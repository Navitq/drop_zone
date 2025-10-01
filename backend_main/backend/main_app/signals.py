import threading
import time
from django.db.backends.signals import connection_created
from django.dispatch import receiver
from redis.exceptions import ConnectionError as RedisConnectionError
from django.db.models.signals import post_save, post_delete
from .utils import load_to_redis, load_advertisement, load_battles_active_main, load_raffles, load_background_main, load_global_coefficient_main
from .models import Case, Battle, BattleCase, BattleDrop, BattleDropItem, CaseItem, SteamItemCs, Advertisement, BackgroundMainPage, Raffles, GlobalCoefficient
import os
from django.db.models.signals import m2m_changed
from main_app.batch_queue import queue_battle_update


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
def battle_saved(sender, instance, **kwargs):
    # пример: обновляем статус и активность битвы
    queue_battle_update(str(instance.id), {
        "is_active": instance.is_active
    })


@receiver(post_save, sender=BattleCase)
def battle_case_saved(sender, instance, **kwargs):
    # обновляем конкретную битву — новые кейсы
    battle_id = str(instance.battle.id)
    cases = [
        {
            "id": str(bc.case.id),
            "name": bc.case.name,
            "imgpath": getattr(bc.case, "icon_url", None),
            "price": bc.case.price,
            "case_amount": bc.case_amount
        } for bc in instance.battle.battle_battles.all()
    ]
    queue_battle_update(battle_id, {"cases": cases})


@receiver(post_save, sender=BattleDrop)
def battle_drop_saved(sender, instance, **kwargs):
    # пример: можно добавлять в очередь изменения связанных игроков
    battle_id = str(instance.battle.id)
    players = [
        {
            "id": str(player.id),
            "username": player.username,
            "imgpath": getattr(player, "avatar_url", None),
            "money_amount": float(player.money_amount)
        } for player in instance.battle.players.all()
    ]
    queue_battle_update(battle_id, {"players": players})


@receiver(post_save, sender=BattleDropItem)
def battle_drop_item_saved(sender, instance, **kwargs):
    # можно обновлять winner или статистику
    battle_id = str(instance.battle.id)
    winner = []
    if instance.battle.winner:
        winner.append({
            "id": str(instance.battle.winner.id),
            "username": instance.battle.winner.username,
            "imgpath": getattr(instance.battle.winner, "avatar", None),
            "money_amount": 0
        })
    queue_battle_update(battle_id, {"winner": winner})


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
