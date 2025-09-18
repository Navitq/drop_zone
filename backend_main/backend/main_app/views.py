# import secrets
import os
import random
import json
import hashlib
import base64
import aiohttp
import secrets
from decimal import Decimal
from redis_om.model.model import NotFoundError
from rest_framework_simplejwt.tokens import RefreshToken
from asgiref.sync import sync_to_async
from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
from .models import SocialAccount, User, Advertisement, InventoryItem, SteamItemCs, Raffles
from urllib.parse import quote
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import MyRefreshToken
from .redis_models import CaseRedisStandart, AdvertisementRedis, RafflesRedis, GlobalCoefficientRedis, ItemRedisStandart, OAuthState, BackgroundMainPageRedis
from django.db import DatabaseError
from django.views.decorators.csrf import ensure_csrf_cookie
from datetime import datetime, timezone
from .custom_decorators import async_require_methods
from datetime import datetime, timezone
from .custom_decorators import async_require_methods
from django.utils import timezone as timezone_utils

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_TOKEN_URL = os.getenv("GOOGLE_TOKEN_URL")
GOOGLE_REDIRECT_URL = os.getenv("GOOGLE_REDIRECT_URL")
GOOGLE_USERINFO_URL = os.getenv("GOOGLE_USERINFO_URL")
REDIRECT_OAUTH_CLIENT_PATH = os.getenv("REDIRECT_OAUTH_CLIENT_PATH")
STEAM_OPENID_URL = os.getenv("STEAM_OPENID_URL")
STEAM_DOMEN_REALM = os.getenv("STEAM_DOMEN_REALM")
STEAM_REDIRECT_URI = os.getenv("STEAM_REDIRECT_URI")


EXTERIOR_CHOICES = [
    ("factory_new", "Factory New"),
    ("minimal_wear", "Minimal Wear"),
    ("field_tested", "Field-Tested"),
    ("well_worn", "Well-Worn"),
    ("battle_scarred", "Battle-Scarred"),
]


def check_state_scrf(state: str) -> bool:
    try:
        obj = OAuthState.find(OAuthState.state == state).first()
        print(obj, 4444444444)
        return obj is not None
    except Exception as e:
        print("Error checking state:", e)
        return False


async def ask_data_from_google(code: str) -> dict | None:
    """
    Асинхронно получает access_token и данные пользователя через Google OAuth2.
    1. Отправляет код авторизации на Google для получения access_token.
    2. Использует access_token (JWT) для запроса userinfo.
    Возвращает словарь с данными пользователя или None при ошибке.
    """
    # Создаём временную асинхронную сессию с таймаутом
    async with aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=10)) as session:
        try:
            # Отправляем POST-запрос на Google для получения токена
            async with session.post(
                GOOGLE_TOKEN_URL,
                data={
                    "code": code,                        # Код авторизации, который пришёл на redirect_uri
                    "client_id": GOOGLE_CLIENT_ID,       # Ваш Client ID
                    "client_secret": GOOGLE_CLIENT_SECRET,  # Ваш Client Secret
                    # Redirect URI, на который пришёл код
                    "redirect_uri": GOOGLE_REDIRECT_URL,
                    "grant_type": "authorization_code"  # Тип запроса
                }
            ) as resp:
                # Проверяем HTTP-статус
                if resp.status != 200:
                    text = await resp.text()
                    print(
                        f"Ошибка HTTP при получении токена {resp.status}: {text}")
                    return None

                # Преобразуем JSON-ответ в словарь
                token_data = await resp.json()

                # Проверяем наличие access_token
                access_token = token_data.get("access_token")
                refresh_token = token_data.get("refresh_token")

                if not access_token:
                    print("Не удалось получить access_token")
                    return None

                # Используем access_token (JWT) для получения данных пользователя
                async with session.get(
                    GOOGLE_USERINFO_URL,
                    headers={"Authorization": f"Bearer {access_token}"}
                ) as user_resp:
                    if user_resp.status != 200:
                        text = await user_resp.text()
                        print(
                            f"Ошибка HTTP при userinfo {user_resp.status}: {text}")
                        return None
                    # Преобразуем JSON-ответ в словарь с данными пользователя
                    user_info = await user_resp.json()
                    user_info['access_token'] = access_token
                    user_info['refresh_token'] = refresh_token
                    return user_info
        except aiohttp.ClientError as e:
            print(f"Ошибка запроса: {e}")
        except Exception as e:
            print(f"Неожиданная ошибка: {e}")
    # Возвращаем None, если что-то пошло не так
    return None


def generate_pkce_pair(length: int = 64):
    """
    Генерирует пару code_verifier и code_challenge для PKCE (S256).

    :param length: длина code_verifier (43–128)
    :return: dict с code_verifier и code_challenge
    """
    if length < 43 or length > 128:
        raise ValueError("code_verifier должен быть длиной 43–128 символов")

    # Генерируем случайный code_verifier из безопасных URL-символов
    allowed_chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~"
    code_verifier = ''.join(secrets.choice(allowed_chars)
                            for _ in range(length))

    # Преобразуем code_verifier в code_challenge
    sha256_hash = hashlib.sha256(code_verifier.encode('utf-8')).digest()
    code_challenge = base64.urlsafe_b64encode(
        sha256_hash).rstrip(b'=').decode('utf-8')

    return {
        "code_verifier": code_verifier,
        "code_challenge": code_challenge
    }


async def create_code_verified() -> dict:
    data = generate_pkce_pair()
    code_verifier = data["code_verifier"]
    code_challenge = data["code_challenge"]

    # Асинхронное сохранение в базу
    await sync_to_async(OAuthState.objects.create)(
        code_verifier=code_verifier,
        code_challenge=code_challenge
    )

    return data


async def create_state_token() -> str:
    state = secrets.token_urlsafe(64)
    await sync_to_async(OAuthState(state=state).save)()
    return state


def seconds_until(dt: datetime) -> int:
    """
    Возвращает количество секунд от текущего времени до dt.
    Если dt в прошлом, возвращает 0.
    """
    now = datetime.now(timezone.utc)
    diff = int((dt.replace(tzinfo=timezone.utc) - now).total_seconds())
    return max(diff, 0)


async def deduct_user_money_raffels(user, raffels):
    """Списываем стоимость кейса с пользователя и сохраняем в БД."""
    try:
        user.money_amount -= Decimal(str(raffels.participate_price))
        await sync_to_async(user.save)()
        return True
    except Exception as err:
        print(err)
        return False


async def deduct_user_money_upgrade(user, price):
    """Списываем стоимость кейса с пользователя и сохраняем в БД."""
    try:
        user.money_amount -= Decimal(str(price))
        await sync_to_async(user.save)()
        return True
    except Exception as err:
        print(err)
        return False


async def deduct_user_money(user, case):
    """Списываем стоимость кейса с пользователя и сохраняем в БД."""
    try:
        user.money_amount -= Decimal(str(case.price))
        await sync_to_async(user.save)()
        return True
    except Exception as err:
        print(err)
        return False


async def spin_roulette_wheel(case, user):
    # Получаем все предметы
    items = await sync_to_async(lambda: list(
        ItemRedisStandart.find(ItemRedisStandart.case_id == case.id).all()
    ))()

    # Сортируем по drop_chance (необязательно, но для прозрачности)
    items.sort(key=lambda x: x.drop_chance)

    # Генерируем рандомное число до 100 и умножаем на шанс пользователя
    roll = random.uniform(0, 100) * user.roulet_chance
    if roll >= 100:
        items[-1]
    cumulative = 0
    for item in items:
        cumulative += item.drop_chance
        if roll <= cumulative:
            del item.drop_chance
            return item  # Этот предмет выпал

    # На всякий случай — если не попали (редко), возвращаем последний
    del items[0].drop_chance
    return items[0]


async def spin_state_wheel_fake():
    # случайное число 0-99, умножаем на шанс пользователя
    rand_num = int(random.randint(0, 99))
    if rand_num > 99:
        return EXTERIOR_CHOICES[-1][0]
    # ограничиваем максимум 99
    rand_num = min(rand_num, 99)

    range_size = 100 // len(EXTERIOR_CHOICES)
    index = rand_num // range_size

    if index >= len(EXTERIOR_CHOICES):
        index = len(EXTERIOR_CHOICES) - 1

    return EXTERIOR_CHOICES[int(round(index))][0]


async def spin_state_wheel(user):
    # случайное число 0-99, умножаем на шанс пользователя
    rand_num = int(random.randint(0, 99) * user.item_state_chance)
    if rand_num > 99:
        return EXTERIOR_CHOICES[-1][0]
    # ограничиваем максимум 99
    rand_num = min(rand_num, 99)

    range_size = 100 // len(EXTERIOR_CHOICES)
    index = rand_num // range_size

    if index >= len(EXTERIOR_CHOICES):
        index = len(EXTERIOR_CHOICES) - 1

    return EXTERIOR_CHOICES[int(round(index))][0]


async def create_order(item_state: str, item, user):
    """
    Создаёт InventoryItem для пользователя и сохраняет в БД.
    """
    try:
        steam_item = await sync_to_async(SteamItemCs.objects.get)(id=item.id)

        await sync_to_async(InventoryItem.objects.create)(
            steam_item=steam_item,
            owner=user,
            exterior_wear=item_state,
        )
    except DatabaseError as e:
        print(f"Ошибка при создании InventoryItem: {e}")


async def add_to_raffels(raffle_id,  user):
    # Находим розыгрыш по UUID
    raffle = await sync_to_async(Raffles.objects.get)(id=raffle_id)

    # Проверяем, участвует ли уже пользователь
    exists = await sync_to_async(lambda: raffle.players.filter(id=user.id).exists())()
    if exists:
        return JsonResponse({"detail": "User already in raffle"}, status=409)

    await sync_to_async(raffle.players.add)(user)

    return JsonResponse({
        "detail": "User added to raffle",
        "raffle_id": str(raffle.id),
        "user_id": user.id,
    }, status=207)


async def check_user_money(request, case_id):
    """Проверяем money_amount пользователя из токена."""
    try:
        cases = await sync_to_async(lambda: list(
            CaseRedisStandart.find(CaseRedisStandart.id == case_id).all()
        ))()

        if not cases:
            return Response({"detail": "Case not found"}, status=404)
        user_id = request.token_data.get("id")
        user = await sync_to_async(User.objects.get)(id=user_id)
        print(user.money_amount, cases[0].price)
        if user.money_amount < cases[0].price:
            return JsonResponse({"detail": "Insufficient funds"}, status=402)
        return {"user": user, "case": cases[0]}
    except NotFoundError:
        return JsonResponse({"detail": "Insufficient funds"}, status=503)


async def check_user_money_raffels(request, raffles_id):
    """Проверяем money_amount пользователя из токена."""
    try:
        raffle = await sync_to_async(RafflesRedis.get)(str(raffles_id))
        if not raffle:
            return Response({"detail": "Raffels not found"}, status=404)
        user_id = request.token_data.get("id")
        user = await sync_to_async(User.objects.get)(id=user_id)
        if user_id in raffle.players_ids:
            return JsonResponse({"detail": "User already in raffle"}, status=409)
        if user.money_amount < raffle.participate_price:
            return JsonResponse({"detail": "Insufficient funds"}, status=402)
        return {"user": user, "raffels": raffle}
    except NotFoundError:
        return JsonResponse({"detail": "Insufficient funds"}, status=503)


async def check_user_money_upgrades(request, server_item_id, client_item_id, price):
    """Проверяем money_amount пользователя из токена."""
    try:
        user_id = request.token_data.get("id")
        user = await sync_to_async(User.objects.get)(id=user_id)
        server_item = await sync_to_async(lambda: SteamItemCs.objects.get(id=server_item_id))()
        if client_item_id:
            client_item = await sync_to_async(
                lambda: InventoryItem.objects.select_related(
                    'steam_item').get(owner_id=user.id, id=client_item_id)
            )()
            if not client_item or not server_item:
                return JsonResponse({"detail": "Item not found"}, status=404)

            if user.money_amount < server_item.price:
                return JsonResponse({"detail": "Insufficient funds"}, status=402)
            return {"user": user, "client_item": client_item, "server_item": server_item}
        elif price is not None or not server_item:
            price = float(price)
            if user.money_amount < price:
                return JsonResponse({"detail": "Insufficient funds"}, status=402)
            return {"user": user, "price": price, "server_item": server_item}
        else:
            return JsonResponse({"detail": "Either client_item_id or price must be provided"}, status=400)
    except NotFoundError:
        return JsonResponse({"detail": "Insufficient funds"}, status=503)


async def get_case(case_id):
    """Возвращает кейс по ID или бросает исключение."""
    case = await sync_to_async(lambda: list(
        CaseRedisStandart.find(CaseRedisStandart.id == case_id).all()
    ))()
    if not case:
        raise NotFoundError("Case not found")
    return case[0]


async def get_case_items(case_id):
    """Возвращает список предметов кейса в виде массива словарей."""
    items = await sync_to_async(lambda: list(
        ItemRedisStandart.find(ItemRedisStandart.case_id == case_id).all()
    ))()
    if not items:
        raise NotFoundError("Items not found for this case")

    return [
        {
            "id": item.id,
            "gunModel": item.item_model,
            "gunStyle": item.item_style,
            "gunPrice": item.price,
            "imgPath": item.icon_url,
            "type": item.rarity,
            "price": item.price,
            "state": await spin_state_wheel_fake()
        }
        for item in items
    ]


async def spin_upgrade(user, server_item, price):
    print(555555555555)
    ad = await sync_to_async(lambda: GlobalCoefficientRedis.find().first())()
    pgrades_global = ad.upgrades_global
    print(0000000000000, 4442)

    honest_chance = (
        (Decimal("0.9") if Decimal(str(price)) /
         server_item >= 1 else Decimal(str(price)) / server_item)
        * Decimal("0.9")
        * Decimal(pgrades_global)
        * Decimal(str(user.upgrade_chance))  # конвертируем float → Decimal
    )
    print(0000000000000, 4442)
    print(honest_chance)
    rand_num = random.uniform(0, 100)
    print(honest_chance, rand_num)
    rand_num_valuable = Decimal(str(rand_num)) * honest_chance
    print(0000000000000, 4442)
    if rand_num_valuable < 50:
        return False
    else:
        return True


async def remover_order(user, client_item):
    # удаляем объект из БД
    await sync_to_async(client_item.delete)()
    return client_item


async def play_upgrade_game(user, server_item, client_item=None, price=None):
    """Игра на апгрейд предмета. Может использовать client_item или деньги (price)."""
    print(7777777777777)
    # определяем цену апгрейда
    upgrade_price = client_item.steam_item.price if client_item else price

    # запускаем апгрейд
    spin_state = await spin_upgrade(
        user=user,
        server_item=server_item.price,
        price=upgrade_price
    )

    if spin_state is True:
        item_state = await spin_state_wheel(user)
        await create_order(item_state, server_item, user)
        return JsonResponse({"status": "client win"}, status=201)
    return JsonResponse({"status": "client lose"}, status=202)


@async_require_methods(["GET"])
@ensure_csrf_cookie
async def get_csrf_view(request):
    return HttpResponse(status=200)


@async_require_methods(["GET"])
async def me_view(request):
    if not request.token_data:
        return JsonResponse({"error": "Unauthorized"}, status=401)
    return JsonResponse(request.token_data)


@async_require_methods(["GET"])
async def vk_login_view(request):
    state = await create_state_token()
    data = await create_code_verified()
    scope = "openid email profile"
    vk_auth_url = (
        "https://id.vk.com/authorize?response_type=code"
        f"?client_id={client_id}"
        f"&redirect_uri={GOOGLE_REDIRECT_URL}"
        f"&code_challenge={data["code_challenge"]}"
        f"&code_challenge_method=S256"
        f"&scope={scope}"
        f"&state={state}"
    )
    pass


@async_require_methods(["GET"])
async def steam_login_view(request):
    """Редирект пользователя на Steam для авторизации"""

    steam_openid_url = (
        f"{STEAM_OPENID_URL}?"
        f"openid.ns={quote('http://specs.openid.net/auth/2.0')}&"
        f"openid.mode=checkid_setup&"
        f"openid.return_to={quote(STEAM_REDIRECT_URI)}&"
        f"openid.realm={quote(STEAM_DOMEN_REALM)}&"
        f"openid.identity={quote('http://specs.openid.net/auth/2.0/identifier_select')}&"
        f"openid.claimed_id={quote('http://specs.openid.net/auth/2.0/identifier_select')}"
    )

    return JsonResponse({"auth_url": steam_openid_url})


@async_require_methods(["GET"])
async def google_login_view(request):
    # Генерация уникального state
    state = await create_state_token()
    scope = "openid email profile"

    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={GOOGLE_REDIRECT_URL}"
        f"&response_type=code"
        f"&scope={scope}"
        f"&state={state}"
    )

    return JsonResponse({"auth_url": google_auth_url})


@async_require_methods(["GET"])
async def vk_callback_view(request):
    pass


@async_require_methods(["GET"])
async def steam_callback_view(request):
    """Асинхронная обработка Steam login с JWT и cookie"""
    data = request.GET.copy()
    data["openid.mode"] = "check_authentication"

    async with aiohttp.ClientSession() as session:
        async with session.post(STEAM_OPENID_URL, data=data) as resp:
            text = await resp.text()

    if "is_valid:true" not in text:
        return JsonResponse({"error": "Invalid or expired state"}, status=409)

    # Получаем SteamID
    steam_id = request.GET.get("openid.claimed_id").split("/")[-1]

    # Проверяем SocialAccount
    social_account = await sync_to_async(
        lambda: SocialAccount.objects.filter(
            provider="steam", provider_user_id=steam_id).first()
    )()

    if social_account:
        user = await sync_to_async(lambda: social_account.user)()
    else:
        # Создаём нового пользователя
        user = await sync_to_async(User.objects.create)(
            username=f"steam_{steam_id}"
        )
        # Создаём SocialAccount
        social_account = await sync_to_async(SocialAccount.objects.create)(
            user=user,
            provider="steam",
            provider_user_id=steam_id,
        )

    # Логиним пользователя

    # Генерируем JWT
    refresh = MyRefreshToken.for_user(user, social_account)
    access_token = str(refresh.access_token)

    # Формируем JSON с данными пользователя
    user_data = {
        "id": str(user.id),
        "username": user.username,
        "email": user.email or None,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "avatar_url": user.avatar_url or "",
        "provider": social_account.provider if social_account else None,
    }

    # Создаём JsonResponse
    response = HttpResponseRedirect(REDIRECT_OAUTH_CLIENT_PATH)

    # Устанавливаем cookies
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,    # True на HTTPS
        samesite="Lax",
        max_age=3600    # 1 час
    )
    response.set_cookie(
        key="refresh_token",
        value=str(refresh),
        httponly=True,
        secure=True,
        samesite="Lax",
        max_age=7*24*3600  # 7 дней
    )
    response["X-User-Data"] = json.dumps(user_data)  # разовый заголовок

    return response


@async_require_methods(["GET"])
async def get_cases_by_type_view(request, case_type: str):
    """
    Возвращает все кейсы определенного типа из Redis.
    URL: /api/cases/<case_type>/
    """
    try:
        print(case_type)
        all_cases = await sync_to_async(lambda: list(CaseRedisStandart.find()))()
        filtered_cases = [
            case.model_dump() for case in all_cases if case.type == case_type
        ]
        return JsonResponse(filtered_cases, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@async_require_methods(["GET"])
async def get_case_content_view(request, case_id):
    try:
        case = await get_case(case_id)
        items_list = await get_case_items(case_id)

        return JsonResponse({
            "id": case.id,
            "name": case.name,
            "icon_url": case.icon_url,
            "type": case.type,
            "items": items_list
        })
    except NotFoundError as e:
        return JsonResponse({"error": str(e)}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@async_require_methods(["POST"])
async def get_open_case_view(request, case_id):
    try:
        money_check = await check_user_money(request, case_id)
        if isinstance(money_check, JsonResponse):
            return money_check  # 402
        if isinstance(money_check, dict) and "user" in money_check and "case" in money_check:
            isFundsWrittenof = await deduct_user_money(money_check["user"], money_check["case"])
            if isFundsWrittenof is True:
                prize_item = await spin_roulette_wheel(money_check["case"], money_check["user"])
                item_state = await spin_state_wheel(money_check["user"])
                await create_order(item_state, prize_item, money_check["user"])
                prize_dict = {
                    "id": prize_item.id,
                    "gunModel": prize_item.item_model,
                    "gunStyle": prize_item.item_style,
                    "gunPrice": prize_item.price,
                    "imgPath": prize_item.icon_url,
                    "type": prize_item.rarity,
                    "price": prize_item.price,
                    "state": item_state
                }
                items_list = await get_case_items(money_check["case"].id)
                return JsonResponse({"prize_item": prize_dict, "case_items": items_list}, status=200)
            # Логика открытия кейса
        return JsonResponse({"Error": "server error"}, status=501)
    except Exception as e:
        print(e)
        return JsonResponse({"error": str(e)}, status=500)


@async_require_methods(["POST"])
async def raffles_take_a_part_view(request):
    try:
        body = json.loads(request.body)
        raffle_id = body.get("id")  # или
        money_check = await check_user_money_raffels(request, raffle_id)
        if isinstance(money_check, JsonResponse):
            return money_check  # 402
        if isinstance(money_check, dict) and "user" in money_check and "raffels" in money_check:
            isFundsWrittenof = await deduct_user_money_raffels(money_check["user"], money_check["raffels"])
            if isFundsWrittenof is True:
                return await add_to_raffels(money_check["raffels"].id, money_check["user"])
            # Логика открытия кейса
        return JsonResponse({"Error": "server error"}, status=501)
    except Exception as e:
        print(e)
        return JsonResponse({"error": str(e)}, status=500)


@async_require_methods(["GET"])
async def advertisement_view(request):
    try:
        # Получаем последний объект асинхронно
        ad = await sync_to_async(lambda: AdvertisementRedis.find().first())()
        if not ad:
            # Если нет объектов, отдаём пустой массив
            return JsonResponse([], safe=False, status=404)

        data = [
            {
                "title": ad.title_1,
                "subTitle": ad.subTitle_1,
                "imgUrl": ad.imgUrl_1,
                "timer": seconds_until(ad.data_and_time),
            },
            {
                "title": ad.title_2,
                "subTitle": ad.subTitle_2,
                "imgUrl": ad.imgUrl_2,
            },
        ]

        return JsonResponse(data, safe=False)

    except Exception as e:
        # Логируем ошибку и возвращаем 500
        print(f"❌ Ошибка в advertisement_view: {e}")
        return JsonResponse({"error": "Internal Server Error"}, status=500)


@async_require_methods(["GET"])
async def get_main_page_background_view(request):
    try:
        # Получаем последний объект асинхронно
        ad = await sync_to_async(lambda: BackgroundMainPageRedis.find().first())()
        if not ad:
            # Если нет объектов, отдаём пустой массив
            return JsonResponse([], safe=False, status=404)

        return JsonResponse(ad.dict(), safe=False)

    except Exception as e:
        # Логируем ошибку и возвращаем 500
        print(f"❌ Ошибка в BackgroundMainPageRedis: {e}")
        return JsonResponse({"error": "Internal Server Error"}, status=500)


@async_require_methods(["GET"])
async def raffles_list_view(request):
    try:
        all_raffles = await sync_to_async(lambda: RafflesRedis.find().all())()
        if not all_raffles:
            return JsonResponse([], safe=False, status=404)
        now = timezone_utils.now()
        raffles = [r for r in all_raffles if r.end_date > now]
        if len(raffles) <= 0:
            return JsonResponse([], safe=False, status=404)
        data = []
        for r in raffles:
            raffle = {
                "id": r.id,  # конвертируем UUID в строку
                "imgPath": r.prize_item['imgUrl'],
                "currentPlayerAmount": len(r.players_ids) + r.fake_users_amount,
                "participationPrice": float(r.participate_price),
                "gunModel": r.prize_item['gunModel'],
                "gunStyle": r.prize_item['gunStyle'],
                "type": r.prize_item['rarity'],
                "maxPlayerAmount": r.max_users_amount,
                "endTime": r.end_date.isoformat(),
            }
            data.append(raffle)

        return JsonResponse(data, safe=False)
    except Exception as e:
        print(f"❌ Ошибка в raffles_list_view: {e}")
        return JsonResponse({"error": "Internal Server Error"}, status=500)


@async_require_methods(["POST"])
async def get_inventory_items_view(request):
    try:
        data = json.loads(request.body)

        page = int(data.get("page", 1))
        body = data.get("body", {})
        client_id = body.get("client_id")
        limit = int(body.get("limit", 25))

        if not client_id:
            return JsonResponse({"error": "client_id is required"}, status=404)

        offset = (page - 1) * limit

        # считаем общее количество у клиента

        # достаём нужный кусок данных
        items_qs = (
            InventoryItem.objects
            .filter(owner_id=client_id)
            .select_related("steam_item")
            .order_by("created_at")[offset: offset + limit]
        )

        items = await sync_to_async(list)(items_qs)

        result = []
        for item in items:
            result.append({
                "id": str(item.id),
                "gunModel": item.steam_item.item_model,
                "gunStyle": item.steam_item.item_style,
                "gunPrice": float(item.steam_item.price),
                "type": item.steam_item.rarity,
                "imgPath": item.steam_item.icon_url,
                "fullName": item.full_name,
                "shortName": item.short_name,
                "tradable": item.tradable,
                "marketable": item.marketable,
                "state":  item.exterior_wear,
            })

        # есть ли ещё страницы?

        return JsonResponse({
            "items": result,
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    # raffle_id = body.get("id")  # или


@async_require_methods(["POST"])
async def get_inventory_server_items_view(request):
    try:
        data = json.loads(request.body)
        page = int(data.get("page", 1))
        body = data.get("body", {})
        limit = int(body.get("limit", 25))
        offset = (page - 1) * limit

        # Достаём данные из БД асинхронно
        qs = await sync_to_async(
            lambda: list(
                SteamItemCs.objects.all()[
                    offset:offset+limit]
            )
        )()

        result = [
            {
                "id": str(item.id),
                "gunModel": item.item_model,
                "gunStyle": item.item_style,
                "gunPrice": float(item.price),
                "type": item.rarity,
                "imgPath": item.icon_url,
            }
            for item in qs
        ]

        return JsonResponse({
            "items": result,
        })

    except Exception as e:
        return JsonResponse({
            "success": False,
            "error": str(e),
        }, status=500)


@async_require_methods(["POST"])
async def upgrade_item_view(request):
    try:
        data = json.loads(request.body)

        client_item_id = data.get("clientItemId")
        server_item_id = data.get("serverItemId")
        price = data.get("price")

        # Проверяем обязательные поля
        if not server_item_id or (not price and not client_item_id):
            return JsonResponse({"success": False, "error": "serverItemId и хотя бы одно из полей clientItemId или price обязательны"}, status=400)
        money_check = await check_user_money_upgrades(request, server_item_id=server_item_id, client_item_id=client_item_id, price=price)
        if isinstance(money_check, JsonResponse):
            return money_check  # 402
        if isinstance(money_check, dict) and "user" in money_check and ("price" in money_check or "client_item" in money_check):
            if "client_item" in money_check:
                answer = await play_upgrade_game(user=money_check["user"], client_item=money_check["client_item"], server_item=money_check["server_item"])
                await remover_order(money_check["user"], money_check["client_item"])
                return answer
            else:
                await deduct_user_money_upgrade(money_check["user"], money_check["price"])
                return await play_upgrade_game(user=money_check["user"], price=money_check["price"], server_item=money_check["server_item"])
    except Exception as e:
        print(e)
        return JsonResponse({"error": str(e)}, status=500)


@async_require_methods(["GET"])
async def google_callback_view(request):
    state = request.GET.get("state")
    code = request.GET.get("code")
    status = check_state_scrf(state)
    if status is False or code is False:
        print(status, 123, code, 231, state)
        return JsonResponse({"error": "Invalid or expired state"}, status=409)

    OAuthState.delete(state)
    user_info = await ask_data_from_google(code)
    print(12222222222222222222222222, user_info)
    if user_info is None:
        return JsonResponse({"error": "Invalid or expired state"}, status=407)
    google_id = user_info.get("id")
    email = user_info.get("email")
    name = user_info.get("name")
    verified_email = user_info.get("verified_email")
    first_name = user_info.get("given_name", "")
    last_name = user_info.get("family_name", "")
    avatar_url = user_info.get("picture", "")
    access_token = user_info.get("access_token")
    refresh_token = user_info.get("refresh_token")
    print(133333333333333333333333333333333333333333)

    try:
        social_account = await sync_to_async(
            lambda: SocialAccount.objects.select_related('user').get(
                provider='google', provider_user_id=google_id
            )
        )()
        # Обновляем токены и данные
        print(144444444444444444444444444444444444444444444)
        social_account.access_token = access_token
        social_account.refresh_token = refresh_token
        social_account.verified_email = verified_email
        social_account.extra_data = user_info  # сохраняем полный user_info для удобства
        await sync_to_async(social_account.save)()

        user = await sync_to_async(lambda: social_account.user)()
        # Можно обновить профиль пользователя
        user.first_name = first_name
        user.last_name = last_name
        user.avatar_url = avatar_url
        await sync_to_async(user.save)()

    except SocialAccount.DoesNotExist:
        # Создаём нового пользователя
        user = await sync_to_async(lambda: User.objects.create_user(
            username=name or email or f"google_{google_id}",
            email=email,
            first_name=first_name,
            last_name=last_name,
            avatar_url=avatar_url
        ))()

        # Создаём социальный аккаунт
        social_account = await sync_to_async(lambda: SocialAccount.objects.create(
            user=user,
            provider='google',
            provider_user_id=google_id,
            access_token=access_token,
            refresh_token=refresh_token,
            extra_data=user_info
        ))()
    # автоматически использует кастомный сериализатор
    refresh = MyRefreshToken.for_user(user, social_account)
    access_token = str(refresh.access_token)

    response = HttpResponseRedirect(REDIRECT_OAUTH_CLIENT_PATH)

    # HttpOnly cookie для access_token
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,    # True на HTTPS
        samesite="Lax",
        max_age=3600    # 1 час, например
    )

    # HttpOnly cookie для refresh_token (если нужен)
    response.set_cookie(
        key="refresh_token",
        value=str(refresh),
        httponly=True,
        secure=True,
        samesite="Lax",
        max_age=7*24*3600  # 7 дней
    )

    # --- Разовый заголовок / данные пользователя ---
    # Можно передать через JSON в GET параметре или через заголовок, пример через заголовок:
    # Устанавливаем custom заголовок с info пользователя (разовый)

    # Django HttpResponse не позволяет напрямую ставить dict в заголовок, поэтому можно сериализовать JSON

    return response

    # return JsonResponse({
    #     "id": str(user.id),
    #     "username": user.username,
    #     "email": user.email,
    #     "first_name": user.first_name,
    #     "last_name": user.last_name,
    #     "avatar_url": user.avatar_url,
    #     "token": access_token,         # JWT access token
    #     "refresh": str(refresh)        # refresh token, если нужно
    # })
