# import secrets
import os
# from django.conf import settings
from django.http import JsonResponse
from django.shortcuts import redirect
import requests

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")


def google_login(request):
    # state = secrets.token_urlsafe(16)
    # request.session['oauth_state'] = state
    client_id = GOOGLE_CLIENT_ID
    redirect_uri = "http://localhost:8000/api/oauth2/google/callback/"
    scope = "openid email profile"

    google_auth_url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={client_id}"
        f"&redirect_uri={redirect_uri}"
        f"&response_type=code"
        f"&scope={scope}"
        # f"&state={state}"
    )
    return JsonResponse({"auth_url": google_auth_url})


# backend_main/backend/users/views.py


def google_callback(request):
    code = request.GET.get('code')
    # обменяем code на токен
    token_response = requests.post(
        'https://oauth2.googleapis.com/token',
        data={
            'code': code,
            'client_id': GOOGLE_CLIENT_ID,
            'client_secret': GOOGLE_CLIENT_SECRET,
            'redirect_uri': 'http://localhost:8000/oauth2/google/callback/',
            'grant_type': 'authorization_code'
        }
    ).json()

    access_token = token_response['access_token']
    # получаем инфо о пользователе
    user_info = requests.get(
        'https://www.googleapis.com/oauth2/v1/userinfo',
        params={'access_token': access_token}
    ).json()

    # создаём/обновляем User + SocialAccount
    # выдаём JWT фронту
