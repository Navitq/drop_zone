from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


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
