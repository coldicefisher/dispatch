from datetime import datetime
import json
import time
import os
import binascii
import ast
import base64


from asgiref.sync import sync_to_async, async_to_sync
from threading import Thread
from queue import Queue

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer, AsyncJsonWebsocketConsumer

from libs.exceptions.auth_exceptions import UserUnauthorizedError
from libs.cass_auth.security import decode_token
from libs.cass_auth.middleware import User
from libs.cass_auth.businesses.business_model import BusinessModel
from libs.public_data.users_data import UsersData
from libs.cass_auth.documents.document_model import DocumentModel
from libs.exceptions.document_exceptions import DocumentExistsError

from libs.kp_fraydit.consumers.base_consumer import BaseConsumer


import userSocket.profile_consumer as helpers

from libs.kp_fraydit.metaclasses import SingletonMeta

from userSocket.business_consumer import BusinessConsumer


class businessConsumer(AsyncJsonWebsocketConsumer, metaclass=SingletonMeta):
    # CANNOT USE INIT BECAUSE IT RETURNS AN EMPTY CONNECITON AND ERRORS OUT!!!
    # def __init__(self):
    
    # THIS FUNCTION IS CALLED IN ANOTHER THREAD AND PRODUCES MESSAGES FROM SUBSCRIBED TOPICS.
    '''
        All messages are placed into a queue and then consumed by this function. The broadcast received is passed to the consumer as a callback function
    '''
    @async_to_sync
    async def _produce_messages_from_kafka(self):
        while True:
            key, value, audience = self.produce_queue.get()
            await self.send_json({'command': value.get('command'), 'message': value.get('message'), 'audience': audience})
        
        
            #self.send_json({'command': 'system', 'message': 'system wide message bro'})    

    @property
    def user(self) -> User:
        return self.__user
    

    @property
    def active_business(self) -> str:
        try:
            return self.__active_business
        except:
            return None


    def _broadcast_all_users(self, key, value):
        print (f'broadcast all: {key} and value: {value}')
        self.produce_queue.put([key, value, "systemWide"])
        

    def _broadcast_specific_user(self, key, value):
        print (f'broadcast private: {key} and value: {value}')
        if key.get('username') == self.user.profile_user.encrypted_username: 
            self.produce_queue.put([key, value, "private"])

    
    def _broadcast_business_users(self, key, value):
        # self.user.profile_user.businesses
        if key.get('uid') in self.user.profile_user.businesses_list:
            print (f'broadcast business users: {key} and value: {value}')
            # check permissions
            if self.user.profile_user.has_permission(key.get('uid'), ['Human Resources', 'Owner']):
                self.produce_queue.put([key, value, "businessUsers"])


    # CONNECT ////////////////////////////////////////////////////////////////////////////////////////
    
    async def connect(self):
        await self.accept()
        
        self.__user = User()
        authenticated = self.__user.authenticate(scope=self.scope)
        
        if not authenticated:
            # await self.send_json({'command': 'system', 'error': 'unauthorized connection'})
            self.__user = None
        else:
            # await self.send_json({'command': 'system', 'message': 'authenticated connection'})
            # HANDLE SUBSCRIPTIONS ///////////////////////////////////////////////////////////////////////////
            self.produce_queue = Queue() # Must be initialized before the callback funciton is passed to the consumer
            
            specific_consumer = BaseConsumer.from_topic('usersMessages', f'{self.user.profile_user.username}.usersMessages', self._broadcast_specific_user)
            specific_consumer.poll()

            system_consumer = BaseConsumer.from_topic("systemMessages", f"{self.user.profile_user.username}.systemMessages", self._broadcast_all_users)
            system_consumer.poll()

            business_consumer = BaseConsumer.from_topic("businessUsers", f"{self.user.profile_user.username}.businessUsers", self._broadcast_business_users)
            business_consumer.poll()
            

            # END HANDLE SUBSCRIPTIONS ///////////////////////////////////////////////////////////////////////

            # START THE PRODUCER THREAD FOR READING THE QUEUE
            t1 = Thread(target=self._produce_messages_from_kafka, args=(),daemon=False)
            t1.start()
        # END AUTHORIZED CONNECTION
        
        
    # Echo messages to the client
    async def echo_message(self, message):
        await self.send_json(message)

    # Receieves the messages and processes commands
    async def receive_json(self, content, **kwargs):
        my_user = User()
        authenticated = my_user.authenticate(scope=self.scope)
        if not authenticated:
            await self.send_json({"key": "system", "command": "unauthorized"})
            return
            #await self.disconnect(3000)
        
        cmd = content.get('command')
        payload = content.get('payload')
        
        await self.echo_message(content)
        
        if cmd == 'profile_test':
            await self.send_json({ "profile": "shit bird" })
            await self.disconnect(1000)
        
        # await self.disconnect(3000)
        if cmd == 'ping':
            await self.send_json({'command': 'ping'})
# GET PROFILE ///////////////////////////////////////////////////////////////////////////////////////
        
        elif cmd == 'get_profile':
            await self.send_json({'key': 'profile', "command": "update_profile", "payload": helpers.get_profile(my_user) })

# END GET PROFILE //////////////////////////////////////////////////////////////////////////////////////


# COMMIT PROFILE ///////////////////////////////////////////////////////////////////////////////////////

        elif cmd == 'commit_profile':
            if helpers.commit_profile(my_user, payload):
                await self.send_json({'key': 'profile', "command": "commit_profile_success", "payload": {
                                        'status': 'success'
                                    }})

# END COMMIT PROFILE ///////////////////////////////////////////////////////////////////////////////////


# UPLOAD IMAGES ////////////////////////////////////////////////////////////////////////////////////////
        
        elif cmd == 'upload_profile_image':
            ''' Old code'''
            await self.send_json({'key': 'profile', "command": "upload_profile_image_success", "image": content.get('image')})


# GET SEARCH DATA ///////////////////////////////////////////////////////////////////////////////////////

        elif cmd == 'search_profiles':
            search_results = UsersData().search_profiles(payload.get('search_string'))
            await self.send_json({'key': 'search', 'command': 'profiles', 'payload': search_results})

        elif cmd == 'search_business_profiles':
            await self.send_json({'key': 'search', 'command': 'business_profiles', 'payload': UsersData().search_profiles(payload.get('search_string'), 'business_profiles')})
# END GET SEARCH DATA //////////////////////////////////////////////////////////////////////////////////


        # REFACTOR!!!!!!!!!!    
        # elif cmd == 'get_signature':
        #     doc = DocumentModel().get(id='24ade91f-6725-4999-9ff8-cbc7e21322cf')
        #     encoded = doc.converted_signature
        #     await self.send_json({'command': 'document_fetched', 'payload': {
        #             'contents': encoded
        #     }})

# FETCH DOCUMENT ///////////////////////////////////////////////////////////////////////////////////////
        # REFACTOR !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        elif cmd == 'get_doc':
            doc = DocumentModel().get(id='24ade91f-6725-4999-9ff8-cbc7e21322cf')
            encoded = doc.converted_contents
            await self.send_json({'key': 'document', 'command': 'document_fetched', 'payload': {
                    'contents': encoded
            }})

# PROCESS SIGNED DOCUMENT ///////////////////////////////////////////////////////////////////////////////
        elif cmd == 'signed_document':
            
            if not helpers.validate_document(payload):
                await self.send_json({'key': 'document', 'command': 'document_processed', 'payload': {
                'status': 'invalid_signature',
                'templateName': payload.get('template_name')
            }})
            else:
                
                try:
                    doc = DocumentModel().create(profile_id=payload.get('profile_id'), template_name=payload.get('template_name'), contents=payload.get('contents'), signature=payload.get('signature'), public_key=payload.get('public_key'), allow_duplicates=payload.get('allow_duplicates'))
                    await self.send_json({'key': 'document', 'command': 'document_processed', 'payload': {
                        'status': 'document_created',
                        'templateName': payload.get('template_name'),
                        'documentType': doc.template_version_client_friendly,
                    }}) 

                except DocumentExistsError:
                    await self.send_json({'key': 'document', 'command': 'document_processed', 'payload': {
                        'status': 'document_exists',
                        'templateName': payload.get('template_name')
                    }}) 
                except Exception as e:
                    await self.send_json({'key': 'document', 'command': 'document_processed', 'payload': {
                        'status': 'unknown_failure',
                    }})

# CREATE BUSINESS //////////////////////////////////////////////////////////////////////////////////////
        elif cmd == 'create_business':
            biz = helpers.create_business(payload)
            # Set default business
            my_user.profile_user.update_profile_info(default_business=payload.get('business_name'))
            if biz == False:
                await self.send_json({'key': 'business', 'command': 'business_create', 'payload': {
                                        'status': 'failed',
                                        'businessName': payload.get('name')
                                    }
                                })
            else:
                await self.send_json({'key': 'business', 'command': 'business_create', 'payload': {
                                        'status': 'success',
                                        'name': biz.name,
                                        'uid': biz.id
                                    }
                                })
    
# END CREATE BUSINESS //////////////////////////////////////////////////////////////////////////////////

# CHECK IF BUSINESS EXISTS /////////////////////////////////////////////////////////////////////////////
        elif cmd == 'check_business_name':
            if payload.get('name') is not None:
                if len(payload.get('name')) > 0:
                    e = BusinessModel().exists(payload.get('name'))
                    if e:
                        await self.send_json({'key': 'business', 'command': 'business_exists', 'payload': {
                                                'status': 'true'
                                            }
                                        })   
                    else:
                        await self.send_json({'key': 'business', 'command': 'business_exists', 'payload': {
                                                'status': 'false'
                                            }
                                        })   


        elif cmd == 'get_business_data':
            pass

# GET BUSINESS USERS ///////////////////////////////////////////////////////////////////////////////////

        elif cmd == 'get_business_users':
            business_name = payload.get('business_name')
            if business_name is None: 
                await self.send_json({'key': 'business', 'command': 'update_business_users', 'payload': {'users': []}})
            else:
                biz = BusinessModel().get(business_name)
                if biz.profiles[my_user.profile_user.id].has_permission(['Owner', 'Administrator']):
                    
                    await self.send_json({'key': 'business', 'command': 'update_business_users', 'payload': { 'users': biz.serialized_profiles }})

# END GET BUSINESS USERS ///////////////////////////////////////////////////////////////////////////////

# ADD PROFILE TO BUSINESS //////////////////////////////////////////////////////////////////////////////
        elif cmd == 'add_profile_to_business':
            biz = BusinessModel().get(payload.get('business_name'))
            biz.upsert_profile(profile_id=payload.get('profile_id'), permissions=payload.get('permissions'))
            await self.send_json({'key': 'business', 'command': 'update_business_users', 'payload': { 'users': biz.serialized_profiles }})
# END ADD PROFILE TO BUSINESS //////////////////////////////////////////////////////////////////////////

# ADD UNASSOCIATED PROFILE TO BUSINESS /////////////////////////////////////////////////////////////////
        elif cmd == 'create_unassociated_profile':
            biz = BusinessModel().get(payload.get('business_name'))
            print(payload.get('email'))
            
            biz.create_unassociated_profile(first_name=payload.get('first_name'), middle_name=payload.get('middle_name'), last_name=payload.get('last_name'), suffix=payload.get('suffix'), permissions=payload.get('permissions'), email=payload.get('email'))
            await self.send_json({'key': 'business', 'command': 'update_business_users', 'payload': { 'users': biz.serialized_profiles }})
# END ADD UNASSOCIATED PROFILE TO BUSINESS /////////////////////////////////////////////////////////////

# # SET DEFAULT COMPANY //////////////////////////////////////////////////////////////////////////////////
        elif cmd == 'set_default_business':
            print ('dispatching consumer 1')
            print ('here mother fucker')
            my_user.profile_user.update_profile_info(default_business=payload.get('business_name'))
            await self.send_json({'key': 'profile', 'command': 'default_business_set', 'payload': { 'businessName': payload.get('business_name') }})
# END SET DEFAULT COMPANY //////////////////////////////////////////////////////////////////////////////

# UPDATE BUSINESS PROFILE PERMISSIONS //////////////////////////////////////////////////////////////////
        elif cmd == 'replace_business_profile_permissions':
            
            biz = BusinessModel().get(payload.get('business_name'))
            p = biz.profiles[payload.get('profile_id')]
            p.replace_permissions(payload.get('permissions'))
            name = p.first_name
            if not p.middle_name == '': name += ' ' + p.middle_name
            name += ' ' + p.last_name
            if not p.suffix == '': name += ' ' + p.suffix

            await self.send_json({'key': 'business', 'command': 'replace_user_permissions_success', 'payload': { 'users': biz.serialized_profiles, 'fullName': name}})
# END UPDATE BUSINESS PROFILE PERMISSIONS //////////////////////////////////////////////////////////////

# END SOCKET COMMANDS //////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////////


                                
    async def disconnect(self, code):
        await self.close(code)
