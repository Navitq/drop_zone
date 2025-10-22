from channels.generic.websocket import AsyncWebsocketConsumer
import redis.asyncio as redis
from dotenv import load_dotenv
import os
import json

load_dotenv()

REDIS_DOCKER_IP = os.getenv("REDIS_DOCKER_IP")
REDIS_DOCKER_PORT = os.getenv("REDIS_DOCKER_PORT")

LAST_ITEMS_LIST_KEY = "last_items_live_list"
LAST_ITEMS_LIST_KEY_CROWN = "last_items_crown_list"
redis_opened = redis.Redis(
    host=REDIS_DOCKER_IP,
    port=int(REDIS_DOCKER_PORT),
    decode_responses=True
)

SLIDER_GROUP_NAME_LIVE = "drop_slider_group_live"
SLIDER_GROUP_NAME_TOP = "drop_slider_group_top"


async def get_last_items(key=LAST_ITEMS_LIST_KEY):
    """
        Получаем все последние 20 айтемов из Redis
        """
    items_json = await redis_opened.lrange(key, 0, 19)
    items = [json.loads(item) for item in items_json]
    return items


class SliderDropConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.is_auth = self.scope['auth']
        print(self.scope['auth'], 474747)
        self.slider_type = "live"
        self.added = False
        self.slider_counter_name = "drop_zone_drop_slider_counter"
        exists_counter = await redis_opened.exists(self.slider_counter_name)
        if not exists_counter:
            await redis_opened.set(self.slider_counter_name, 0)
        if self.is_auth and not self.added:
            self.added = True
            await redis_opened.incr(self.slider_counter_name)
        await self.accept()
        await self.channel_layer.group_add(SLIDER_GROUP_NAME_LIVE, self.channel_name)
        await self.send(text_data=json.dumps({
            "event": "start_data",
            "data": {
                "items": await get_last_items(),
                "clientsAmount": await redis_opened.get(self.slider_counter_name),
            }
        }))

    async def receive(self, text_data=None, bytes_data=None):
        if text_data:
            # Разбираем JSON
            message = json.loads(text_data)
            event_type = message.get("event")
            data = message.get("data")

            # Словарь обработчиков
            event_handlers = {
                "change_slider_type": self.handle_change_slider_type,
                # добавь другие события сюда
            }

            handler = event_handlers.get(event_type)
            if handler:
                await handler(data)  # вызываем асинхронно
            else:
                print(f"No handler for event: {event_type}")

    async def send(self, text_data=None, bytes_data=None):
        await super().send(text_data=text_data, bytes_data=bytes_data)

    async def disconnect(self, close_code):
        if self.is_auth and self.added:
            await redis_opened.decr(self.slider_counter_name)
        # ##### удаляем из группы
        await self.channel_layer.group_discard(SLIDER_GROUP_NAME_LIVE, self.channel_name)

    async def send_item(self, event):
        clients_amount = await redis_opened.get(self.slider_counter_name)
        await self.send(text_data=json.dumps({
            "event": "update_slider_data",   # вот это уйдёт на фронт
            "data": {"item": event["item"], "clientsAmount": clients_amount}
        }))

    async def start_data(self, event):
        await self.send(text_data=json.dumps({
            "event": "start_data",   # вот это уйдёт на фронт
            "data": event["data"]
        }))

    async def handle_change_slider_type(self, slider_type: str):
        if self.slider_type == slider_type:
            return
        self.slider_type = slider_type
        key = ''
        if slider_type == "top":
            await self.channel_layer.group_discard(SLIDER_GROUP_NAME_LIVE, self.channel_name)
            await self.channel_layer.group_add(SLIDER_GROUP_NAME_TOP, self.channel_name)
            key = LAST_ITEMS_LIST_KEY_CROWN
        else:
            await self.channel_layer.group_discard(SLIDER_GROUP_NAME_TOP, self.channel_name)
            await self.channel_layer.group_add(SLIDER_GROUP_NAME_LIVE, self.channel_name)
            key = LAST_ITEMS_LIST_KEY
        items = await get_last_items(key)
        clients_amount = await redis_opened.get(self.slider_counter_name)

        # Отправляем только текущему пользователю
        await self.send(text_data=json.dumps({
            "event": "start_data",  # фронт получит это событие
            "data": {
                "items": items,
                "clientsAmount": clients_amount,
            }
        }))
