import re

from libs.cass_auth.connect import get_secured_session
from libs.exceptions.auth_exceptions import InvalidAddressTypeError, InvalidPhoneNumberError, InvalidEmailError, AddressNotRegisteredError

from libs.kp_fraydit.metaclasses import SingletonMeta



class AddressClient(metaclass=SingletonMeta):

    def __init__(self):
        pass

    @staticmethod
    def address_type(address: str) -> str:
        if address is None: return False

        if address.find('@') == -1: 
            phone = ''.join(re.findall(r'\d+', address))
            
            if not len(phone) == 12 and not len(phone) == 11 and not len(phone) == 10: raise InvalidAddressTypeError(address)
            address_type = 'phone'
        
        else: 
            a, b = address.split('@')
            if b.find('.') == -1: raise InvalidAddressTypeError(address)
            address_type = 'email'
        
        return address_type
        

    def is_phone_number(self, address: str) -> bool:
        if self.address_type(address) == 'phone': return True
        return False

    
    def is_email(self, address: str) -> bool:
        if self.address_type(address) == 'email': return True
        return False

    
    def format_phone_number(self, address: str) -> str:
        
        if not self.address_type(address) == 'phone': raise InvalidAddressTypeError(address)
        phone = ''.join(re.findall(r'\d+', address))
        if len(phone) == 10: phone = f'1{phone}'
        return phone


    def is_phone_number_registered(self, phone: str) -> bool:
        try:
            if not self.is_phone_number(phone): raise InvalidPhoneNumberError
            
            p = self.format_phone_number(phone)

            with get_secured_session() as session:
                results = session.execute(f"SELECT address, username FROM verified_addresses WHERE address = '{p}'")
                
                row_count = 0
                for count, r in enumerate(results):
                    if count == 0: row = r
                    row_count += 1

                if row_count == 0: return False
                return True
        except:
            return False
            

    def is_email_registered(self, email: str) -> bool:
        if not self.is_email(email): raise InvalidEmailError(email)

        with get_secured_session() as session:
            results = session.execute(f"SELECT address, username FROM verified_addresses WHERE address = '{email}'")
             
            row_count = 0
            for count, r in enumerate(results):
                if count == 0: row = r
                row_count += 1

            if row_count == 0: return False
            return True


    def is_address_registered(self, address: str) -> bool:
        if self.is_phone_number(address):
            if self.is_phone_number_registered(self.format_phone_number(address)): return True

        if self.is_email(address):
            if self.is_email_registered(address): return True

        return False


    def is_address(self, address: str) -> bool:
        try:
            if self.address_type(address) is None: return False
            return True
        except:
            return False


    def lookup_usernames_by_phone_number(self, phone: str) -> list:
        if not self.is_phone_number(phone): raise InvalidPhoneNumberError(phone)
        
        phone = self.format_phone_number(phone)

        with get_secured_session() as session:
            results = session.execute(f"SELECT address, username FROM verified_addresses WHERE address = '{phone}'")

            row_count = 0
            users = []
            for count, r in enumerate(results):
                users.append(r.username)
                row_count += 1

            
            if row_count == 0: raise AddressNotRegisteredError(phone)
            return users


    def lookup_usernames_by_email(self, email: str) -> list:
        if not self.is_email(email): raise InvalidEmailError(email)

        with get_secured_session() as session:
            results = session.execute(f"SELECT address, username FROM verified_addresses WHERE address = '{email}'")

            row_count = 0
            users = []
            for count, r in enumerate(results):
                users.append(r.username)
                row_count += 1

            if row_count == 0: raise AddressNotRegisteredError(email)
            return users


    def lookup_username_by_address(self, address: str) -> list:

        if not self.is_address(address): raise InvalidAddressTypeError(address)
        type = self.address_type(address)
        if type == 'phone':
            return self.lookup_usernames_by_phone_number(address)[0]
        
        elif type == 'email':
            return self.lookup_usernames_by_email(address)[0]

        else:
            raise InvalidAddressTypeError(address)
