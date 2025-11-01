#!/bin/sh

echo "Waiting for Redis..."

# Проверка доступности Redis на уровне сокета
python << END
import socket, time, sys

host = "redis"
port = 6379

while True:
    try:
        with socket.create_connection((host, port), timeout=2):
            print("✅ Redis is up — continuing...")
            break
    except OSError:
        print("Waiting for Redis...")
        time.sleep(1)
END

echo "Running Redis migration..."
python redis_migrate.py

echo "Starting Django server..."
python manage.py runserver 0.0.0.0:8000
