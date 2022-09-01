import sys
sys.path.append("..") # Adds higher directory to python modules path.

from rest_framework.decorators import api_view
from rest_framework import status
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import FileUploadParser
from datetime import datetime as dt
from datetime import timedelta

from libs.cass_auth.users import UserModel
from libs.exceptions.auth_exceptions import AddressAlreadyRegisteredError, AddressNotRegisteredError, OtpCodeExpiredError, UserDoesNotExistError, InvalidAddressTypeError, InvalidCredentialsError, UserExistsError
from libs.cass_auth.security import generate_token, decode_token
from libs.cass_auth.addresses import AddressClient
from libs.cass_auth.profiles.profile_model import ProfileModel

from PIL import Image
from io import BytesIO

ac = AddressClient()

# def get_user_from_token(token):
#     # decode the payload
#     token = decode_token(token)
#     my_user = get_user(token['username'])
#     return my_user

'''
Required: 
Body: username, pwd, first_name, last_name
'''

'''
Required:
Body: username, device

Returns:
Cookie: access_token
'''
@api_view(['POST', ])
def CheckUser(request):
    renderer_classes = [JSONRenderer] # this tells DRF to render in JSON. Not use the model viewer.
    
    if request.method == 'POST': # Check for post in case other methods are allowed
        
        # Validate data
        print (request.data)
        print ('Check user')
        if not request.data.get('username') or not request.data.get('device'):
            return Response(data={
                'login_status': 'start',
            },
                status=status.HTTP_417_EXPECTATION_FAILED)
        
        try:
            my_user = UserModel().get(request.data['username']) # get the user
            
            # check to see if device is trusted
            if my_user.is_device_trusted(request.data['device']): 
                token = generate_token(
                    username=my_user.username, 
                    status=my_user.status,
                    login_status='trusted_not_authenticated'
                )
                response = Response(data={
                        'username': my_user.username,
                        'login_status': 'trusted_not_authenticated'
                    },
                        status=status.HTTP_200_OK
                    )
                
            else: 

                token = generate_token(
                            username=my_user.username,
                            status=my_user.status,
                            login_status='not_trusted_not_authenticated'
                        )
                response = Response(data={
                            'login_status': 'not_trusted_not_authenticated', 
                            'username': my_user.username
                        },
                            status=status.HTTP_200_OK
                        )

            # End if
            response.set_cookie(key='access_token', value=token, httponly=True, expires=dt.now() + timedelta(days=730))
            return response
                

        except UserDoesNotExistError as e:
            print ('doesnt exist dude')
            return Response(data={
                        'login_status': 'trusted_not_authenticated',
                        'username': request.data.get('username')
                    },
                status=status.HTTP_200_OK
            )
        except Exception as e:
            print (f'Error: {e}')

            return Response(data={
                'login_status': 'not_trusted_not_authenticated',
                'message': 'unknown_error',
                'payload': {
                    "display": 'Oops! Something went wrong',
                    
                },
            },
                status=status.HTTP_400_BAD_REQUEST
            )


'''
[GET]
Required:
cookies: access_token

[POST]
Required:
cookies: access_token
body: address
'''
@api_view(['POST', 'GET'])
def SendAddressVerification(request):
    renderer_classes = [JSONRenderer] # this tells DRF to render in JSON. Not use the model viewer.

        
    if request.method == 'GET':
        if not request.COOKIES.get('access_token'): 
            print ('no access token')
            return Response(status=status.HTTP_417_EXPECTATION_FAILED)
        # decode the payload
        token = decode_token(request.COOKIES['access_token'])
        my_user = UserModel().get(token['username'])
        login_status = token['login_status']
        
        # check the login status
        # DEPRECATED. Any user should be able to access verification options
        # if not token['login_status'] == 'not_trusted_not_authenticated':
        #     return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        l_status = 'verification_options'
        if login_status == 'authenticated':
            new_token = generate_token(
                            username=my_user.username, 
                            status=my_user.status,
                            login_status='authenticated',
                            options=my_user.otp_options
                        )
            l_status = 'authenticated'
        else:
            new_token = generate_token(
                            username=my_user.username, 
                            status=my_user.status,
                            login_status='verification_options',
                            options=my_user.otp_options
                        )
        data = {
            'otp_options': my_user.otp_options_client_friendly,
            'username': my_user.username,
            'login_status': l_status

        }
        response = Response(data=data,
                status=status.HTTP_200_OK
            )
        response.set_cookie(key='access_token', value=new_token, httponly=True, expires=dt.now() + timedelta(days=730))
        return response
    
        
    elif request.method == 'POST':
        # validate data
        if not request.COOKIES.get('access_token') or not request.data.get('address'):
            return Response(status=status.HTTP_417_EXPECTATION_FAILED)

        # decode the payload
        token = decode_token(request.COOKIES['access_token'])
        my_user = UserModel().get(token['username'])
    
        # check the login status
        # DEPRECATED: Any user should be able to send a verification
        # if not token['login_status'] == 'verification_options':
        #     return Response(status=status.HTTP_401_UNAUTHORIZED)

        # Send verification
        full_address = my_user.get_full_address(request.data.get('address'))
        my_user.send_verification(full_address)

        # trust this device
        # if request.data.get('trust_this'):
        #     my_user.add_trusted_device(request.data.get('device'))
        
        token = generate_token(
                        username=my_user.username, 
                        status=my_user.status,
                        login_status='verification_sent'
                    )

        response = Response(data={
                        'username': my_user.username,
                        'login_status': 'verification_sent'
                    },
                        status=status.HTTP_200_OK
                    )
        response.set_cookie(key='access_token', value=token, httponly=True, expires=dt.now() + timedelta(days=730))
        return response
    

@api_view(['POST',])
def VerifyAddress(request):
    renderer_classes = [JSONRenderer] # this tells DRF to render in JSON. Not use the model viewer.


    if request.method == 'POST':
        # validate data
        if not request.COOKIES.get('access_token') or not request.data.get('otp') or not request.data.get('address') or not request.data.get('username'):
            
            data = {
                'cookie': request.COOKIES.get('access_token'),
                'otp': request.data.get('otp'),
                'address': request.data.get('address'),
            }
            return Response(
                status=status.HTTP_417_EXPECTATION_FAILED
                )

        
        # decode the payload
        token = decode_token(request.COOKIES['access_token'])
        my_user = UserModel().get(request.data.get('username'))
        
        # check login status
        # DEPRECATED. Any user should be able to verify an address
        # if not token['login_status'] == 'verification_sent':
        #     return Response(status=status.HTTP_401_UNAUTHORIZED)
        
        full_address = my_user.get_full_address(request.data.get('address'))
        try:
            is_valid = my_user.validate_verification(request.data.get('otp'), full_address)
            
        except AddressAlreadyRegisteredError as e:
            return Response(data={
                    'message': 'address_registered'
                },
                status=status.HTTP_409_CONFLICT
            )
        except OtpCodeExpiredError as e:
            return Response(data={
                    'message': 'otp_code_expired',
                    'login_status': 'verification_options'
                },
                    status=status.HTTP_409_CONFLICT
                )

        if is_valid:
            token = generate_token(
                        username=my_user.username, 
                        status=my_user.status,
                        login_status='trusted_not_authenticated'
                    )
            # set device trust
            if request.data.get('trust_this') == 'true': my_user.add_trusted_device(request.data.get('device'))

            response = Response(data={
                    'login_status': 'trusted_not_authenticated',
                    'username': my_user.username
                },
                status=status.HTTP_202_ACCEPTED
            )    
            response.set_cookie(key='access_token', value=token, httponly=True,  expires=dt.now() + timedelta(days=730))
        
            return response 

        token = generate_token(
                    username=my_user.username, 
                    status=my_user.status,
                    login_status='not_trusted_not_authenticated'
                )

        response = Response(data={
                'message': 'invalid_code',
                'username': my_user.username,
                'login_status': 'not_trusted_not_authenticated'
            },
                status=status.HTTP_406_NOT_ACCEPTABLE
            )

        response.set_cookie(key='access_token', value=token, httponly=True)
        return response

'''
Required:
cookies: access_token
body: pwd
'''
@api_view(['POST',])
def PwdAuthenticate(request):
    renderer_classes = [JSONRenderer] # this tells DRF to render in JSON. Not use the model viewer.
    
    if request.method == 'POST': # Check for post in case other methods are allowed
        # Validate data
        if not request.COOKIES.get('access_token') or not request.data.get('pwd') or not request.data.get('username'): 
            print ('not all shit was passed')
            return Response(
                status=status.HTTP_401_UNAUTHORIZED)
            
        
        # decode the payload
        token = decode_token(request.COOKIES['access_token'])
        
        try:
            if not UserModel().username_exists(request.data.get('username')): raise InvalidCredentialsError()
            # my_user = uModel.get(request.data.get('username'))
            my_user = UserModel().get(request.data.get('username'))
            # return Response(data={'meta': request.headers.get('Authorization'), 'test': request.COOKIES})
            # Check to see if the device is previously trusted. If not, return forbidden
        
            if not token['login_status'] == 'trusted_not_authenticated':
                return Response(
                    status=status.HTTP_401_UNAUTHORIZED
                )

            # device is trusted. Authenticate pwd
            if my_user.check_password(request.data['pwd']): # pwd is right
                my_profile = ProfileModel().get(encrypted_username=my_user.encrypted_username)
                token = generate_token(
                        username=my_user.username,
                        login_status='authenticated',
                        permissions=list(my_profile.permissions)
                    )

                response = Response(data={
                    'username': my_user.username,
                    'login_status': 'authenticated'
                },
                    status=status.HTTP_202_ACCEPTED
                )

                # Check to see if a device has been trusted
                trust_this = request.data.get('trust_this')
                if trust_this == 'true':
                    my_user.add_trusted_device(request.data.get('device'))
                
                response.set_cookie(key='access_token', value=token, httponly=True, expires=dt.now() + timedelta(days=730))
                
                return response
            
            else: raise InvalidCredentialsError()

        
        except InvalidCredentialsError:
            return Response({
                    'message': 'login_failed',
                    'payload': {
                        'display': 'Invalid credentials'
                    }
                },
                status=status.HTTP_401_UNAUTHORIZED
            )


        # except Exception as e:
            
        #     return Response(data={
        #         'message': 'unknown_error',
        #         'payload': {
        #             "display": 'Oops! Something went wrong'
        #         }
        #     },
        #     status=status.HTTP_400_BAD_REQUEST
        #     )

            
@api_view(['POST', ])
def Register(request):
    renderer_classes = [JSONRenderer] # this tells DRF to render in JSON. Not use the model viewer.
    
    if request.method == 'POST': # Check for post in case other methods are allowed
        # Validate data
        if not request.data.get('username') or not request.data.get('pwd') \
            or not request.data.get('first_name') or not request.data.get('last_name') \
            or not request.data.get('phone') or not request.data.get('email') \
            or not request.data.get('q1') or not request.data.get('a1') \
            or not request.data.get('q2') or not request.data.get('a2'):
            return Response(
                status=status.HTTP_417_EXPECTATION_FAILED
            )
        
        username = request.data.get('username')
        pwd = request.data.get('pwd')
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        email = request.data.get('email')
        phone = request.data.get('phone')
        q1 = request.data.get('q1')
        a1 = request.data.get('a1')
        q2 = request.data.get('q2')
        a2 = request.data.get('a2')

        

        # # Return not acceptable if username exists
        # if uModel.username_exists(username): 
        #     return Response(status=status.HTTP_409_CONFLICT, data={'message': 'username_exists'})
        
        # Return not acceptable if account does not own email
        if ac.is_email_registered(email):
            return Response(status=status.HTTP_409_CONFLICT, data={'message': 'email_registered'})
        
        if ac.is_phone_number_registered(phone):
            return Response(status=status.HTTP_409_CONFLICT, data={'message': 'phone_registered'})
        
        # if UserModel().exists(username=username): Response(status=status.HTTP_409_CONFLICT, data={'message': 'username_exists'})
        
        try:
            my_profile = ProfileModel().create(username=username, password=pwd, first_name=first_name, last_name=last_name,
                        q1=q1, a1=a1, q2=q2, a2=a2, association_email=email)
        
        except UserExistsError:
            return Response(status=status.HTTP_409_CONFLICT, data={'message': 'username_exists'})

        my_user = UserModel().get(my_profile.username)
        my_user.add_address(email)
        my_user.add_address(phone)
        
        # my_profile.update_profile_info(first_name=first_name, last_name=last_name, privacy_status="Private", seeking_status="Not Looking")
        
        token = generate_token(
                    username=username, 
                    login_status='not_trusted_not_authenticated'
                )

        response = Response(data={
            'username': my_user.username,
            'login_status': 'not_trusted_not_authenticated'
        },
            status=status.HTTP_201_CREATED
        )

        response.set_cookie(key='access_token', value=token, httponly=True,  expires=dt.now() + timedelta(days=730))
        return response
                

@api_view(['POST'])
def AddAddress(request):
    renderer_classes = [JSONRenderer] # this tells DRF to render in JSON. Not use the model viewer.

    if request.method == 'POST': # Check for post in case other methods are allowed
        # Validate data
        if not request.data.get('username') or not request.data.get('address'):
            return Response(
                status=status.HTTP_417_EXPECTATION_FAILED
            )
        
        my_user = UserModel().get(request.data.get('username'))
        address = request.data.get('address')
        
        # Check to see if user has this address
        existing_address = False
        if ac.is_phone_number(address):
            if my_user.has_phone_number(address): existing_address = True

        elif ac.is_email(address): 
            if address in list(my_user.emails.keys()): existing_address = True
        
        if existing_address:
            return Response(data={
                    'address': address,
                    'options': my_user.otp_options,
                    'message': 'exists'
                },
                status=status.HTTP_200_OK
            )

    try:
        my_user.add_address(address)
    except AddressAlreadyRegisteredError as e:
        return Response(data={
                'message': 'address_registered_to_another_user'
            },
                status=status.HTTP_409_CONFLICT
        )
    
    return Response(data={
            'address': address,
            'options': my_user.otp_options,
            'message': 'new'
        },
        status=status.HTTP_200_OK
    )


@api_view(['GET', 'POST'])
def RetrieveUsername(request):
    renderer_classes = [JSONRenderer] # this tells DRF to render in JSON. Not use the model viewer.

    if request.method == 'POST':
        # Validate data
        if not request.data.get('login_status'):
            return Response(status=status.HTTP_417_EXPECTATION_FAILED)

        login_status = request.data.get('login_status')
    
        if login_status == 'retrieve_username_start':
            if not request.data.get('address'):
                return Response(status=status.HTTP_417_EXPECTATION_FAILED)

            address = request.data.get('address')

            if not ac.is_address_registered(address):
                return Response(data={
                        'message': 'verification_sent',
                        'login_status': 'retrieve_username_verification_sent',
                        'address': address
                    },
                    status=status.HTTP_200_OK
                )
                
            try:
                my_user = UserModel().get(address)

            except AddressNotRegisteredError as e:
                
                return Response(data={
                        'message': 'verification_sent',
                        'login_status': 'retrieve_username_verification_sent',
                        'address': address
                    },
                    status=status.HTTP_200_OK
                )   
            
            except Exception as e:

                return Response(data={
                        'message': 'verification_sent',
                        'login_status': 'retrieve_username_verification_sent',
                        'address': address
                    },
                    status=status.HTTP_200_OK
                )


            my_user.send_verification(address)
            return Response(data={
                    'message': 'verification_sent',
                    'login_status': 'retrieve_username_verification_sent',
                    'address': address
                },
                status=status.HTTP_200_OK
            )
        
        elif login_status == 'retrieve_username_otp_verify':
            if not request.data.get('otp_code') or not request.data.get('address'):
                return Response(status=status.HTTP_417_EXPECTATION_FAILED)

            otp = request.data.get('otp_code')
            address = request.data.get('address')
            
            try:
                user = UserModel().get(address)
            
                if user.validate_verification(int(otp), address):
                    return Response(data={
                            'login_status': 'retrieve_username_otp_verified',
                            'q1': user.q1,
                            'q2': user.q2
                        },
                            status=status.HTTP_200_OK
                        
                        )
                else:
                    return Response(data={
                            'message': 'otp_invalid'
                        },
                        status=status.HTTP_406_NOT_ACCEPTABLE
                    )
            except OtpCodeExpiredError as e:
                return Response(data={
                        'login_status': 'retrieve_username_start',
                        'message': 'otp_code_expired'
                    },
                        status=status.HTTP_409_CONFLICT
                    
                    )

            except UserDoesNotExistError as e:
                return Response(data={
                            'login_status': 'retrieve_username_otp_verified',
                            'q1': "Where did you go to high school?",
                            'q2': "What was the model of your first car?"
                        },
                            status=status.HTTP_200_OK
                        
                        )
        elif login_status == 'retrieve_username_questions_verify':
            if not request.data.get('a1') or not request.data.get('a2') or not request.data.get('address'):
                return Response(status=status.HTTP_417_EXPECTATION_FAILED)

            address = request.data.get('address')
            a1 = request.data.get('a1')
            a2 = request.data.get('a2')

            try:
                user = UserModel().get(address)
                if user.verify_username_recovery(a1, a2):

                    # Send the username to device
                    user.send_message(f'Your username is: {user.username}', address)

                    # Send Response to client
                    return Response(data={
                            'login_status': 'retrieve_username_success',
                            'username': user.username
                        },
                        status=status.HTTP_200_OK
                    )
                else:
                    return Response(data={
                            'login_status': 'retrieve_username_failed'
                        },
                        status=status.HTTP_406_NOT_ACCEPTABLE
                    )
            
            except UserDoesNotExistError as e:
                return Response(data={
                        'login_status': 'retrieve_username_failed'
                    },
                    status=status.HTTP_406_NOT_ACCEPTABLE
                )


@api_view(['POST',])
def ResetPassword(request):
    renderer_classes = [JSONRenderer] # this tells DRF to render in JSON. Not use the model viewer.

    if request.method == 'POST':
        
        # Validate data
        if not request.data.get('login_status'):
            return Response(status=status.HTTP_417_EXPECTATION_FAILED)


        login_status = request.data.get('login_status')

        if login_status == 'reset_password':
            if not request.data.get('address') and not request.data.get('username'):
                return Response(status=status.HTTP_417_EXPECTATION_FAILED)

            address = request.data.get('address')
            username = request.data.get('username')

            
            try:
                my_user = UserModel.get(username)
                

            except UserDoesNotExistError as e:
                
                return Response(data={
                    'message': 'verification_sent',
                    'login_status': 'reset_password_verification_sent',
                    'address': address
                },
                status=status.HTTP_200_OK
            )

            if address in my_user.verified_addresses: 
                

                my_user.send_verification(address)

            return Response(data={
                    'message': 'verification_sent',
                    'login_status': 'reset_password_verification_sent',
                    'address': address
                },
                status=status.HTTP_200_OK
            )
        
        elif login_status == 'reset_password_set':
            if not request.data.get('otp_code') or not request.data.get('address') or not request.data.get('username') or not request.data.get('password'):
                return Response(status=status.HTTP_417_EXPECTATION_FAILED)

            otp = request.data.get('otp_code')
            address = request.data.get('address')
            username = request.data.get('username')
            password = request.data.get('password')
            
            try:
                user = UserModel().get(username)
            except UserDoesNotExistError as e:
                return Response(data={
                        'message': 'otp_invalid'
                    },
                    status=status.HTTP_406_NOT_ACCEPTABLE
                )
            
            if user.validate_verification(int(otp), address):
                # Reset the password
                user.update_info(pwd=password)
                return Response(data={
                        'login_status': 'reset_password_success',
                    },
                        status=status.HTTP_200_OK
                    
                    )
            else:
                return Response(data={
                        'message': 'otp_invalid'
                    },
                    status=status.HTTP_406_NOT_ACCEPTABLE
                )
            

@api_view(['GET',])
def SignOut(request):
    renderer_classes = [JSONRenderer] # this tells DRF to render in JSON. Not use the model viewer.

    if request.method == 'GET':
        response = Response(data={
                'message': 'logged_out'
            },
                status=status.HTTP_200_OK
            )
        response.delete_cookie(key='access_token')
        return response

@api_view(['POST',])
def ChangePassword(request):
    renderer_classes = [JSONRenderer]  # this tells DRF to render in JSON. Not use the model viewer.
    
    if request.method == 'POST':
        # Verify cookie authenticated
        if not request.COOKIES.get('access_token'): return Response(status=status.HTTP_417_EXPECTATION_FAILED)
        # decode the payload
        token = decode_token(request.COOKIES['access_token'])
        my_user = uModel.get(token['username'])
        login_status = token['login_status']
        if not login_status == 'authenticated': return Response(status=status.HTTP_401_UNAUTHORIZED)


        if not request.data.get('current_password') or not request.data.get('new_password'):
            return Response(status=status.HTTP_417_EXPECTATION_FAILED)

        if my_user.change_password(current_password=request.data.get('current_password'), new_password=request.data.get('new_password')):
            return Response(data={
                    'message': 'password_updated'
                },
                status=status.HTTP_202_ACCEPTED
            )
        
        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)


@api_view(['GET', 'POST'])
def PostImage(request):
    renderer_classes = [JSONRenderer]  # this tells DRF to render in JSON. Not use the model viewer.
    parser_classes = [FileUploadParser]
    print ('image stuff')
    if request.method == 'POST':
        print (request.data)
        image = request.data.get('file')
        form_data = request.data.get('form_data')
        print (image)
        
        for key, value in request.data.items():
            print (f'key: {key}')
            print (f'value: {value}')
        print ('file: ')
        print (image)
        print ('thumbnail: ')
        print (request.data.get('thumbnail'))

        img = Image.open((image))
        # img = Image.open(BytesIO(image))
        print ('parsed image:')
        print (img)
        
        img.save('test-img.png')
        return Response(data={
                'message': 'image uploaded',
            },
                status=status.HTTP_200_OK
        )
        #if not request.data.get('image'):
            
@api_view(['POST',])
def DeleteProfile(request):
    renderer_classes = [JSONRenderer]  # this tells DRF to render in JSON. Not use the model viewer.

    if request.method == 'POST':
        if not request.COOKIES.get('access_token'): return Response(status=status.HTTP_417_EXPECTATION_FAILED)
        # decode the payload
        token = decode_token(request.COOKIES['access_token'])
        my_user = uModel.get(token['username'])
        login_status = token['login_status']

        if not login_status == 'authenticated': return Response(status.HTTP_401_UNAUTHORIZED)

        
        uModel.delete(my_user.encrypted_username)

        return Response(data={
                'message': f"User {my_user.encrypted_username} successfully deleted"
            },
            status=status.HTTP_200_OK
        )
        