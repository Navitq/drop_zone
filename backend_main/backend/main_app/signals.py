import threading
import time
from django.db.backends.signals import connection_created
from django.dispatch import receiver
from redis.exceptions import ConnectionError as RedisConnectionError
from django.db.models.signals import post_save, post_delete
from .utils import load_to_redis, load_advertisement
from .models import Case, CaseItem, SteamItemCs, Advertisement
import os


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
