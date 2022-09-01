import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer, AsyncJsonWebsocketConsumer
from .exceptions import ClientError

from libs.cass_auth.security import decode_token
from libs.cass_auth.middleware import User

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))


class userConsumer(AsyncJsonWebsocketConsumer):
    
    async def connect(self):
        # access_token = self.scope['cookies'].get('access_token')
        # if access_token is None:
        #     print ('Unauthorized')
        # else: 
        #     print ('Authorized')
        #     print (decode_token(access_token)['username'])
        
        # print ('connected')
        # user = get_user(self.scope)
        if User(scope=self.scope).is_authenticated:
            await self.accept()
        else: await self.disconnect(3000)

    # Echo messages to the client
    # async def echo_message(self, message):
    #     await self.send_json(message)

    # Receieves the messages and processes commands

    async def receive_json(self, content, **kwargs):
        
        
        msg = content.get('message')

        if msg == 'profile_test':
            await self.send_json({ "profile": "shit bird" })
            await self.disconnect(1000)
        else:
            await self.send_json({ "dickhead": "dicky dick" })
        # message_type = content.get('type')
        # try:
        #     if message_type == 'create.trip':
        #         await self.create_trip(content)
        #     elif message_type == 'echo.message':
        #         await self.echo_message(content)
        #     elif message_type == 'update.trip':
        #         await self.update_trip(content)
        #     elif message_type == 'join.chat':
        #         await self.join_room(content["room"])
        #     elif message_type == 'leave.chat':
        #         await self.leave_room(content['room'])
        #     elif message_type == 'send.chat':
        #         await self.send_room(content["room"], content["message"])
        # except ClientError as e:
        #     # Catch any errors and send it back
        #     await self.send_json({"error": e.code})


    async def disconnect(self, code):
        await self.close(code)
