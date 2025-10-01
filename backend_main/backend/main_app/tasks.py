import asyncio
from main_app.batch_queue import batch_queue, queue_lock, BATCH_INTERVAL
# обновление Redis конкретной битвы
from main_app.utils import update_battle_in_redis


async def flush_battles_batch():
    while True:
        await asyncio.sleep(BATCH_INTERVAL)

        with queue_lock:
            if not batch_queue:
                continue
            batch_copy = batch_queue.copy()
            batch_queue.clear()

        # обновляем Redis только для изменённых битв
        for battle_id, fields in batch_copy.items():
            await update_battle_in_redis(battle_id, fields)
