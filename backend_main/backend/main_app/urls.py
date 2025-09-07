from django.urls import path
from . import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    # path("", views.index, name="TokenObtainPairView"),
    path('me/', views.me_view,
         name='me_view'),
    path('oauth2/google/login/', views.google_login_view,
         name='google_oauth2_login'),
    path('oauth2/google/callback/', views.google_callback_view,
         name='google_oauth2_login'),
    path('oauth2/vk/login/', views.vk_login_view, name='vk_oauth2_login'),
    path('oauth2/vk/callback/',
         views.vk_callback_view, name='vk_oauth2_callback'),
    path('oauth2/steam/login/', views.steam_login_view, name='vk_oauth2_login'),
    path('oauth2/steam/callback/',
         views.steam_callback_view, name='vk_oauth2_callback'),
]
