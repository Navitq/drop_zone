from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user, social_account=None):
        token = super().get_token(user)
        token['id'] = user.id
        token['username'] = user.username
        token['avatar'] = user.avatar_url
        if social_account:
            token['provider'] = social_account.provider
        return token


class MyRefreshToken(RefreshToken):
    @classmethod
    def for_user(cls, user, social_account=None):
        token = super().for_user(user)
        token['id'] = str(user.id)  # ⚡ UUID → string
        token['username'] = user.username
        token['avatar'] = getattr(user, "avatar_url", "")
        if social_account:
            token['provider'] = social_account.provider
        return token
