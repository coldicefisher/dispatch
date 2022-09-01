from django.urls import re_path, path

from . import consumers


websocket_urlpatterns = [
    path('feed/', consumers.feedConsumer.as_asgi()),
    
]