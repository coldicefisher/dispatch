# from datetime import datetime
# from libs.cass_auth.security import is_signature_valid

# from libs.cass_auth.businesses.business_model import BusinessModel

from multiprocessing.sharedctypes import Value
from libs.exceptions.auth_exceptions import UserUnauthorizedError
from libs.exceptions.handle_errors import handleErrors
from userSocket.consumer_errors import ConsumerError

from libs.cass_auth.middleware import User, authenticated, authorized
class ProfileConsumer:

    @staticmethod
    @authenticated
    # # @handleErrors
    def get_profile(scope):
        user = User(scope=scope)
        payload = {
            'firstName': user.profile_user.first_name,
            'middleName': user.profile_user.middle_name,
            'lastName': user.profile_user.last_name,
            'suffix': user.profile_user.suffix,
            'profileId': str(user.profile_user.id),
            'gender': user.profile_user.gender,
            'privacyStatus': user.profile_user.privacy_status,
            'seekingStatus': user.profile_user.seeking_status,
            'addresses': user.profile_user.serialized_addresses,
            'workHistories': user.profile_user.serialized_work_histories,
            'images': user.profile_user.serialized_images,
            'permissions': user.profile_user.serialized_permissions,
            'businesses': user.profile_user.serialized_businesses,
            'defaultBusiness': user.profile_user.default_business
            # 'profileId': my_user.profile_user.id,
        }
        
        return {'key': 'profile', "command": "update_profile", "payload": payload }
        


    @staticmethod
    @authenticated
    # @handleErrors
    def commit_profile(scope, payload):
    
        my_user = User(scope=scope)        
        my_user.profile_user.update_profile_info(gender=payload['gender'], suffix=payload['suffix'], first_name=payload['firstName'], middle_name=payload['middleName'], last_name=payload['lastName'], \
                                                work_history=payload['workHistories'], addresses=payload['addresses'], images=payload['images'], \
                                                privacy_status=payload['privacyStatus'], seeking_status=payload['seekingStatus']
                                            )
        return {'key': 'profile', "command": "commit_profile_success", "payload": {
                                    'status': 'success'
                                }}
        # except Exception as e: raise ConsumerError(f"commit_profile: {e}")


    @staticmethod
    @authenticated
    # @handleErrors
    def set_default_business(scope, payload):
        my_user = User(scope=scope)
        my_user.profile_user.update_profile_info(default_business=payload.get('businessName'))
        return {'key': 'profile', 'command': 'default_business_set', 'payload': { 'businessName': payload.get('businessName') }}
