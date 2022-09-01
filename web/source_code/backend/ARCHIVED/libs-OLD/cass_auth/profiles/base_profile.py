import os
import hashlib      
import uuid

from datetime import datetime
# from multiprocessing.sharedctypes import Value
import time
import json

from libs.cass_auth.users import _CassUser, UserModel
from libs.cass_auth.connect import get_secured_session as get_session
from libs.exceptions.profile_exceptions import ProfileDoesNotExistError
from cassandra.encoder import Encoder
from libs.exceptions.auth_exceptions import DatabaseFailedError

from libs.cass_auth.profiles.profile_work_history import ProfileWorkHistories, ProfileWorkHistory
from libs.cass_auth.profiles.profile_address import ProfileAddress, ProfileAddresses
from libs.cass_auth.profiles.profile_images import ProfileImage, ProfileImages
from libs.cass_auth.profiles.profiles_businesses import ProfileBusiness, ProfileBusinesses
from libs.cass_auth.users import _create_user
from libs.public_data.users_data import UsersData

from libs.uuid.uuid import is_valid_uuid, convert_string_to_uuid, random_uuid, InvalidUuidError
from libs.cass_auth.profiles.profile_functions import get_id_from_username, get_id_from_encrypted_username, encrypt_username

cql_encoder = Encoder()


class fetchType:
    id = 'id'
    username = 'username' 
    encrypted_username = 'encrypted_username'


class BaseUserProfile:
    def __init__(self, key: str, fetch_type: str = fetchType.id, autoclean_indexes: bool = False):
        # Set the full name for search index
        
        retrieved = False
        self.__full_name = None
        self.__profile_picture = None
        self.__default_business = None

        with get_session() as session:

            if fetch_type == fetchType.username:
                profile_id = get_id_from_username(key)
                
                if profile_id is None: profile_id = get_id_from_encrypted_username(key)
                
                if profile_id is not None:
                    results = session.execute(f'''SELECT first_name, middle_name, last_name, suffix, full_name, gender, 
                                                privacy_status, seeking_status, username, profile_picture, default_business,
                                                addresses, work_history, images, businesses, user_id, id, full_name
                                                FROM profiles WHERE id = {profile_id}
                                                ''')
                    
                    row_count = 0
                    for count, r in enumerate(results):
                        if count == 0: row = r
                        row_count += 1
                    
                    if row_count > 0: retrieved = True 
        
            if fetch_type == fetchType.encrypted_username: # Username was not plain text. Try encrypted username
                
                # profile_id = get_id_from_encrypted_username(key)
                # if profile_id is None: profile_id = get_id_from_username(key)
                # print (profile_id)
                # if profile_id is not None:
                select_query = f"SELECT first_name, middle_name, last_name, full_name, suffix, gender, privacy_status, seeking_status, username, profile_picture, default_business, addresses, work_history, images, businesses, user_id, id, full_name FROM profiles WHERE username = '{key}'"
                
                results = session.execute(select_query)
            
                row_count = 0
                for count, r in enumerate(results):
                    if count == 0: row = r
                    row_count += 1
                
                if row_count > 0: retrieved = True

            if fetch_type == 'id': 
                if is_valid_uuid(key):
                    select_query = f'''SELECT first_name, middle_name, last_name, full_name, suffix, gender, 
                                                privacy_status, seeking_status, username, profile_picture, default_business,
                                                addresses, work_history, images, businesses, user_id, id
                                                FROM profiles WHERE id = {convert_string_to_uuid(key)}
                                                '''
                    results = session.execute(select_query)
                    
                    row_count = 0
                    for count, r in enumerate(results):
                        if count == 0: row = r
                        row_count += 1
                    
                    if row_count > 0: retrieved = True
            # END CHECKING THE DATABASE FOR PROFILES ////////////////////////////////////////////////
                
            # Return none if profile not found
            if not retrieved:
                # if autoclean_indexes: 
                #     # Delete any profile username associations
                #     delete_profile_username_index(key)
                #     delete_profile_username_index(encrypt_username(key))
                raise ProfileDoesNotExistError(key)
                
                
            elif retrieved:
                self.__first_name = row.first_name
                self.__middle_name = row.middle_name
                self.__last_name = row.last_name
                self.__suffix = row.suffix
                self.__full_name_db = row.full_name
                self.__gender = row.gender
                self.__privacy_status = row.privacy_status
                self.__seeking_status = row.seeking_status
                self.__addresses = row.addresses
                self.__work_histories = row.work_history
                self.__images = row.images
                self.__businesses = row.businesses
                self.__user_id = row.user_id
                self.__id = row.id
                self.__username = row.username
                self.__profile_picture_db = row.profile_picture
                self.__default_business = row.default_business
                # Get the underlying user
                self.create_full_name_index()
                self.profile_picture
        
    
    def __str__(self):
        l = []
        l.append('\n')
        l.append(f'#################################\n')
        l.append(f'id: {self.id}')
        l.append(f'Name: {self.first_name} {self.middle_name} {self.last_name} {self.suffix}')
        l.append(f"Full name: {self.full_name}")
        l.append(f"Profile picture: {self.profile_picture}")
        l.append(f'Username: {self.username}')
        l.append(f"Businesses: {self.serialized_businesses}")
        l.append(f"Permissions: {self.serialized_permissions}")
        l.append(f"Images: {self.serialized_images}")
        l.append(f"Addresses: {self.serialized_addresses}")
        l.append(f"Work history: {self.serialized_work_histories}")
        l.append(f'\n ################################# \n')
        return '\n'.join(l)
    

    @property
    def id(self):
        # return convert_string_to_uuid(self.__id)
        return self.__id


    @property
    def username(self):
        return self.__username


    @property
    def user_id(self):
        return self.__user_id


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


    def create_full_name_index(self):
        full_name = self.first_name
        if not self.__middle_name == 'None' and not self.__middle_name == '' and not self.__middle_name is None: full_name += " " + self.middle_name
        full_name += " " + self.last_name
        if not self.__suffix == 'None' and not self.__suffix == '' and not self.__suffix is None: full_name += " " + self.suffix
        
        if not full_name == self.__full_name_db: self.update_profile_info(full_name=full_name)
        

    @property
    def full_name(self):
        full_name = self.first_name
        if not self.__middle_name == 'None' and not self.__middle_name == '' and not self.__middle_name is None: full_name += " " + self.middle_name
        full_name += " " + self.last_name
        if not self.__suffix == 'None' and not self.__suffix == '' and not self.__suffix is None: full_name += " " + self.suffix
        
        if not full_name == self.__full_name_db: self.update_profile_info(full_name=full_name)
        
        return full_name


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
    def default_business(self):
        if self.__default_business is None or self.__default_business == 'None': return ''
        return self.__default_business

    @property
    def addresses(self) -> list:
        if self.__addresses is None: return []
        if len(self.__addresses) == 0: return []
        l = ProfileAddresses()
        for key, value in self.__addresses.items():
            l.append(ProfileAddress(key, value))
        return l


    @property
    def images(self) -> list:
        if self.__images is None: return []
        if len(self.__images) == 0: return []
        l = ProfileImages()
        for key, value in self.__images.items():
            l.append(ProfileImage(key, value))

        return l

    @property
    def profile_picture(self) -> str:
        for image in self.images:
            if image.image_type == 'profileActive':

                if not image.cdn_url == self.__profile_picture_db: 
                    self.update_profile_info(profile_picture=image.cdn_url)
        
                return image.cdn_url


    @property
    def new_work_history_id(self) -> int:
        if self.__work_histories is None: return 0
        if len(self.__work_histories) == 0: return 0
        last_key = sorted(self.__work_histories)[-1]
        return int(last_key) + 1


    @property
    def new_address_id(self) -> int:
        if self.__addresses is None: return 0
        if len(self.__addresses) == 0: return 0
        last_key = sorted(self.__addresses)[-1]
        return int(last_key) + 1


    @property
    def new_image_id(self) -> int:
        if self.__images is None: return 0
        if len(self.__images) == 0: return 0
        last_key = sorted(self.__images)[-1]
        return int(last_key) + 1


    @property
    def work_histories(self):
        if self.__work_histories is None: return []
        if len(self.__work_histories) == 0: return []
        l = ProfileWorkHistories()
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
                    'mimeType': a.mime_type,
                    'size': a.size
                }
            })
        
        return d

    
    @property
    def businesses(self):
        if self.__businesses is None: return ProfileBusinesses()
        if len(self.__businesses) == 0: return ProfileBusinesses()
        l = ProfileBusinesses()
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
        l = set()
        for b in self.businesses:
            for p in b.formatted_permissions:
                l.add(p)
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

    def has_permission(self, business_name: str, permissions_to_check: set) -> bool:
        if isinstance(permissions_to_check, str): 
            perm = permissions_to_check
            permissions_to_check = set()
            permissions_to_check.add(perm)
        elif isinstance(permissions_to_check, set) and len(permissions_to_check) == 0: return False
        my_permissions = set()
        try:
            for p in permissions_to_check: my_permissions.add(f"{business_name}.{p}")
            
            for permission in self.permissions:
                if permission in my_permissions: return True

        except: return False
        return False


    def refresh(self) -> object:
        self.__init__(self.id, fetchType.id)
        

    def update_profile_info(self, **fieldArgs) -> bool: # Returns true on success
        create_index = False
        update_business_profiles = False
        set_biz_args = []
        
        
        with get_session() as session:

            set_args = []
            update_valid = False
            
            for key, value in fieldArgs.items():
                if key == 'first_name':
                    set_args.append(f"first_name = '{value}'")
                    update_valid = True
                    create_index = True
                    update_business_profiles = True
                    set_biz_args.append(f"first_name = '{value}'")

                elif key == 'middle_name': 
                    set_args.append(f"middle_name = '{value}'")
                    update_valid = True
                    update_business_profiles = True
                    set_biz_args.append(f"middle_name = '{value}'")
                    
                elif key == 'last_name':
                    set_args.append(f"last_name = '{value}'")
                    update_valid = True
                    create_index = True
                    update_business_profiles = True
                    set_biz_args.append(f"last_name = '{value}'")

                elif key == 'suffix': 
                    set_args.append(f"suffix = '{value}'")
                    update_valid = True
                    update_business_profiles = True
                    set_biz_args.append(f"suffix = '{value}'")

                elif key == 'full_name': 
                    set_args.append(f"full_name = '{value}'")
                    update_valid = True
                    update_business_profiles = True
                    set_biz_args.append(f"full_name = '{value}'")
                
                elif key == 'profile_picture': 
                    set_args.append(f"profile_picture = '{value}'")
                    update_valid = True
                    update_business_profiles = True
                    set_biz_args.append(f"profile_picture = '{value}'")

                elif key == 'gender': 
                    set_args.append(f"gender = '{value}'")
                    update_valid = True

                elif key == 'privacy_status':
                    set_args.append(f"privacy_status = '{value}'")
                    update_valid = True

                elif key == 'seeking_status':
                    set_args.append(f"seeking_status = '{value}'")
                    update_valid = True

                elif key == 'default_business':
                    set_args.append(f"default_business = '{value}'")
                    update_valid = True
                    
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
                    for i in l:
                        image = ProfileImage.from_dict(i)
                        if image.image_type == 'profileActive':
                            set_biz_args.append(f"profile_picture = '{image.cdn_url}'")
                            update_business_profiles = True
                
                # BUSINESSES ARE CONTROLLED ONLY BY BUSINESS MODEL!!!!
                # elif key == 'businesses':
                #     l = []
                #     if not isinstance(value, list): l.append(value)
                #     else: l = value
                #     il = convert_businesses_list(l)
                #     set_args.append(f"businesses = {cql_encoder.cql_encode_map_collection(il)}")
                #     update_valid = True

                    
            if update_valid:
                
                set_str = ', '.join(set_args)
                query_str = f"UPDATE profiles SET {set_str} WHERE id = {self.id} IF EXISTS"
                     
                try:
                    session.execute(query_str)
                    
                except Exception as e:
                    raise DatabaseFailedError(e)

            # if create_index:
            #     self.create_search_index()

            # Update the business profiles
            if update_business_profiles:
                set_biz_str = ', '.join(set_biz_args)
                update_biz_query = 'BEGIN BATCH '
                for business in self.businesses:
                    update_biz_query += f"UPDATE business_profiles SET {set_biz_str} WHERE business_name = '{business.name}' and profile_id = {self.id}; "
                update_biz_query += "APPLY BATCH"
                session.execute(update_biz_query)

            self.refresh()
            return True


    # def create_search_index(self):
    #     UsersData().create_search_index(self.first_name[:4], self.first_name, self.middle_name, self.last_name,
    #                                 self.suffix, f"{self.first_name} {self.middle_name} {self.last_name} {self.suffix}",
    #                                 self.user_id)


    def upsert_profile_address(self, address: ProfileAddress) -> bool:
        if address.id is None: address.id = self.new_address_id
        with get_session() as session:
            
            try:
                session.execute(f"UPDATE profiles SET addresses = addresses + {address.dict_format} WHERE id = {self.id} IF EXISTS")
                self.refresh()
                return True

            except Exception as e:       
                print (e)
                raise DatabaseFailedError(e)


    def upsert_work_history(self, work_history: ProfileWorkHistory) -> bool:
        if work_history.id is None: work_history.id = self.new_work_history_id

        if not isinstance(work_history, ProfileWorkHistory): raise TypeError()
        
        with get_session() as session:
            try:
                session.execute(f"UPDATE profiles SET work_history = work_history + {work_history.dict_format} WHERE id = {self.id} IF EXISTS")
                self.refresh()
                return True

            except Exception as e:
                raise DatabaseFailedError(e)


    def upsert_images(self, image: ProfileImage) -> bool:
        if image.id is None: image.id = self.new_image_id
        with get_session() as session:

            try:
                upsert_query = f"UPDATE profiles SET images = images + {image.dict_format} WHERE id = {self.id} IF EXISTS"
                # print ('UPSERT IMAGE QUERY:')
                # print (upsert_query)
                # print ('//////////////////////////////////////////////////////')
                # print ('')
                session.execute(upsert_query)
                self.refresh()
                return True
            except Exception as e:
                raise DatabaseFailedError(e)


    def remove_profile_address(self, address: ProfileAddress) -> bool:
        
        if not isinstance(address, ProfileAddress): raise TypeError()
        with get_session() as session: 
            try:
                s = {address.id,}
                session.execute(f"UPDATE profiles SET addresses = addresses - {s} WHERE id = {self.id}")
                self.refresh()
                return True

            except Exception as e:
                raise DatabaseFailedError(e)

    
    def remove_work_history(self, work_history: ProfileWorkHistory) -> bool:
        
        if not isinstance(work_history, ProfileWorkHistory): raise TypeError()
        s = {work_history.id, }
        with get_session() as session: 
            try:
                session.execute(f"UPDATE profiles SET work_history = work_history - {s} WHERE id = {self.id}")
                self.refresh()
                return True

            except Exception as e:
                raise DatabaseFailedError(e)


    def remove_images(self, images: ProfileImage) -> bool:
        if not isinstance(images, ProfileImage): raise TypeError()
        s = {images.id, }
        with get_session() as session:
            try:
                session.execute(f"UPDATE profiles SET images = images - {s} WHERE id = {self.id}")
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
            
            # try:
                w = ProfileWorkHistory.from_dict(item)
                if w.dict_format is not None: d = {**d, **w.dict_format}
            # except:
            #     pass

        return d

    
def convert_address_list(l: list):
        d = dict()
        for item in l:
            w = ProfileAddress.from_dict(item)
            if w.dict_format is not None: d = {**d, **w.dict_format}
            
        return d


def convert_images_list(l: list):
    d = dict()
    for item in l:
        try:
            w = ProfileImage.from_dict(item)
            if w.dict_format is not None: d = {**d, **w.dict_format}
        except:
            pass

    return d

def convert_businesses_list(l: list) -> dict:
    d = dict()
    for item in l:
        try: 
            w = ProfileBusiness.from_dict(item)
            if w.dict_format is not None: d = {**d, **w.dict_format}
        except:
            pass
        return d