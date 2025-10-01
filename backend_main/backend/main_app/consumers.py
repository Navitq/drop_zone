from channels.generic.websocket import AsyncWebsocketConsumer
import json
from urllib.parse import parse_qs
from asgiref.sync import sync_to_async
from .models import User, Battle
from .redis_models import ActiveBattleRedis


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


async def get_user_from_token(token_data):
    """
    Получает пользователя по данным токена.
    token_data должен содержать поле 'id' с идентификатором пользователя.
    """
    user_id = token_data.get("id")
    if not user_id:
        return None

    # Используем sync_to_async для безопасного вызова ORM в async контексте
    try:
        user = await sync_to_async(lambda: User.objects.filter(id=user_id).first())()
        return user
    except User.DoesNotExist:
        return None


class BattleConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Получаем game_id из URL
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        query_string = self.scope['query_string'].decode()  # "guest=true"
        query_params = parse_qs(query_string)

        # Берем guest, если нет — по умолчанию False
        guest = query_params.get("guest", ["false"])[0]  # "true" или "false"
        is_guest = guest.lower() == "true"
        self.battle = get_battle_from_game_id(self.game_id)
        if self.battle is None:
            await self.close(code=4003)  # код можно выбрать любой
            return

        if not is_guest:
            self.group_name_players = f"battle_{self.game_id}_players"
            await self.channel_layer.group_add(
                self.group_name_players,
                self.channel_name
            )

        # Название группы для этой конкретной битвы
        self.group_name = f"battle_{self.game_id}"

        # Добавляемся в группу
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        # Принимаем соединение
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
        # Удаляемся из группы
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
