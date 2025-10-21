from django.contrib import admin
from .models import SocialAccount, CrownFilterData, TotalActionAmount, GlobalStateCoeff, Raffles, ItemsOrders, Battle, GlobalCoefficient, BackgroundMainPage, Advertisement, User, SteamItemCs, InventoryItem, ItemsOrders, Case, CaseItem

# Register your models here.
admin.site.register(SocialAccount)
admin.site.register(User)
admin.site.register(SteamItemCs)
admin.site.register(InventoryItem)
admin.site.register(ItemsOrders)
admin.site.register(CaseItem)
admin.site.register(Advertisement)
admin.site.register(BackgroundMainPage)
admin.site.register(GlobalCoefficient)
admin.site.register(Battle)
admin.site.register(GlobalStateCoeff)
admin.site.register(TotalActionAmount)
admin.site.register(CrownFilterData)


@admin.register(Raffles)
class RafflesAdmin(admin.ModelAdmin):
    filter_horizontal = ("players",)


class CaseItemInline(admin.TabularInline):  # или StackedInline
    model = CaseItem
    extra = 1  # сколько пустых форм показывать для добавления новых
    min_num = 0
    fields = ("steam_item", "drop_chance")
    verbose_name = "Item"
    verbose_name_plural = "Items in Case"


@admin.register(Case)
class CaseAdmin(admin.ModelAdmin):
    list_display = ("id", "get_name_en", "get_name_ru", "created_at")
    inlines = [CaseItemInline]

    def get_name_en(self, obj):
        return obj.name_en
    get_name_en.short_description = "Name (EN)"

    def get_name_ru(self, obj):
        return obj.name_ru
    get_name_ru.short_description = "Name (RU)"
