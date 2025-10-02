from django.db.models import F, Sum
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from urllib.parse import parse_qs
from asgiref.sync import sync_to_async
from .models import User, Battle, BattleCase
from .redis_models import ActiveBattleRedis, PlayerInfo
from django.db import transaction, IntegrityError, DatabaseError
from django.db.models import F, Sum
import redis.asyncio as redis
from dotenv import load_dotenv
from redis_om import get_redis_connection
import os

load_dotenv()

REDIS_DOCKER_IP = os.getenv("REDIS_DOCKER_IP")
REDIS_DOCKER_PORT = os.getenv("REDIS_DOCKER_PORT")
print(REDIS_DOCKER_PORT, REDIS_DOCKER_IP)


redis_opened = redis.Redis(
    host=REDIS_DOCKER_IP,
    port=int(REDIS_DOCKER_PORT),
    decode_responses=True
)


async def get_battle_from_game_id(game_id):
    """
    Получает активную битву по game_id из Redis.
    Возвращает объект битвы или None, если не найдено или не активно.
    """

    def fetch_battle():
        return ActiveBattleRedis.find(
            (ActiveBattleRedis.id == game_id) & (
                ActiveBattleRedis.is_active == True)
        ).first()

    battle = await sync_to_async(fetch_battle)()

    if battle and battle.check_activity():
        return battle

    return None


def get_battle_from_game_id_db(game_id):
    """
    Получает активную битву по game_id из Redis.
    Возвращает объект битвы или None, если не найдено или не активно.
    """
    try:
        print(555555555555555555, game_id)
        battle = Battle.objects.select_for_update().filter(
            id=game_id,
            is_active=True
        ).first()
        print(battle, battle.players.count() <
              battle.players_amount, "ddddddd")
        if (
            battle
            and battle.check_activity()
            and battle.players.count() < battle.players_amount  # ✅ проверяем лимит
        ):
            return battle
        else:
            return None
    except Exception:
        return None


def get_user_db(token_data):
    """
    Получает пользователя по данным токена.
    token_data должен содержать поле 'id' с идентификатором пользователя.
    """
    user_id = token_data.get("id")
    if not user_id:
        return None

    # Используем sync_to_async для безопасного вызова ORM в async контексте
    try:
        user = User.objects.select_for_update().filter(id=user_id).first()
        return user
    except User.DoesNotExist:
        return None


def pay_and_add_to_battle(token_data, game_id):
    try:
        with transaction.atomic():
            battle = get_battle_from_game_id_db(game_id)
            user = get_user_db(token_data)
            print(battle, 7777777777)
            if user is None or battle is None:
                return None

            if battle.players.filter(id=user.id).exists():
                return None

            # 1. Проверяем, есть ли свободные слоты
            if battle.players.count() >= battle.players_amount:
                return None

            # 2. Считаем суммарную цену кейсов в битве
            total_price = (
                BattleCase.objects
                .filter(battle=battle)
                .aggregate(
                    total=Sum(F("case__price") * F("case_amount"))
                )["total"] or 0
            )

            # 3. Проверяем баланс
            if user.money_amount < total_price:
                return None

            # 4. Списываем деньги
            user.money_amount -= total_price
            user.save()

            # 5. Добавляем игрока в битву
            battle.players.add(user)
            battle.save()
            players = [
                PlayerInfo(
                    id=str(p.id),
                    username=p.username,
                    imgpath=p.avatar_url,
                    money_amount=float(p.money_amount)
                )
                for p in battle.players.all()
            ]

            return players

    except IntegrityError:
        # ошибка базы, например гонка за слот в битве
        return None
    except DatabaseError:
        # общая ошибка работы с БД
        return None
    except Exception as e:
        # логируем, чтобы не терять причину
        print(f"Unexpected error in pay_and_add_to_battle: {e}")
        return None


def left_match(token_data, game_id):
    try:
        with transaction.atomic():
            battle = get_battle_from_game_id_db(game_id)
            user = get_user_db(token_data)
            print(battle, 7777777777)
            if user is None or battle is None:
                return None

            if not battle.players.filter(id=user.id).exists():
                return None

            total_price = (
                BattleCase.objects
                .filter(battle=battle)
                .aggregate(
                    total=Sum(F("case__price") * F("case_amount"))
                )["total"] or 0
            )

            # 3. Проверяем баланс

            # 4. Списываем деньги
            user.money_amount += total_price
            user.save()

            # 5. Добавляем игрока в битву
            battle.players.remove(user)
            battle.save()
            players = [
                PlayerInfo(
                    id=str(p.id),
                    username=p.username,
                    imgpath=p.avatar_url,
                    money_amount=float(p.money_amount)
                )
                for p in battle.players.all()
            ]

            return players
    except IntegrityError:
        # ошибка базы, например гонка за слот в битве
        return None
    except DatabaseError:
        # общая ошибка работы с БД
        return None
    except Exception as e:
        # логируем, чтобы не терять причину
        print(f"Unexpected error in pay_and_add_to_battle: {e}")
        return None


# waiting | in_process | canceled | finished
class BattleConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Получаем game_id из URL

        self.game_id = self.scope['url_route']['kwargs']['game_id']
        query_string = self.scope['query_string'].decode()  # "guest=true"
        query_params = parse_qs(query_string)
        print(11111111111111)
        # Берем guest, если нет — по умолчанию False
        guest = query_params.get("guest", ["false"])[0]  # "true" или "false"
        is_guest = guest.lower() == "true"
        self.battle = await get_battle_from_game_id(self.game_id)
        if self.battle is None:
            await self.close(code=4003)  # код можно выбрать любой
            return
        self.token_data = self.scope["token_data"]
        self.players_amount_redis = f"battle_{self.game_id}_players"
        self.group_state_redis = f"battle_{self.game_id}_state"
        exists_state = await redis_opened.exists(self.group_state_redis)
        exists_counter = await redis_opened.exists(self.players_amount_redis)
        if not exists_state:
            await redis_opened.set(self.group_state_redis, "waiting")
        if not exists_counter:
            await redis_opened.set(self.players_amount_redis, 0)

        self.group_name = f"battle_{self.game_id}"

        # Добавляемся в группу
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        print(2222222222222222222222, is_guest)
        if is_guest:
            is_payed = await sync_to_async(pay_and_add_to_battle)(
                token_data=self.scope["token_data"],
                game_id=self.game_id
            )
            print(3333333333333333333333333)
            if is_payed:
                await redis_opened.incr(self.players_amount_redis)
                count = int(await redis_opened.get(self.players_amount_redis) or 0)
                if count <= self.battle.players_amount:
                    await self.channel_layer.group_send(
                        self.group_name,  # имя группы
                        {
                            "type": "players_update",  # имя обработчика
                            "players": [p.model_dump() for p in is_payed],
                        }
                    )
                if count == self.battle.players_amount:
                    await redis_opened.set(self.group_state_redis, "in_process")
                    # start_battle_game()

        await self.accept()

    async def receive(self, text_data=None, bytes_data=None):
        # Получаем данные от клиента
        if text_data:
            data = json.loads(text_data)
            event_type = data.get("event", "message")
            payload = data.get("payload", {})

            # Пример обработки события "chat"
            if event_type == "chat":
                message = payload.get("message", "")
                # Отправляем всем участникам группы
                await self.channel_layer.group_send(
                    self.group_name,
                    {
                        "type": "battle.chat",
                        "user": payload.get("user", "Anonymous"),
                        "message": message
                    }
                )

            # Можно добавить обработку других событий
            elif event_type == "move":
                move = payload.get("move")
                await self.channel_layer.group_send(
                    self.group_name,
                    {
                        "type": "battle.move",
                        "move": move,
                        "user": payload.get("user", "Anonymous")
                    }
                )

    async def disconnect(self, close_code):
        # bytes или None
        exists_state = (await redis_opened.get(self.group_state_redis))
        exists_state = exists_state.decode(
            "utf-8") if isinstance(exists_state, bytes) else exists_state

        if exists_state == "canceled" or exists_state == "waiting":
            await sync_to_async(left_match)(game_id=self.game_id, token_data=self.token_data)
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
        print(
            f"Disconnected from battle {self.game_id} with code {close_code}")

    # Обработчик событий группы "battle.chat"
    async def battle_chat(self, event):
        await self.send(text_data=json.dumps({
            "event": "chat",
            "user": event["user"],
            "message": event["message"]
        }))

    async def players_update(self, event):
        # здесь уже напрямую шлём фронту
        await self.send(text_data=json.dumps({
            "event": "players_update",   # вот это уйдёт на фронт
            "players": event["players"]
        }))

    # Обработчик событий группы "battle.move"
    async def battle_move(self, event):
        await self.send(text_data=json.dumps({
            "event": "move",
            "user": event["user"],
            "move": event["move"]
        }))

    # Обработка ошибок (пример)
    async def websocket_error(self, event):
        await self.send(text_data=json.dumps({
            "event": "error",
            "message": event.get("message", "Unknown error")
        }))
