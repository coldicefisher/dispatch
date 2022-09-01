
from datetime import datetime
# from multiprocessing.sharedctypes import Value
import time
import json

from libs.cass_auth.users import _CassUser, UserModel
from libs.exceptions.auth_exceptions import UserDoesNotExistError
from libs.cass_auth.connect import get_secured_session as get_session

from cassandra.encoder import Encoder
from libs.exceptions.auth_exceptions import DatabaseFailedError

from libs.cass_auth.profiles.profile_work_history import ProfileWorkHistory
from libs.cass_auth.profiles.profile_address import ProfileAddress

cql_encoder = Encoder()
uModel = UserModel()



class UserProfile(_CassUser):
    def __init__(self, *args):
        # Get the user from the users class
        try:
            u = uModel.get(args[0])
        except UserDoesNotExistError:
            print ('Could not initialize user profile. User does not exist')
        except Exception as e:
            print (f'Error in initiailizing UserProfile: {e}')

        # PROFILE INFORMATION /////////////////////////////////////////////////////////////////////////////////////////////
        with get_session() as session:

            results = session.execute(f'''SELECT middle_name, suffix, gender, addresses, work_history
                                        FROM profiles_by_username WHERE username = '{u.encrypted_username}'
                                        ''')
            
            row_count = 0
            for count, r in enumerate(results):
                if count == 0: row = r
                row_count += 1

            # Create profile
            if row_count == 0: 
                insert_query = (f'''INSERT INTO profiles_by_username (username) VALUES 
                ('{u.encrypted_username}')
                ''')
                session.execute(insert_query)
                self.__middle_name = ''
                self.__suffix = ''
                self.__gender = ''
                self.__addresses = ''
                self.__work_histories = ''
            else:
                self.__middle_name = row.middle_name
                self.__suffix = row.suffix
                self.__gender = row.gender
                
                self.__addresses = row.addresses
                
                self.__work_histories = row.work_history

        # END PROFILE INFORMATION ////////////////////////////////////////////////////////////////////////////////////////
        
        # Initialize the inherited class
        super().__init__(pwd=u.pwd, uid=u.uid, first_name=u.first_name, last_name=u.last_name, trusted_devices=u.trusted_devices, 
                            phone_numbers=u.phone_numbers, emails=u.emails, status=u.status, a1=u.a1, a2=u.a2, q1=u.q1, q2=u.q2, 
                            secret=u.secret, username=u.username, encrypted_username=u.encrypted_username
                        )
        
        
    @property
    def middle_name(self):
        return self.__middle_name
    

    @property
    def suffix(self):
        return self.__suffix


    @property
    def gender(self):
        return self.__gender

    
    @property
    def addresses(self):
        if self.__addresses is None: return []
        if len(self.__addresses) == 0: return []
        l = []
        for key, value in self.__addresses.items():
            l.append(ProfileAddress(key, value))
        return l



    @property
    def new_work_history_id(self) -> int:
        if len(self.__work_histories) == 0: return 1
        last_key = sorted(self.__work_histories)[-1]
        return int(last_key) + 1


    @property
    def new_address_id(self) -> int:
        if len(self.__addresses) == 0: return 1
        last_key = sorted(self.__addresses)[-1]
        return int(last_key) + 1


    @property
    def work_histories(self):
        if self.__work_histories is None: return []
        if len(self.__work_histories) == 0: return []
        l = []
        for key, value in self.__work_histories.items():
            l.append(ProfileWorkHistory(key, value))
        return l


    @property
    def serialized_work_histories(self):
        l_to_sort = []
        l_blank = []
        
        if self.work_histories is None: return []
        if len(self.work_histories) == 0: return []
        for a in self.work_histories:
            if a.end_date is not None:
                l_to_sort.append({
                    'id': a.id,
                    'item': {
                        'id': a.id,
                        'startDate': a.start_date, 
                        'endDate': a.end_date, 
                        'businessName': a.business_name, 
                        'positionsHeld': a.positions_held, 
                        'description': a.description, 
                        'physicalAddress1': a.physical_address1, 
                        'physicalAddress2': a.physical_address2, 
                        'physicalCity': a.physical_city, 
                        'physicalState': a.physical_state, 
                        'physicalZip': a.physical_zip, 
                        'mailingAddress1': a.mailing_address1, 
                        'mailingAddress2': a.mailing_address2, 
                        'mailingCity': a.mailing_city, 
                        'mailingState': a.mailing_state, 
                        'mailingZip': a.mailing_zip,
                        'supervisor': a.supervisor,
                        'phoneNumber': a.phone_number,
                        'email': a.email,
                        'website': a.website

                    }
                })
            else:
                l_blank.append({
                    'id': a.id,
                    'item': {
                        'id': a.id,
                        'startDate': a.start_date, 
                        'endDate': a.end_date, 
                        'businessName': a.business_name, 
                        'positionsHeld': a.positions_held, 
                        'description': a.description, 
                        'physicalAddress1': a.physical_address1, 
                        'physicalAddress2': a.physical_address2, 
                        'physicalCity': a.physical_city, 
                        'physicalState': a.physical_state, 
                        'physicalZip': a.physical_zip, 
                        'mailingAddress1': a.mailing_address1, 
                        'mailingAddress2': a.mailing_address2, 
                        'mailingCity': a.mailing_city, 
                        'mailingState': a.mailing_state, 
                        'mailingZip': a.mailing_zip,
                        'supervisor': a.supervisor,
                        'phoneNumber': a.phone_number,
                        'email': a.email,
                        'website': a.website
                    }
                })

        l_sorted = sorted(l_to_sort, key=lambda item: item['item']['endDate'], reverse=True)
        return l_blank + l_sorted
          
    # @property
    # def dictionary_work_histories(self):
    #     d = {}
    #     for item in self.serialized_work_histories:
    #         d = {**d, **item}
    #     return d


    @property
    def serialized_addresses(self):
        d = []
        if self.addresses is None: return []
        if len(self.addresses) == 0: return []
        for a in self.addresses:
            d.append({
                'id': a.id,
                'startDate': a.start_date, 
                'endDate': a.end_date, 
                'addressType': a.address_type, 
                'address1': a.address1, 
                'address2': a.address2, 
                'city': a.city, 
                'state': a.state, 
                'zip': a.zip
            
            })
        
        return sorted(d, key=lambda item: item["endDate"], reverse=True)
        # return json.dumps(d)

    @property
    def dictionary_addresses(self):
        d = {}
        for item in self.addresses:
            d = {**d, **item}
        return d

            
    def refresh(self) -> object:
        u = uModel.get(self.username)
        self.__init__(u.username)
        # return u

    def update_profile_info(self, **fieldArgs) -> bool: # Returns true on success

        with get_session() as session:

            set_args = []
            update_valid = False
            for key, value in fieldArgs.items():
                if key == 'middle_name': 
                    set_args.append(f"middle_name = {cql_encoder.cql_encode_str(value)}")
                    update_valid = True

                elif key == 'suffix': 
                    set_args.append(f"suffix = {cql_encoder.cql_encode_str(value)}")

                    update_valid = True

                elif key == 'gender': 
                    set_args.append(f"gender = {cql_encoder.cql_encode_str(value)}")
                    update_valid = True

                elif key == 'addresses':
                    if isinstance(value, list): ah = convert_address_list(value)
                    else: ah = value
                    set_args.append(f"addresses = {ah}")
                    update_valid = True


                elif key == 'work_history':
                    l = []
                    if not isinstance(value, list):
                        l.append(value)
                    else: l = value
                    
                    wh = convert_work_history_list(value)

                    print (f'update_profile_info: {wh}')
                    set_args.append(f"work_history = {cql_encoder.cql_encode_map_collection(wh)}")
                    update_valid = True


            if update_valid:
                
                set_str = ', '.join(set_args)
                query_str = f"UPDATE profiles_by_username SET {set_str} WHERE username = '{self.encrypted_username}' IF EXISTS"
                     
                try:
                    session.execute(query_str)
                    self.refresh()
                    return True
                except Exception as e:
                    raise DatabaseFailedError(e)


    def upsert_profile_address(self, address: ProfileAddress) -> bool:
        
        with get_session() as session:
            
            try:
                #session.execute(f"UPDATE users_by_email SET phone_numbers = phone_numbers + ['{str(formatted_phone)}'] WHERE email = '{self.encrypted_email}'")
                session.execute(f"UPDATE profiles_by_username SET addresses = addresses + {address.dict_format} WHERE username = '{self.encrypted_username}' IF EXISTS")
                self.refresh()
                return True

            except Exception as e:       
                raise DatabaseFailedError(e)


    def remove_profile_address(self, address: ProfileAddress) -> bool:
        
        if not isinstance(address, ProfileAddress): raise TypeError()
        with get_session() as session: 
            try:
                s = {address.id,}
                session.execute(f"UPDATE profiles_by_username SET addresses = addresses - {s} WHERE username = '{self.encrypted_username}'")
                self.refresh()
                return True

            except Exception as e:
                raise DatabaseFailedError(e)

    
    def upsert_work_history(self, work_history: ProfileWorkHistory) -> bool:
        
        if not isinstance(work_history, ProfileWorkHistory): raise TypeError()

        with get_session() as session:
            
            try:
                
                session.execute(f"UPDATE profiles_by_username SET work_history = work_history + {work_history.dict_format} WHERE username = '{self.encrypted_username}' IF EXISTS")
                self.refresh()
                return True

            except Exception as e:
                raise DatabaseFailedError(e)

    
    def remove_work_history(self, work_history: ProfileWorkHistory) -> bool:
        
        if not isinstance(work_history, ProfileWorkHistory): raise TypeError()
        s = {work_history.id, }
        with get_session() as session: 
            try:
                session.execute(f"UPDATE profiles_by_username SET work_history = work_history - {s} WHERE username = '{self.encrypted_username}'")
                self.refresh()
                return True

            except Exception as e:
                raise DatabaseFailedError(e)

    
def convert_work_history_list(l: list):
        d = dict()
        for item in l:
            w = ProfileWorkHistory.from_dict(item)
            print (f'Convert work history list: {item}')
            d = {**d, **w.dict_format}

        return d

    
def convert_address_list(l: list):
        d = dict()
        for item in l:
            w = ProfileAddress.from_dict(item)
            print (w.start_date)
            d = {**d, **w.dict_format}

        return d
