# Используем официальный образ Nginx
FROM nginx:latest

# Устанавливаем curl и Node.js из NodeSource
RUN apt update -y && \
    apt install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt install -y nodejs && \
    apt clean

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json отдельно
COPY frontend/package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь фронтенд-код
COPY frontend/ ./


# Собираем фронтенд

RUN mkdir staticfiles
RUN rm /etc/nginx/conf.d/default.conf
COPY /add_files/docker/nginx/nginx.conf /etc/nginx/conf.d

RUN npm run build
# # Копируем собранные файлы в папку Nginx
# RUN cp -r /app/dist/* /usr/share/nginx/html/

# # Удаляем стандартную конфигурацию Nginx
RUN apt install nano -y
RUN apt install certbot python3-certbot-nginx -y

# # Копируем свою конфигурацию Nginx
# Копируем SSL-сертификаты и ключи в контейнер
COPY /add_files/warhammer40000.ru/fullchain.pem /app/fullchain.pem
COPY /add_files/warhammer40000.ru/privkey.pem /app/privkey.pem
COPY /add_files/warhammer40000.ru/chain.pem /app/chain.pem

# Открываем порт 80
EXPOSE 80
EXPOSE 443
# Запускаем Nginx
CMD ["nginx", "-g", "daemon off;"]
