import json
from django.http import JsonResponse
from django.conf import settings
from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.exceptions import TokenError

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
        ]

    def __call__(self, request):
        access_token = request.COOKIES.get("access_token")
        refresh_token = request.COOKIES.get("refresh_token")

        request.user = None
        request.token_data = None

        if access_token:
            try:
                token = AccessToken(access_token)
                print(token, 123141231)
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
                        request._new_access_token = str(new_access)
                    except TokenError:
                        return JsonResponse({"detail": "Unauthorized"}, status=401)
                else:
                    return JsonResponse({"detail": "Unauthorized"}, status=401)

        response = self.get_response(request)

        if hasattr(request, "_new_access_token"):
            response.set_cookie(
                "access",
                request._new_access_token,
                httponly=True,
                secure=True,
                samesite="Lax",
                max_age=5 * 60,
            )
        if request.token_data:
            response["X-User-Data"] = json.dumps(request.token_data)
        return response
