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
from libs.cass_auth.profiles.base_profile import BaseUserProfile
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


from feedSocket.feed_consumer import FeedConsumer
from feedSocket.businesses_consumer import BusinessesConsumer

# from libs.kp_fraydit.producers.auto_producer import AutoProducer
from libs.kp_fraydit.producers.base_producer import BaseProducer

from libs.exceptions.handle_errors import KafkaLoggingHandler, handleErrors

from .businesses_consumer import BusinessesConsumer


class feedConsumer(AsyncJsonWebsocketConsumer):
    # CANNOT USE INIT BECAUSE IT RETURNS AN EMPTY CONNECITON AND ERRORS OUT!!!
    # def __init__(self):

    @property
    def feed_producer(self):
        try:
            return self.__feed_producer
            
        except Exception as e:
            self.__feed_producer  = BaseProducer.from_topic(topic_name=f"userMessages", include_value_fields=['command', 'payload'], include_key_fields=['department', 'business'], preserve_order=False)
            return self.__feed_producer


    @feed_producer.setter
    def feed_producer(self, value):
        if isinstance(value, BaseProducer): self.__feed_producer = value


    @property
    def public_producer(self):
        try:
            return self.__public_producer
        except Exception as e:
            self.__public_producer = BaseProducer.from_topic(topic_name=f'publicMessages', preserve_order=False, include_value_fields=['command', 'payload'], include_key_fields=['key'])


    @public_producer.setter
    def public_producer(self, value):
        if isinstance(value, BaseProducer): self.__public_producer = value


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


    def _receive_public_message(self, key, value):
        print (f'broadcast all: {key} and value: {value}')
        self.produce_queue.put([key, value, "systemWide"])
        

    @async_to_sync
    async def _receive_feed_message(self, key, value):
        try:
            command = value['command']
            payload = value['payload']
            profileId = key['profileId']
            createdAt = value['createdAt']
            print ('MESSAGE/////////////////////////////////////////////////////////////////////////')
            print ('')
            print ('')
            print (payload)
            print (profileId)
            print (createdAt)
            print ('')
            print ('')
            print ('MESSAGE/////////////////////////////////////////////////////////////////////////')
            try:
                result = FeedConsumer().process_message(command=command, payloadStr=payload, scope=self.scope, profileId=profileId, createdAt=createdAt)
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
        
        print ('connected to feed socket')
        self.subscribe_to_feed()   
        self.subscribe_to_public()

        print ('Sending initial businesses state')
        await self.send_json(BusinessesConsumer().update_all_businesses())
    # END CONNECT() ///////////////////////////////////////////////////////////////////////////////////////////////

    # @handleErrors
    def subscribe_to_feed(self):
            
        self.feed_consumer = BaseConsumer.from_topic(topic_name=f"userMessages", group_id=f"userMessages.{random_uuid()}", on_message=self._receive_feed_message, read_from_beginning=False)
        self.feed_consumer.poll()
        

    def subscribe_to_public(self):
        self.public_consumer = BaseConsumer.from_topic(topic_name=f"publicMessages", group_id=f"publicMessages.{random_uuid()}", on_message=self._receive_public_message, read_from_beginning=False)
        self.public_consumer.poll()

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

        elif key == 'feed':
            pass

        elif key == 'businesses':
            if cmd == 'get_businesses': await self.send_json(BusinessesConsumer().get_businesses())

            # if cmd == 'get_profile': await self.send_json(ProfileConsumer().get_profile(scope=self.scope))
            # elif cmd == 'commit_profile': await self.send_json(ProfileConsumer().commit_profile(payload=payload, scope=self.scope))
            # elif cmd == 'set_default_business': await self.send_json(ProfileConsumer().set_default_business(payload=payload, scope=self.scope))
            
        
        # # Handle Exceptions        
        # except UserUnauthorizedError as e: await self.send_unauthorized_message()
        # except Exception as e: await self.send_error_message()


        
# END SOCKET COMMANDS //////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////////////


                                
    async def disconnect(self, code):
        await self.close(code)
