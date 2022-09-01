# from django.contrib.auth.models import AnonymousUser

from base64 import decode
import inspect
from libs.cass_auth.profiles.base_profile import BaseUserProfile
from libs.cass_auth.security import decode_token
from libs.exceptions.auth_exceptions import UserUnauthorizedError

from libs.cass_auth.users import UserModel
from libs.cass_auth.profiles.profile_model import ProfileModel

from asgiref.sync import async_to_sync, sync_to_async

import asyncio

class User:
    
    def __init__(self, scope):
        
        access_token = scope['cookies'].get('access_token')
        if access_token is None: raise UserUnauthorizedError()
        else: 
            token = decode_token(access_token)
            if not token['login_status'] == 'authenticated': raise UserUnauthorizedError()
            self.__profile_user = ProfileModel().get(username=token['username'])
            self.__auth_user = UserModel().get(token['username'])
        
        
    
    @property
    def profile_user(self):
        return self.__profile_user
    
    @property
    def auth_user(self):
        return self.__auth_user
    # @property
    # def is_authenticated(self):
    #     if self is None: return False
    #     else: return True


def unauthorized_json():
    return {"key": "system", "command": "unauthorized", "payload": {}}


def spruce_up_permissions(permissions: set) -> set:
    
    if not isinstance(permissions, set): return set()
    admin = set()
    admin.add('Administrator')
    admin.add('Owner')
    permissions.update(admin)
    if 'Driver' in permissions: permissions.add('Employee')
    return permissions


def authorized(func):
    def inner(*args, **kwargs):
        permissions = set()
        business = None
        
        if len(args) == 3:
            try:
                my_user = User(scope=args[0]).profile_user
                business = args[1]
                if isinstance(args[2], str): permissions.add(args[2])
                elif isinstance(args[2], list) or isinstance(args[2], set):
                    for p in args[2]: permissions.add(p)
                
                # Add the owner and administrator to each call
                
                if not my_user.has_permission(business_name=business, permissions_to_check=spruce_up_permissions(permissions)): raise UserUnauthorizedError()
                else: return func(*args, **kwargs)        
            except: pass

        # TEST CODE
        # if kwargs.get('user') is None: raise UserUnauthorizedError()
        # my_user = kwargs.get('user')

        # Get the user
        if kwargs.get('scope') is None and kwargs.get('user') is None: 
            
            raise UserUnauthorizedError()
        
        if kwargs.get('scope') is not None: my_user = User(scope=kwargs.get('scope')).profile_user
        
        if kwargs.get('user') is not None: 
            if isinstance(kwargs.get('user'), User): my_user = kwargs.get('user').profile_user
            elif isinstance(kwargs.get('user'), BaseUserProfile): my_user = kwargs.get('user')
            else: raise ValueError('Authorized: Incorrect user was passed')
        
        # Get the business
        if kwargs.get('payload') is not None:
            payload = kwargs.get('payload')
            business = payload.get('business')
            if business is None: business = payload.get('business_name')
            if business is None: business = payload.get('businessName')
            
            if payload.get('permission') is not None: permissions.add(payload.get('permission'))
            if payload.get('permissions') is not None:
                if isinstance(payload.get('permissions'), list):
                    for p in payload.get('permissions'): permissions.add(p)
                elif isinstance(payload.get('permissions'), set): 
                    permissions |= payload.get('permissions')

            if payload.get('department') is not None: permissions.add(payload.get('department'))
            if payload.get('departments') is not None: 
                if isinstance(payload['departments'], list):
                    for p in kwargs.get('departments'):
                        permissions.add(p)
                elif isinstance(payload['departments'], set): permissions |= payload['departments']
            
            
        if kwargs.get('business') is not None: business = kwargs.get('business')
        elif kwargs.get('business_name') is not None: business = kwargs.get('business_name')
        elif kwargs.get('businessName') is not None: business = kwargs.get('businessName')
        
        if kwargs.get('required_permission') is not None or kwargs.get('required_permissions') is not None: permissions = set()
        if kwargs.get('required_permission') is not None: permissions.add(kwargs.get('required_permission'))
        if kwargs.get('required_permissions') is not None: 
            if isinstance(kwargs.get('required_permissions'), list):
                for p in kwargs.get('required_permissions'): 
                    permissions.add(p)
            elif isinstance(kwargs.get('required_permissions'), set): 
                permissions |= kwargs.get('required_permissions')
                
        if kwargs.get('department') is not None: permissions.add(kwargs.get('department'))
        if kwargs.get('departments') is not None:
            if isinstance(kwargs['departments'], list):
                for p in kwargs.get('departments'): permissions.add(p)
            elif isinstance(kwargs['departments'], set): permissions |= kwargs['departments']
    
        if business is None: 
            
            raise UserUnauthorizedError()

        # if not my_user.profile_user.has_permission(business_name=business, permissions_to_check=permissions): raise UserUnauthorizedError()
        # Add the owner and administrator to each call
        if not my_user.has_permission(business_name=business, permissions_to_check=spruce_up_permissions(permissions)): 
            # print ('Authorized: Does not have permission')
            # print (f'Business: {business}')
            # print (f'Permissions: {permissions}')
            # print (f'Function: {func}')
            # print (f'Function args: {args}')
            # print (f'Function kwargs: {kwargs}')
            raise UserUnauthorizedError()
        else:
            print ('Authorized')
            return func(*args, **kwargs)
    
    return inner


def authenticated(func):
    def inner(*args, **kwargs):
        # Get the scope
        if kwargs.get('scope') is None: raise UserUnauthorizedError()
        # Get the user
        scope = kwargs.get('scope')
        
        try:
            access_token = scope['cookies'].get('access_token')
            if access_token is None: raise UserUnauthorizedError()
            else: 
                token = decode_token(access_token)
                if not token['login_status'] == 'authenticated': raise UserUnauthorizedError()
                else: return func(*args, **kwargs)
        except: raise UserUnauthorizedError()
    
    return inner