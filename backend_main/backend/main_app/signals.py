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


@receiver(post_save, sender=Battle)
@receiver(post_save, sender=BattleCase)
@receiver(post_save, sender=BattleDrop)
@receiver(post_save, sender=BattleDropItem)
def active_battles_saved(sender, instance, created, **kwargs):
    # Если объект создан — всегда обрабатываем
    if os.environ.get("RUN_MAIN") != "true":
        return
    try:
        load_battles_active_main()
    except RedisConnectionError:
        pass


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
