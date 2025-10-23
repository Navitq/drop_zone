# import secrets
from redis.exceptions import RedisError
import os
import random
import json
import hashlib
import base64
import aiohttp
import secrets
import asyncio
from decimal import Decimal
from redis_om.model.model import NotFoundError
from rest_framework_simplejwt.tokens import RefreshToken
from asgiref.sync import sync_to_async
from django.http import JsonResponse, HttpResponseRedirect, HttpResponse
from .models import SocialAccount, ItemsOrders, User, Battle, Advertisement, TotalActionAmount, BattleCase, Case, InventoryItem, SteamItemCs, Raffles
from urllib.parse import quote
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import MyRefreshToken
from .redis_models import CaseRedisStandart, BlockedTokenRedis, TotalActionAmountRedis, GlobalStateCoeffRedis, ActiveBattleRedis, AdvertisementRedis, RafflesRedis, GlobalCoefficientRedis, ItemRedisStandart, OAuthState, BackgroundMainPageRedis
from django.db import DatabaseError
from django.views.decorators.csrf import ensure_csrf_cookie
from datetime import datetime, timezone, timedelta
from .custom_decorators import async_require_methods
from datetime import datetime, timezone
from .custom_decorators import async_require_methods
from django.utils import timezone as timezone_utils
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.http import require_http_methods
from django.db import transaction
from urllib.parse import urlparse
from django.db.models import Q
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import UntypedToken
from urllib.parse import urlencode

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_TOKEN_URL = os.getenv("GOOGLE_TOKEN_URL")
GOOGLE_REDIRECT_URL = os.getenv("GOOGLE_REDIRECT_URL")
GOOGLE_USERINFO_URL = os.getenv("GOOGLE_USERINFO_URL")
REDIRECT_OAUTH_CLIENT_PATH = os.getenv("REDIRECT_OAUTH_CLIENT_PATH")
STEAM_OPENID_URL = os.getenv("STEAM_OPENID_URL")
STEAM_DOMEN_REALM = os.getenv("STEAM_DOMEN_REALM")
STEAM_REDIRECT_URI = os.getenv("STEAM_REDIRECT_URI")
STEAM_API_WEB_KEY = os.getenv("STEAM_API_WEB_KEY")

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


async def get_steam_player_info(steam_id: str) -> dict | None:
    url = "https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/"
    params = {
        "key": STEAM_API_WEB_KEY,
        "steamids": steam_id
    }
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url, params=params) as resp:
                if resp.status != 200:
                    text = await resp.text()
                    print(f"Ошибка Steam API ({resp.status}): {text}")
                    return None

                data = await resp.json()
                players = data.get("response", {}).get("players", [])
                if not players:
                    print(f"SteamID {steam_id} не найден")
                    return None
                return players[0]

    except aiohttp.ClientError as e:
        print(f"Ошибка сети при запросе к Steam API: {e}")
    except Exception as e:
        print(f"Неожиданная ошибка в get_steam_player_info: {e}")

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


def deduct_user_money_raffels(user, raffels):
    """Списываем стоимость кейса с пользователя и сохраняем в БД."""
    try:
        user.money_amount -= Decimal(str(raffels.participate_price))
        user.save()
        return True
    except Exception as err:
        print(err)
        return False


def deduct_user_money_upgrade(user, price):
    """Списываем стоимость кейса с пользователя и сохраняем в БД."""
    try:
        user.money_amount -= Decimal(str(price))
        user.save()
        return True
    except Exception as err:
        print(err)
        return False


def deduct_user_money(user, case):
    """Списываем стоимость кейса с пользователя и сохраняем в БД."""
    try:
        user.money_amount -= Decimal(str(case.price))
        user.save()
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
    roll = secrets.randbelow(10000) / 100.0 * user.roulet_chance
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


def sync_spin_roulette_wheel(case, user):
    # Получаем все предметы
    items = list(
        ItemRedisStandart.find(ItemRedisStandart.case_id == case.id).all()
    )

    # Сортируем по drop_chance (необязательно, но для прозрачности)
    items.sort(key=lambda x: x.drop_chance)

    # Генерируем рандомное число до 100 и умножаем на шанс пользователя
    roll = secrets.randbelow(10000) / 100.0 * user.roulet_chance
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


def sync_spin_state_wheel_fake():
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


# def sync_spin_state_wheel(user):
#     # случайное число 0-99, умножаем на шанс пользователя
#     rand_num = int(random.randint(0, 99) * user.item_state_chance)
#     if rand_num > 99:
#         return EXTERIOR_CHOICES[-1][0]
#     # ограничиваем максимум 99
#     rand_num = min(rand_num, 99)

#     range_size = 100 // len(EXTERIOR_CHOICES)
#     index = rand_num // range_size

#     if index >= len(EXTERIOR_CHOICES):
#         index = len(EXTERIOR_CHOICES) - 1

#     return EXTERIOR_CHOICES[int(round(index))][0]


def sync_spin_state_wheel(user):
    """Синхронная версия: определяет состояние предмета на основе коэффициентов из Redis и шанса пользователя"""
    try:
        # 🧠 Получаем коэффициенты из Redis (синхронно)
        coeff = GlobalStateCoeffRedis.find().first()
        print(coeff)
        if not coeff:
            raise ValueError("❌ GlobalStateCoeffRedis не найден!")

        # 🧩 Сортируем коэффициенты от большего к меньшему
        sorted_coeffs = sorted(
            [
                ("battle_scarred", float(coeff.battle_scarred)),
                ("well_worn", float(coeff.well_worn)),
                ("field_tested", float(coeff.field_tested)),
                ("minimal_wear", float(coeff.minimal_wear)),
                ("factory_new", float(coeff.factory_new)),
            ],
            key=lambda x: x[1],
            reverse=True
        )

        # 🎲 Генерируем случайное число от 0 до 100
        rand_num = secrets.randbelow(
            10000) / 100.0 * float(user.item_state_chance)
        rand_num = min(rand_num, 100)
        print(rand_num, 7878, user.item_state_chance)

        # 💡 Проверяем, в какой интервал попало число
        cumulative = 0
        for name, value in sorted_coeffs:
            cumulative += value
            if rand_num <= cumulative:
                return name

        # Если число больше всех интервалов (на случай некорректных коэффициентов)
        return sorted_coeffs[0][0]

    except RedisError as e:
        print(f"❌ Ошибка Redis при получении коэффициентов: {e}")
        return "well_worn"

    except Exception as e:
        print(f"⚠️ Ошибка в spin_state_wheel_sync: {e}")
        return "well_worn"


async def spin_state_wheel(user):
    """Определяет состояние предмета на основе коэффициентов из Redis и шанса пользователя"""
    try:
        # 🧠 Получаем коэффициенты из Redis
        coeff = await GlobalStateCoeffRedis.find().first()
        if not coeff:
            raise ValueError("❌ GlobalStateCoeffRedis не найден!!!!!!!")

        # 🧩 Сортируем коэффициенты от большего к меньшему
        sorted_coeffs = sorted(
            [
                ("battle_scarred", float(coeff.battle_scarred)),
                ("well_worn", float(coeff.well_worn)),
                ("field_tested", float(coeff.field_tested)),
                ("minimal_wear", float(coeff.minimal_wear)),
                ("factory_new", float(coeff.factory_new)),
            ],
            key=lambda x: x[1],
            reverse=True
        )

        # 🎲 Генерируем случайное число от 0 до 100
        rand_num = secrets.randbelow(
            10000) / 100.0 * float(user.item_state_chance)
        rand_num = min(rand_num, 100)
        print(rand_num, 7878, user.item_state_chance)
        # 💡 Проверяем, в какой интервал попало число
        cumulative = 0
        for name, value in sorted_coeffs:
            cumulative += value
            if rand_num <= cumulative:
                return name

        # Если число больше всех интервалов (на случай некорректных коэффициентов)
        return sorted_coeffs[0][0]

    except RedisError as e:
        print(f"❌ Ошибка Redis при получении коэффициентов: {e}")
        # fallback — если Redis не доступен, возвращаем "field_tested" как дефолт
        return "well_worn"

    except Exception as e:
        print(f"⚠️ Ошибка в spin_state_wheel: {e}")
        return "well_worn"


# async def spin_state_wheel(user):
#     # случайное число 0-99, умножаем на шанс пользователя
#     rand_num = int(random.randint(0, 99) * user.item_state_chance)
#     if rand_num > 99:
#         return EXTERIOR_CHOICES[-1][0]
#     # ограничиваем максимум 99
#     rand_num = min(rand_num, 99)

#     range_size = 100 // len(EXTERIOR_CHOICES)
#     index = rand_num // range_size

#     if index >= len(EXTERIOR_CHOICES):
#         index = len(EXTERIOR_CHOICES) - 1

#     return EXTERIOR_CHOICES[int(round(index))][0]


def sync_create_order(item_state: str, item, user, case=None):
    """
    Создаёт InventoryItem для пользователя и сохраняет в БД.
    """
    try:
        steam_item = SteamItemCs.objects.get(id=item.id)
        if (
            "price" not in user.best_skin
            or float(user.best_skin.get("gunPrice", 0)) <= float(item.price)
        ):
            user.best_skin = {
                "id": str(item.id),
                "imgPath": item.icon_url,
                "gunPrice": float(item.price or 0),
                "gunModel": item.item_model,
                "gunStyle": item.item_style,
                "state": item_state,
                "type": item.rarity,
            }
            user.save()
        if case:
            return InventoryItem.objects.create(
                steam_item=steam_item,
                owner=user,
                exterior_wear=item_state,
                case_id=case.id
            )
        else:
            return InventoryItem.objects.create(
                steam_item=steam_item,
                owner=user,
                exterior_wear=item_state,
            )
    except DatabaseError as e:
        print(f"Ошибка при создании InventoryItem: {e}")


# async def create_order(item_state: str, item, user):
#     """
#     Создаёт InventoryItem для пользователя и сохраняет в БД.
#     """
#     try:
#         steam_item = await sync_to_async(SteamItemCs.objects.get)(id=item.id)
#         return await sync_to_async(InventoryItem.objects.create)(
#             steam_item=steam_item,
#             owner=user,
#             exterior_wear=item_state,
#         )
#     except DatabaseError as e:
#         print(f"Ошибка при создании InventoryItem: {e}")


def add_to_raffels(raffle_id,  user):
    # Находим розыгрыш по UUID
    raffle = Raffles.objects.select_for_update().get(id=raffle_id)

    # Проверяем, участвует ли уже пользователь
    exists = raffle.players.filter(id=user.id).exists()
    if exists:
        return JsonResponse({"detail": "User already in raffle"}, status=409)
    user.total_raffles += 1
    user.save()
    raffle.players.add(user)

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


def sync_check_user_money(request, case_id):
    """Проверяем money_amount пользователя из токена."""
    try:
        cases = list(
            CaseRedisStandart.find(CaseRedisStandart.id == case_id).all()
        )

        if not cases:
            return Response({"detail": "Case not found"}, status=404)
        user_id = request.token_data.get("id")
        user = User.objects.select_for_update().get(id=user_id)
        print(user.money_amount, cases[0].price)
        if user.money_amount < cases[0].price:
            return JsonResponse({"detail": "Insufficient funds"}, status=402)
        return {"user": user, "case": cases[0]}
    except NotFoundError:
        return JsonResponse({"detail": "Insufficient funds"}, status=503)


def check_user_money_raffels(request, raffles_id):
    """Проверяем money_amount пользователя из токена."""
    try:
        raffle = RafflesRedis.get(str(raffles_id))
        if not raffle:
            return Response({"detail": "Raffels not found"}, status=404)
        user_id = request.token_data.get("id")
        user = User.objects.select_for_update().get(id=user_id)
        if raffle.max_users_amount <= len(raffle.players_ids):
            return JsonResponse({"detail": "Not enough places "}, status=409)
        if user_id in raffle.players_ids:
            return JsonResponse({"detail": "User already in raffle"}, status=409)
        if user.money_amount < raffle.participate_price:
            return JsonResponse({"detail": "Insufficient funds"}, status=402)
        return {"user": user, "raffels": raffle}
    except NotFoundError:
        return JsonResponse({"detail": "Insufficient funds"}, status=503)


def check_user_money_upgrades(request, server_item_id, client_item_id, price):
    """Проверяем money_amount пользователя из токена."""
    try:
        user_id = request.token_data.get("id")
        user = User.objects.select_for_update().get(id=user_id)
        server_item = SteamItemCs.objects.get(id=server_item_id)
        if client_item_id:
            client_item = InventoryItem.objects.select_for_update().select_related(
                'steam_item').get(owner_id=user.id, id=client_item_id, marketable=True, tradable=True)
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
    except User.DoesNotExist:
        return JsonResponse({"detail": "User not found"}, status=404)
    except SteamItemCs.DoesNotExist:
        return JsonResponse({"detail": "Server item not found"}, status=404)
    except InventoryItem.DoesNotExist:
        return JsonResponse({"detail": "Client item not found"}, status=404)
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


def sync_get_case_items(case_id):
    """Возвращает список предметов кейса в виде массива словарей."""
    items = list(
        ItemRedisStandart.find(ItemRedisStandart.case_id == case_id).all()
    )
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
            "state": sync_spin_state_wheel_fake()
        }
        for item in items
    ]


def spin_upgrade(user, server_item, price):
    print(555555555555)
    ad = GlobalCoefficientRedis.find().first()
    pgrades_global = ad.upgrades_global
    print(0000000000000, 4442)

    honest_chance = (
        (Decimal("0.9") if Decimal(str(price)) /
         server_item >= 1 else Decimal(str(price)) / server_item)
        * Decimal(pgrades_global)
        * Decimal(str(user.upgrade_chance))  # конвертируем float → Decimal
    )
    print(0000000000000, 4442)
    print(honest_chance)
    rand_num = Decimal(secrets.randbelow(101))
    print(honest_chance, rand_num)
    print(0000000000000, 4442)
    if rand_num > honest_chance * Decimal(100):
        return False
    else:
        return True


def sync_remover_order(user, client_item):
    client_item.delete()
    return client_item


# async def get_user_inventory_items(user, ids: list[str]):
#     """
#     Асинхронно возвращает список предметов из инвентаря пользователя по id.
#     """
#     arrayItems = []

#     for item_id in ids:
#         client_item = await sync_to_async(
#             lambda: InventoryItem.objects.select_related('steam_item')
#             .get(owner=user, id=item_id)
#         )()
#         arrayItems.append(client_item)

#     # возвращаем список и длину
#     return arrayItems

def sync_get_user_inventory_items(user, ids: list[str]):
    """
    Асинхронно возвращает список предметов из инвентаря пользователя по id.
    Работает в один запрос к БД.
    """
    if not ids:
        return JsonResponse({"status": "ObjectDoesNotExist"}, status=411)

    try:
        # Синхронная функция для materialization QuerySet
        def fetch_items():
            return list(
                InventoryItem.objects.select_for_update().select_related('steam_item')
                .filter(owner=user, id__in=ids, marketable=True, tradable=True)
            )

        # Асинхронный вызов
        print(222222222)
        items = fetch_items()
        if not items or len(items) != len(ids):
            return JsonResponse({"status": "ObjectDoesNotExist"}, status=411)
        return items

    except ObjectDoesNotExist:
        # Если нет ни одного объекта
        return JsonResponse({"status": "ObjectDoesNotExist"}, status=411)

    except Exception:
        # Логируем и пробрасываем исключение дальше
        return JsonResponse({"status": "ObjectDoesNotExist"}, status=411)


async def get_user_inventory_items(user, ids: list[str]):
    """
    Асинхронно возвращает список предметов из инвентаря пользователя по id.
    Работает в один запрос к БД.
    """
    if not ids:
        return JsonResponse({"status": "ObjectDoesNotExist"}, status=411)

    try:
        # Синхронная функция для materialization QuerySet
        def fetch_items():
            return list(
                InventoryItem.objects.select_related('steam_item')
                .filter(owner=user, id__in=ids, tradable=True, marketable=True)
            )

        # Асинхронный вызов
        print(222222222)
        items = await sync_to_async(fetch_items)()
        if not items or len(items) != len(ids):
            return JsonResponse({"status": "ObjectDoesNotExist"}, status=411)
        return items

    except ObjectDoesNotExist:
        # Если нет ни одного объекта
        return JsonResponse({"status": "ObjectDoesNotExist"}, status=411)

    except Exception:
        # Логируем и пробрасываем исключение дальше
        return JsonResponse({"status": "ObjectDoesNotExist"}, status=411)


def get_random_item_contracts(prize_value: Decimal, min_value: Decimal):
    """
    Возвращает предмет максимально близкий к prize_value в диапазоне [min_value, prize_value*4].
    Если предметов нет, возвращает JsonResponse с 410.
    """
    # Функция поиска предмета в диапазоне
    print("7777777777777777",  min_value, prize_value)

    def find_item_in_range(min_val, max_val):
        def fetch_items():
            return list(
                SteamItemCs.objects.filter(
                    price__gte=min_val, price__lte=max_val)
                .order_by('price')
            )
        return fetch_items()
    print("4451231241231",  min_value, prize_value)
    items = find_item_in_range(min_value, prize_value)
    print("123123",  min_value, prize_value)
    if items:
        # Находим предмет с ценой максимально близкой к prize_value
        closest_item = min(items, key=lambda x: abs(x.price - prize_value))
        return closest_item
    print("ccccccc")

    # Если не найдено, расширяем поиск до min_value*4
    items = find_item_in_range(prize_value, min_value * 4)
    if items:
        closest_item = min(items, key=lambda x: abs(x.price - prize_value))
        return closest_item
    print("123123")

    # Если предметов нет вообще
    return JsonResponse({"detail": "No items found"}, status=410)


def remove_inventory_objects(items: list[InventoryItem]):
    """
    Удаляет предметы из инвентаря пользователя.
    :param items: список объектов InventoryItem
    :return: количество удалённых предметов
    """
    def _delete_items():
        count = len(items)
        InventoryItem.objects.filter(
            id__in=[item.id for item in items]).delete()
        return count

    return _delete_items()


def play_contracts_game(user, items: list):
    """
    Игра "контракты": на вход список InventoryItem, на выход приз.
    """
    # 1. Считаем общую стоимость предметов
    print("sssssssssssssssssssssssss")
    total_price = sum(
        # допустим, у steam_item есть поле price
        Decimal(item.steam_item.price) for item in items
    )

    # 2. Получаем глобальный коэффициент из Redis
    print("--------------------")
    ad = GlobalCoefficientRedis.find().first()
    print("++++++++++++++++++++")
    pgrades_global = ad.contracts_global

    # 3. Берём персональный коэффициент
    personal_coeff = user.contracts_chance  # поле из модели User

    # 4. Финальный шанс
    final_coeff = Decimal(pgrades_global) * Decimal(personal_coeff)

    # 5. Определяем исход
    min_value = Decimal(total_price) / Decimal(4)
    max_value = Decimal(total_price) * Decimal(4)

    # итоговый коэффициент
    a = Decimal(secrets.randbelow(101)) * final_coeff
    b = Decimal(secrets.randbelow(101))
    print(a, b)
    # защищаем от деления на ноль
    if b == Decimal(0):
        b = Decimal(0.1)

    cof = min(Decimal(a / b), Decimal('1.0'))  # гарантированно в [0, 1]
    print(cof)
    print("ddddddddasdaw", min_value, cof, max_value,
          total_price)
    # линейная интерполяция
    prize_value = Decimal(min_value) + (Decimal(max_value) -
                                        Decimal(min_value)) * Decimal(cof)
    print("7777777777777777")
    prize_item = get_random_item_contracts(
        prize_value=prize_value, min_value=min_value)
    return prize_item


def get_user_by_id(user_id: str):
    """
    Асинхронно возвращает пользователя по его UUID.
    :param user_id: UUID пользователя (строка)
    :return: User или None
    """
    return User.objects.select_for_update().filter(id=user_id).first()


def play_upgrade_game(user, server_item, client_item=None, price=None):
    """Игра на апгрейд предмета. Может использовать client_item или деньги (price)."""
    print(7777777777777)
    # определяем цену апгрейда
    upgrade_price = client_item.steam_item.price if client_item else price

    # запускаем апгрейд
    spin_state = spin_upgrade(
        user=user,
        server_item=server_item.price,
        price=upgrade_price
    )
    user.total_upgrades += 1
    TotalActionAmount.increment_total_upgrades()
    user.save()
    if spin_state is True:
        item_state = sync_spin_state_wheel(user)
        item = sync_create_order(item_state, server_item, user)
        order_to_send = {
            "id": str(item.id),
            "gunModel": item.steam_item.item_model,
            "gunStyle": item.steam_item.item_style,
            "gunPrice": item.steam_item.price,
            "imgPath": item.steam_item.icon_url,
            "type": item.steam_item.rarity,
            "price": item.steam_item.price,
            "state": item_state
        }
        return JsonResponse({"status": "client win", 'items': order_to_send}, status=201)
    return JsonResponse({"status": "client lose"}, status=202)


def check_user_money_battles(user, cases):
    balance = user.money_amount

    total_price = 0
    valid_cases = []

    for item in cases:
        # получаем кейс из базы или Redis (асинхронно)
        case_obj = Case.objects.get(id=item["case"].id)
        case_amount = item["case_amount"]
        price = case_obj.price * case_amount

        total_price += price

        # добавляем проверенный кейс с количеством
        valid_cases.append({
            "case": case_obj,
            "case_amount": case_amount,
        })

    if balance >= total_price:
        return valid_cases
    else:
        return JsonResponse({"error": "You don't have enough funds!"}, status=402)


def create_battle_with_cases(creator, valid_cases, players_amount=2, ended_at=None):
    # Создаём Battle
    created_at = timezone_utils.now()
    ended_at = ended_at or (created_at + timedelta(hours=2))
    battle = Battle.objects.create(
        creator=creator,
        created_at=created_at,
        ended_at=ended_at,
        players_amount=players_amount,
        is_active=True
    )

    # Синхронное добавление кейсов через обычный цикл
    for item in valid_cases:
        case = item.get("case")
        case_amount = item.get("case_amount")
        if case is not None:
            BattleCase.objects.create(
                battle=battle,
                case=case,
                case_amount=case_amount
            )

    return battle.id


# async def create_battle_with_cases(creator, valid_cases, players_amount=2):

#     # 1️⃣ Создаём Battle (синхронно через sync_to_async)
#     battle = await sync_to_async(Battle.objects.create)(
#         creator=creator,
#         created_at=timezone.now(),
#         players_amount=players_amount,
#         is_active=True
#     )

#     # 2️⃣ Добавляем кейсы к батлу
#     for item in valid_cases:
#         case = item["case"]
#         case_amount = item["case_amount"]

#         # достаём кейс из Redis (асинхронно)

#         if case is None:
#             continue  # пропускаем недоступные кейсы

#         # создаём BattleCase
#         await sync_to_async(BattleCase.objects.create)(
#             battle=battle,
#             case=case,  # ForeignKey
#             case_amount=case_amount
#         )

#     return battle


@async_require_methods(["GET"])
@ensure_csrf_cookie
async def get_csrf_view(request):
    return HttpResponse(status=200)


@async_require_methods(["GET"])
async def me_view(request):
    if not request.token_data:
        return JsonResponse({"error": "Unauthorized"}, status=401)

    try:
        user = await sync_to_async(User.objects.get)(id=request.token_data.get("id"))
        money_amount = round(float(user.money_amount),
                             2)  # округляем до 2 знаков
    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

    # добавляем поле к данным токена
    token_data = {**request.token_data, "money_amount": money_amount}

    return JsonResponse(token_data)


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

# OK CHECKED


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


# OK CHECKED
@async_require_methods(["GET"])
async def google_login_view(request):
    state = await create_state_token()
    scope = "openid email profile"

    params = {
        "client_id": GOOGLE_CLIENT_ID,
        "redirect_uri": GOOGLE_REDIRECT_URL,
        "response_type": "code",
        "scope": scope,
        "state": state,
        "access_type": "offline",
        "include_granted_scopes": "true",
        # "prompt": "consent",  # <- опционально: всегда показывать окно выбора аккаунта
    }

    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth?" + urlencode(params)
    )

    return JsonResponse({"auth_url": google_auth_url})


@async_require_methods(["GET"])
async def vk_callback_view(request):
    pass

# OK CHECKED


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
    user_data = await get_steam_player_info(steam_id)
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

    if user_data:
        if user_data.get("personaname", user.username):
            user.username = user_data.get("personaname", user.username)
        if user_data.get("avatarfull", user.avatar_url):
            user.avatar_url = user_data.get("avatarfull", user.avatar_url)
        await sync_to_async(user.save)()
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


# OK CHECKED
@async_require_methods(["GET"])
async def google_callback_view(request):
    state = request.GET.get("state")
    code = request.GET.get("code")
    status = await sync_to_async(check_state_scrf)(state)
    if status is False or code is False:
        return JsonResponse({"error": "Invalid or expired state"}, status=409)

    await sync_to_async(OAuthState.delete)(state)
    user_info = await ask_data_from_google(code)
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
    try:
        social_account = await sync_to_async(
            lambda: SocialAccount.objects.select_related('user').get(
                provider='google', provider_user_id=google_id
            )
        )()
        # Обновляем токены и данные
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

        if case_type == "all":
            filtered_cases = [case.model_dump() for case in all_cases]
        else:
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


@require_http_methods(["POST"])
def get_open_case_view(request, case_id):
    try:
        with transaction.atomic():
            money_check = sync_check_user_money(request, case_id)
            if isinstance(money_check, JsonResponse):
                return money_check  # 402
            if isinstance(money_check, dict) and "user" in money_check and "case" in money_check:
                isFundsWrittenof = deduct_user_money(
                    money_check["user"], money_check["case"])
                if isFundsWrittenof is True:
                    prize_item = sync_spin_roulette_wheel(
                        money_check["case"], money_check["user"])
                    item_state = sync_spin_state_wheel(money_check["user"])
                    money_check["user"].total_case_opened += 1
                    TotalActionAmount.increment_total_opened_cases()
                    print(money_check["user"].best_case.get(
                        "price", 0),  money_check["case"].price, 67676767)
                    if (
                        "price" not in money_check["user"].best_case
                        or float(money_check["user"].best_case.get("price", 0)) <= float(money_check["case"].price)
                    ):
                        money_check["user"].best_case = {
                            "id": money_check["case"].id,
                            "imgPath": money_check["case"].icon_url,
                            "name": money_check["case"].name,
                            "price": money_check["case"].price,
                        }
                    money_check["user"].save()
                    sync_create_order(item_state, prize_item,
                                      money_check["user"], money_check["case"])
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
                    items_list = sync_get_case_items(money_check["case"].id)
                    return JsonResponse({"prize_item": prize_dict, "case_items": items_list}, status=200)
                # Логика открытия кейса
        return JsonResponse({"Error": "server error"}, status=501)
    except Exception as e:
        print(e)
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["POST"])
def raffles_take_a_part_view(request):
    try:
        body = json.loads(request.body)
        raffle_id = body.get("id")  # или
        with transaction.atomic():
            money_check = check_user_money_raffels(request, raffle_id)
            if isinstance(money_check, JsonResponse):
                return money_check  # 402
            if isinstance(money_check, dict) and "user" in money_check and "raffels" in money_check:
                isFundsWrittenof = deduct_user_money_raffels(
                    money_check["user"], money_check["raffels"])
                if isFundsWrittenof is True:
                    return add_to_raffels(money_check["raffels"].id, money_check["user"])
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

        return JsonResponse(ad.model_dump(), safe=False)

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
    # try:
    data = json.loads(request.body)

    page = int(data.get("page", 1))
    ordered_by = int(data.get("sort_by", 1))  # исправил опечатку
    body = data.get("body", {})
    deleted_length = data.get("filteredDeletedLength", 0)
    client_id = body.get("client_id")
    limit = int(body.get("limit", 25))

    if not client_id:
        return JsonResponse({"error": "client_id is required"}, status=404)

    offset = (page - 1) * limit

    # считаем общее количество у клиента
    if ordered_by == 1:
        ordering = "created_at"                # по умолчанию по дате создания
    elif ordered_by == 2:
        ordering = "steam_item__item_model"    # по названию
    elif ordered_by == 3:
        ordering = "steam_item__price"         # по возрастанию цены
    elif ordered_by == 4:
        ordering = "-steam_item__price"        # по убыванию цены
    else:
        ordering = "created_at"
    # достаём нужный кусок данных
    start_index = max(offset - deleted_length, 0)
    end_index = offset + limit
    print(ordering, 484848)
    items_qs = (
        InventoryItem.objects
        .filter(owner_id=client_id,
                tradable=True,
                marketable=True)
        .select_related("steam_item")
        .order_by(ordering)[start_index:end_index]
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

    # except Exception as e:
    #     return JsonResponse({"error": str(e)}, status=500)


@async_require_methods(["POST"])
async def get_inventory_server_items_view(request):
    try:
        print(1)
        data = json.loads(request.body)
        page = int(data.get("page", 1))
        body = data.get("body", {})
        text_sort_value = data.get("textSortValue", "").strip()
        limit = int(body.get("limit", 25))
        offset = (page - 1) * limit
        start_price = body.get("startPrice", None)
        if start_price:
            start_price = float(body.get("startPrice", None))

        # Достаём данные из БД асинхронно

        # qs = await sync_to_async(
        #     lambda: list(
        #         SteamItemCs.objects.all()[
        #             offset:offset+limit]
        #     )
        # )()

        # def fetch():
        #     qs = SteamItemCs.objects.all()
        #     if start_price is not None and float(start_price) != 0:
        #         qs = qs.filter(price__gte=float(start_price))
        #     qs = qs.order_by("price")[offset:offset + limit]
        #     return list(qs)

        def fetch():
            qs = SteamItemCs.objects
            if start_price is not None and float(start_price) > 0:
                qs = qs.filter(price__gte=float(start_price))
            if text_sort_value:
                qs = qs.filter(
                    Q(item_model__icontains=text_sort_value) |
                    Q(item_style__icontains=text_sort_value)
                )
            qs = qs.order_by("price")
            qs_page = qs[offset:offset + limit]

            return list(qs_page)
        qs = await sync_to_async(fetch)()
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


@require_http_methods(["POST"])
def make_contract_view(request):
    try:

        body = json.loads(request.body.decode("utf-8"))
        items = body.get("itemClientData", [])

        if not isinstance(items, list):
            return JsonResponse({"error": "itemClientData must be a list"}, status=403)

        # оставляем только уникальные по id
        seen_ids = set()
        unique_items = []
        for item in items:
            item_id = item.get("id")
            if item_id and item_id not in seen_ids:
                seen_ids.add(item_id)
                unique_items.append(item)

        # проверяем количество
        if not (2 < len(unique_items) < 11):
            return JsonResponse({"error": "Number of unique items must be >3 and <10"}, status=403)
        print(100000000000000000000)
        with transaction.atomic():
            user_item = get_user_by_id(request.token_data.get("id"))

            item_ids = [str(item["id"])
                        for item in unique_items if "id" in item]
            print(111111111111111111111111111, user_item.id, item_ids[0])

            inventoryItems = sync_get_user_inventory_items(
                ids=item_ids, user=user_item)
            if isinstance(inventoryItems, JsonResponse):
                return inventoryItems
            print(2222222222222222222222222,
                  inventoryItems[0].steam_item.id)
            won_item = play_contracts_game(
                user=user_item, items=inventoryItems)
            print(333333333333333333333333333333)
            if isinstance(won_item, JsonResponse):
                return won_item
            remove_inventory_objects(items=inventoryItems)
            print(44444444444444444444444444444444444)
            print(5555555555555555555555555555555555555)
            state = sync_spin_state_wheel(user_item)
            print(6666666666666666666666666666666666666666666)
            user_item.total_contracts += 1
            TotalActionAmount.increment_total_contracts()
            user_item.save()
            order = sync_create_order(
                item_state=state, item=won_item, user=user_item)
            print(77777777777777777777777777777777777777)
            order_to_send = {
                "id": str(order.id),
                "gunModel": order.steam_item.item_model,
                "gunStyle": order.steam_item.item_style,
                "gunPrice": order.steam_item.price,
                "imgPath": order.steam_item.icon_url,
                "type": order.steam_item.rarity,
                "price": order.steam_item.price,
                "state": state
            }
            print(order_to_send)
            return JsonResponse({"status": "client win", 'items': order_to_send}, status=200)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        print(e)
        return JsonResponse({"error": str(e)}, status=500)


@async_require_methods(["GET"])
async def global_battles_info_view(request):
    try:
        user_id = request.token_data.get("id") if hasattr(
            request, "token_data") else None

        # Общее количество батлов
        total_battles = await sync_to_async(lambda: ActiveBattleRedis.find().count())()
        # Количество активных батлов
        battles = await sync_to_async(lambda: list(ActiveBattleRedis.find(ActiveBattleRedis.is_active == True)))()
        active_battles = []
        for b in battles:
            if b.check_activity():
                active_battles.append(b)
            else:
                # сохраняем изменение is_active в Redis
                await sync_to_async(b.save)()

        count_active = len(active_battles)

        user_won = 0
        user_lost = 0
        if user_id:
            # Баттлы, где пользователь победил
            user_won = await sync_to_async(
                lambda: ActiveBattleRedis.find(
                    ActiveBattleRedis.winner_id == user_id).count()
            )()

            # Баттлы, где пользователь участвовал, но не выиграл
            user_lost = await sync_to_async(
                lambda: ActiveBattleRedis.find(
                    (ActiveBattleRedis.winner_id != user_id) &
                    # << проверяет вхождение в список
                    (ActiveBattleRedis.players_ids << user_id)
                ).count()
            )()

        data = {
            "total_battles": total_battles,
            "active_battles": count_active,
            "user_won": user_won,
            "user_lost": user_lost,
        }
        return JsonResponse(data)

    except Exception as e:
        print("Ошибка в global_battles_info_view:", e)
        return JsonResponse({"error": "Internal Server Error"}, status=500)


@async_require_methods(["GET"])
async def active_battles_info_view(request):
    try:
        battles = await sync_to_async(
            lambda: list(ActiveBattleRedis.find(
                ActiveBattleRedis.is_active == True))
        )()

        active_battles = []
        for b in battles:
            if b.check_activity():
                active_battles.append(b.model_dump())
            else:
                await sync_to_async(b.save)()  # обновляем статус

        return JsonResponse({"active_battles": active_battles})

    except Exception as e:
        print("Ошибка в active_battles_info_view:", e)
        return JsonResponse({"error": "Internal Server Error"}, status=500)


@async_require_methods(["POST"])
async def get_battle_info_view(request, battle_id):
    try:
        body = json.loads(request.body)
        game_id = body.get("gameId")
        print(game_id == battle_id)
        if game_id != battle_id:
            return JsonResponse({"error": "Forbidden url"}, status=403)
        try:
            battle = await sync_to_async(
                lambda: ActiveBattleRedis.find(
                    ActiveBattleRedis.id == game_id).first()
            )()
        except NotFoundError:
            return JsonResponse({"error": "Game not found"}, status=404)
        if not battle.check_activity():
            return JsonResponse({"error": "Game was finished"}, status=404)
        return JsonResponse(battle.model_dump(), status=200)
    except Exception as e:
        print("Ошибка в active_battles_info_view:", e)
        return JsonResponse({"error": "Internal Server Error"}, status=500)


@require_http_methods(["POST"])
def set_trade_link_view(request):
    try:
        body = json.loads(request.body)
        link = body.get("tradeLink", "").strip()

        # Проверка на длину
        if len(link) == 0 or len(link) > 200:
            return JsonResponse({"error": "Invalid link length"}, status=409)

        # Проверка, что это URL
        parsed = urlparse(link)
        if not parsed.scheme or not parsed.netloc:
            return JsonResponse({"error": "Invalid URL format"}, status=409)

        # Проверка, что это ссылка Steam Trade Offer
        if not link.startswith("https://steamcommunity.com/tradeoffer/new/?partner="):
            return JsonResponse({"error": "Invalid Steam trade URL"}, status=409)

        with transaction.atomic():
            user = User.objects.select_for_update().get(id=request.token_data.get("id"))
            user.trade_link = link
            user.save()

        return JsonResponse({"success": True}, status=200)

    except User.DoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        print("Error in set_trade_link_view:", e)
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["POST"])
def sell_inventory_item_view(request):
    try:
        body = json.loads(request.body)
        item_id = body.get('itemId')
        user_id = request.token_data.get('id')

        with transaction.atomic():
            # Блокируем пользователя и предмет для безопасной транзакции
            user = User.objects.select_for_update().get(id=user_id)
            item = InventoryItem.objects.select_for_update().get(owner=user, id=item_id)
            if not item.tradable or not item.marketable:
                return JsonResponse({'error': 'Предмет уже забронирован или недоступен для торговли'}, status=416)
            user.money_amount += item.steam_item.price
            user.save(update_fields=['money_amount'])
            item.delete()
            return JsonResponse({'success': True, 'new_balance': user.money_amount})

    except InventoryItem.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'Item not found'}, status=404)
    except User.DoesNotExist:
        return JsonResponse({'success': False, 'error': 'User not found'}, status=404)
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)}, status=500)


@require_http_methods(['POST'])
def book_inventory_item_view(request):
    try:
        # Получаем user_id из токена
        user_id = request.token_data.get('id')
        if not user_id:
            return JsonResponse({'error': 'Не удалось определить пользователя'}, status=401)

        # Получаем тело запроса
        body = json.loads(request.body)
        item_id = body.get('itemId')

        if not item_id:
            return JsonResponse({'error': 'Не указан itemId'}, status=400)

        # Проверяем, существует ли пользователь
        with transaction.atomic():
            try:
                user = User.objects.select_for_update().get(id=user_id)
            except User.DoesNotExist:
                return JsonResponse({'error': 'Пользователь не найден'}, status=404)

            # Проверяем наличие trade_link у пользователя
            if not user.trade_link:
                return JsonResponse({'error': 'Отсутствует trade_link у пользователя'}, status=415)

            # Проверяем, существует ли предмет и принадлежит ли пользователю
            try:
                item = InventoryItem.objects.select_for_update().get(id=item_id, owner=user)
            except InventoryItem.DoesNotExist:
                return JsonResponse({'error': 'Предмет не найден или не принадлежит пользователю'}, status=404)

            # Проверяем, не забронирован ли уже предмет
            if not item.tradable or not item.marketable:
                return JsonResponse({'error': 'Предмет уже забронирован или недоступен для торговли'}, status=416)

            # Обновляем состояние предмета
            item.tradable = False
            item.marketable = False
            item.save()

            # Создаём запись в ItemsOrders
            order = ItemsOrders.objects.create(
                inventory_item=item,
                trade_link=user.trade_link,
                order_date=timezone_utils.now()
            )

            return JsonResponse({
                'success': True,
                'message': 'Предмет успешно забронирован',
                'order_id': order.id,
                'item_id': str(item.id),
                'market_hash_name': item.market_hash_name,
                'trade_link': user.trade_link
            }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({'error': 'Некорректный JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@async_require_methods(['POST'])
async def profile_info_view(request):
    try:
        data_full = json.loads(request.body)
        asked_user_id = data_full.get("id")

        if not asked_user_id:
            return JsonResponse({"error": "User ID is required"}, status=400)

        # Получаем пользователя асинхронно (через sync_to_async)
        asked_user = await sync_to_async(User.objects.get)(id=asked_user_id)
        owner_id = request.token_data.get("id")
        first_social_account = await sync_to_async(lambda: asked_user.social_accounts.first())()
        provider = first_social_account.provider if first_social_account else None

        if owner_id == asked_user_id:
            response_data = {
                "id": str(asked_user.id),
                "provider": provider,
                "username": asked_user.username,
                "email": asked_user.email,
                "avatar_url": asked_user.avatar_url,
                "money_amount": float(asked_user.money_amount),
                "stats": {
                    "total_case_opened": asked_user.total_case_opened,
                    "total_upgrades": asked_user.total_upgrades,
                    "total_raffles": asked_user.total_raffles,
                    "total_battles": asked_user.total_battles,
                    "total_contracts": asked_user.total_contracts,
                },
                "best_case": asked_user.best_case,
                "best_skin": asked_user.best_skin,
            }
        else:
            response_data = {
                "id": str(asked_user.id),
                "provider": provider,
                "username": asked_user.username,
                "email": asked_user.email,
                "avatar_url": asked_user.avatar_url,
                "stats": {
                    "total_case_opened": asked_user.total_case_opened,
                    "total_upgrades": asked_user.total_upgrades,
                    "total_raffles": asked_user.total_raffles,
                    "total_battles": asked_user.total_battles,
                    "total_contracts": asked_user.total_contracts,
                },
                "best_case": asked_user.best_case,
                "best_skin": asked_user.best_skin,
            }
        return JsonResponse(response_data, status=200, safe=False)

    except ObjectDoesNotExist:
        return JsonResponse({"error": "User not found"}, status=404)

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@require_http_methods(["POST"])
def create_battles_view(request):
    try:
        print("start")
        data_full = json.loads(request.body)
        print("data_full")
        data = data_full.get("data")
        print("data: ", data)
        player_total_amount = data_full.get("players_amount")
        print("player_total_amount: ", player_total_amount)
        # проверяем, что пришёл массив
        if not isinstance(data, list):
            return JsonResponse({"error": "Payload must be a list"}, status=400)

        # 1. фильтруем элементы с некорректным caseAmount
        filtered = [item for item in data if 0 < item.get("caseAmount", 0) < 4]
        print("filtered: ", filtered)

        # 2. проверяем длину массива
        if not (0 < len(filtered) < 4):
            return JsonResponse({"error": "Количество кейсов должно быть от 1 до 3"}, status=404)

        total_amount = sum(item["caseAmount"] for item in filtered)
        print("filtered: ", total_amount)
        if not (0 < total_amount < 4):
            return JsonResponse({"error": "Сумма всех caseAmount должна быть >0 и <4"}, status=400)

        valid_cases = []

        for item in filtered:
            print("sonic")
            case_obj = CaseRedisStandart.find(
                CaseRedisStandart.id == str(item["id"]))
            case_obj = case_obj[0] if case_obj else None
            if case_obj is None:
                return JsonResponse({"error": f"Case with id {item['id']} not found in Redis"}, status=400)

            valid_cases.append({
                "case": case_obj,            # объект кейса
                "case_amount": item["caseAmount"]
            })
        user_id = request.token_data.get("id")
        print("user_id: ", user_id)
        with transaction.atomic():
            user = User.objects.select_for_update().get(id=user_id)
            print("user: ", user)
            cases = check_user_money_battles(user, valid_cases)
            print("cases: ", cases)
            if isinstance(cases, JsonResponse):
                return cases
            battle_id = create_battle_with_cases(
                creator=user, valid_cases=cases, players_amount=player_total_amount)
            print("battle_id: ", battle_id)
            return JsonResponse({"battle_id": battle_id})

    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)
    except Exception as e:
        return JsonResponse({"error": e}, status=500)


@require_http_methods(["POST"])
def upgrade_item_view(request):
    try:
        with transaction.atomic():
            data = json.loads(request.body)

            client_item_id = data.get("clientItemId")
            server_item_id = data.get("serverItemId")
            price = data.get("price")

            # Проверяем обязательные поля
            if not server_item_id or (not price and not client_item_id):
                return JsonResponse({"success": False, "error": "serverItemId и хотя бы одно из полей clientItemId или price обязательны"}, status=400)
            money_check = check_user_money_upgrades(
                request, server_item_id=server_item_id, client_item_id=client_item_id, price=price)
            if isinstance(money_check, JsonResponse):
                return money_check  # 402
            if isinstance(money_check, dict) and "user" in money_check and ("price" in money_check or "client_item" in money_check):
                if "client_item" in money_check:
                    answer = play_upgrade_game(
                        user=money_check["user"], client_item=money_check["client_item"], server_item=money_check["server_item"])
                    sync_remover_order(
                        money_check["user"], money_check["client_item"])
                    return answer
                else:
                    deduct_user_money_upgrade(
                        money_check["user"], money_check["price"])
                    return play_upgrade_game(user=money_check["user"], price=money_check["price"], server_item=money_check["server_item"])
    except Exception as e:
        print(e)
        return JsonResponse({"error": str(e)}, status=500)


@async_require_methods(["POST"])
async def logout_view(request):
    access_token = request.COOKIES.get("access_token")
    refresh_token = request.COOKIES.get("refresh_token")

    # Функция для блокировки токена
    async def block(token_str, token_type):
        if not token_str:
            return
        try:
            token = UntypedToken(token_str)
            jti = token.get("jti")
            user_id = token.get("id")
            exp = token.get("exp")
            if jti and user_id and exp:
                BlockedTokenRedis.block_token(
                    jti=jti,
                    token_type=token_type,
                    user_id=user_id,
                    exp=exp
                )
        except TokenError:
            pass  # токен уже недействителен, игнорируем

    # Блокируем оба токена
    await block(access_token, "access")
    await block(refresh_token, "refresh")

    # Удаляем куки
    response = JsonResponse({"detail": "Logged out successfully"})
    # response.delete_cookie("access_token")
    # response.delete_cookie("refresh_token")

    return response


@async_require_methods(["GET"])
async def total_activities_view(request):
    # Redis OM не async, поэтому используем sync_to_async
    @sync_to_async
    def get_total_data():
        obj = TotalActionAmountRedis.find().first()  # единственная запись
        if not obj:
            return None
        return {
            "upgrades": obj.total_upgrades,
            "cases": obj.total_opened_cases,
            "contracts": obj.total_contracts,
            "battles": obj.total_battles,
        }

    data = await get_total_data()
    if not data:
        return JsonResponse({"error": "No data in Redis"}, status=404)

    return JsonResponse(data)
