import os
import django

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
import userSocket.routing
from channels.routing import get_default_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'dispatchSocket1.settings')

# application = ProtocolTypeRouter({
#   "http": get_asgi_application(),
#   "websocket": AuthMiddlewareStack(
#         URLRouter(
#             userSocket.routing.websocket_urlpatterns
#         )
#     ),
# })

django.setup()
application = get_default_application()
