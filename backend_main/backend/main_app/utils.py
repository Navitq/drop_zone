
from django.db.utils import OperationalError
from redis.exceptions import ConnectionError as RedisConnectionError
from .models import Case, CaseItem, Advertisement
from .redis_models import CaseRedisStandart, ItemRedisStandart, AdvertisementRedis


def load_advertisement():
    try:
        # проверим доступность Redis
        AdvertisementRedis.db().ping()
        ad = Advertisement.objects.order_by('-id').first()
        if not ad:
            return

        # Очищаем старую запись в Redis
        AdvertisementRedis.find().delete()

        # Сохраняем только последний объект
        AdvertisementRedis(
            title_1=ad.title_1,
            subTitle_1=ad.subTitle_1,
            imgUrl_1=ad.imgUrl_1,
            data_and_time=ad.data_and_time,
            title_2=ad.title_2,
            subTitle_2=ad.subTitle_2,
            imgUrl_2=ad.imgUrl_2
        ).save()

        print("✅ Redis синхронизирован: сохранена последняя запись Advertisement")

    except RedisConnectionError:
        raise
    except OperationalError:
        print("❌ Postgres ещё не готов — ждём…")


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
                price=case.price,
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
                drop_chance=case_item.drop_chance,
                case_id=str(case_item.case.id)
            ).save()
        print("✅ Redis синхронизирован")

    except RedisConnectionError:
        raise
    except OperationalError:
        print("❌ Postgres ещё не готов — ждём…")
