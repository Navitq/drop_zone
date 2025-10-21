from redis_om import HashModel
# импорт твоего Redis клиента
from datetime import datetime, timedelta, timezone
from redis_om import HashModel,  JsonModel,  Field, get_redis_connection, Migrator
# Подключение к Redis
from django.utils import timezone
import os
from pydantic import BaseModel
from dotenv import load_dotenv
from datetime import datetime, timezone as timezone_datatime
from typing import Optional
import json
from decimal import Decimal
from django.apps import apps

load_dotenv()

REDIS_DOCKER_IP = os.getenv("REDIS_DOCKER_IP")
REDIS_DOCKER_PORT = os.getenv("REDIS_DOCKER_PORT")


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
    price: Decimal
    icon_url: str
    rarity: str
    case_id: str = Field(index=True)
    drop_chance: float

    class Meta:
        global_key_prefix = "items"
        model_key_prefix = "itemStandart"
        database = redis


class AdvertisementRedis(JsonModel):
    title_1: dict
    subTitle_1: dict
    imgUrl_1: str
    data_and_time: datetime

    # Второй объект без timer
    title_2: dict
    subTitle_2: dict
    imgUrl_2: str

    class Meta:
        global_key_prefix = "Advertisement"
        model_key_prefix = "AdvertisementMain"
        database = redis


class BackgroundMainPageRedis(JsonModel):
    pc_background_url: str
    mobile_background_url: str
    pc_background_grass_url: str
    mobile_background_grass_url: str

    class Meta:
        global_key_prefix = "BackgroundMainPage"
        model_key_prefix = "BackgroundMainPage"
        database = redis


class RafflesRedis(JsonModel):
    id: str = Field(primary_key=True)
    prize_item: dict  # id SteamItemCs
    players_ids: list[str] = []          # id пользователей
    participate_price: float
    fake_users_amount: int = 0
    max_users_amount: int
    end_date: datetime


class GlobalCoefficientRedis(JsonModel):
    raffles_global: float
    cases_global: float
    upgrades_global: float
    contracts_global: float
    battles_global: float


class PlayerInfo(BaseModel):
    id: str
    username: str
    imgpath: str | None = None


class CaseInfo(BaseModel):
    id: str
    # теперь поле может содержать словарь, например {"ru": "Весенняя", "en": "Spring"}
    name: dict
    imgpath: Optional[str] = None
    price: float
    case_amount: int


class GlobalStateCoeffRedis(JsonModel):
    factory_new: float
    minimal_wear: float
    field_tested: float
    well_worn: float
    battle_scarred: float


class ActiveBattleRedis(JsonModel):
    id: str = Field(index=True)  # UUID баттла
    creator_id: str = Field(index=True)  # ID создателя
    players: str = Field(default="[]")  # JSON-строка со списком PlayerInfo
    cases: str = Field(default="[]")    # JSON-строка со списком CaseInfo
    players_amount: int = Field(index=True)
    is_active: bool = Field(default=True)
    created_at: datetime = Field(index=True)
    ended_at: datetime | None = Field(default=None, index=True)
    winner: str = Field(default="[]")  # JSON-строка со списком PlayerInfo
    players_ids: list[str] = Field(default=[], index=True)
    winner_id: str | None = Field(default=None, index=True)

    def check_activity(self) -> bool:
        if not self.is_active:
            return False
        if self.ended_at and self.ended_at <= timezone.now():
            self.is_active = False
            return False
        return True

    def set_players(self, players: list[PlayerInfo]):
        self.players = json.dumps([p.model_dump() for p in players])

    def set_cases(self, cases: list[CaseInfo]):
        self.cases = json.dumps([c.model_dump() for c in cases])

    def set_winner(self, winners: list[PlayerInfo]):
        self.winner = json.dumps([w.model_dump() for w in winners])

    def save(self, *args, **kwargs):
        """
        Переопределяем save(), чтобы при каждом сохранении
        доп. поля winner_id и players_ids актуализировались.
        """
        try:
            self.is_active = self.check_activity()
            self.players_ids = [p["id"]
                                for p in json.loads(self.players or "[]")]
        except Exception:
            self.players_ids = []

        try:
            winners = json.loads(self.winner or "[]")
            self.winner_id = winners[0]["id"] if winners else None
        except Exception:
            self.winner_id = None

        return super().save(*args, **kwargs)

    class Meta:
        global_key_prefix = "items"
        model_key_prefix = "battle"
        database = redis


class BlockedTokenRedis(HashModel):
    jti: str = Field(index=True)  # уникальный идентификатор токена
    token_type: str  # access или refresh
    user_id: str
    exp: int  # timestamp истечения токена

    class Meta:
        database = redis

    @classmethod
    def block_token(cls, jti: str, token_type: str, user_id: str, exp: int):
        """Блокируем токен и ставим TTL"""

        ttl = max(exp - int(datetime.now(timezone_datatime.utc).timestamp()), 0)
        token = cls(
            jti=jti,
            token_type=token_type,
            user_id=user_id,
            exp=exp
        )
        token.save()
        redis.expire(token.key(), ttl)


class BlockedTokeVersionRedis(HashModel):
    token_version: int  # access или refresh
    user_id: str = Field(index=True)
    exp: int  # timestamp истечения токена

    class Meta:
        database = redis

    @classmethod
    def block_token(cls, token_version: int, user_id: str, exp: int):
        """
        Блокирует токен (version), удаляет все предыдущие токены пользователя
        и ставит TTL на новый.
        """
        now_ts = int(datetime.now(timezone_datatime.utc).timestamp())
        ttl = max(exp - now_ts, 0)

        # 🧹 Удаляем все старые токены, связанные с этим user_id
        old_tokens = []

        try:
            old_tokens = BlockedTokeVersionRedis.find(
                BlockedTokeVersionRedis.user_id == user_id).all()
        except Exception:
            pass
        for token in old_tokens:
            try:
                redis.delete(token.key())
            except Exception:
                pass

        new_token = cls(
            token_version=int(token_version),
            user_id=user_id,
            exp=exp
        )
        new_token.save()

        # 🕒 Ставим TTL, чтобы Redis сам удалил запись после истечения срока
        redis.expire(new_token.key(), ttl)

        return new_token


class BlockedUserRedis(HashModel):
    user_id: str = Field(index=True)

    class Meta:
        database = redis


class TotalActionAmountRedis(HashModel):
    total_upgrades: int = Field(default=0)
    total_opened_cases: int = Field(default=0)
    total_contracts: int = Field(default=0)
    total_battles: int = Field(default=0)  # будем хранить в Redis

    class Meta:
        database = redis


LAST_ITEMS_LIST_KEY = "last_items_live_list"
MAX_ITEMS = 20


def add_last_item(payload: dict):
    item_json = json.dumps(payload)
    redis.lpush(LAST_ITEMS_LIST_KEY, item_json)
    redis.ltrim(LAST_ITEMS_LIST_KEY, 0, MAX_ITEMS - 1)


def push_last_20_items_to_redis():
    """
    Берёт последние 20 InventoryItem и добавляет их в Redis список
    """
    InventoryItem = apps.get_model("main_app", "InventoryItem")
    Case = apps.get_model("main_app", "Case")
    last_items = InventoryItem.objects.select_related(
        "steam_item", "owner").order_by("-created_at")[:MAX_ITEMS]

    # Чтобы добавились в правильном порядке (от старого к новому), переворачиваем
    for instance in reversed(last_items):
        # Данные кейса
        case_id = getattr(instance, 'case_id', None)
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

        add_last_item(payload)


Migrator().run()
