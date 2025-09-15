from django.apps import AppConfig
import threading
import time
from django.db import connections
from django.db.utils import OperationalError
import redis
import os
from dotenv import load_dotenv

load_dotenv()

REDIS_DOCKER_IP = os.getenv("REDIS_DOCKER_IP")
REDIS_DOCKER_PORT = os.getenv("REDIS_DOCKER_PORT")
print(REDIS_DOCKER_PORT, REDIS_DOCKER_IP)


def try_load_with_retry():
    """Пробуем дождаться Postgres и Redis и синхронизируем"""
    if not os.environ.get("RUN_MAIN") == "true":
        return
    while True:
        try:
            # Проверяем Postgres
            conn = connections['default']
            conn.cursor()  # если не готово — упадёт
            print("✅ Postgres готов")

            # Проверяем Redis
            r = redis.Redis(host=REDIS_DOCKER_IP,
                            port=int(REDIS_DOCKER_PORT), db=0)
            r.ping()
            print("✅ Redis готов")
            from .utils import load_to_redis, load_raffles, load_advertisement, load_background_main

            load_to_redis()
            load_advertisement()
            load_background_main()
            load_raffles()
            break  # всё ок, выходим из цикла
        except OperationalError:
            print("⏳ Ждём Postgres...")
        except redis.ConnectionError:
            print("⏳ Ждём Redis...")

        time.sleep(2)


class MainAppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main_app'

    def ready(self):
        """Запускается один раз при старте Django"""
        from . import signals
        t = threading.Thread(target=try_load_with_retry, daemon=True)
        t.start()
