from django.http import JsonResponse
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import TokenError
from .redis_models import BlockedTokeVersionRedis
from redis_om.model.model import NotFoundError


class BlockedTokenMiddleware:
    """
    Middleware, который проверяет — не заблокирован ли access или refresh токен.
    Работает через Redis (redis_om).
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        access_token = request.COOKIES.get("access_token")
        refresh_token = request.COOKIES.get("refresh_token")

        # Проверяем оба токена
        for token_str in (access_token, refresh_token):
            if not token_str:
                continue

            try:
                token = UntypedToken(token_str)
                token_version = token.get("token_version")
                id = token.get("id")
                if not token_version or not id:
                    continue
                try:
                    blocked = BlockedTokeVersionRedis.find(
                        (BlockedTokeVersionRedis.user_id == id) &
                        (BlockedTokeVersionRedis.token_version == token_version)
                    ).first()
                except NotFoundError:
                    blocked = None
                # Проверяем наличие в Redis
                if blocked:
                    # ⚠️ Токен найден в Redis — значит, он заблокирован
                    response = JsonResponse(
                        {"detail": "Token is blocked"}, status=401)
                    response.delete_cookie("access_token")
                    response.delete_cookie("refresh_token")
                    return response

            except TokenError:
                # Если токен невалидный, просто продолжаем (пусть обработает следующий middleware)
                continue

        return self.get_response(request)
