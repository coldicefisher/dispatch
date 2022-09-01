from urllib.parse import parse_qs

from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.db import close_old_connections
from channels.auth import AuthMiddleware, AuthMiddlewareStack, UserLazyObject
from channels.db import database_sync_to_async
from channels.sessions import CookieMiddleware, SessionMiddleware
from rest_framework_simplejwt.tokens import AccessToken

from libs.cass_auth.users import UserModel
from libs.exceptions.auth_exceptions import UserUnauthorizedError


def get_user(scope):
    access_token = scope['cookies'].get('access_token')
    if not access_token:
        return None
    
    try:
        user = UserModel().get(access_token['username'])
    
    except Exception as exception:
        return AnonymousUser()
    
    if not user.is_active:
        return AnonymousUser()
    
    return user


class TokenAuthMiddleware(AuthMiddleware):
    async def resolve_scope(self, scope):
        scope['user']._wrapped = await get_user(scope)


def TokenAuthMiddlewareStack(inner):
    return CookieMiddleware(SessionMiddleware(TokenAuthMiddleware(inner)))
