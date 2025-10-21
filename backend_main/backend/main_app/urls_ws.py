from django.urls import re_path
from . import consumers
from . import slider_drop_consume
websocket_urlpatterns = [
    re_path(r'ws/battle/(?P<game_id>[^/]+)/$',
            consumers.BattleConsumer.as_asgi()),
    re_path(r'ws/drop-slider/',
            slider_drop_consume.SliderDropConsumer.as_asgi()),
]
