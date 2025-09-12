from redis_om import HashModel, JsonModel,  Field, get_redis_connection, Migrator
# Подключение к Redis
import os
from dotenv import load_dotenv

load_dotenv()

REDIS_DOCKER_IP = os.getenv("REDIS_DOCKER_IP")
REDIS_DOCKER_PORT = os.getenv("REDIS_DOCKER_PORT")
print(REDIS_DOCKER_PORT, REDIS_DOCKER_IP)

redis = get_redis_connection(
    host=REDIS_DOCKER_IP,
    port=int(REDIS_DOCKER_PORT)
)

# Модель для OAuth state


class OAuthState(HashModel):
    state: str = Field(index=True)  # ✅ индексируем поле

    class Meta:
        database = redis
        global_ttl = 300


class OAuthCodeVerifier(HashModel):
    code_verifier: str = Field(index=True)  # ✅ индексируем поле
    code_challenge: str = Field(index=True)

    class Meta:
        database = redis
        global_ttl = 300


class CaseRedisStandart(JsonModel):
    id: str = Field(index=True)
    name: dict
    icon_url: str
    type: str
    price: float

    class Meta:
        global_key_prefix = "items"
        model_key_prefix = "caseStandart"
        database = redis

    def get_name(self, lang="ru"):
        return self.name.get(lang, next(iter(self.name.values())))


class ItemRedisStandart(JsonModel):
    id: str = Field(index=True)
    item_model: str
    item_style: str
    price: int
    icon_url: str
    rarity: str
    case_id: str = Field(index=True)
    drop_chance: float

    class Meta:
        global_key_prefix = "items"
        model_key_prefix = "itemStandart"
        database = redis


Migrator().run()
