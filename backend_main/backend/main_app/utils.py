
from django.db.utils import OperationalError
from redis.exceptions import ConnectionError as RedisConnectionError
from .models import Case, CaseItem
from .redis_models import CaseRedisStandart, ItemRedisStandart


def load_to_redis():
    """Заливаем данные в Redis"""

    try:
        # проверим доступность Redis
        CaseRedisStandart.db().ping()
        # очищаем
        CaseRedisStandart.find().delete()
        ItemRedisStandart.find().delete()

        # кейсы
        for case in Case.objects.prefetch_related("items__steam_item"):
            CaseRedisStandart(
                id=str(case.id),
                name=case.name,
                icon_url=case.icon_url,
                type=case.type,
            ).save()
        # предметы
        for case_item in CaseItem.objects.select_related('steam_item', 'case').all():
            ItemRedisStandart(
                id=str(case_item.steam_item.id),
                icon_url=case_item.steam_item.icon_url,
                item_model=case_item.steam_item.item_model,
                price=case_item.steam_item.price,
                item_style=case_item.steam_item.item_style,
                rarity=case_item.steam_item.rarity,
                case_id=str(case_item.case.id)
            ).save()
        print("✅ Redis синхронизирован")

    except RedisConnectionError:
        raise
    except OperationalError:
        print("❌ Postgres ещё не готов — ждём…")
