import threading
import time
from django.db.backends.signals import connection_created
from django.dispatch import receiver
from redis.exceptions import ConnectionError as RedisConnectionError
from django.db.models.signals import post_save, post_delete
from .utils import load_to_redis
from .models import Case, CaseItem, SteamItemCs


@receiver(post_save, sender=Case)
@receiver(post_save, sender=CaseItem)
@receiver(post_save, sender=SteamItemCs)
def case_saved(sender, instance, created, **kwargs):
    """
    Срабатывает при создании или изменении кейса
    """
    load_to_redis()


def try_load_with_retry():
    """Пробуем пока не подключимся к Redis"""

    while True:
        try:
            load_to_redis()
            break  # успех → выходим
        except RedisConnectionError:
            print("❌ Redis недоступен, пробуем снова через 5 секунд…")
            time.sleep(5)


@receiver(connection_created)
def load_on_postgres_connect(sender, connection, **kwargs):
    """Когда Postgres готов — запускаем проверку Redis"""
    if connection.vendor == "postgresql":
        t = threading.Thread(target=try_load_with_retry, daemon=True)
        t.start()
