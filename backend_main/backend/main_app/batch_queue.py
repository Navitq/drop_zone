from threading import Lock

batch_queue = {}  # ключ: battle_id, значение: dict с изменениями
queue_lock = Lock()
BATCH_INTERVAL = 5


def queue_battle_update(battle_id: str, changed_fields: dict):
    """
    Добавляем изменения конкретной битвы в очередь.
    changed_fields = {
        "players": [...],
        "cases": [...],
        "winner": [...],
        "is_active": True/False,
        ...
    }
    """
    with queue_lock:
        if battle_id not in batch_queue:
            batch_queue[battle_id] = {}
        batch_queue[battle_id].update(changed_fields)
