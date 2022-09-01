import requests
import json
import os
import telnyx

from libs.comms.comms_errors import TextClientFailed, ApiFailed
from libs.cass_auth.connect import get_secured_session as get_session
from libs.kp_fraydit.datetime_functions import utc_now_as_long
from libs.comms.mail_client import MailClient


mc = MailClient()

telnyx.api_key = os.environ.get('TELNYX_API_KEY')

carriers = [
        {'carrier': 'AT&T', 'sms': '@txt.att.net', 'mms': '@mms.att.net'},
        {'carrier': 'Boost', 'sms': '@sms.myboostmobile.com', 'mms': '@myboostmobile.com'},
        {'carrier': 'Cricket', 'sms': '@mms.cricketwireless.net', 'mms': '@mms.cricket.wireless.net'},
        {'carrier': 'Google fi', 'sms': '@msg.fi.google.com', 'mms': '@msg.fi.google.com'},
        {'carrier': 'Republic', 'sms': '@text.republicwireless.com', 'mms': 'unavailable'},
        {'carrier': 'Sprint', 'sms': '@messaging.sprintpcs.com', 'mms': '@pm.sprint.com'},
        {'carrier': 'Straight Talk', 'sms': '@vtext.com', 'mms': '@mypixmessages.com'},
        {'carrier': 'T-Mobile', 'sms': '@tmomail.net', 'mms': '@tmomail.net'},
        {'carrier': 'ting', 'sms': '@message.ting.com', 'mms': 'unavailable'},
        {'carrier': 'US Cellular', 'sms': '@email.uscc.net', 'mms': '@mms.uscc.net'},
        {'carrier': 'Verizon', 'sms': '@vtext.com', 'mms': '@vzwpix.com'},
        {'carrier': 'Virgin', 'sms': '@vmobi.com', 'mms': '@vmpix.com'},
    ]

# http://apilayer.net/api/validate?access_key=3cb70d06a0bd28ea543b89c0bb8daadf&number=4234042162&country_code=US&format=1

class TextClient:
    def __init__(self):
        self.debug = True

    def print_debug(self, msg: str):
        if self.debug: print (msg)
    '''
    This method checks a carrier string from a verification format. If a match is found
    '''
    def get_carrier(self):
        pass

    @staticmethod
    def get_numverify_validation(phone_number: str, country_code: str = 'US', code_format: str = "1"):
        api_key = os.environ.get('NUMVERIFY_API_KEY')
        try:
            r = requests.get(f'http://apilayer.net/api/validate?access_key={api_key}&number={phone_number}&country_code={country_code}&format={code_format}')
            data = r.json()
            # print (data)
            if data.get('success') == False:
                raise ApiFailed('numverify', data)
                
            '''
            Data has been validated by checking for 'succes'. Convert the carrier to our list
            '''

            api_carrier = data['carrier'].upper()
            for carrier in carriers:
                if api_carrier.find(carrier['carrier'].upper()) > -1:
                    my_carrier = carrier['carrier']
                else:
                    my_carrier = data['carrier']
            
            # Write validation details to database
            session = get_session()
            insert_pt1 = 'INSERT INTO validated_phone_numbers (phone_number, id, is_valid, local_format, international_format, country_code, country_name, location, carrier, phone_number_type) '
            
            insert_pt2 = f"VALUES ('{phone_number}', now(), {data['valid']}, '{data['local_format']}','{data['international_format']}', '{data['country_code']}', '{data['country_name']}', '{data['location']}', '{data['carrier']}', '{data['line_type']}')"
            insert_sql = insert_pt1 + insert_pt2
            # print (insert_sql)
            session.execute(insert_sql)
            return data
        except Exception as e:
            raise TextClientFailed(e)

        # Example response from numverify /////////////////////////////////////
        '''
        {
            "valid": true,
            "number": "14234042162",
            "local_format": "4234042162",
            "international_format": "+14234042162",
            "country_prefix": "+1",
            "country_code": "US",
            "country_name": "United States of America",
            "location": "Madisonvl",
            "carrier": "AT&T Mobility LLC",
            "line_type": "mobile"
        }
        '''

    def validate_number_from_numverify(self):
        pass

    def send_verify_sms_from_email(self, phone_number):
        l = [f"{phone_number}{carrier['sms']}" for carrier in carriers]
        self.print_debug(f'Formatted numbers: {l}')

        mc.sendmail('Verify phone number', 'Click Here to verify your phone number', 'verify-phone@bizniz.io', l, 'VERIFY-PHONE_EMAIL_PWD')

    def send_sms_from_telnyx(self, phone_number, msg):
        from_phone = '+13642228239'
        data = telnyx.Message.create(from_=from_phone, to=f'+{phone_number}', text=msg,)
        
    