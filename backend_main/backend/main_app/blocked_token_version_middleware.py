from django.http import JsonResponse
from rest_framework_simplejwt.tokens import UntypedToken
from rest_framework_simplejwt.exceptions import TokenError
from .redis_models import BlockedTokeVersionRedis
from redis_om.model.model import NotFoundError


class BlockedTokenVersionMiddleware:
    """
    Middleware, который проверяет — не заблокирован ли access или refresh токен.
    Работает через Redis (redis_om).
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        access_token = request.COOKIES.get("access_token")
        refresh_token = request.COOKIES.get("refresh_token")
        print(5656565)
        # Проверяем оба токена
        for token_str in (access_token, refresh_token):
            if not token_str:
                continue

            try:

                print(423123123123)
                token = UntypedToken(token_str)

                token_version = int(token.get("token_version"))
                print(token_version, 4587878787878787)
                id = token.get("id")
                print(not token_version)
                if (not token_version and token_version != 0) or not id:
                    continue

                blocked = False
                try:
                    print(999999999)
                    redis_token_version = BlockedTokeVersionRedis.find(
                        BlockedTokeVersionRedis.user_id == id
                    ).first()

                    print(token_version, redis_token_version.token_version,
                          redis_token_version)
                    if redis_token_version and token_version < redis_token_version.token_version:
                        blocked = True
                except NotFoundError:
                    blocked = False
                # Проверяем наличие в Redis
                if blocked:
                    # ⚠️ Токен найден в Redis — значит, он заблокирован
                    response = JsonResponse(
                        {"detail": "Token version is blocked"}, status=401)
                    response.delete_cookie("access_token")
                    response.delete_cookie("refresh_token")
                    return response

            except TokenError:
                # Если токен невалидный, просто продолжаем (пусть обработает следующий middleware)
                continue

        return self.get_response(request)
