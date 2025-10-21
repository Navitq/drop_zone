import json
from channels.middleware import BaseMiddleware
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.exceptions import TokenError
from .serializers import MyRefreshToken


class JWTAuthMiddlewareCustom(BaseMiddleware):
    """
    ASGI middleware для Channels/WebSocket.
    Проверяет JWT из HttpOnly cookie и добавляет данные пользователя в scope.
    Закрывает соединение, если токен недействителен, но для /ws/drop-slider/ всегда пропускает.
    """

    async def __call__(self, scope, receive, send):
        # Получаем путь подключения
        path = scope.get("path", "")

        # Получаем cookie из scope headers
        cookies = {}
        for header in scope.get("headers", []):
            if header[0] == b"cookie":
                cookie_str = header[1].decode()
                for item in cookie_str.split(";"):
                    if "=" in item:
                        key, value = item.strip().split("=", 1)
                        cookies[key] = value

        access_token = cookies.get("access_token")
        refresh_token = cookies.get("refresh_token")

        scope["token_data"] = None
        scope["auth"] = False  # ##### добавил ключ auth
        scope["_new_access_token"] = None

        async def close_connection(code=401):
            await send({
                "type": "websocket.close",
                "code": code
            })

        # $$$$$$  # старый код: сразу проверка access_token и закрытие соединения

        # Особый путь: /ws/drop-slider/ — всегда пропускаем
        if path.startswith("/ws/drop-slider/"):  # ##### новый блок
            # Проверяем токен, если есть, для данных, но не закрываем соединение
            if access_token:
                try:
                    token = AccessToken(access_token)
                    scope["token_data"] = {
                        "id": token.get("id"),
                        "username": token.get("username"),
                        "avatar": token.get("avatar"),
                        "provider": token.get("provider"),
                    }
                    # ##### auth True, если токен валидный
                    scope["auth"] = True
                except TokenError:
                    # Попытка через refresh_token
                    if refresh_token:
                        try:
                            refresh = MyRefreshToken(refresh_token)
                            scope["token_data"] = {
                                "id": refresh.get("id"),
                                "username": refresh.get("username"),
                                "avatar": refresh.get("avatar"),
                                "provider": refresh.get("provider"),
                            }
                            scope["auth"] = True  # ##### auth True
                        except TokenError:
                            scope["auth"] = False  # ##### auth False
                    else:
                        scope["auth"] = False  # ##### auth False
            return await super().__call__(scope, receive, send)  # ##### пропускаем ниже

        # Обычный путь: /ws/battle/... — оставляем проверку токена как раньше
        if access_token:
            try:
                token = AccessToken(access_token)
                scope["token_data"] = {
                    "id": token.get("id"),
                    "username": token.get("username"),
                    "avatar": token.get("avatar"),
                    "provider": token.get("provider"),
                }
                scope["auth"] = True  # ##### auth True
            except TokenError:
                # Попытка через refresh_token
                if refresh_token:
                    try:
                        refresh = MyRefreshToken(refresh_token)
                        scope["token_data"] = {
                            "id": refresh.get("id"),
                            "username": refresh.get("username"),
                            "avatar": refresh.get("avatar"),
                            "provider": refresh.get("provider"),
                        }
                        scope["auth"] = True  # ##### auth True
                    except TokenError:
                        return await close_connection(code=4003)
                else:
                    return await close_connection(code=4003)
        else:
            # Нет access, есть refresh?
            if refresh_token:
                try:
                    refresh = MyRefreshToken(refresh_token)
                    scope["token_data"] = {
                        "id": refresh.get("id"),
                        "username": refresh.get("username"),
                        "avatar": refresh.get("avatar"),
                        "provider": refresh.get("provider"),
                    }
                    scope["auth"] = True  # ##### auth True
                except TokenError:
                    return await close_connection(code=4003)
            else:
                return await close_connection(code=4003)

        # Всё ок, передаём управление следующему уровню
        return await super().__call__(scope, receive, send)
