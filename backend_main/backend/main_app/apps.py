from django.apps import AppConfig


class MainAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main_app'

    def ready(self):
        from django.db.utils import OperationalError
        from .models import Case, SteamItemCs
        from .redis_models import CaseRedisStandart, ItemRedisStandart

        try:
            # чистим редис от старых кейсов
            CaseRedisStandart.find().delete()

            # грузим кейсы
            for case in Case.objects.prefetch_related("items__steam_item"):
                CaseRedisStandart(
                    id=str(case.id),
                    name=case.name_json,
                    icon_url=case.icon_url,
                    items=[
                        {
                            "id": ci.steam_item.id,
                        }
                        for ci in case.items.all()
                    ]
                ).save()

            for item in SteamItemCs.objects.all():
                ItemRedisStandart(
                    id=str(item.id),
                    icon_url=item.icon_url,
                    item_model=item.item_model,
                    price=item.price,
                    rarity=item.rarity,
                ).save()
        except OperationalError:
            # чтобы не падал при миграциях
            pass
