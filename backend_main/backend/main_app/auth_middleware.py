import json
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import get_user_model

User = get_user_model()


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
                        refresh = RefreshToken(refresh_token)
                        new_access = AccessToken()
                        new_access["id"] = refresh.get("id")
                        new_access["username"] = refresh.get("username")
                        new_access["avatar"] = refresh.get("avatar")
                        new_access["provider"] = refresh.get("provider")
                        new_access["token_version"] = refresh.get(
                            "token_version")
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
                    refresh = RefreshToken(refresh_token)
                    new_access = AccessToken()
                    new_access["id"] = refresh.get("id")
                    new_access["username"] = refresh.get("username")
                    new_access["avatar"] = refresh.get("avatar")
                    new_access["provider"] = refresh.get("provider")
                    new_access["token_version"] = refresh.get(
                        "token_version")
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
                max_age=5 * 60,
            )

        return response
