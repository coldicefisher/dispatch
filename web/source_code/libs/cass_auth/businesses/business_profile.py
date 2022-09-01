from libs.cass_auth.connect import get_secured_session as get_session
from cassandra.encoder import Encoder

from libs.kp_fraydit.class_iterators import ClassIterator
from libs.kp_fraydit.classes import BaseClass

from libs.cass_auth.addresses import AddressClient

from libs.uuid.uuid import convert_string_to_uuid, is_valid_uuid, random_uuid

from libs.cass_auth.profiles.profile_model import ProfileModel

cql_encoder = Encoder()
import uuid


class BusinessProfile(BaseClass):
    def __init__(self, profile_id: uuid.uuid4, has_login: bool, permissions: set, business_name: str, 
                            first_name: str, middle_name: str, last_name: str, full_name: str, suffix: str, deleted: bool, 
                            profile_picture: str = None,
                            association_email: str = None):
        
        self.__profile_id = profile_id
        self.__has_login = has_login
        self.__deleted = deleted
        self.__permissions = permissions
        self.__business_name = business_name
        self.__association_email = association_email
        self.__first_name = first_name
        self.__middle_name = middle_name
        self.__last_name = last_name
        self.__suffix = suffix
        self.__full_name = full_name
        self.__profile_picture = profile_picture

    @property
    def profile_id(self) -> uuid:
        return self.__profile_id


    @property
    def has_login(self) -> bool:
        return self.__has_login

    @property
    def deleted(self) -> bool:
        return self.__deleted


    @property
    def permissions(self) -> set:
        if self.__permissions is None: return set()
        # Add the employee permission
        if "Driver" in self.__permissions or "Human Resources" in self.__permissions or "Assets" in self.__permissions or "Dispatching" or "Owner" in self.__permissions: self.__permissions.add('Employee')
        return self.__permissions

    
    @property
    def business_name(self) -> str:
        return self.__business_name


    @property
    def association_email(self) -> str:
        if self.__association_email is None: return ''
        return self.__association_email


    @property
    def first_name(self) -> str:
        if self.__first_name == 'None': return ''
        return self.__first_name


    @property
    def middle_name(self) -> str:
        if self.__middle_name == 'None': return ''
        return self.__middle_name

    
    @property
    def last_name(self) -> str:
        if self.__last_name == 'None': return ''
        return self.__last_name


    @property
    def suffix(self) -> str:
        if self.__suffix == 'None': return ''
        return self.__suffix


    @property
    def full_name(self) -> str:
        return self.__full_name

    @property
    def profile_picture(self) -> str:
        if self.__profile_picture == 'None': return ''
        return self.__profile_picture
        
# PERMISSIONS //////////////////////////////////////////////////////////////////////////////////
# //////////////////////////////////////////////////////////////////////////////////////////////


    def delete_permissions(self, permissions: set):
        permissions_to_delete = set(self.permissions) - set(permissions)
        
        # format the permissions for profile update
        formatted_permissions = "|".join(permissions_to_delete)
        my_dict = {}
        my_dict[self.business_name] = formatted_permissions
        update_query = f'''BEGIN BATCH 
                UPDATE profiles SET businesses = businesses + {my_dict} WHERE id = {self.profile_id}; 
                UPDATE business_profiles SET permissions = permissions - {permissions} WHERE business_name = '{self.business_name}' AND profile_id = {self.profile_id}; 
                APPLY BATCH'''
        with get_session() as session:
            session.execute(update_query)

        # Set the objects permissions
        self.__permissions = permissions_to_delete


    def add_permissions(self, permissions: set):
        permissions_to_add = set(self.permissions).union(set(permissions))
        
        # format the permissions
        formatted_permissions = "|".join(permissions_to_add)
        my_dict = {}
        my_dict[self.business_name] = formatted_permissions
        update_query = f'''BEGIN BATCH 
                UPDATE profiles SET businesses = businesses + {my_dict} WHERE id = {self.profile_id}; 
                UPDATE business_profiles SET permissions = permissions + {permissions} WHERE business_name = '{self.business_name}' AND profile_id = {self.profile_id}; 
                APPLY BATCH'''
        with get_session() as session:
            session.execute(update_query)

        self.__permissions = permissions_to_add


    def replace_permissions(self, permissions: set):
        my_dict = {}

        # Get the old permissions from profiles
        profile = ProfileModel().get(id=self.profile_id)
        
        for p in profile.businesses:
            if not p.name == self.business_name: my_dict[p.name] = "|".join(p.permissions)

        
        formatted_permissions = "|".join(permissions)

        
        
        
        my_dict[self.business_name] = formatted_permissions
        update_query = f'''BEGIN BATCH 
                UPDATE profiles SET businesses = {my_dict} WHERE id = {self.profile_id}; 
                UPDATE business_profiles SET permissions = {cql_encoder.cql_encode_set_collection(permissions)} WHERE business_name = '{self.business_name}' AND profile_id = {self.profile_id}; 
                APPLY BATCH'''

        with get_session() as session:
            session.execute(update_query)

        self.__permissions = permissions



    def has_permission(self, permissions_to_check: set):
        if len(permissions_to_check) == 0: return False
        for permission in permissions_to_check: 
            if permission in self.permissions: return True

        return False

# END PERMISSIONS //////////////////////////////////////////////////////////////////////////
    def create_recovery_profile_record(self, email: str):
        if AddressClient().is_address_registered(email): return False
        if self.deleted == False: return False

        insert_query = f"INSERT INTO unassociated_profiles (email, business_name, profile_id) VALUES('{email}', '{self.business_name}', {self.profile_id})"
        with get_session() as session:
            session.execute(insert_query)
        return True



    def delete(self) -> bool:
        s = {self.business_name, }
        with get_session() as session:
            delete_query = 'BEGIN BATCH '
            delete_query += f"DELETE FROM business_profiles WHERE business_name = '{self.business_name}' AND profile_id = {convert_string_to_uuid(self.profile_id)}; "
            delete_query += f"UPDATE PROFILES SET businesses = businesses - {s} WHERE id = {convert_string_to_uuid(self.profile_id)}; "
            if not self.association_email == '':
                delete_query += f"DELETE FROM unassociated_profiles WHERE email = '{self.association_email}'; "
            delete_query += f"APPLY BATCH"
            session.execute(delete_query)
        return True

    
    def refresh(self):
        self.__init__(self.profile_id, self.has_login, self.permissions, self.business_name, self.association_email)

# END BUSINESS PROFILE ////////////////////////////////////////////////////////////////////////////////
# /////////////////////////////////////////////////////////////////////////////////////////////////////


class BusinessProfiles(ClassIterator):
    def __init__(self, l = None):
        super().__init__(l, "profile_id")

