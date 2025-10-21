import threading
import time
from django.db.backends.signals import connection_created
from django.dispatch import receiver
from redis.exceptions import ConnectionError as RedisConnectionError
from django.db.models.signals import post_save, post_delete
from .utils import load_to_redis, load_crown_filter, load_advertisement, sync_update_battle_in_redis, load_total_data, load_global_state_coeff, load_battles_active_main, load_raffles, load_background_main, load_global_coefficient_main
from .models import Case, Battle, BattleCase, CrownFilterData, TotalActionAmount, InventoryItem, GlobalStateCoeff, BattleDrop, BattleDropItem, CaseItem, SteamItemCs, Advertisement, BackgroundMainPage, Raffles, GlobalCoefficient
import os
from django.db.models.signals import m2m_changed
from main_app.batch_queue import queue_battle_update
from main_app.redis_models import CaseInfo, PlayerInfo, CrownFilterDataRedis
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from redis.exceptions import RedisError

SLIDER_GROUP_NAME_LIVE = "drop_slider_group_live"
SLIDER_GROUP_NAME_TOP = "drop_slider_group_top"


@receiver(post_save, sender=Case)
@receiver(post_save, sender=CaseItem)
@receiver(post_save, sender=SteamItemCs)
def case_saved(sender, instance, created, **kwargs):
    """
    Срабатывает при создании или изменении кейса
    """
    if not os.environ.get("RUN_MAIN") == "true":
        return
    try:
        pass
        load_to_redis()
    except RedisConnectionError:
        pass


@receiver(post_save, sender=GlobalStateCoeff)
def load_global_state(sender, instance, created, **kwargs):
    """
    Срабатывает при создании или изменении кейса
    """
    if not os.environ.get("RUN_MAIN") == "true":
        return
    try:
        pass
        load_global_state_coeff()
    except RedisConnectionError:
        pass


@receiver(post_save, sender=Advertisement)
def advertisement_saved(sender, instance, created, **kwargs):
    """
    Срабатывает при создании или изменении кейса
    """
    if not os.environ.get("RUN_MAIN") == "true":
        return
    try:
        pass
        load_advertisement()
    except RedisConnectionError:
        pass


@receiver(post_save, sender=BackgroundMainPage)
def background_main_saved(sender, instance, created, **kwargs):
    """
    Срабатывает при создании или изменении кейса
    """
    if not os.environ.get("RUN_MAIN") == "true":
        return
    try:
        pass
        load_background_main()
    except RedisConnectionError:
        pass


@receiver(post_save, sender=GlobalCoefficient)
def load_global_coefficient_main_saved(sender, instance, created, **kwargs):
    """
    Срабатывает при создании или изменении кейса
    """
    if not os.environ.get("RUN_MAIN") == "true":
        return
    try:

        load_global_coefficient_main()
    except RedisConnectionError:
        pass


@receiver(post_save, sender=Raffles)
def raffle_saved(sender, instance, created, **kwargs):
    # Если объект создан — всегда обрабатываем
    if os.environ.get("RUN_MAIN") != "true":
        return
    try:
        load_raffles()
    except RedisConnectionError:
        pass


# @receiver(post_save, sender=Battle)
# @receiver(post_save, sender=BattleCase)
# @receiver(post_save, sender=BattleDrop)
# @receiver(post_save, sender=BattleDropItem)
# def active_battles_saved(sender, instance, created, **kwargs):
#     # Если объект создан — всегда обрабатываем
#     if os.environ.get("RUN_MAIN") != "true":
#         return
#     try:
#         load_battles_active_main()
#     except RedisConnectionError:
#         pass


@receiver(post_save, sender=Battle)
def battle_saved(sender, instance, created, **kwargs):
    """
    Сигнал для Battle:
    - при создании объекта сразу создаём запись в Redis
    - при обновлении добавляем изменения в batch
    """
    sync_update_battle_in_redis(str(instance.id), {
        "is_active": instance.is_active})
    load_total_data()
    # queue_battle_update(str(instance.id), {
    #     "is_active": instance.is_active})


@receiver(post_save, sender=TotalActionAmount)
def total_action_saved(sender, instance, created, **kwargs):
    load_total_data()


@receiver(post_save, sender=CrownFilterData)
def save_crown_filterData(sender, instance, created, **kwargs):
    load_crown_filter()


@receiver(m2m_changed, sender=Battle.players.through)
def battle_players_changed(sender, instance, action, pk_set, **kwargs):
    """
    Срабатывает, когда добавляются или удаляются игроки из битвы
    """
    if action in ['post_add', 'post_remove', 'post_clear']:
        # собираем актуальный список игроков
        players = [
            PlayerInfo(
                id=str(player.id),
                username=player.username,
                imgpath=getattr(player, "avatar_url", None),
            )
            for player in instance.players.all()
        ]
        # обновляем Redis
        sync_update_battle_in_redis(str(instance.id), {"players": players})


@receiver(post_save, sender=BattleCase)
def battle_case_saved(sender, instance, **kwargs):
    battle_id = str(instance.battle.id)

    cases = [
        CaseInfo(
            id=str(bc.case.id),
            name=bc.case.name if isinstance(bc.case.name, dict) else {
                "ru": bc.case.name},
            imgpath=getattr(bc.case, "icon_url", None),
            price=bc.case.price,
            case_amount=bc.case_amount
        )
        for bc in instance.battle.battle_battles.all()
    ]

    sync_update_battle_in_redis(battle_id, {"cases": cases})


@receiver(post_save, sender=BattleDrop)
def battle_drop_saved(sender, instance, **kwargs):
    # пример: можно добавлять в очередь изменения связанных игроков
    return
    # battle_id = str(instance.battle.id)
    # players = [
    #     PlayerInfo(
    #         id=str(player.id),
    #         username=player.username,
    #         imgpath=getattr(player, "avatar_url", None),
    #         money_amount=float(player.money_amount)
    #     )
    #     for player in instance.battle.players.all()
    # ]
    # print(players)
    # sync_update_battle_in_redis(battle_id, {"players": players})


@receiver(post_save, sender=BattleDropItem)
def battle_drop_item_saved(sender, instance, **kwargs):
    battle_id = str(instance.battle.id)
    winner = []
    if instance.battle.winner:
        winner.append(PlayerInfo(
            id=str(instance.battle.winner.id),
            username=instance.battle.winner.username,
            imgpath=getattr(instance.battle.winner, "avatar", None),
            money_amount=0
        ))
    sync_update_battle_in_redis(battle_id, {"winner": winner})


@receiver(m2m_changed, sender=Raffles.players.through)
def raffle_players_changed(sender, instance, action, **kwargs):
    """Срабатывает только при изменении игроков"""
    if os.environ.get("RUN_MAIN") != "true":
        return

    # чтобы не пересекалось с post_save
    if action in ("post_add", "post_remove", "post_clear"):
        # если нужно тоже обновлять
        try:
            load_raffles()
        except RedisConnectionError:
            pass
        print(
            f"⚡ Игроки изменились у розыгрыша {instance.id}, но post_save не трогаем")


@receiver(post_save, sender=InventoryItem)
def inventory_item_created(sender, instance, created, **kwargs):
    if not created:
        return  # ##### только при первом создании

    channel_layer = get_channel_layer()

    # Получаем данные кейса
    case_id = getattr(instance, 'case_id', None)
    if not case_id:
        return
    case_img = None
    if case_id:
        try:
            case = Case.objects.get(id=case_id)
            case_img = case.icon_url
        except Case.DoesNotExist:
            case_img = None

    # Данные пользователя
    user = instance.owner
    user_id = str(user.id)
    user_img = user.avatar_url or ""
    username = user.username

    # Формируем payload
    payload = {
        "case_id": case_id,
        "id": str(instance.id),
        "imgPath": instance.steam_item.icon_url or "",
        "gunModel": instance.steam_item.item_model or "",
        "gunStyle": instance.steam_item.item_style or "",
        "rarity": instance.rarity,
        "userId": user_id,
        "userImg": user_img,
        "username": username,
        "caseImg": case_img
    }
    filter_obj = False
    if filter_obj:
        return False
    try:
        filter_obj = CrownFilterDataRedis.find().first()
    except RedisError as e:
        print(f"Ошибка доступа к Redis: {e}")
    if filter_obj:
        return False  # или True по умолчанию, если фильтр отсутствует

    if instance.steam_item.price >= filter_obj.price and instance.rarity in filter_obj.rarity and instance.exterior_wear in filter_obj.exterior_wear:
        async_to_sync(channel_layer.group_send)(
            SLIDER_GROUP_NAME_TOP,
            {
                "type": "send_item",  # вызывает метод send_item в consumer
                "item": payload
            }
        )

    async_to_sync(channel_layer.group_send)(
        SLIDER_GROUP_NAME_LIVE,
        {
            "type": "send_item",  # вызывает метод send_item в consumer
            "item": payload
        }
    )
