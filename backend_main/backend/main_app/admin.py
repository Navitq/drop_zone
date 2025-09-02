from django.contrib import admin
from .models import SocialAccount, User

# Register your models here.
admin.site.register(SocialAccount)
admin.site.register(User)
