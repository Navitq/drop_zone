from django.urls import path
from . import views
from django.contrib import admin


urlpatterns = [
    # path("", views.index, name="TokenObtainPairView"),
    path('admin/', admin.site.urls),
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
    path('get-season-cases/', views.get_season_cases, name='get_season_cases'),
    path('get-standart-cases/', views.get_standart_cases, name='get_season_cases'),
]
