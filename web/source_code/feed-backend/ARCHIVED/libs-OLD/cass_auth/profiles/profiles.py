import os
import hashlib      

from datetime import datetime
# from multiprocessing.sharedctypes import Value
import time
import json

from libs.cass_auth.users import _CassUser, UserModel
from libs.cass_auth.ARCHIVED.auth_errors import UserDoesNotExistError, UserExistsError
from libs.cass_auth.connect import get_secured_session as get_session

from cassandra.encoder import Encoder
from libs.cass_auth.ARCHIVED.auth_errors import DatabaseFailedError

from libs.cass_auth.profiles.profile_work_history import ProfileWorkHistory
from libs.cass_auth.profiles.profile_address import ProfileAddress
from libs.cass_auth.profiles.profile_images import ProfileImage
from libs.cass_auth.profiles.profiles_businesses import ProfileBusiness
from libs.cass_auth.users import _create_user


cql_encoder = Encoder()
uModel = UserModel()



class UserProfile(_CassUser):
    def __init__(self, *args):
        # Get the user from the users class
        # try:
        #     u = uModel.get(args[0])
        # except UserDoesNotExistError:
        #     print ('Could not initialize user profile. User does not exist')
        #     raise UserDoesNotExistError(args[0])
        # except Exception as e:
        #     print (f'Error in initiailizing UserProfile: {e}')

            
        retrieved = False
        username_pepper = os.environ.get('USERNAME_PEPPER')
        prepared_username = args[0] + username_pepper
        digest = hashlib.sha256()
        digest.update(bytes(prepared_username, 'utf-8'))
        final_username = digest.hexdigest()
        encrypted_username = final_username

        # PROFILE INFORMATION /////////////////////////////////////////////////////////////////////////////////////////////
        with get_session() as session:

            results = session.execute(f'''SELECT first_name, middle_name, last_name, suffix, gender, 
                                        privacy_status, seeking_status,
                                        addresses, work_history, images, businesses
                                        FROM profiles_by_username WHERE username = '{encrypted_username}'
                                        ''')
            
            row_count = 0
            for count, r in enumerate(results):
                if count == 0: row = r
                row_count += 1
            if row_count > 0: retrieved = True

            if not retrieved: # Username was not plain text. Try encrypted username
                results = session.execute(f'''SELECT first_name, middle_name, last_name, suffix, gender, 
                                        privacy_status, seeking_status,
                                        addresses, work_history, images, businesses
                                        FROM profiles_by_username WHERE username = '{encrypted_username}'
                                        ''')
            
                row_count = 0
                for count, r in enumerate(results):
                    if count == 0: row = r
                    row_count += 1
                
                if row_count > 0: retrieved = True

            if not retrieved: # Profile does not exist. Try creating a profile
                try:
                    u = uModel.get(args[0])
                except UserDoesNotExistError:
                    raise UserDoesNotExistError(args[0])
                
                insert_query = (f'''INSERT INTO profiles_by_username (username) VALUES 
                ('{u.encrypted_username}')
                ''')
                session.execute(insert_query)
                self.__first_name = ''
                self.__middle_name = ''
                self.__last_name = ''
                self.__suffix = ''
                self.__gender = ''
                self.__addresses = ''
                self.__work_histories = ''
                self.__images = ''
                self.__privacy_status = ''
                self.__seeking_status = ''
                self.__businesses = []
            elif retrieved:
                self.__first_name = row.first_name
                self.__middle_name = row.middle_name
                self.__last_name = row.last_name
                self.__suffix = row.suffix
                self.__gender = row.gender
                self.__privacy_status = row.privacy_status
                self.__seeking_status = row.seeking_status
                self.__addresses = row.addresses
                self.__work_histories = row.work_history
                self.__images = row.images
                self.__businesses = row.businesses
                
                # Get the underlying user
                u = uModel.get(args[0])
        # END PROFILE INFORMATION ////////////////////////////////////////////////////////////////////////////////////////
        
        # Initialize the inherited class
        
        super().__init__(pwd=u.pwd, uid=u.uid, trusted_devices=u.trusted_devices, 
                            phone_numbers=u.phone_numbers, emails=u.emails, status=u.status, a1=u.a1, a2=u.a2, q1=u.q1, q2=u.q2, 
                            secret=u.secret, username=u.username, encrypted_username=u.encrypted_username
                        )
        
    
        
    @property
    def first_name(self):
        if self.__first_name == 'None': return ''
        return self.__first_name


    @first_name.setter
    def first_name(self, value: str):
        self.__first_name = value

        # Commit to db
        self.update_profile_info(first_name=value)


    @property
    def middle_name(self):
        if self.__middle_name == 'None': return ''
        return self.__middle_name


    @middle_name.setter
    def middle_name(self, value: str):
        self.__middle_name = value
        # Commit to db
        self.update_profile_info(middle_name=value)


    @property
    def last_name(self):
        if self.__last_name == 'None': return ''
        return self.__last_name


    @last_name.setter
    def last_name(self, value: str):
        self.__last_name = value

        # Commit to db
        self.update_profile_info(last_name=value)


    @property
    def suffix(self):
        if self.__suffix == 'None': return ''
        return self.__suffix


    @suffix.setter
    def suffix(self, value: str):
        self.__suffix = value

        # Commit to db
        self.update_profile_info(suffix=value)


    @property
    def gender(self):
        if self.__gender == 'None': return ''
        return self.__gender

    
    @gender.setter
    def gender(self, value: str):
        self.__gender = value

        # Commit to db
        self.update_profile_info(gender=value)


    @property
    def addresses(self) -> list:
        if self.__addresses is None: return []
        if len(self.__addresses) == 0: return []
        l = []
        for key, value in self.__addresses.items():
            l.append(ProfileAddress(key, value))
        return l


    @property
    def images(self) -> list:
        if self.__images is None: return []
        if len(self.__images) == 0: return []
        l = []
        for key, value in self.__images.items():
            l.append(ProfileImage(key, value))

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
    def new_image_id(self) -> int:
        if len(self.__images) == 0: return 1
        last_key = sorted(self.__images)[-1]
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
        
        if self.work_histories is None: return []
        if len(self.work_histories) == 0: return []
        for a in self.work_histories:
            l_to_sort.append({
                'id': a.id,
                'item': {
                    'id': a.id,
                    'startDate': a.start_date, 
                    'endDate': a.end_date, 
                    'companyName': a.company_name, 
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
        return l_to_sort


    @property
    def serialized_addresses(self):
        d = []
        if self.addresses is None: return []
        if len(self.addresses) == 0: return []
        for a in self.addresses:
            d.append({
                'id': a.id,
                'item': {
                    'id': a.id,
                    'startDate': a.start_date, 
                    'endDate': a.end_date, 
                    'addressType': a.address_type, 
                    'address1': a.address1, 
                    'address2': a.address2, 
                    'city': a.city, 
                    'state': a.state, 
                    'zip': a.zip
                }
            })
        
        return d
        # return json.dumps(d)

    @property
    def serialized_images(self):
        d = []
        if self.images is None: return []
        if len(self.images) == 0: return []
        for a in self.images:
            d.append({
                'id': a.id,
                'item': {
                    'id': a.id,
                    'imageType': a.image_type,
                    'uuid': a.uuid,
                    'originalUrl': a.original_url,
                    'cdnUrl': a.cdn_url,
                    'name': a.name,
                    'mime_type': a.mime_type,
                    'size': a.size
                }
            })
        
        return d

    
    @property
    def businesses(self):
        if self.__businesses is None: return []
        if len(self.__businesses) == 0: return []
        l = []
        for key, value in self.__businesses.items():
            l.append(ProfileBusiness(key, value))
        return l

    
    @property
    def businesses_list(self):
        if len(self.__businesses) == 0: return []
        l = []
        for business in self.businesses:
            l.append(business.name)
        return l


    @property
    def serialized_businesses(self):
        d = []
        if self.businesses is None: return []
        if len(self.businesses) == 0: return []
        for count, a in enumerate(self.businesses):
            d.append({
                'id': count,
                'item': {
                    'id': count,
                    'name': a.name,
                    'permissions': a.permissions
                }
            })
        
        return d


    @property
    def permissions(self):
        l = []
        for b in self.businesses:
            for p in b.formatted_permissions:
                l.append(p)
        return l
    

    @property
    def serialized_permissions(self):
        d = []
        if self.permissions is None: return []
        if len(self.permissions) == 0: return []
        for count, a in enumerate(self.permissions):
            d.append({
                'id': count,
                'item': {
                    'id': count,
                    'fullPermission': a,
                    'business': a.split(".")[0].strip(),
                    'permission': a.split(".")[1].strip(),
                }
            })
        
        return d

    @property
    def permissions_summary(self):
        pass


    def has_permission(self, company_name: str, permissions_to_check: list = []) -> bool:
        my_permissions = []
        for p in permissions_to_check: my_permissions.append(f"{company_name}.{p}")
        
        for permission in self.permissions:
            if permission in my_permissions: return True

        return False


    def add_permission(self, company_name: str, permissions_to_add: list) -> bool:
        # get current permissions and store them in list
        
        permissions_list = []
        if not len(self.businesses) == 0:
            for business in self.businesses:
                if business.name == company_name: 
                    permissions_list = business.permissions            
                    break
        
        # Add missing permissions to list
        for permission in permissions_to_add:
            if f"{company_name}.{permission}" not in self.permissions: permissions_list.append(permission)
        
        formatted_permissions = "|".join(permissions_list)

        with get_session() as session:
            my_dict = {}
            my_dict[company_name] = f"{formatted_permissions}"
            # encoded_map = cql_encoder.cql_encode_map_collection(my_dict)
            
            update_query = f"UPDATE profiles_by_username SET businesses = businesses + {my_dict} WHERE username = '{self.encrypted_username}'"
            
            session.execute(update_query)
            self.refresh()
        return True


    def delete_permission(self, company_name: str, permissions_to_delete: list) -> bool:
        # get current permissions and store them in list
        
        permissions_list = []
        if not len(self.businesses) == 0:
            for business in self.businesses:
                if business.name == company_name: 
                    permissions_list = business.permissions            
                    break
        
        # Add missing permissions to list
        for permission in permissions_to_delete:
            if f"{company_name}.{permission}" in self.permissions: permissions_list.remove(permission)
        
        formatted_permissions = "|".join(permissions_list)

        with get_session() as session:
            my_dict = {}
            my_dict[company_name] = f"{formatted_permissions}"
            # encoded_map = cql_encoder.cql_encode_map_collection(my_dict)
            
            update_query = f"UPDATE profiles_by_username SET businesses = businesses + {my_dict} WHERE username = '{self.encrypted_username}'"
            
            session.execute(update_query)
            self.refresh()
        return True

    def refresh(self) -> object:
        
        # u = ProfileModel().get(self.username)
        self.__init__(self.username)
        # self = u



    def update_profile_info(self, **fieldArgs) -> bool: # Returns true on success

        with get_session() as session:

            set_args = []
            update_valid = False
            for key, value in fieldArgs.items():
                if key == 'first_name':
                    set_args.append(f"first_name = '{value}'")
                    update_valid = True

                elif key == 'middle_name': 
                    set_args.append(f"middle_name = '{value}'")
                    update_valid = True

                elif key == 'last_name':
                    set_args.append(f"last_name = '{value}'")
                    update_valid = True
                    
                elif key == 'suffix': 
                    set_args.append(f"suffix = '{value}'")
                    update_valid = True

                elif key == 'gender': 
                    set_args.append(f"gender = '{value}'")
                    update_valid = True

                elif key == 'privacy_status':
                    set_args.append(f"privacy_status = '{value}'")
                    update_valid = True

                elif key == 'seeking_status':
                    set_args.append(f"seeking_status = '{value}'")


                # MAPS //////////////////////////////////////////////////////////////////////////
                elif key == 'addresses':
                    l = []
                    if not isinstance(value, list): l.append(value)
                    else: l = value
                    ah = convert_address_list(l)
                    set_args.append(f"addresses = {cql_encoder.cql_encode_map_collection(ah)}")
                    update_valid = True

                elif key == 'work_history':
                    l = []
                    if not isinstance(value, list): l.append(value)
                    else: l = value
                    wh = convert_work_history_list(l)
                    set_args.append(f"work_history = {cql_encoder.cql_encode_map_collection(wh)}")
                    update_valid = True

                elif key == 'images':
                    l = []
                    if not isinstance(value, list): l.append(value)
                    else: l = value
                    il = convert_images_list(l)
                    set_args.append(f"images = {cql_encoder.cql_encode_map_collection(il)}")
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
                session.execute(f"UPDATE profiles_by_username SET addresses = addresses + {address.dict_format} WHERE username = '{self.encrypted_username}' IF EXISTS")
                self.refresh()
                return True

            except Exception as e:       
                print (e)
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


    def upsert_images(self, image: ProfileImage) -> bool:

        with get_session() as session:

            try:
                session.execute(f"UPDATE profiles_by_username SET images + {image.dict_format} WHERE username = '{self.encrypted_username}' IF EXISTS")
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


    def remove_images(self, images: ProfileImage) -> bool:
        if not isinstance(images, ProfileImage): raise TypeError()
        s = {images.id, }
        with get_session() as session:
            try:
                session.execute(f"UPDATE profiles_by_username SET images = images - {s} WHERE username = '{self.encrypted_username}")
                self.refresh()
                return True

            except Exception as e:
                raise DatabaseFailedError(e)

# PRIVACY STATUS /////////////////////////////////////////////////////////////////////////////

    @property
    def privacy_status(self) -> str:
        if self.__privacy_status == 'None': return ''
        return self.__privacy_status


    @privacy_status.setter
    def privacy_status(self, value: str):
        self.__privacy_status = value

        # Commit to db
        self.update_profile_info(privacy_status=value)


    @property
    def seeking_status(self):
        if self.__seeking_status == 'None': return ''
        return self.__seeking_status


    @seeking_status.setter
    def seeking_status(self, value: str):
        self.__seeking_status = value

        # Commit to db
        self.update_profile_info(seeking_status=value)


        

# END PRIVACY STATUS /////////////////////////////////////////////////////////////////////////


def convert_work_history_list(l: list):
        d = dict()
        for item in l:
            w = ProfileWorkHistory.from_dict(item)
            d = {**d, **w.dict_format}

        return d

    
def convert_address_list(l: list):
        d = dict()
        for item in l:
            w = ProfileAddress.from_dict(item)
            d = {**d, **w.dict_format}

        return d


def convert_images_list(l: list):
    d = dict()
    for item in l:
        w = ProfileImage.from_dict(item)
        d = {**d, **w.dict_format}

    return d
    

class ProfileModel:
    def __init__(self):
        pass

    @staticmethod
    def get(username: str):
        return UserProfile(username)


    @staticmethod
    def exists(username: str):
        select_query = f"SELECT username from profiles_by_username WHERE username = '{username}'"
        with get_session() as session:
            results = session.execute(select_query)
            row_count = 0
            for count, r in enumerate(results):
                if count == 0: row = r
                row_count += 1

            # Create profile
            if row_count == 0: return False
            return True

        # if UserModel().exists(username): return True
        # return False
            
    
    def create(self, username: str, password: str, q1: str, a1: str, q2: str, a2: str, first_name: str, last_name: str, **fieldArgs):
        
        my_user = _create_user(username=username, password=password, q1=q1, a1=a1, q2=q2, a2=a2)
        

        # PROFILE INFORMATION /////////////////////////////////////////////////////////////////////////////////////////////
        field_args = []
        value_args = []
        field_args.append(f"first_name")
        value_args.append(f"'{first_name}'")
        field_args.append(f"last_name")
        value_args.append(f"'{last_name}'")
        field_args.append(f"user_id")
        value_args.append(f"'{str(my_user.uid)}'")
        field_args.append(f"username")
        value_args.append(f"'{my_user.encrypted_username}'")
        
        for key, value in fieldArgs.items():
            if key == 'middle_name': 
                field_args.append(f"middle_name")
                value_args.append(f"'{value}'")
        
            elif key == 'suffix':
                field_args.append(f"suffix")
                value_args.append(f"'{value}'")
        
            elif key == 'gender':
                field_args.append(f"gender")
                value_args.append(f"'{value}'")
        
        with get_session() as session:
            field_str = ', '.join(field_args)
            value_str = ', '.join(value_args)
            query_str = f"INSERT INTO profiles_by_username ({field_str}) VALUES ({value_str})"
            
            try:
                session.execute(query_str)

            except Exception as e:
                raise DatabaseFailedError(e)

            return UserProfile(my_user.username)
    
    @staticmethod
    def delete(username: str):
        UserModel().delete(username)

