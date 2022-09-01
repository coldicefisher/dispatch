from datetime import datetime

from libs.cass_auth.businesses.business_model import BusinessModel
from libs.exceptions.handle_errors import handleErrors
from libs.kp_fraydit.producers.auto_producer import AutoProducer

import ast

from libs.cass_auth.middleware import User, authorized, authenticated
from libs.kp_fraydit.datetime_functions import utc_now_as_long

from libs.kp_fraydit.metaclasses import SingletonMeta

from libs.public_data.businesses.business_view import BusinessView


class BusinessesConsumer(metaclass=SingletonMeta):
    def __init__(self):
        pass


    @property
    def businesses(self):
        return BusinessView().serialized_businesses


    def update_all_businesses(self):
        
        businesses = self.businesses
        
        payload = {
            'command': 'update_all_businesses',
            'payload': {
                'businesses': businesses
            }
        }
        
        return payload