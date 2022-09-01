
# from django.core.asgi import get_asgi_application
# from django.urls import path

# from channels.routing import ProtocolTypeRouter, URLRouter

# from taxi.middleware import TokenAuthMiddlewareStack # new
# from trips.consumers import TaxiConsumer


# application = ProtocolTypeRouter({
#     'http': get_asgi_application(),
#     # changed
#     'websocket': TokenAuthMiddlewareStack(
#         URLRouter([
#             path('taxi/', TaxiConsumer.as_asgi()),
#         ])
#     ),
# })


#///////

from django.core.asgi import get_asgi_application
from django.urls import path

from channels.routing import ProtocolTypeRouter, URLRouter
import userSocket
from channels.auth import AuthMiddlewareStack

# from taxi.middleware import TokenAuthMiddlewareStack # new
# from trips.consumers import TaxiConsumer


application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  "websocket": AuthMiddlewareStack(
        URLRouter(
            userSocket.routing.websocket_urlpatterns,
            
        )
    ),
})