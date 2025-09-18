
from django.db.utils import OperationalError
from redis.exceptions import ConnectionError as RedisConnectionError
from .models import Case, Raffles, CaseItem, Advertisement, BackgroundMainPage, GlobalCoefficient
from .redis_models import CaseRedisStandart, RafflesRedis, GlobalCoefficientRedis, ItemRedisStandart, AdvertisementRedis, BackgroundMainPageRedis
from django.utils import timezone


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
        print("✅ Redis синхронизирован ItemRedisStandart, CaseRedisStandart")

    except RedisConnectionError:
        raise
    except OperationalError:
        print("❌ Postgres ещё не готов — ждём…")


def load_background_main():
    try:
        # проверим доступность Redis
        BackgroundMainPageRedis.db().ping()
        ad = BackgroundMainPage.objects.order_by('-id').first()
        if not ad:
            return

        # Очищаем старую запись в Redis
        BackgroundMainPageRedis.find().delete()

        # Сохраняем только последний объект
        BackgroundMainPageRedis(
            pc_background_url=ad.pc_background_url,
            mobile_background_url=ad.mobile_background_url,
            pc_background_grass_url=ad.pc_background_grass_url,
            mobile_background_grass_url=ad.mobile_background_grass_url,
        ).save()

        print("✅ Redis синхронизирован: сохранена последняя запись BackgroundMainPageRedis")

    except RedisConnectionError:
        raise
    except OperationalError:
        print("❌ Postgres ещё не готов — ждём…")


def load_global_coefficient_main():
    try:
        # проверим доступность Redis
        GlobalCoefficientRedis.db().ping()
        ad = GlobalCoefficient.objects.order_by('-id').first()
        if not ad:
            return

        # Очищаем старую запись в Redis
        GlobalCoefficientRedis.find().delete()

        # Сохраняем только последний объект
        GlobalCoefficientRedis(
            raffles_global=ad.raffles_global,
            cases_global=ad.cases_global,
            upgrades_global=ad.upgrades_global,
            contracts_global=ad.contracts_global,
            battles_global=ad.battles_global,
        ).save()

        print("✅ Redis синхронизирован: сохранена последняя запись GlobalCoefficientRedis")

    except RedisConnectionError:
        raise
    except OperationalError:
        print("❌ Postgres ещё не готов — ждём…")


def load_raffles():
    try:
        # проверим доступность Redis
        RafflesRedis.db().ping()
        now = timezone.now()
        active_raffles = Raffles.objects.filter(end_date__gt=now)

        RafflesRedis.find().delete()

        for raffle in active_raffles:
            # создаём или обновляем запись в Redis
            RafflesRedis(
                id=str(raffle.id),
                prize_item={
                    "id": str(raffle.prize_item.id),
                    "imgUrl": raffle.prize_item.icon_url,
                    "gunModel": raffle.prize_item.item_model,
                    "gunStyle": raffle.prize_item.item_style,
                    "rarity": raffle.prize_item.rarity,
                } if raffle.prize_item else {},
                players_ids=[str(p.id) for p in raffle.players.all()],
                participate_price=float(raffle.participate_price),
                fake_users_amount=raffle.fake_users_amount or 0,
                max_users_amount=raffle.max_users_amount,
                end_date=raffle.end_date
            ).save()

        print("✅ Redis синхронизирован: сохранена последняя запись RafflesRedis")

    except RedisConnectionError:
        raise
    except OperationalError:
        print("❌ Postgres ещё не готов — ждём…")
