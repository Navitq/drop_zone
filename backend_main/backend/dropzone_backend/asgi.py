"""
ASGI config for dropzone_backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from django.urls import path
from channels.routing import ProtocolTypeRouter, URLRouter
# Импорт твоего кастомного ASGI JWT middleware
from channels.security.websocket import AllowedHostsOriginValidator
import django
# Импорт WebSocket consumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dropzone_backend.settings')
django.setup()


from main_app.urls_ws import websocket_urlpatterns  # noqa: E402
from main_app.web_socket_middleware import JWTAuthMiddlewareCustom  # noqa: E402
# импортируем список маршрутов

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AllowedHostsOriginValidator(JWTAuthMiddlewareCustom(
        URLRouter(websocket_urlpatterns)
    )),
})
