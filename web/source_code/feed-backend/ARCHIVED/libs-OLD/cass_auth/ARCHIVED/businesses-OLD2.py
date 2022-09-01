from datetime import datetime
from sys import settrace
# from multiprocessing.sharedctypes import Value
import time
import json

from libs.cass_auth.connect import get_secured_session as get_session
from cassandra.encoder import Encoder
from libs.cass_auth.ARCHIVED.auth_errors import DatabaseFailedError
from libs.cass_auth.profiles.profiles import UserProfile, ProfileModel
from libs.cass_auth.profiles.profile_address import ProfileAddress

cql_encoder = Encoder()


class Business:

    def __init__(self, name: str):

        
        self.__name = name
        # PROFILE INFORMATION /////////////////////////////////////////////////////////////////////////////////////////////
        with get_session() as session:

            results = session.execute(f'''SELECT uid, name, dot_number, dot_verified, industry, owner,  
                                        addresses, users
                                        FROM businesses WHERE name = '{name}'
                                        ''')
            
            row_count = 0
            for count, r in enumerate(results):
                if count == 0: row = r
                row_count += 1

            # Create business
            if row_count == 0:
                insert_query = f"INSERT INTO businesses (name) VALUES ('{name}')"
                session.execute(insert_query)

                self.__uid = None
                self.__dot_number = None
                self.__dot_verified = None
                self.__industry = None
                self.__owner = None
                self.__addresses = None
                self.__users = None
            else:
                self.__uid = row.uid
                self.__dot_number = row.dot_number
                self.__dot_verified = row.dot_verified
                self.__industry = row.industry
                self.__owner = row.owner
                self.__addresses = row.addresses
                self.__users = row.users                

    
    @property
    def name(self) -> str:
        return self.__name


    @property
    def uid(self) -> str:
        return str(self.__uid)

    
    @uid.setter
    def uid(self, value: str):
        self.__uid = value

    
    @property
    def dot_number(self) -> str:
        return self.__dot_number


    @dot_number.setter
    def dot_number(self, value: str):
        self.__dot_number = value


    @property
    def dot_verified(self) -> str:
        return self.__dot_verified

    
    @dot_verified.setter
    def dot_verified(self, value: str):
        self.__dot_verified = value


    @property
    def industry(self) -> str:
        return self.__industry


    @industry.setter
    def industry(self, value: str):
        self.__industry = value


    @property
    def owner(self) -> str:
        return self.__owner

    
    @owner.setter
    def owner(self, value: str):
        self.__owner = value


    @property
    def addresses(self):
        pass


    @property
    def users(self):
        if self.__users is None: return []
        if len(self.__users) == 0: return []
        l = []
        for key in self.__users:
            print (key)
            l.append(UserProfile(key))
        return l


    @property
    def addresses(self) -> list:
        if self.__addresses is None: return []
        if len(self.__addresses) == 0: return []
        l = []
        for key, value in self.__addresses.items():
            l.append(ProfileAddress(key, value))
        return l


    def add_user(self, user: str, permissions: list) -> bool:
        with get_session() as session:
            # Add user to business table
            if not ProfileModel().exists(user): return False
            my_set = {user}
            encoded_set = cql_encoder.cql_encode_set_collection(my_set)
            
            update_query = f"UPDATE businesses SET users = users + {encoded_set} WHERE name = '{self.name}'"
            
            session.execute(update_query)

            # Add permissions to user table
            my_user = ProfileModel().get(user)
            my_user.add_permission(self.name, permissions)
            

class BusinessModel:
    def __init__(self):
        pass

    def exists(self, name):
        with get_session() as session:

            results = session.execute(f"SELECT name FROM businesses WHERE name = '{name}'")
            
            row_count = 0
            for count, r in enumerate(results):
                if count == 0: row = r
                row_count += 1

            # Create business
            if row_count == 0: return False
            return True
        

    def get(self, name):
        return Business(name)


    def create(self, name, owner):
        # Check to see if the business exists
        with get_session() as session:
            my_set = {owner}
            encoded_set = cql_encoder.cql_encode_set_collection(my_set)
                    
            # Create business
            insert_query = f"INSERT INTO businesses (name, owner, users, uid) VALUES ('{name}', '{owner}', {encoded_set}, uuid()) IF NOT EXISTS"
            session.execute(insert_query)
        return Business(name)
                
    def delete(self, name):
        try:
            with get_session() as session:

                delete_query = f"DELETE FROM businesses WHERE name = '{name}'"
                session.execute(delete_query)
                return True
        except Exception as e:
            print (f'Failed to delete business {e}')
            return False