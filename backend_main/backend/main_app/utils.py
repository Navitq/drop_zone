
from django.db.utils import OperationalError
from redis.exceptions import ConnectionError as RedisConnectionError
from .models import Case, SteamItemCs
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
        for item in SteamItemCs.objects.all():
            ItemRedisStandart(
                id=str(item.id),
                icon_url=item.icon_url,
                item_model=item.item_model,
                price=item.price,
                rarity=item.rarity,
            ).save()

        print("✅ Redis синхронизирован")

    except RedisConnectionError:
        raise
    except OperationalError:
        print("❌ Postgres ещё не готов — ждём…")
