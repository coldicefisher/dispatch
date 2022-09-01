from datetime import datetime

from libs.cass_auth.businesses.business_model import BusinessModel
from libs.exceptions.handle_errors import handleErrors
from libs.kp_fraydit.producers.auto_producer import AutoProducer

import ast

from libs.cass_auth.middleware import User, authorized, authenticated
from libs.kp_fraydit.datetime_functions import utc_now_as_long

class FeedConsumer:
    

    @staticmethod
    @authenticated
    def process_message():
        pass