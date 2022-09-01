from datetime import datetime
import json
import time
import os
import binascii
import ast
import base64
import logging


from asgiref.sync import sync_to_async, async_to_sync
from threading import Thread
from queue import Queue

from asgiref.sync import async_to_sync
import asyncio
from channels.generic.websocket import WebsocketConsumer, AsyncJsonWebsocketConsumer
from libs.exceptions.auth_exceptions import UserUnauthorizedError

# from libs.cass_auth.auth_errors import UserUnauthorizedError
from libs.cass_auth.security import decode_token
from libs.cass_auth.middleware import User
# from libs.cass_auth.businesses.business_model import BusinessModel
# from libs.cass_auth.documents.document_model import DocumentModel
# from libs.cass_auth.documents.document_errors import DocumentExistsError

# from libs.public_data.users_data import UsersData

from libs.kp_fraydit.consumers.base_consumer import BaseConsumer
from libs.kp_fraydit.metaclasses import SingletonMeta
from libs.kp_fraydit.admin.admin_engine import AdminEngine
from libs.kp_fraydit.datetime_functions import utc_now_as_long
from libs.uuid.uuid import random_uuid

from userSocket.subscription_status import BusinessSubscription

from userSocket.business_consumer import BusinessConsumer
from userSocket.profile_consumer import ProfileConsumer
from userSocket.search_consumer import SearchConsumer
from userSocket.forms_consumer import FormsConsumer

# from libs.kp_fraydit.producers.auto_producer import AutoProducer
from libs.kp_fraydit.producers.base_producer import BaseProducer

from libs.exceptions.handle_errors import KafkaLoggingHandler, handleErrors


class userConsumer(AsyncJsonWebsocketConsumer):
    # CANNOT USE INIT BECAUSE IT RETURNS AN EMPTY CONNECITON AND ERRORS OUT!!!
    # def __init__(self):

    @property
    def business_producer(self):
        try:
            return self.__business_producer
            
        except Exception as e:
            self.__business_producer  = BaseProducer.from_topic(topic_name=f"businessMessages", include_value_fields=['command', 'payload'], include_key_fields=['department', 'business'], preserve_order=False)
            return self.__business_producer


    @business_producer.setter
    def business_producer(self, value):
        if isinstance(value, BaseProducer): self.__business_producer = value

    @property
    def produce_queue(self):
        try: return self.__produce_queue
        except: return None

    # THIS FUNCTION IS CALLED IN ANOTHER THREAD AND PRODUCES MESSAGES FROM SUBSCRIBED TOPICS.
    '''
        All messages are placed into a queue and then consumed by this function. The broadcast received is passed to the consumer as a callback function
    '''
    # @async_to_sync
    # async def _produce_messages_from_kafka(self):
    #     while True:
    #         key, value, audience = self.produce_queue.get()
    #         await self.send_json({'command': value.get('command'), 'message': value.get('message'), 'audience': audience})
    #         #self.send_json({'command': 'system', 'message': 'system wide message bro'})    


    def _receive_all_users_message(self, key, value):
        print (f'broadcast all: {key} and value: {value}')
        self.produce_queue.put([key, value, "systemWide"])
        

    def _receive_specific_user_message(self, key, value):
        print (f'broadcast private: {key} and value: {value}')
        if key.get('username') == User(scope=self.scope).profile_user.encrypted_username: 
            self.produce_queue.put([key, value, "private"])


    @async_to_sync
    async def _receive_business_message(self, key, value):
        try:
            department = key['department']
            business = key['business']
            command = value['command']
            payload = value['payload']
            profileId = value['profileId']
            createdAt = value['createdAt']
            print ('MESSAGE/////////////////////////////////////////////////////////////////////////')
            print ('')
            print ('')
            print (department)
            print (business)
            print (payload)
            print (profileId)
            print (createdAt)
            print ('')
            print ('')
            print ('MESSAGE/////////////////////////////////////////////////////////////////////////')
            try:
                result = BusinessConsumer().process_message(business=business, department=department, command=command, payloadStr=payload, user=User(scope=self.scope), profileId=profileId, createdAt=createdAt)
            except UserUnauthorizedError: 
                print ('')
                print ('')
                print ('')
                print ('')
                print ('unauthorized user. This should pass unnoticed because I do not want the message processed...')
                print ('')
                print ('')
                print ('')
                print ('')
                
                # self.send_unauthorized_message()
            except Exception as e: 
                print ('Received message exception...')
                print (e)

            if result is not None:
                cmd, msg = result
                if cmd == 'send': 
                    print ('sending message now')
                    await self.send_json(msg)
        except UserUnauthorizedError:
            pass    
    # CONNECT ////////////////////////////////////////////////////////////////////////////////////////
    
    
    async def connect(self):
        await self.accept()
        
        # HANDLE SUBSCRIPTIONS ///////////////////////////////////////////////////////////////////////////
        if self.produce_queue is None: self.__produce_queue = Queue() # Must be initialized before the callback funciton is passed to the consumer
        self.subscribe_to_business()
            
    # END CONNECT() ///////////////////////////////////////////////////////////////////////////////////////////////
    # @handleErrors
    def subscribe_to_business(self):
        # Create if not exists
        # if not AdminEngine().cluster.topics.exists(f'businessMessages'):
        #     AdminEngine().cluster.topics.create(topic_name=f"businessMessages", num_partitions=20)
        #     AdminEngine().cluster.topics[f'businessMessages'].create_value_schema(field_list=[{'name': 'command', 'type': 'string'}, {'name': 'payload', 'type': 'string'}, {'name': 'profileId', 'type': 'string'}, {'name': 'createdAt', 'type': 'long'}])
        #     AdminEngine().cluster.topics[f'businessMessages'].create_key_schema(field_list=[{'name': 'business', 'type': 'string'},{'name': 'department', 'type': 'string'}])
            
        self.business_consumer = BaseConsumer.from_topic(topic_name=f"businessMessages", group_id=f"businessMessages.{random_uuid()}", on_message=self._receive_business_message, read_from_beginning=False)
        self.business_consumer.poll()
        # if self.business_producer is None: self.business_producer = BaseProducer(topic_name=f"businessMessages", include_value_fields=['command', 'payload'], include_key_fields=['department', 'business'], preserve_order=True)

    # Echo messages to the client
    async def echo_message(self, message): await self.send_json(message)
    # Send unauthorized message to client
    async def send_unauthorized_message(self): await self.send_json({"key": "system", "command": "unauthorized", "payload": {}})
    # Send error message to client
    async def send_error_message(self): await self.send_json({"key": "system", "command": "application_failed", "payload": {} })

    # Receives the messages and processes commands
    async def receive_json(self, content, **kwargs):
        # try: my_user = User(scope=self.scope)
        # except UserUnauthorizedError: 
        #     self.send_unauthorized_message()        
        #     return

        key = content.get('key')        
        cmd = content.get('command')
        payload = content.get('payload')
        
        await self.echo_message(content)
        
        # try:
        if key == 'system':
            if cmd == 'ping': await self.send_json({'command': 'ping'})
        
        elif key == 'profile':
            if cmd == 'get_profile': await self.send_json(ProfileConsumer().get_profile(scope=self.scope))
            elif cmd == 'commit_profile': await self.send_json(ProfileConsumer().commit_profile(payload=payload, scope=self.scope))
            elif cmd == 'set_default_business': await self.send_json(ProfileConsumer().set_default_business(payload=payload, scope=self.scope))
            
        elif key == 'business':
            # SEND JSON BACK ////////////////////////////////////////
            if cmd == 'check_business_name': await self.send_json(BusinessConsumer().check_business_name(payload=payload))
            # AUTHENTICATED
            elif cmd == 'create_business': await self.send_json(BusinessConsumer().create_business(scope=self.scope, payload=payload))
            
            # AUTHORIZED
            elif cmd == 'get_business_profile': await self.send_json(BusinessConsumer().get_business_profile(payload=payload, user=User(scope=self.scope), required_permissions={'Owner', 'Administrator'}, producer=self.business_producer))
            elif cmd == 'get_business_users': await self.send_json(BusinessConsumer().get_business_users(payload=payload, user=User(scope=self.scope), required_permissions={'Owner', 'Administrator', 'Human Resources', 'Dispatching'}))
            elif cmd == 'get_business_data': await self.send_json(BusinessConsumer().get_business_data(payload=payload, user=User(scope=self.scope), required_permissions={'Employee'}))
            elif cmd == 'replace_business_profile_permissions': await self.send_json(BusinessConsumer().replace_business_profile_permissions(payload=payload, producer=self.business_producer, user=User(self.scope), required_permissions={'Owner', 'Administrator'}))
            elif cmd == 'add_profile_to_business': await self.send_json(BusinessConsumer().add_profile_to_business(payload=payload, user=User(scope=self.scope), required_permissions={'Owner', 'Administrator'}, producer=self.business_producer))
            elif cmd == 'create_unassociated_profile': await self.send_json(BusinessConsumer().create_unassociated_profile(payload=payload, user=User(scope=self.scope), required_permissions={'Owner', 'Administrator'}, producer=self.business_producer))
            elif cmd == 'delete_business_profile': await self.send_json(BusinessConsumer().delete_business_profile(payload=payload, user=User(scope=self.scope), required_permissions={'Owner', 'Administrator'}, producer=self.business_producer))
            elif cmd == 'commit_business_profile': await self.send_json(BusinessConsumer().commit_business_profile(payload=payload, user=User(scope=self.scope), required_permissions={'Owner', 'Administrator'}, producer=self.business_producer))
            elif cmd == 'create_application_template': await self.send_json(BusinessConsumer().create_application_template(payload=payload, user=User(scope=self.scope), required_permissions={'Owner', 'Administrator', 'Human_Resources'}, producer=self.business_producer))
            # elif cmd == 'subscribe_to_business': self.subscribe_to_business(payload.get('businessName'))
        
            
        elif key == 'search':
            if cmd == 'search_profiles': await self.send_json(SearchConsumer().search_profiles(payload=payload))
            elif cmd == 'search_business_profiles': await self.send_json(SearchConsumer().search_business_profiles(payload=payload))
            elif cmd == 'search_emails': await self.send_json(SearchConsumer().search_emails(payload=payload))
        elif key == 'forms':
            if cmd == 'get_doc': await self.send_json(FormsConsumer().get_doc())
            elif cmd == 'signed_document': await self.send_json(FormsConsumer().signed_document(payload=payload))

        # # Handle Exceptions        
        # except UserUnauthorizedError as e: await self.send_unauthorized_message()
        # except Exception as e: await self.send_error_message()


        # REFACTOR!!!!!!!!!!    
        # elif cmd == 'get_signature':
        #     doc = DocumentModel().get(id='24ade91f-6725-4999-9ff8-cbc7e21322cf')
        #     encoded = doc.converted_signature
        #     await self.send_json({'command': 'document_fetched', 'payload': {
        #             'contents': encoded
        #     }})

        # REFACTOR !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        
# END SOCKET COMMANDS //////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////////


                                
    async def disconnect(self, code):
        await self.close(code)
