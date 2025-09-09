from django.contrib import admin
from .models import SocialAccount, User, SteamItemCs, InventoryItem, ItemsOrders

# Register your models here.
admin.site.register(SocialAccount)
admin.site.register(User)
admin.site.register(SteamItemCs)
admin.site.register(InventoryItem)
admin.site.register(ItemsOrders)
