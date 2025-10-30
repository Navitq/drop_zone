FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=Europe/Moscow

RUN apt-get update -y && apt-get install -y tzdata


RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    python3-venv \
    build-essential \
    && apt-get clean

# Устанавливаем рабочую директорию в контейнере
WORKDIR /app

# 1. Копируем код в контейнер
COPY /backend /app

# 2. Устанавливаем виртуальное окружение
RUN python3 -m venv venv

# 3. Устанавливаем зависимости в виртуальное окружение
RUN venv/bin/pip install --upgrade pip && \
    venv/bin/pip install -r requirements.txt

# 4. Собираем статические файлы с использованием виртуального окружения
RUN venv/bin/python3 manage.py collectstatic --noinput || echo "collectstatic failed"

# 5. Открываем порт для сервера Django
EXPOSE 8000

# Запускаем сервер Django с gunicorn
CMD ["venv/bin/gunicorn", "--access-logfile", "-", "--workers", "3", "--bind", "backend:8000", "war_back.wsgi:application"]
