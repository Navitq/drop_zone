
from django.db.utils import OperationalError
from redis.exceptions import ConnectionError as RedisConnectionError
from .models import User, Case, Battle, Raffles, GlobalStateCoeff, CrownFilterData, CaseItem, TotalActionAmount, Advertisement, BackgroundMainPage, GlobalCoefficient
from .redis_models import BlockedUserRedis, CaseRedisStandart, CrownFilterDataRedis, TotalActionAmountRedis, GlobalStateCoeffRedis, PlayerInfo, CaseInfo, RafflesRedis, ActiveBattleRedis, GlobalCoefficientRedis, ItemRedisStandart, AdvertisementRedis, BackgroundMainPageRedis, push_last_20_items_to_redis_crown, push_last_20_items_to_redis
from django.utils import timezone
from redis.exceptions import RedisError
from redis_om.model.model import NotFoundError


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


def load_blocked_users():
    try:
        # Проверяем доступность Redis
        BlockedUserRedis.db().ping()

        # Получаем всех неактивных пользователей
        inactive_users = User.objects.filter(is_active=False)
        if not inactive_users.exists():
            return

        # Удаляем все старые записи в Redis
        all_blocked = BlockedUserRedis.find().all()
        for b in all_blocked:
            BlockedUserRedis.delete(b.pk)  # удаляем через класс и pk

        # Сохраняем всех неактивных пользователей в Redis
        for user in inactive_users:
            BlockedUserRedis(user_id=str(user.id)).save()

        print(
            f"✅ BlockedUserRedis синхронизирован: сохранены все неактивные пользователи {inactive_users.count()}")

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
        for case in Case.objects.filter(is_active=True).prefetch_related("items__steam_item"):
            CaseRedisStandart(
                id=str(case.id),
                name=case.name,
                icon_url=case.icon_url,
                type=case.type,
                price=case.price,
            ).save()
        # предметы
        for case_item in CaseItem.objects.select_related('steam_item', 'case').filter(case__is_active=True):
            ItemRedisStandart(
                id=str(case_item.steam_item.id),
                icon_url=case_item.steam_item.icon_url,
                item_model=case_item.steam_item.item_model,
                price=case_item.steam_item.price,
                item_style=case_item.steam_item.item_style,
                rarity=case_item.steam_item.rarity,
                drop_chance=case_item.drop_chance,
                case_id=str(case_item.case.id),
                price_factory_new=case_item.steam_item.price_factory_new,
                price_minimal_wear=case_item.steam_item.price_minimal_wear,
                price_field_tested=case_item.steam_item.price_field_tested,
                price_well_worn=case_item.steam_item.price_well_worn,
                price_battle_scarred=case_item.steam_item.price_battle_scarred,
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
            cases_global=ad.cases_global,
            upgrades_global=ad.upgrades_global,
            contracts_global=ad.contracts_global,
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
                    "exterior_wear": raffle.exterior_wear
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


def load_battles_active_main():
    """
    Загружаем все активные баттлы из Postgres в Redis (ActiveBattleRedis).
    """
    try:
        # проверим доступность Redis
        ActiveBattleRedis.db().ping()

        # очищаем старые записи активных баттлов в Redis
        ActiveBattleRedis.find().delete()

        # выбираем все баттлы (можно добавить фильтр is_active=True)
        active_battles = Battle.objects.all()

        for battle in active_battles:
            # собираем игроков
            players = [
                PlayerInfo(
                    id=str(player.id),
                    username=player.username,
                    imgpath=getattr(player, "avatar_url", None),
                )
                for player in battle.players.all()
            ]

            # собираем кейсы
            cases = [
                CaseInfo(
                    id=str(bc.case.id),
                    name=bc.case.name,
                    imgpath=getattr(bc.case, "icon_url", None),
                    price=bc.case.price,
                    case_amount=bc.case_amount
                )
                for bc in battle.battle_battles.all()
            ]

            # победитель (если есть)
            winner = []
            if battle.winner:
                winner.append(PlayerInfo(
                    id=str(battle.winner.id),
                    username=battle.winner.username,
                    imgpath=getattr(battle.winner, "avatar", None),
                ))

            # создаём запись в Redis
            redis_battle = ActiveBattleRedis(
                id=str(battle.id),
                creator_id=str(battle.creator.id) if battle.creator else None,
                players_amount=battle.players_amount,
                is_active=battle.is_active,
                created_at=battle.created_at,
                ended_at=battle.ended_at
            )

            # сохраняем JSON-поля
            redis_battle.set_players(players)
            redis_battle.set_cases(cases)
            redis_battle.set_winner(winner)
            redis_battle.save()

        print(
            f"✅ Redis синхронизирован: загружено {active_battles.count()} активных баттлов (ActiveBattleRedis)")

    except RedisConnectionError:
        print("❌ Redis недоступен — баттлы не загружены")
        raise
    except OperationalError:
        print("❌ Postgres ещё не готов — ждём…")


def load_global_state_coeff():
    try:
        # проверка доступности Redis
        GlobalStateCoeffRedis.db().ping()

        # очищаем старые записи в Redis
        GlobalStateCoeffRedis.find().delete()

        # забираем единственную запись из базы
        try:
            coeff_obj = GlobalStateCoeff.objects.get()
        except GlobalStateCoeff.DoesNotExist:
            print("❌ В базе нет GlobalStateCoeff")
            return

        # создаём объект для Redis и сохраняем
        GlobalStateCoeffRedis(
            factory_new=coeff_obj.factory_new,
            minimal_wear=coeff_obj.minimal_wear,
            field_tested=coeff_obj.field_tested,
            well_worn=coeff_obj.well_worn,
            battle_scarred=coeff_obj.battle_scarred,
        ).save()

        print("✅ Redis синхронизирован: GlobalStateCoeff сохранён")

    except RedisError:
        print("❌ Redis недоступен")
    except OperationalError:
        print("❌ Postgres ещё не готов — ждём…")


def load_crown_filter():
    try:
        # проверка доступности Redis
        CrownFilterDataRedis.db().ping()

        # очищаем старые записи в Redis
        CrownFilterDataRedis.find().delete()

        # забираем единственную запись из базы
        try:
            coeff_obj = CrownFilterData.objects.get()
        except CrownFilterData.DoesNotExist:
            print("❌ В базе нет GlobalStateCoeff")
            return

        # создаём объект для Redis и сохраняем
        CrownFilterDataRedis(
            rarity=coeff_obj.rarity,
            exterior_wear=coeff_obj.exterior_wear,
            price=float(coeff_obj.price)
        ).save()

        print("✅ Redis синхронизирован: CrownFilterData сохранён")

    except RedisError:
        print("❌ Redis недоступен")
    except OperationalError:
        print("❌ Postgres ещё не готов — ждём…")


async def update_battle_in_redis(battle_id: str, fields: dict):
    """
    fields - словарь изменённых полей.
    Обновляет только эти поля в Redis для конкретной битвы.
    """
    try:
        redis_battle = None
        print('aaaaaaaassss')
        try:
            redis_battle = ActiveBattleRedis.find(
                ActiveBattleRedis.id == battle_id).first()
        except NotFoundError:
            print(f"❌ Не найден battle {battle_id} в Redis")
        if not redis_battle:
            # Если записи нет — создаём заново
            battle = Battle.objects.filter(id=battle_id).first()
            if not battle:
                return

            # создаём запись в Redis
            redis_battle = ActiveBattleRedis(
                id=str(battle.id),
                creator_id=str(battle.creator.id) if battle.creator else None,
                players_amount=battle.players_amount,
                is_active=battle.is_active,
                created_at=battle.created_at,
                ended_at=battle.ended_at
            )

            # собираем игроков
            players = [
                PlayerInfo(
                    id=str(player.id),
                    username=player.username,
                    imgpath=getattr(player, "avatar_url", None),
                )
                for player in battle.players.all()
            ]

            redis_battle.set_players(players)

        # Обновляем только изменённые поля
        if "players" in fields:
            redis_battle.set_players(fields["players"])
        if "cases" in fields:
            redis_battle.set_cases(fields["cases"])
        if "winner" in fields:
            redis_battle.set_winner(fields["winner"])
        if "is_active" in fields:
            redis_battle.is_active = fields["is_active"]

        redis_battle.save()

    except RedisError:
        print(f"❌ Ошибка Redis при обновлении battle {battle_id}")


def sync_update_battle_in_redis(battle_id: str, fields: dict):
    """
    fields - словарь изменённых полей.
    Обновляет только эти поля в Redis для конкретной битвы.
    """
    try:
        redis_battle = None
        print('aaaaaaaassss')
        try:
            redis_battle = ActiveBattleRedis.find(
                ActiveBattleRedis.id == battle_id).first()
        except NotFoundError:
            print(f"❌ Не найден battle {battle_id} в Redis")
        if not redis_battle:
            # Если записи нет — создаём заново
            battle = Battle.objects.filter(id=battle_id).first()
            if not battle:
                return

            redis_battle = ActiveBattleRedis(
                id=str(battle.id),
                creator_id=str(battle.creator.id) if battle.creator else None,
                players_amount=battle.players_amount,
                is_active=battle.is_active,
                created_at=battle.created_at,
                ended_at=battle.ended_at
            )

        # Обновляем только изменённые поля
        if "players" in fields:
            redis_battle.set_players(fields["players"])
        if "cases" in fields:
            redis_battle.set_cases(fields["cases"])
        if "winner" in fields:
            redis_battle.set_winner(fields["winner"])
        if "is_active" in fields:
            redis_battle.is_active = fields["is_active"]

        redis_battle.save()

    except RedisError:
        print(f"❌ Ошибка Redis при обновлении battle {battle_id}")


def load_live_slider_drop():
    try:
        push_last_20_items_to_redis()
        print('✅ Redis синхронизирован: LIVE SLIDER сохранён')
    except RedisError:
        print("❌ Redis недоступен")
    except OperationalError:
        print("❌ Postgres ещё не готов — ждём…")


def load_live_slider_drop_crown():
    try:
        push_last_20_items_to_redis_crown()
        print('✅ Redis синхронизирован: LIVE SLIDER crown сохранён')
    except RedisError:
        print("❌ Redis недоступен")
    except OperationalError:
        print("❌ Postgres ещё не готов — ждём…")


def load_total_data():
    try:
        # проверка доступности Redis
        TotalActionAmountRedis.db().ping()

        # очищаем старые записи в Redis
        for obj in TotalActionAmountRedis.find():
            obj_pk = obj.pk  # берём pk объекта
            TotalActionAmountRedis.delete(obj_pk)

        # забираем единственную запись из базы
        try:
            coeff_obj = TotalActionAmount.objects.get()
        except TotalActionAmount.DoesNotExist:
            print("❌ В базе нет TotalActionAmount")
            return

        # создаём объект для Redis и сохраняем
        redis_obj = TotalActionAmountRedis(
            total_upgrades=coeff_obj.total_upgrades,
            total_opened_cases=coeff_obj.total_opened_cases,
            total_contracts=coeff_obj.total_contracts,
            total_battles=coeff_obj.total_battles
        )
        redis_obj.save()  # обязательно сохраняем в Redis

        print("✅ Redis синхронизирован: TotalActionAmount сохранён")

    except RedisError:
        print("❌ Redis недоступен")
    except OperationalError:
        print("❌ Postgres ещё не готов — ждём…")
