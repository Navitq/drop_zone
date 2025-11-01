from redis_om import Migrator, get_redis_connection
from main_app import redis_models
import time
import redis.exceptions
from dotenv import load_dotenv
import os
import redis
load_dotenv()

REDIS_DOCKER_IP = os.getenv("REDIS_DOCKER_IP")
REDIS_DOCKER_PORT = os.getenv("REDIS_DOCKER_PORT")
REDIS_OM_URL = os.getenv("REDIS_OM_URL")

# Ждём пока Redis станет доступен
redis_conn = None
while redis_conn is None:
    try:
        redis_conn = redis.from_url(REDIS_OM_URL)
        redis_conn.ping()
        print("Redis ready!")
    except (redis.exceptions.ConnectionError, ConnectionRefusedError):
        print("Waiting for Redis...")
        time.sleep(1)

# Создаём мигратор
Migrator().run()
print("Redis indices migrated successfully")
