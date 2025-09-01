from django.urls import path
from . import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    # path("", views.index, name="TokenObtainPairView"),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/login/', views.google_login, name='token_refresh'),
    path('oauth2/google/callback/',
         views.create_google_user, name='google_oauth2')

]
