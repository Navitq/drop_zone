import json
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import get_user_model
import time
from uuid import UUID
# User = get_user_model()
from .models import User
from .serializers import MyRefreshToken


class JWTAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.exclude_paths = [
            "/api/oauth2/google/login/",
            "/api/oauth2/steam/login/",
            "/api/oauth2/vk/login/",
            "/api/oauth2/google/callback/",
            "/api/oauth2/steam/callback/",
            "/api/oauth2/vk/callback/",
            "/api/cases/standart_case/",
            "/api/cases/season_case/",
            "/api/cases/bloger_case/",
            "/api/advertisement/",
            "/api/csrf/",
            "/api/main-page-background/",
            "/api/raffles/",
            "/api/global-battle-info/",
            "/api/total-activities/"
        ]

    def __call__(self, request):
        if request.path.startswith("/api/admin/") or request.path.startswith("/api/cases/get_case_content/"):
            return self.get_response(request)
        if request.path in self.exclude_paths:
            return self.get_response(request)
        access_token = request.COOKIES.get("access_token")
        refresh_token = request.COOKIES.get("refresh_token")

        request.user = None
        request.token_data = None
        request._clear_cookies = False  # флаг очистки

        if access_token:
            try:
                token = AccessToken(access_token)
                request.token_data = {
                    "id": token.get("id"),
                    "username": token.get("username"),
                    "avatar": token.get("avatar"),
                    "provider": token.get("provider"),
                }
            except TokenError:
                if refresh_token:
                    try:

                        refresh = MyRefreshToken(refresh_token)
                        exp_timestamp = refresh.payload['exp']
                        hours_left = (exp_timestamp - int(time.time())) / 3600
                        if 0 < hours_left <= 3:
                            user_id = refresh.get("id")
                            refresh = MyRefreshToken.for_user(
                                User.objects.get(id=str(user_id), is_active=True))
                            request._new_refresh_token = str(refresh)
                        new_access = refresh.access_token
                        request._new_access_token = str(new_access)
                        request.token_data = {
                            "id": refresh.get("id"),
                            "username": refresh.get("username"),
                            "avatar": refresh.get("avatar"),
                            "provider": refresh.get("provider"),
                        }
                    except TokenError:
                        request._clear_cookies = True
                else:
                    request._clear_cookies = True
        else:
            if refresh_token:
                try:
                    refresh = MyRefreshToken(refresh_token)
                    exp_timestamp = refresh.payload['exp']
                    hours_left = (exp_timestamp - int(time.time())) / 3600

                    if 0 < hours_left <= 3:
                        user_id = refresh.get("id")
                        refresh = MyRefreshToken.for_user(
                            User.objects.get(id=str(user_id), is_active=True))
                        request._new_refresh_token = str(refresh)
                    new_access = refresh.access_token
                    request._new_access_token = str(new_access)
                    request.token_data = {
                        "id": refresh.get("id"),
                        "username": refresh.get("username"),
                        "avatar": refresh.get("avatar"),
                        "provider": refresh.get("provider"),
                    }
                except (TokenError, User.DoesNotExist):
                    request._clear_cookies = True
            else:
                request._clear_cookies = True

        if request._clear_cookies:
            response = JsonResponse({"detail": "Unauthorized"}, status=401)
            response.delete_cookie("access_token")
            response.delete_cookie("refresh_token")
            return response

        response = self.get_response(request)

        # обновляем access если он был пересоздан
        if hasattr(request, "_new_access_token"):
            response.delete_cookie("access_token")
            response.set_cookie(
                "access_token",
                request._new_access_token,
                httponly=True,
                secure=True,
                samesite="Lax",
                max_age=5 * 60,  # 5 минут
            )

            # 🔸 обновляем refresh-токен, если у тебя он был пересоздан
            if hasattr(request, "_new_refresh_token"):
                response.delete_cookie("refresh_token")
                response.set_cookie(
                    "refresh_token",
                    request._new_refresh_token,
                    httponly=True,
                    secure=True,
                    samesite="Lax",
                    max_age=7 * 24 * 3600,  # 7 дней
                )

        return response
