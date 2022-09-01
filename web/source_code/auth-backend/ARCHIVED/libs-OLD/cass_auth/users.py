import os

# from ssl import _PasswordType
import bcrypt
from cryptography.fernet import Fernet
from rest_framework.response import Response
from libs.cass_auth.connect import get_secured_session as get_session
import hashlib      
import re                  
from random import seed, randint
import jwt

from libs.exceptions.auth_exceptions import DatabaseFailedError, InvalidAddressTypeError, InvalidCassUserArgs, UserDoesNotExistError, AddressAlreadyRegisteredError, OtpCodeExpiredError, AddressNotRegisteredError, UserExistsError
from libs.comms.mail_client import MailClient
from libs.comms.text_client import TextClient
from libs.cass_auth.addresses import AddressClient

from libs.cass_auth.profiles.profile_functions import encrypt_username

mc = MailClient()
tc = TextClient()
ac = AddressClient()


# CassUser ///////////////////////////////////////////////////////////////////////////////////////
# ////////////////////////////////////////////////////////////////////////////////////////////////

class _CassUser:
    def __init__(self, pwd: str, uid: str,
                    trusted_devices: list, phone_numbers: list, emails: list, status: str,
                    a1: str, a2: str, q1: str, q2: str, secret: str, username: str = None, encrypted_username: str = None
                ):

        self.__uid = uid
        self.__pwd = pwd
        self.__trusted_devices = trusted_devices
        self.__phone_numbers = phone_numbers
        self.__emails = emails
        self.__status = status
        self.__a1 = a1
        self.__a2 = a2
        self.__q1 = q1
        self.__q2 = q2
        self.__secret = secret

        '''
        Check to see if username or encrypted_username has been passed. If none have, raise error.
        '''
        if username is None and encrypted_username is None: raise InvalidCassUserArgs()
        if username is None: # Get the username stored in the secret
            
            self.__username = secret
            self.__encrypted_username = encrypted_username

        else:
            self.__username = username
                
            username_pepper = os.environ.get('USERNAME_PEPPER')
            prepared_username = username + username_pepper
            digest = hashlib.sha256()
            digest.update(bytes(prepared_username, 'utf-8'))
            final_username = digest.hexdigest()
            self.__encrypted_username = final_username


    def __str__(self):
        l = []
        l.append('\n')
        l.append(f'#################################\n')
        l.append(f'Encrypted Username: {self.encrypted_username}')
        l.append(f'Status: {self.status}')
        l.append(f'Phone numbers: {self.phone_numbers}')
        l.append(f'Alternate emails: {self.emails}')
        l.append(f'Authenticated devices: {self.trusted_devices}')
        l.append(f'\n ################################# \n')
        return '\n'.join(l)


    @property
    def encrypted_username(self) -> str:
        return self.__encrypted_username


    @property
    def username(self) -> str:
        return self.__username


    @property
    def pwd(self) -> str:
        return self.__pwd


    @property
    def uid(self) -> str:
        return self.__uid


    # @property
    # def first_name(self) -> str:
    #     if isinstance(self.__first_name, str): return self.__first_name
    #     else: return self.__first_name.decode('utf-8')


    # @property
    # def last_name(self) -> str:
    #     if isinstance(self.__last_name, str): return self.__last_name
    #     else: return self.__last_name.decode('utf-8')


    @property
    def phone_numbers(self) -> list:
        if self.__phone_numbers is None: self.__phone_numbers = {}
        return self.__phone_numbers


    @property
    def emails(self) -> list:

        if self.__emails is None: self.__emails = {}
        return self.__emails


    @property
    def trusted_devices(self) -> list:
        if self.__trusted_devices is None: self.__trusted_devices = []
        return self.__trusted_devices


    @property
    def status(self) -> str:
        return self.__status


    @property
    def otp_options(self) -> dict:
        options = dict()

        # add phone numbers
        for phone in self.phone_numbers:

            options[phone] = self.phone_numbers[phone]

        # add emails
        for email in self.emails:
            options[email] = self.emails[email]

        return options


    @property
    def verified_addresses(self) -> list:
        addresses = list()

        for phone in self.phone_numbers:
            if self.phone_numbers[phone] == 'verified': addresses.append(phone)

        for email in self.emails:
            if self.emails[email] == 'verified': addresses.append(email)
        
        return addresses


    @property
    def otp_options_client_friendly(self) -> dict:
        # options = dict()
        options = []
        # add phone numbers
        for phone, value in self.phone_numbers.items():
            options.append({ 'id': str(phone[-4:]), 'display': f'Phone number ...{phone[-4:]}', 'status': value })

        # add emails
        for email, value in self.emails.items():
            a, b = email.split('@')
            formatted_email = f'{a[:4]}...@{b}'
            options.append({ 'id': formatted_email, 'display': f'Email {formatted_email}', 'status': value })

        return options


    @property
    def a1(self) -> str:
        if isinstance(self.__a1,bytes):
            return self.__a1.decode('utf-8')
        return self.__a1


    @property
    def a2(self) -> str:
        if isinstance(self.__a2, bytes):
            return self.__a2.decode('utf-8')
        return self.__a2


    @property
    def q1(self) -> str:
        if isinstance(self.__q1, bytes):
            return self.__q1.decode('utf-8')
        return self.__q1


    @property
    def q2(self) -> str:
        if isinstance(self.__q2, bytes):
            return self.__q2.decode('utf-8')
        return self.__q2


    @property
    def secret(self) -> str:
        if isinstance(self.__secret, bytes):
            return self.__secret.decode('utf-8')
        return self.__secret


    def refresh(self) -> object:
        u = _get_user(self.username)
        self.__init__(username=u.username, pwd=u.pwd, uid=self.uid, 
                        trusted_devices=u.trusted_devices, phone_numbers=u.phone_numbers, 
                        emails=u.emails, status=u.status, q1=u.q1, a1=u.a1, q2=u.q2, a2=u.a2, secret=u.secret)
        # return u


    def update_info(self, **fieldArgs) -> bool: # Returns true on success

        master_fernet = Fernet(os.environ.get('MASTER_KEY'))
        with get_session() as session:

            set_args = []
            update_valid = False
            for key, value in fieldArgs.items():
                # if key == 'first_name': 
                #     # first_name_fernet = Fernet(os.environ.get('FIRST_NAME_KEY'))
                #     # encrypted_first_name = first_name_fernet.encrypt(bytes(value, 'utf-8'))        
                #     # final_first_name = master_fernet.encrypt(encrypted_first_name)
                #     # set_args.append(f"first_name = '{final_first_name.decode('utf-8')}'")
                #     set_args.append(f"first_name = '{value}'")
                #     update_valid = True

                # elif key == 'last_name': 
                #     # last_name_fernet = Fernet(os.environ.get('LAST_NAME_KEY'))
                #     # encrypted_last_name = last_name_fernet.encrypt(bytes(value, 'utf-8'))
                #     # final_last_name = master_fernet.encrypt(encrypted_last_name)
                #     # set_args.append(f"last_name = '{final_last_name.decode('utf-8')}'")
                #     set_args.append(f"last_name = '{value}'")
                    
                #     update_valid = True

                # elif key == 'email': 
                #     email_pepper = os.environ.get('EMAIL_PEPPER')
                #     prepared_email = value + email_pepper
                #     digest = hashlib.sha256()
                #     digest.update(bytes(prepared_email, 'utf-8'))
                #     final_email = digest.hexdigest()
                #     set_args.append(f"email = '{final_email}'")
                #     update_valid = True            
                #     self.__email = value
                #     self.__encrypted_email = final_email

                if key == 'pwd': 
                    hashed_password = bcrypt.hashpw(bytes(value, 'utf-8'), bcrypt.gensalt(14))
                    password_fernet = Fernet(os.environ.get('PASSWORD_KEY'))
                    encrypted_password = password_fernet.encrypt(hashed_password)
                    final_password = master_fernet.encrypt(encrypted_password)
                    set_args.append(f"pwd = '{final_password.decode('utf-8')}'")
                    update_valid = True            

                elif key == 'status':
                    set_args.append(f"status = '{value}'")
                    update_valid = True

                # elif key == 'username':
                #     set_args.append(f"username = '{value}'")
                #     update_valid = True
                
            if update_valid:
                set_str = ', '.join(set_args)
                query_str = f"UPDATE users SET {set_str} WHERE username = '{self.encrypted_username}' IF EXISTS"
                
                try:
                    session.execute(query_str)
                    self.refresh()
                    return True
                except Exception as e:
                    raise DatabaseFailedError(e)


    '''
    ADDING PHONE NUMBERS AND EMAILS: dictionary where the phone/email is the key and value is status or whatever information I need to store.
    key: str
    value: str
    '''

    def __upsert_phone_numbers(self, phones: dict) -> bool:
        
        # format phone numbers
        formatted_phones = {}
        for key, value in phones.items(): formatted_phones[ac.format_phone_number(key)] = value
        
        with get_session() as session:
            
            try:
                #session.execute(f"UPDATE users_by_email SET phone_numbers = phone_numbers + ['{str(formatted_phone)}'] WHERE email = '{self.encrypted_email}'")
                session.execute(f"UPDATE users USING TTL 600  SET phone_numbers = phone_numbers + {formatted_phones} WHERE username = '{self.encrypted_username}' IF EXISTS")
                self.refresh()
                return True

            except Exception as e:
                raise DatabaseFailedError(e)


    def remove_phone_numbers(self, phones: set) -> bool:
        # print (f"UPDATE users SET phone_numbers = phone_numbers - {phones} WHERE username = '{self.encrypted_username}' IF EXISTS")
        
        if not isinstance(phones, set): raise TypeError()
        with get_session() as session: 
            try:
                
                session.execute(f"UPDATE users SET phone_numbers = phone_numbers - {phones} WHERE username = '{self.encrypted_username}'")
                self.refresh()
                return True

            except Exception as e:
                raise DatabaseFailedError(e)


    def __upsert_emails(self, emails: dict) -> bool:
        print (emails)
        with get_session() as session:
            # for key, value in emails.items():
            #     if user_exists(key): raise EmailRegisteredAsUsernameError

            try:
                # session.execute(f"UPDATE users_by_email SET alternate_emails = alternate_emails + ['{str(email)}'] WHERE email = '{self.encrypted_email}'")
                
                # print (f"UPDATE users USING TTL 14400 SET emails = emails + {emails} WHERE username = '{self.encrypted_username}' IF EXISTS")
                session.execute(f"UPDATE users USING TTL 14400 SET emails = emails + {emails} WHERE username = '{self.encrypted_username}' IF EXISTS")
                self.refresh()
                return True

            except Exception as e:
                raise DatabaseFailedError(e)


    def remove_emails(self, emails: set) ->bool:
        if not isinstance(emails, set): raise TypeError()

        with get_session() as session:

            try:

                session.execute(f"UPDATE users SET emails = emails - {emails} WHERE username = '{self.encrypted_username}' IF EXISTS")
                self.refresh()
                return True
            except Exception as e:
                raise DatabaseFailedError(e)


    def add_address(self, address: str) -> bool:
                # Check address format
        

        if ac.address_type(address) == 'email':
            # Check if the email is registered
            if ac.is_email_registered(address): raise AddressAlreadyRegisteredError(address)
            
            # Add the email address
            self.__upsert_emails({address: 'unverified'})

            
        elif ac.address_type(address) == 'phone':
            phone = ac.format_phone_number(address)
            # Check if the phone number is registered
            if ac.is_phone_number_registered(phone): raise AddressAlreadyRegisteredError(phone)
                
            # Add the phone number
            self.__upsert_phone_numbers({phone: 'unverified'})
            
        else:
            raise InvalidAddressTypeError(address)
            
        return True
  

    def add_trusted_device(self, device: str) -> bool:
        with get_session() as session:

            try:
                session.execute(f"UPDATE users SET trusted_devices = trusted_devices + ['{str(device)}'] WHERE username = '{self.encrypted_username}'")
                self.refresh()
                return True

            except Exception as e:
                raise DatabaseFailedError(e) 


    def remove_trusted_device(self, device: str) -> bool:

        with get_session() as session:

            try:
                session.execute(f"UPDATE users SET trusted_devices = trusted_devices - ['{str(device)}'] WHERE username = '{self.encrypted_username}'")
                self.refresh()
                return True

            except Exception as e:
                raise DatabaseFailedError(e) 


    def is_device_trusted(self, device: str) -> bool:
        if device in self.trusted_devices: return True
        else: return False


    def check_password(self, pwd):
        # return bcrypt.checkpw(pwd, self.pwd)
        return bcrypt.checkpw(bytes(pwd, 'utf-8'), self.pwd)


    def send_verification(self, address: str) -> bool:
        # Generate code        
        otp_code = randint(100000, 999999)

        
        
        encrypted_otp_code = encrypt_username(otp_code)
        
        
        with get_session() as session:
        
            if ac.address_type(address) == "email":
                disclaimer = "Do not share this code with anyone. This code was generated to verify your account with bizniz.io"
                email_sender = os.environ.get('AUTH_EMAIL_ACCOUNT')
                sender_pwd = os.environ.get('AUTH_EMAIL_PWD')
                
                mc.sendmail("Two factor authentication code", f'Your Code: {otp_code} \n\r\n\r {disclaimer}', email_sender, [address,], sender_pwd)
                ttl_time = 14400
                insert_query = f"INSERT INTO otp_validations (username, address, verified, created_at, otp) VALUES ('{self.encrypted_username}', '{address}', False, toTimeStamp(now()), '{encrypted_otp_code}') USING TTL {ttl_time}"

            elif ac.address_type(address) == "phone":
                tc.send_sms_from_telnyx(ac.format_phone_number(address), f"Your code: {otp_code}. Do not share this code with anyone. Sent by bizniz.io")
                ttl_time = 600

                insert_query = f"INSERT INTO otp_validations (username, address, verified, created_at, otp) VALUES ('{self.encrypted_username}', '{ac.format_phone_number(address)}', False, toTimeStamp(now()), '{encrypted_otp_code}') USING TTL {ttl_time}"
            # update_query = f"UPDATE otp_validations USING TTL {ttl_time} SET otp = {otp_code} WHERE username = '{self.encrypted_username}' and address = '{address}'"
            
        
            print (insert_query)   
            session.execute(insert_query)
        

    def validate_verification(self, code: int, address: str) -> bool:
        
        if ac.is_address_registered(address):

            if ac.address_type(address) == "email":
                users = ac.lookup_usernames_by_email(address)
                for u in users:
                    pass
                    # print (u)
                if users is not None:
                    if not users[0] == self.encrypted_username: raise AddressAlreadyRegisteredError(address)
                
            elif ac.address_type(address) == "phone":
                users = ac.lookup_usernames_by_phone_number(address)
                if users is not None:
                    if not users[0] == self.encrypted_username: raise AddressAlreadyRegisteredError(address)
                

        # get the otp
        with get_session() as session:
            
            address_type = ac.address_type(address)
            if address_type == 'phone':
                # print (f"SELECT otp, verified FROM otp_validations WHERE address = '{ac.format_phone_number(address)}' AND username = '{self.encrypted_username}'")
                results = session.execute(f"SELECT otp, verified FROM otp_validations WHERE address = '{ac.format_phone_number(address)}' AND username = '{self.encrypted_username}'")
            elif address_type == 'email':
                # print (f"SELECT otp, verified FROM otp_validations WHERE address = '{address}' AND username = '{self.encrypted_username}'")
                results = session.execute(f"SELECT otp, verified FROM otp_validations WHERE address = '{address}' AND username = '{self.encrypted_username}'")

            row = None
            for count, r in enumerate(results):
                if count == 0: row = r
                break
            print ('')
            print (row.otp)
            print ('')
            
            if row is None: raise OtpCodeExpiredError()

            try:

                
                if row.otp == encrypt_username(code): # verified
                    
                    if ac.address_type(address) == 'email':
                        session.execute(f"BEGIN BATCH UPDATE users SET emails['{address}'] = 'verified', status = 1 WHERE username = '{self.encrypted_username}'; INSERT INTO verified_addresses (address, username, verified_at) VALUES ('{address}', '{self.encrypted_username}', toTimeStamp(now())); APPLY BATCH")
                        session.execute(f"DELETE FROM otp_validations WHERE address = '{address}' AND username = '{self.encrypted_username}'")
                    
                    elif ac.address_type(address) == 'phone':
                        session.execute(f"BEGIN BATCH UPDATE users SET phone_numbers['{ac.format_phone_number(address)}'] = 'verified', status = 1 WHERE username = '{self.encrypted_username}'; INSERT INTO verified_addresses (address, username, verified_at) VALUES ('{address}', '{self.encrypted_username}', toTimeStamp(now())); APPLY BATCH")
                        session.execute(f"DELETE FROM otp_validations WHERE address = '{ac.format_phone_number(address)}' AND username = '{self.encrypted_username}'")
                    
                    self.refresh()
                    return True
            except Exception as e:
                print ('')
                print ('')
                print ('')
                print (e)
                print ('')
                print ('')
                print ('')
                return False

            # Code was not valid
            return False


    def get_full_address(self, partial_address: str) -> str:
        for key, value in self.otp_options.items():
            try:
                a, b = key.split('@')
                formatted_email = f'{a[:4]}...@{b}'
            except:
                formatted_email = None
            if key[-4:] == partial_address or formatted_email == partial_address: return key

        raise AddressNotRegisteredError(f'Partial address: {partial_address}')


    def verify_username_recovery(self, a1: str, a2: str) -> bool:
        if a1 == self.a1 and a2 == self.a2: return True
        return False


    def add_secrets(self, q1: str, a1: str, q2: str, a2: str) -> bool:
        try:
            with get_session() as session:
                update_query = f"UPDATE users SET q1 = '{q1}', a1 = '{a1}', q2 = '{q2}', a2 = '{a2}' WHERE username = '{self.encrypted_username}'"
                session.execute(update_query)
        except Exception as e:
            return False

        return True


    def send_message(self, message: str, address: str) -> bool:
        
            if ac.address_type(address) == "email":
                email_sender = os.environ.get('AUTH_EMAIL_ACCOUNT')
                sender_pwd = os.environ.get('AUTH_EMAIL_PWD')
                mc.sendmail("Message from bizniz.io", message, email_sender, [address,], sender_pwd)
        
            elif ac.address_type(address) == "phone":
                tc.send_sms_from_telnyx(ac.format_phone_number(address), message)


    def has_phone_number(self, address: str) -> bool:
        if ac.format_phone_number(address) in list(self.phone_numbers.keys()): return True
        return False

    def change_password(self, current_password: str, new_password: str) -> bool:
        if self.check_password(current_password):
            self.update_info(pwd=new_password)
            return True

        return False
# END CassUser ///////////////////////////////////////////////////////////////////////////////////
# ////////////////////////////////////////////////////////////////////////////////////////////////


def _create_user(username: str, password: str,
                    q1: str, a1: str, q2: str, a2: str,
                    phone_numbers: list=None, trusted_devices: list=None, 
                    ) -> object:

    # Check to see if user exists
    if UserModel().exists(username): raise UserExistsError

    if phone_numbers == None: phone_numbers = []
    if trusted_devices == None: trusted_devices = []
    
    username_pepper = os.environ.get('USERNAME_PEPPER')
    prepared_username = username + username_pepper
    digest = hashlib.sha256()
    digest.update(bytes(prepared_username, 'utf-8'))
    final_username = digest.hexdigest()
    
    hashed_password = bcrypt.hashpw(bytes(password, 'utf-8'), bcrypt.gensalt(14))
    password_fernet = Fernet(os.environ.get('PASSWORD_KEY'))
    encrypted_password = password_fernet.encrypt(hashed_password)

    q1_fernet = Fernet(os.environ.get('Q1_KEY'))
    encrypted_q1 = q1_fernet.encrypt(bytes(q1, 'utf-8'))
    
    a1_fernet = Fernet(os.environ.get('A1_KEY'))
    encrypted_a1 = a1_fernet.encrypt(bytes(a1, "utf-8"))

    q2_fernet = Fernet(os.environ.get('Q2_KEY'))
    encrypted_q2 = q2_fernet.encrypt(bytes(q2, "utf-*"))

    a2_fernet = Fernet(os.environ.get('A2_KEY'))
    encrypted_a2 = a2_fernet.encrypt(bytes(a2, "utf-8"))

    secret_fernet = Fernet(os.environ.get('SECRET_KEY'))
    encrypted_secret = secret_fernet.encrypt(bytes(username, "utf-8"))

    '''Final encryption!!!!!'''
    master_fernet = Fernet(os.environ.get('MASTER_KEY'))
    final_password = master_fernet.encrypt(encrypted_password)
    final_q1 = master_fernet.encrypt(encrypted_q1)
    final_a1 = master_fernet.encrypt(encrypted_a1)
    final_q2 = master_fernet.encrypt(encrypted_q2)
    final_a2 = master_fernet.encrypt(encrypted_a2)
    final_secret = master_fernet.encrypt(encrypted_secret)

    with get_session() as session:
       
       session.execute(f'''INSERT INTO users (uid, username, pwd, status, q1, a1, q2, a2, secret, terms_accepted_at) VALUES (
                            uuid(), 
                            '{final_username}', 
                            '{final_password.decode('utf-8')}', 
                            0,
                            '{final_q1.decode('utf-8')}',
                            '{final_a1.decode('utf-8')}',
                            '{final_q2.decode('utf-8')}',
                            '{final_a2.decode('utf-8')}',
                            '{final_secret.decode('utf-8')}',
                            toTimeStamp(now())
                        ) IF NOT EXISTS''')
       

    # Check to see if there is an account to associate with
    return _get_user(username=username)


def encrypted_username_exists(encrypted_username: str) -> bool:
    with get_session() as session:
        results = session.execute(f'''SELECT uid, username, pwd, trusted_devices, phone_numbers,
                                    status, emails, a1, a2, q1, q2, secret 
                                    FROM users WHERE username = '{encrypted_username}'
                                    ''')

    row_count = 0
    for count, r in enumerate(results):
        if count == 0: row = r
        row_count += 1

        if row_count == 0:
            return False

        return True


def user_exists(username: str) -> bool:
    try:
        my_user = _get_user(username)
        return True

    except UserDoesNotExistError as e:
        return False


def _get_user(username: str, encrypted: bool = False) -> object:
    
    if not encrypted:
        username_pepper = os.environ.get('USERNAME_PEPPER')
        prepared_username = username + username_pepper
        digest = hashlib.sha256()
        digest.update(bytes(prepared_username, 'utf-8'))
        final_username = digest.hexdigest()
    else:
        final_username = username

    with get_session() as session:

        results = session.execute(f'''SELECT uid, username, pwd, trusted_devices, phone_numbers,
                                    status, emails, a1, a2, q1, q2, secret
                                    FROM users WHERE username = '{final_username}'
                                    ''')
        
        row_count = 0
        for count, r in enumerate(results):
            if count == 0: row = r
            row_count += 1


        if row_count == 0:
            
            raise UserDoesNotExistError(username)



        master_fernet = Fernet(os.environ.get('MASTER_KEY'))
        
        password_fernet = Fernet(os.environ.get('PASSWORD_KEY'))
        decrypted_password = master_fernet.decrypt(bytes(row.pwd, 'utf-8'))
        final_password = password_fernet.decrypt(decrypted_password)

        
        row_a1 = ''
        final_a1 = ''
        if row.a1 is not None: 
            row_a1 = row.a1
            a1_fernet = Fernet(os.environ.get('A1_KEY'))
            decrypted_a1 = master_fernet.decrypt(bytes(row_a1, "utf-8"))
            final_a1 = a1_fernet.decrypt(decrypted_a1)
        
        
        row_2 = ''
        final_a2 = ''
        if row.a2 is not None: 
            row_a2 = row.a2
            a2_fernet = Fernet(os.environ.get('A2_KEY'))
            decrypted_a2 = master_fernet.decrypt(bytes(row_a2, "utf-8"))
            final_a2 = a2_fernet.decrypt(decrypted_a2)
        
        row_q1 = ''
        final_q1 = ''
        if row.q1 is not None: 
            row_q1 = row.q1
            q1_fernet = Fernet(os.environ.get('Q1_KEY'))
            decrypted_q1 = master_fernet.decrypt(bytes(row_q1, "utf-8"))
            final_q1 = q1_fernet.decrypt(decrypted_q1)
        
        row_q2 = ''
        final_q2 = ''
        if row.q2 is not None: 
            row_q2 = row.q2
            q2_fernet = Fernet(os.environ.get('Q2_KEY'))
            decrypted_q2 = master_fernet.decrypt(bytes(row_q2, "utf-8"))
            final_q2 = q2_fernet.decrypt(decrypted_q2)
        
        row_secret = ''
        final_secret = ''
        if row.secret is not None:
            row_secret = row.secret
            secret_fernet = Fernet(os.environ.get('SECRET_KEY'))
            decrypted_secret = master_fernet.decrypt(bytes(row_secret, "utf-8"))
            final_secret = secret_fernet.decrypt(decrypted_secret).decode('utf-8')
        
        uid = row.uid
        trusted_devices = row.trusted_devices
        
        phones_dict = {}
        if row.phone_numbers is None: phone_numbers = {}
        elif row.phone_numbers is not None:
            for key, value in row.phone_numbers.items():
                phones_dict[ac.format_phone_number(key)] = value
            phone_numbers = phones_dict
        
        emails_dict = {}
        if row.emails is None: emails = {}
        elif row.emails is not None:
            for key, value in row.emails.items():
                emails_dict[key] = value
            emails = emails_dict
        
        # Ancillary fields not related to account creation or authentication
        status = row.status
        if not encrypted:
            return _CassUser(username=username, pwd=final_password, uid=uid,
                                trusted_devices=trusted_devices, phone_numbers=phone_numbers, 
                                emails=emails, status=status,
                                a1=final_a1, a2=final_a2, q1=final_q1, q2=final_q2, secret=final_secret,
                                
                            )
        elif encrypted:
            return _CassUser(pwd=final_password, uid=uid, 
                                trusted_devices=trusted_devices, phone_numbers=phone_numbers, 
                                encrypted_username=final_username, emails=emails, status=status,
                                a1=final_a1, a2=final_a2, q1=final_q1, q2=final_q2, secret=final_secret,
                                
                            )


def _get_encrypted_user(encrypted_username: str) -> object:
    return _get_user(encrypted_username, True)    


def _delete_user(username: str) -> bool:

    my_user = UserModel().get(username)
    with get_session() as session:
        # Delete the associated addresses
        for key, value in my_user.phone_numbers.items():
            delete_addresses_query = f"DELETE FROM verified_addresses WHERE username = '{my_user.encrypted_username}' AND address = '{key}'"    
            session.execute(delete_addresses_query)

        for key, value in my_user.emails.items():
            delete_addresses_query = f"DELETE FROM verified_addresses WHERE username = '{my_user.encrypted_username}' AND address = '{key}'"    
            session.execute(delete_addresses_query)

        # # Delete the profile
        # delete_profile_query = f"DELETE FROM *_by_username WHERE username = '{my_user.encrypted_username}'"
        # session.execute(delete_profile_query)

        # Delete the user
        try:
            session.execute(f"DELETE FROM users where username = '{my_user.encrypted_username}'")
            return True
        except Exception as e:
            return False

        
def return_encrypted_users_from_list(l: list) -> list:
    return [_get_encrypted_user(uname) for uname in l]


def return_users_from_list(l: list) -> list:

    return [_get_user(uname) for uname in l]


def send_username_recovery(address: str) -> bool:

    # Get the username from the address
    try:
        my_user = UserModel().get(address)
        my_user.send_verification(address)
        return True
    except:
        return False



class UserModel:
    def __init__(self):
        pass

    @staticmethod
    def get(*args) -> object:
        
        if user_exists(args[0]): # Username was passed
            return _get_user(args[0])

        if encrypted_username_exists(args[0]):
            return _get_encrypted_user(args[0])

        try:
            if ac.is_address_registered(args[0]):
                return _get_encrypted_user(ac.lookup_username_by_address(args[0]))

        except Exception as e:
            pass

        raise UserDoesNotExistError(args[0])

    @staticmethod
    def create(username: str, password: str,
                    q1: str, a1: str, q2: str, a2: str,
                    **fieldArgs
                ) -> object:

        for key, value in fieldArgs.items():
            pass
            # if key == 'first_name': first_name = value
            # elif key == 'last_name': last_name = value
        
        return _create_user(username=username, password=password, q1=q1, q2=q2, a1=a1, a2=a2)

    
    # def create_with_profile(self, username: str, password: str, q1: str, a1: str, q2: str, a2: str, first_name: str, last_name: str, **fieldArgs):
        
    #     my_user = self.create(username=username, password=password, q1=q1, a1=a1, q2=q2, a2=a2)
        
    #     # PROFILE INFORMATION /////////////////////////////////////////////////////////////////////////////////////////////
    #     set_args = []
    #     set_args.append(f"first_name = '{first_name}'")
    #     set_args.append(f"last_name = '{last_name}'")
    
    #     for key, value in fieldArgs.items():
    #         if key == 'middle_name': 
    #             set_args.append(f"middle_name = '{value}'")
        
    #         elif key == 'suffix':
    #             set_args.append(f"suffix = '{value}'")
        
    #         elif key == 'gender':
    #             set_args.append(f"gender = '{value}'")
        
    #     with get_session() as session:
    #         set_str = ', '.join(set_args)
    #         query_str = f"UPDATE *_by_username SET {set_str} WHERE username = '{my_user.encrypted_username}'"
            
    #         try:
    #             session.execute(query_str)
                
    #         except Exception as e:
    #             raise DatabaseFailedError(e)

    #         return my_user
        
        
    @staticmethod
    def delete(*args) -> bool:
        if encrypted_username_exists(args[0]): return _delete_user(args[0])
        if user_exists(args[0]): return _delete_user(args[0])
        
        # if ac.is_address_registered(args[0]): return _delete_user(ac.lookup_username_by_address(args[0]))
        
        return False

    @staticmethod
    def exists(*args, ) -> bool:
        try:
            if encrypted_username_exists(args[0]): return True
            if user_exists(args[0]): return True
            if ac.is_address_registered(args[0]): return True
            return False
        except:
            return False

    @staticmethod
    def username_exists(username: str) -> bool:
        return user_exists(username)
    
    @staticmethod
    def encrypted_username_exists(username: str) -> bool:
        return encrypted_username_exists(username)