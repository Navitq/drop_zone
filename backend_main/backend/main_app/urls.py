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
    path('cases/get_case_content/<str:case_id>/',
         views.get_case_content, name='get_case_content'),
    path('cases/<str:case_type>/',
         views.get_cases_by_type, name='get_cases_by_type'),
]
