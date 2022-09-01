from datetime import datetime

from libs.cass_auth.businesses.business_model import BusinessModel
from libs.exceptions.handle_errors import handleErrors
from libs.kp_fraydit.producers.auto_producer import AutoProducer

import ast

from libs.cass_auth.middleware import User, authorized, authenticated
from libs.kp_fraydit.datetime_functions import utc_now_as_long

class BusinessConsumer:

    # NOT AUTHENTICATED NOT AUTHORIZED /////////////////////////////////////////////////////////////////
    @staticmethod
    # @handleErrors
    def check_business_name(payload: dict) -> dict:
        
        if payload.get('name') is not None:
            if len(payload.get('name')) > 0:
                e = BusinessModel().exists(payload.get('name'))
                if e:
                    return ({'key': 'business', 'command': 'business_exists', 'payload': {
                                            'status': 'true'
                                        }
                                    })   
                else:
                    return ({'key': 'business', 'command': 'business_exists', 'payload': {
                                            'status': 'false'
                                        }
                                    })   


    # AUTHENTICATED NOT AUTHORIZED TRANSCACTIONS ////////////////////////////////////////////////////////////////////
    @staticmethod
    @authenticated
    # @handleErrors
    def create_business(scope: dict, payload: dict):
        user = User(scope=scope)
        # biz = BusinessModel().create(payload.get('name'), payload.get('owner'))
        # create address structure
        phyAdd = {'id': 0, 'item': {
                    'startDate': datetime.strftime(datetime.now(), "%m/%d/%Y"),
                    'endDate': '',
                    'addressType': 'Physical',
                    'address1': payload.get('physicalAddress1'),
                    'address2': payload.get('physicalAddress2'),
                    'city': payload.get('physicalCity'),
                    'state': payload.get('physicalState'),
                    'zip': payload.get('physicalZip'),
                }}
        mailAdd = {'id': 1, 'item': {
                    'startDate': datetime.strftime(datetime.now(), "%m/%d/%Y"),
                    'endDate': '',
                    'addressType': 'Mailing',
                    'address1': payload.get('mailingAddress1'),
                    'address2': payload.get('mailingAddress2'),
                    'city': payload.get('mailingCity'),
                    'state': payload.get('mailingState'),
                    'zip': payload.get('mailingZip')
                }}
        addresses = [phyAdd, mailAdd]
        try:
            biz = BusinessModel().create(name=payload.get("name"), display_name=payload.get('name'), owner=payload.get('owner'), mc_number=payload.get('mcNumber'), dot_number=payload.get('dotNumber'),
                        industry=payload.get('industry'), industry_category=payload.get('industryCategory'), legal_structure=payload.get('legalStructure'),
                        addresses=addresses
                        )

            # Set default business
            user.profile_user.update_profile_info(default_business=payload.get('business_name'))
            return ({'key': 'business', 'command': 'business_create', 'payload': {
                                        'status': 'success',
                                        'name': biz.name,
                                        'uid': biz.id
                                    }
                                })

        except:
            return ({'key': 'business', 'command': 'business_create', 'payload': {
                                    'status': 'failed',
                                    'businessName': payload.get('name')
                                }
                            })    


    # AUTHORIZED /////////////////////////////////////////////////////////////////////////////////////////
    @staticmethod
    @authorized
    # @handleErrors
    def get_business_users(payload: dict, user: User, required_permissions: set) -> dict:
        
        # elif cmd == 'get_business_users':
        business_name = payload.get('businessName')
        if business_name is None: 
            return ({'key': 'business', 'command': 'update_business_users', 'payload': {'users': []}})
        else:
            biz = BusinessModel().get(business_name)
            if biz.profiles[user.profile_user.id].has_permission(['Owner', 'Administrator']):
                return ({'key': 'business', 'command': 'update_business_users', 'payload': { 'users': biz.serialized_profiles }})


    @staticmethod
    @authorized
    # @handleErrors
    def add_profile_to_business(payload: dict, user: User, producer: object, required_permissions: set) -> dict:
        biz = BusinessModel().get(payload.get('businessName'))
        p = biz.upsert_profile(profile_id=payload.get('profileId'), permissions=payload.get('permissions'))
        producer.addValueArgs(command='added_profile_to_business', payload=f'profileId:{payload.get("profileId")}|permissions:{payload.get("permissions")}',profileId=user.profile_user.id, createdAt=utc_now_as_long())
        producer.addKeyArgs(business=biz.name, department='Administrator')
        
        payload = {
            'key': 'business', 
            'command': 'added_profile_to_business_success', 
            'payload': { 
                    'business': biz.name, 
                    'profileId': str(p.id),
                    'firstName': p.first_name,
                    'middleName': p.middle_name,
                    'lastName': p.last_name,
                    'suffix': p.suffix,
                    'users': biz.serialized_profiles, 
                    'permissions': payload['permissions'],
                
            } }
        return payload
        # return ({'key': 'business', 'command': 'update_business_users', 'payload': { 'users': biz.serialized_profiles }})


    @staticmethod
    @authorized
    # @handleErrors
    def create_unassociated_profile(payload, user: User, producer, required_permissions: set) -> dict:
        biz = BusinessModel().get(payload.get('businessName'))
        p = biz.create_unassociated_profile(first_name=payload.get('firstName'), middle_name=payload.get('middleName'), last_name=payload.get('lastName'), suffix=payload.get('suffix'), permissions=payload.get('permissions'), email=payload.get('email'))
        producer.addValueArgs(command='added_profile_to_business', payload=f'profileId:{p.id}|permissions:{payload.get("permissions")}', profileId=user.profile_user.id, createdAt=utc_now_as_long())
        producer.addKeyArgs(business=biz.name, department='Administrator')
        
        payload = {
            'key': 'business', 
            'command': 'added_profile_to_business_success', 
            'payload': { 
                    'business': biz.name, 
                    'profileId': str(p.id),
                    'firstName': p.first_name,
                    'middleName': p.middle_name,
                    'lastName': p.last_name,
                    'suffix': p.suffix,
                    'users': biz.serialized_profiles, 
                    'permissions': payload.get('permissions'),
                    
                } }
        return payload
        # return ({'key': 'business', 'command': 'update_business_users', 'payload': { 'users': biz.serialized_profiles }})

    
    @staticmethod
    @authorized
    # @handleErrors
    def replace_business_profile_permissions(payload, producer, required_permissions: set, user: User) -> dict:
        biz = BusinessModel().get(payload.get('businessName'))
        p = biz.profiles[payload.get('profileId')]
        p.replace_permissions(payload.get('permissions'))
        name = p.first_name
        if not p.middle_name == '': name += ' ' + p.middle_name
        name += ' ' + p.last_name
        if not p.suffix == '': name += ' ' + p.suffix
        producer.addValueArgs(command='replaced_business_profile_permissions', payload=f'profileId:{payload.get("profileId")}|permissions:{payload.get("permissions")}', profileId=user.profile_user.id, createdAt=utc_now_as_long())
        producer.addKeyArgs(business=biz.name, department='Administrator')
        producer.addValueArgs(command='replaced_business_profile_permissions', payload=f'profileId:{payload.get("profileId")}|permissions:{payload.get("permissions")}', profileId=user.profile_user.id, createdAt=utc_now_as_long())
        producer.addKeyArgs(business=biz.name, department='Employee')
        
        payload = {
            'key': 'business', 
            'command': 'replaced_user_permissions_success', 
            'payload': {
                'business': biz.name,
                'profileId': str(p.profile_id), 
                'permissions': payload['permissions']}}
                
        return payload
        # return ({'key': 'business', 'command': 'replace_user_permissions_success', 'payload': { 'users': biz.serialized_profiles, 'fullName': name}})

    @staticmethod
    @authorized
    def delete_business_profile(payload: dict, producer: object, required_permissions: set, user: User):
        biz = BusinessModel().get(payload.get('business'))
        p = biz.profiles[payload.get('profileId')]
        result = biz.delete_profile(payload.get('profileId'))
        
        if result:
            payload = {
                'key': 'business',
                'command': 'deleted_business_profile_success',
                'payload': {
                    'business':     biz.name,
                    'profileId':    str(p.profile_id),
                    'firstName':    p.first_name,
                    'middleName':   p.middle_name,
                    'lastName':     p.last_name,
                    'suffix':       p.suffix
                }
            }
            producer.addValueArgs(command='deleted_business_profile', payload=f'profileId:{str(p.profile_id)}|firstName:{p.first_name}|middleName:{p.middle_name}|lastName:{p.last_name}|suffix:{p.suffix}', profileId=user.profile_user.id, createdAt=utc_now_as_long())
            producer.addKeyArgs(business=biz.name, department='Administrator')
            return payload


    @staticmethod
    @authorized
    # @handleErrors
    def process_message(business: str, department: str, command: str, payloadStr: str, user: User, createdAt: float, profileId: str) -> tuple:
        my_user = user.profile_user
        if not str(my_user.id) == str(profileId):
            keypairs = payloadStr.split('|')
            payload = dict()
            for keypair in keypairs: 
                key, value = keypair.split(':')
                payload[key] = value
            
            if command == 'replaced_business_profile_permissions': 
                if department == 'Administrator':
                    payload = {'key': 'business', 'command': 'replaced_user_permissions_success', 'payload': {'business': business,'profileId': payload['profileId'], 'permissions': ast.literal_eval(payload['permissions'])}}
                    return 'send', payload
                elif department == 'Employee' and payload.get('profileId') == str(my_user.id):
                    payload = {'key': 'business', 'command': 'replaced_user_permissions_success', 'payload': {'business': business,'profileId': payload['profileId'], 'permissions': ast.literal_eval(payload['permissions'])}}
                    return 'send', payload

            elif command == 'added_profile_to_business':
                biz = BusinessModel().get(business)
                p = biz.profiles[payload.get('profileId')]
                payload = {
                    'key': 'business', 
                    'command': 'added_profile_to_business_success', 
                    'payload': { 
                            'business': business, 
                            'profileId': payload['profileId'],
                            'firstName': p.first_name,
                            'middleName': p.middle_name,
                            'lastName': p.last_name,
                            'suffix': p.suffix,
                            'users': biz.serialized_profiles, 
                            'permissions': ast.literal_eval(payload['permissions']),
                        
                    } }
                return 'send', payload

            elif command == 'deleted_business_profile':
                biz = BusinessModel().get(business)
                p = biz.profiles[payload.get('profileId')]
                payload = {
                    'key': 'business', 
                    'command': 'deleted_business_profile_success', 
                    'payload': { 
                            'business': business, 
                            'profileId': payload['profileId'],
                            'firstName': payload.get('firstName'),
                            'middleName': payload.get('middleName'),
                            'lastName': payload.get('lastName'),
                            'suffix': payload.get('suffix'),
                            'users': biz.serialized_profiles, 
                        
                        } 
                    }
                return 'send', payload

        
        else:
            '''
                The profile of the sender if the same as mine. I should not process this message because I should be
                handling a callback as the message is processed. The purpose of the above code is to message other users
                that the message was handled.
            '''
            print ('')
            print ('')
            print ('Message was not for me')
            print ('')
            print ('')
            print ('')
            print ('')
            return None, None


    @staticmethod
    @authorized
    # @handleErrors
    def received_replaced_business_profile_permissions(profileId, payload, required_permissions: set):
        pass
    # @staticmethod
    # def business_selected(payload, user):
    #     AdminEngine().kafka_cluster.topics.create(topic_name='business', num_partitions=5)