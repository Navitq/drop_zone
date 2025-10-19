from decimal import Decimal
from django.db.models import F, Sum
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from urllib.parse import parse_qs
from asgiref.sync import sync_to_async
from .models import User, Battle, BattleCase, SteamItemCs, InventoryItem
from .redis_models import ActiveBattleRedis, GlobalStateCoeffRedis, PlayerInfo, ItemRedisStandart
from django.db import transaction, IntegrityError, DatabaseError
from django.db.models import F, Sum
import redis.asyncio as redis
from dotenv import load_dotenv
from redis_om import get_redis_connection
import os
import random
from decimal import Decimal, ROUND_DOWN
from redis_om.model.model import NotFoundError
import secrets
from redis.exceptions import RedisError

load_dotenv()

REDIS_DOCKER_IP = os.getenv("REDIS_DOCKER_IP")
REDIS_DOCKER_PORT = os.getenv("REDIS_DOCKER_PORT")
print(REDIS_DOCKER_PORT, REDIS_DOCKER_IP)


EXTERIOR_CHOICES = [
    ("factory_new", "Factory New"),
    ("minimal_wear", "Minimal Wear"),
    ("field_tested", "Field-Tested"),
    ("well_worn", "Well-Worn"),
    ("battle_scarred", "Battle-Scarred"),
]


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
        try:
            return ActiveBattleRedis.find(
                (ActiveBattleRedis.id == game_id) &
                (ActiveBattleRedis.is_active == True)
            ).first()
        except NotFoundError:
            return None

    battle = await sync_to_async(fetch_battle)()

    if battle and battle.check_activity():
        return battle

    return None


def get_battle_from_game_id_db_game(game_id):
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
        if battle:
            return battle
        else:
            return None
    except Exception:
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


def sync_spin_roulette_wheel(case):
    # Получаем все предметы
    items = list(
        ItemRedisStandart.find(ItemRedisStandart.case_id == str(case.id)).all()
    )

    # Сортируем по drop_chance (необязательно, но для прозрачности)
    items.sort(key=lambda x: x.drop_chance)

    # Генерируем рандомное число до 100 и умножаем на шанс пользователя
    roll = random.uniform(0, 100)
    if roll >= 100:
        items[-1]
    cumulative = 0
    for item in items:
        cumulative += item.drop_chance
        if roll <= cumulative:
            del item.drop_chance
            return item  # Этот предмет выпал

    # На всякий случай — если не попали (редко), возвращаем первый
    del items[0].drop_chance
    return items[0]


def find_winner(battle, data):
    players = list(battle.players.all())
    players_count = len(players)
    if players_count == 0:
        return [], None

    player_items = [{"player": player, "items": [], "lose_items": []}
                    for player in players]

    # Раздаём won_data
    for element in data.get("won_data", []):
        case_id = element.get("case_id")
        drops = element.get("items", [])
        for idx, drop in enumerate(drops):
            if idx < players_count:
                player_items[idx]["items"].append({
                    "case_id": case_id,
                    "item": drop
                })

    # Определяем победителя
    max_value = Decimal("0")
    winner_player_id = None
    for pi in player_items:
        total_price = sum(
            item["item"].get("price", Decimal("0"))  # вместо getattr
            for item in pi["items"]
        )
        print('total_price', total_price)
        if total_price > max_value:
            max_value = total_price
            winner_player_id = pi["player"].id

    # Добавляем lose_data
    lose_data = data.get("lose_data", []) or []
    loser_indices = [i for i, pi in enumerate(
        player_items) if pi["player"].id != winner_player_id]

    if loser_indices and lose_data:
        for i, lose_item in enumerate(lose_data):
            idx = loser_indices[i % len(loser_indices)]
            player_items[idx]["lose_items"].append(lose_item)

    return player_items, winner_player_id


def generate_lose_items(battle, players_count):
    """
    Генерирует массив 'проигрышных' предметов на основе SteamItemCs.
    Количество = players_count - 1
    Цена каждого предмета <= 10% от цены самого дешевого кейса
    """
    print("players_count", players_count)
    if players_count <= 1:
        return []

    # Находим самый дешевый кейс в баттле
    battle_cases = BattleCase.objects.filter(
        battle=battle).select_related("case")
    print("battle_cases", battle_cases)
    if not battle_cases.exists():
        return []

    min_price = min([bc.case.price for bc in battle_cases])
    max_lose_price = (Decimal(min_price) * Decimal("0.1")
                      ).quantize(Decimal("0.01"), rounding=ROUND_DOWN)
    print("battle_cases", battle_cases)
    # Получаем все SteamItemCs с ценой <= max_lose_price
    cheap_items_qs = SteamItemCs.objects.filter(price__lte=max_lose_price)
    cheap_items = list(cheap_items_qs.values())
    print("cheap_items", cheap_items)
    if not cheap_items:
        return []

    lose_items = []
    for _ in range(players_count - 1):
        item = random.choice(cheap_items)
        lose_items.append(item)

    return lose_items


def sync_spin_state_wheel():
    """Синхронная версия: определяет состояние предмета на основе коэффициентов из Redis и шанса пользователя"""
    try:
        # 🧠 Получаем коэффициенты из Redis (синхронно)
        coeff = GlobalStateCoeffRedis.find().first()
        print(coeff)
        if not coeff:
            raise ValueError("❌ GlobalStateCoeffRedis не найден!")

        # 🧩 Сортируем коэффициенты от большего к меньшему
        sorted_coeffs = sorted(
            [
                ("battle_scarred", float(coeff.battle_scarred)),
                ("well_worn", float(coeff.well_worn)),
                ("field_tested", float(coeff.field_tested)),
                ("minimal_wear", float(coeff.minimal_wear)),
                ("factory_new", float(coeff.factory_new)),
            ],
            key=lambda x: x[1],
            reverse=True
        )

        # 🎲 Генерируем случайное число от 0 до 100
        rand_num = secrets.randbelow(
            10000) / 100.0
        rand_num = min(rand_num, 100)

        # 💡 Проверяем, в какой интервал попало число
        cumulative = 0
        for name, value in sorted_coeffs:
            cumulative += value
            if rand_num <= cumulative:
                print(name)
                return name

        # Если число больше всех интервалов (на случай некорректных коэффициентов)
        return sorted_coeffs[0][0]

    except RedisError as e:
        print(f"❌ Ошибка Redis при получении коэффициентов: {e}")
        return "well_worn"

    except Exception as e:
        print(f"⚠️ Ошибка в spin_state_wheel_sync: {e}")
        return "well_worn"


def sync_create_order(item_state: str, item, user):
    """
    Создаёт InventoryItem для пользователя и сохраняет в БД.
    """
    try:
        steam_item = SteamItemCs.objects.get(id=item["id"])
        if (
            "price" not in user.best_skin
            or float(user.best_skin.get("gunPrice", 0)) <= float(item.price)
        ):
            user.best_skin = {
                "id": str(item['id']),
                "imgPath": item['icon_url'],
                "gunPrice": float(item['price'] or 0),
                "gunModel": item['item_model'],
                "gunStyle": item['item_style'],
                "state": item_state,
                "type": item['rarity'],
            }
            user.save()
        return InventoryItem.objects.create(
            steam_item=steam_item,
            owner=user,
            exterior_wear=item_state,
        )
    except DatabaseError as e:
        print(f"Ошибка при создании InventoryItem: {e}")


def process_results_to_inventory_for_player(results, player_id):
    """
    Создаёт InventoryItem для всех предметов из results одному игроку по его id.
    """
    try:
        user = User.objects.get(id=player_id)
        user.total_battles += 1
        user.save()
    except User.DoesNotExist:
        print(f"Пользователь с id={player_id} не найден")
        return

    for element in results:
        drops = element.get("items", [])
        for drop in drops:
            item_state = sync_spin_state_wheel()  # можно рандомизировать
            sync_create_order(item_state, drop, user)
            drop['state'] = item_state


def add_lose_items_to_inventory(player_items):
    """
    Добавляет все lose_items из player_items в Inventory игрока.
    """
    for pi in player_items:
        user = pi.get("player")
        user.total_battles += 1
        user.save()
        lose_items = pi.get("lose_items", [])
        for lose_item in lose_items:
            # item_state можно задать по умолчанию
            item_state = sync_spin_state_wheel()
            sync_create_order(item_state, lose_item, user)
            lose_item['state'] = item_state


def start_battle_game(game_id):
    try:
        with transaction.atomic():
            print("block start")
            battle = get_battle_from_game_id_db_game(game_id)
            print("get_battle_from_game_id_db_game", battle)
            if battle is None:
                return None
            battle.game_state = "in_process"
            battle.save()
            results = []  # сюда сохраняем все кейсы и их дропы
            print('results = []')
            # Получаем все кейсы в этом баттле
            battle_cases = BattleCase.objects.filter(
                battle=battle).select_related("case")
            print('battle_cases', battle_cases)
            # Кол-во игроков
            players_count = battle.players.count()
            print('players_count', players_count)
            for battle_case in battle_cases:
                # если case_amount > 1 — обрабатываем как отдельные кейсы
                for _ in range(battle_case.case_amount):
                    drops = []

                    # крутим столько раз, сколько игроков
                    for _ in range(players_count):
                        dropped_item = sync_spin_roulette_wheel(
                            battle_case.case)
                        dropped_item_dict = dropped_item.model_dump()
                        drops.append(dropped_item_dict)

                    results.append({
                        "case_id": str(battle_case.case.id),
                        "items": drops
                    })

            # Генерируем проигрышные предметы
            lose_data = generate_lose_items(battle, players_count)
            print('generate_lose_items', players_count)
            player_items, winner_player_id = find_winner(
                battle, data={"won_data": results, "lose_data": lose_data})
            print('winner_player_id', winner_player_id, 6666777766666)
            process_results_to_inventory_for_player(
                results=results, player_id=winner_player_id)
            print('player_items', player_items)
            add_lose_items_to_inventory(player_items)
            for item in player_items:
                user = item['player']  # объект User
                item['player'] = {
                    "id": str(user.id),
                    "username": user.username,
                    "avatar_url": user.avatar_url
                }

            battle.game_state = "finished"
            battle.is_active = False
            battle.save()
            return {
                "players_items": player_items,
                "winner_id": winner_player_id,
                "won_data": results
            }

    except Exception as e:
        battle.game_state = "failed"
        battle.save()
        import logging
        logging.exception("Ошибка при старте баттла")
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
            count = battle.players.count()
            if count == 0:
                if battle.game_state == "waiting":
                    battle.is_active = False
                    battle.game_state = "canceled"
            battle.save()
            players = [
                PlayerInfo(
                    id=str(p.id),
                    username=p.username,
                    imgpath=p.avatar_url,
                )
                for p in battle.players.all()
            ]
            print(players)

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
        self.is_player_payed = False
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        query_string = self.scope['query_string'].decode()  # "guest=true"
        query_params = parse_qs(query_string)
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
        if is_guest:
            is_payed = await sync_to_async(pay_and_add_to_battle)(
                token_data=self.scope["token_data"],
                game_id=self.game_id
            )
            if is_payed:
                await redis_opened.incr(self.players_amount_redis)
                count = int(await redis_opened.get(self.players_amount_redis) or 0)
                self.is_player_payed = True
                print(count, 7878787878787878)
                await self.channel_layer.group_send(
                    self.group_name,  # имя группы
                    {
                        "type": "players_update",  # имя обработчика
                        "players": [p.model_dump() for p in is_payed],
                    }
                )
                if count == self.battle.players_amount:
                    await redis_opened.set(self.group_state_redis, "in_process")
                    data = await sync_to_async(start_battle_game)(game_id=self.game_id)
                    await self.channel_layer.group_send(
                        self.group_name,  # имя группы
                        {
                            "type": "game_finished",  # имя обработчика
                            "game_data": json.dumps(data, default=str),
                        }
                    )
                    # await self.channel_layer.group_send(
                    #     self.group_name,  # имя группы
                    #     {
                    #         "type": "force_disconnect",  # имя обработчика
                    #     }
                    # )
        await self.accept()

    async def disconnect(self, close_code):
        # bytes или None
        if not hasattr(self, "group_state_redis"):
            return  # защита от ошибки при неполном connect
        exists_state = (await redis_opened.get(self.group_state_redis))
        exists_state = exists_state.decode(
            "utf-8") if isinstance(exists_state, bytes) else exists_state
        print(exists_state, 6666666666666)
        if exists_state == "canceled" or exists_state == "waiting" and self.is_player_payed:
            self.is_player_payed = False
            await redis_opened.decr(self.players_amount_redis)
            players = await sync_to_async(left_match)(game_id=self.game_id, token_data=self.token_data)
            await self.channel_layer.group_send(
                self.group_name,  # имя группы
                {
                    "type": "players_update",  # имя обработчика
                    "players": [p.model_dump() for p in players],
                }
            )
            if len(players) == 0:
                await self.channel_layer.group_send(
                    self.group_name,  # имя группы
                    {
                        "type": "redirect_in_the_end",  # имя обработчика
                    }
                )
                await self.channel_layer.group_send(
                    self.group_name,  # имя группы
                    {
                        "type": "force_disconnect",  # имя обработчика
                    }
                )
                return

        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
        print(
            f"Disconnected from battle {self.game_id} with code {close_code}")

    async def players_update(self, event):
        await self.send(text_data=json.dumps({
            "event": "players_update",   # вот это уйдёт на фронт
            "players": event["players"]
        }))

    async def game_finished(self, event):
        await self.send(text_data=json.dumps({
            "event": "game_finished",   # вот это уйдёт на фронт
            "game_data": event["game_data"]
        }))

    async def force_disconnect(self, event):
        await self.close(code=1000)

    async def redirect_in_the_end(self, event):
        await self.send(text_data=json.dumps({
            "event": "redirect_in_the_end",   # вот это уйдёт на фронт
        }))

    async def websocket_error(self, event):
        await self.send(text_data=json.dumps({
            "event": "error",
            "message": event.get("message", "Unknown error")
        }))
