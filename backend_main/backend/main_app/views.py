# import secrets
import os
from rest_framework_simplejwt.tokens import RefreshToken
from .redis_models import OAuthState
from asgiref.sync import sync_to_async
import secrets
from django.http import JsonResponse, HttpResponseRedirect
from .redis_models import OAuthState, OAuthCodeVerifier  # импорт модели
import aiohttp
from .models import SocialAccount, User
import json
import hashlib
import base64
from urllib.parse import quote
import requests

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_TOKEN_URL = os.getenv("GOOGLE_TOKEN_URL")
GOOGLE_REDIRECT_URL = os.getenv("GOOGLE_REDIRECT_URL")
GOOGLE_USERINFO_URL = os.getenv("GOOGLE_USERINFO_URL")
REDIRECT_OAUTH_CLIENT_PATH = os.getenv("REDIRECT_OAUTH_CLIENT_PATH")
STEAM_OPENID_URL = os.getenv("STEAM_OPENID_URL")
STEAM_DOMEN_REALM = os.getenv("STEAM_DOMEN_REALM")
STEAM_REDIRECT_URI = os.getenv("STEAM_REDIRECT_URI")


def check_state_scrf(state: str) -> bool:
    try:
        print(77777777, f'!{state}!')
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


def create_code_verified() -> object:
    data = generate_pkce_pair()
    code_verifier = data["code_verifier"]
    code_challenge = data["code_challenge"]
    OAuthState(code_verifier=code_verifier,
               code_challenge=code_challenge).save()
    return data


def create_state_token() -> str:
    state = secrets.token_urlsafe(64)
    OAuthState(state=state).save()
    return state


def vk_login_view(request):
    state = create_state_token()
    data = create_code_verified()
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


def steam_login_view(request):
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


def google_login_view(request):
    # Генерация уникального state
    state = create_state_token()

    # Сохраняем state в Redis OM с TTL

    # Формируем URL для авторизации
    scope = "openid email profile"

    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri={GOOGLE_REDIRECT_URL}"
        f"&response_type=code"
        f"&scope={scope}"
        f"&state={state}"
    )
    print(google_auth_url, f'!{state}!')
    return JsonResponse({"auth_url": google_auth_url})


async def vk_callback_view(request):
    pass


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
    refresh = await sync_to_async(RefreshToken.for_user)(user)
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
        print(15555555555555555555555555555555555555555)
        # Создаём нового пользователя
        user = await sync_to_async(lambda: User.objects.create_user(
            username=email or f"google_{google_id}",
            email=email,
            first_name=first_name,
            last_name=last_name,
            avatar_url=avatar_url
        ))()

        # Создаём социальный аккаунт
        await sync_to_async(lambda: SocialAccount.objects.create(
            user=user,
            provider='google',
            provider_user_id=google_id,
            access_token=access_token,
            refresh_token=refresh_token,
            extra_data=user_info
        ))()
    # автоматически использует кастомный сериализатор
    refresh = RefreshToken.for_user(user)
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
    user_data = {
        "id": str(user.id),
        "username": user.username,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "avatar_url": user.avatar_url
    }

    # Django HttpResponse не позволяет напрямую ставить dict в заголовок, поэтому можно сериализовать JSON
    response["X-User-Data"] = json.dumps(user_data)  # разовый заголовок

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
