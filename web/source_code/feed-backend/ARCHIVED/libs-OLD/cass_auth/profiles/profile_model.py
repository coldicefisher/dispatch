from datetime import datetime
# from multiprocessing.sharedctypes import Value

from libs.cass_auth.users import UserModel
from libs.cass_auth.connect import get_secured_session as get_session
from libs.exceptions.profile_exceptions import ProfileDoesNotExistError
from libs.cass_auth.profiles.profile_images import ProfileImage
from libs.cass_auth.users import _create_user

from libs.uuid.uuid import is_valid_uuid, convert_string_to_uuid, random_uuid
from libs.cass_auth.profiles.base_profile import BaseUserProfile

from libs.cass_auth.profiles.profile_functions import get_unassociated_account_information
# from libs.cass_auth.profiles.profile_functions import get_id_from_username, get_id_from_encrypted_username
from libs.cass_auth.profiles.profile_functions import get_id_from_username, get_id_from_encrypted_username

from libs.cass_auth.addresses import AddressClient
from libs.exceptions.auth_exceptions import AddressAlreadyRegisteredError, UserDoesNotExistError, UserExistsError

from cassandra.encoder import Encoder

cql_encoder = Encoder()


class fetchType:
    id = 'id'
    username = 'username' 
    encrypted_username = 'encrypted_username'



def convert_images_list(l: list):
    d = dict()
    for item in l:
        try:
            w = ProfileImage.from_dict(item)
            d = {**d, **w.dict_format}
        except:
            pass

    return d
    

class ProfileModel:
    def __init__(self):
        pass


    @staticmethod
    def get(**kwargs):
        if kwargs.get('username') is not None: return BaseUserProfile(kwargs.get('username'), 'username')
        if kwargs.get('encrypted_username') is not None: return BaseUserProfile(kwargs.get('encrypted_username'), 'encrypted_username')
        if kwargs.get('id') is not None: return BaseUserProfile(kwargs.get('id'), 'id')
    # def get(id: str, fetch_type: str = fetchType.id):
        
    #     return BaseUserProfile(id, fetch_type)
        
            

    def create(self, username: str, password: str, q1: str, a1: str, q2: str, a2: str, 
            first_name: str, last_name: str, 
            association_email: str,
            **fieldArgs):
        
        
        my_user = _create_user(username=username, password=password, q1=q1, a1=a1, q2=q2, a2=a2)
        
        '''
            Check to see if association email is passed. Get the associated information.
        '''   
        association_context = 0
        if association_email is not None: 
            try:
                association_id, association_business = get_unassociated_account_information(association_email)
                if is_valid_uuid(association_id):
                    print ('Valid association id')
                    association_context = 1
                    
                else:
                    association_context = 0
            except Exception as e:
                association_context = 0
                    
        
        if association_context > 0:
            '''
                Check to see if a profile already exists and a username is set. If it is return the profile.
                If both the profile and user exists, Update the records and return the profile.

                If the profile exists and no username, set association_context to 2.
                
            '''
            try:
                
                profile = ProfileModel().get(id=association_id)
                
                if profile.username != None: return profile # Return the profile because it has user associated
                
                association_context = 2
                

            except ProfileDoesNotExistError:
                association_context = 1

            except UserDoesNotExistError:
                association_context = 1
            
        if association_context == 2:
            '''
                Existing profile exists and needs to be associated. 
                1.Associated information has already been instantiated
                2. Update profiles (username, privacy_status) 
                3. Update business_profiles (has_login, deleted)
                4. Delete the unassociated_profiles record
                5. Return the refreshed profile
                If this fails. Set the association_context to 0 and create a fresh profile
            '''
        
            if is_valid_uuid(association_id):
                update_query = f"BEGIN BATCH UPDATE profiles SET username = '{my_user.encrypted_username}', privacy_status = 'Private' WHERE id = {profile.id}; "
                update_query += f"UPDATE business_profiles SET has_login = True, deleted = False WHERE business_name = '{association_business}' and profile_id = {profile.id}; "
                update_query += f"DELETE FROM unassociated_profiles WHERE email = '{association_email}'; "
                update_query += f" APPLY BATCH"
                with get_session() as session:
                    session.execute(update_query)
                profile.refresh()
                profile.update_profile_info(first_name=first_name, last_name=last_name)
                
                return profile
            
            else:
                association_context = 0
        # END ASSOCIATE EXISTING PROFILE //////////////////////////////////////////////////////////////////////////////////
        
        

        field_args = []
        value_args = []
        field_args.append(f"first_name")
        value_args.append(f"'{first_name}'")
        field_args.append(f"last_name")
        value_args.append(f"'{last_name}'")
        field_args.append(f"user_id")
        value_args.append(f"{str(my_user.uid)}")
        field_args.append(f"username")
        value_args.append(f"'{my_user.encrypted_username}'")
        field_args.append(f"id")
        
        if association_context > 0: my_id = association_id
        else: my_id = random_uuid()
        value_args.append(str(my_id))

        middle_name = ''
        suffix = ''

        privacy_status = 'Private'

        for key, value in fieldArgs.items():
            if key == 'middle_name': 
                field_args.append(f"middle_name")
                value_args.append(f"'{value}'")
                middle_name = value
        
            elif key == 'suffix':
                field_args.append(f"suffix")
                value_args.append(f"'{value}'")
                suffix = value
        
            elif key == 'gender':
                field_args.append(f"gender")
                value_args.append(f"'{value}'")

            elif key == 'privacy_status': privacy_status = value

        with get_session() as session:
            field_str = ', '.join(field_args)
            value_str = ', '.join(value_args)


            insert_profiles_query = f"INSERT INTO profiles ({field_str}, privacy_status, seeking_status) VALUES ({value_str}, '{privacy_status}', 'Not Looking')"
            # insert_*_by_username_query = f"INSERT INTO *_by_username (profile_id, username) VALUES ({my_id}, '{my_user.encrypted_username}')"
            upsert_search_query = f'''INSERT INTO search_profiles_by_name(search, first_name, middle_name, last_name, suffix, profile_id) 
                    VALUES
                    ('{first_name[:4].lower()}', 
                    '{first_name.lower()}',
                    '{middle_name.lower()}', 
                    '{last_name.lower()}',
                    '{suffix.lower()}', 
                    {str(my_id)}
                    )
                    '''
            if association_context > 0:
                '''
                    Profile needs to be associated.
                    1. Delete the unassociated_profiles record
                    2. Update the business_profiles record: has_login = True, deleted = False
                    3. Insert profiles record
                    4. Insert profiles_by_username record - DEPRECATED
                    5. Insert search_profiles_by_name record
                '''
                batch_query = f'''BEGIN BATCH DELETE FROM unassociated_profiles WHERE email = '{association_email}';
                                UPDATE business_profiles SET has_login = True, deleted = False 
                                WHERE business_name = '{association_business}' AND profile_id = {convert_string_to_uuid(association_id)}; '''
                batch_query += insert_profiles_query
                # batch_query += insert_*_by_username_query + "; " + upsert_search_query + "; APPLY BATCH"
                batch_query +=  + "; APPLY BATCH"
                session.execute(batch_query)
            
            elif association_context == 0:
                '''
                    Create a brand new profile
                    1. Insert profiles record
                    2. Insert profiles_by_username record
                    3. Insert search_profiles_by_name record
                '''
                # batch_query = "BEGIN BATCH " + insert_profiles_query + "; " + insert_*_by_username_query + "; " + upsert_search_query
                batch_query = "BEGIN BATCH " + insert_profiles_query + "; " + upsert_search_query
                batch_query += "; APPLY BATCH"
                session.execute(batch_query)

            my_profile = self.get(id=my_id)
            # my_profile = BaseUserProfile(row.id)
            # Create search indexes
            
            
            
            return my_profile


    def delete(self, **kwargs) -> bool:
        '''
            1. Update the profiles: set the privacy status = Deleted and the username to a blank string
            2. Update the business profiles: set the has_login to False
            3. Delete the users object and associated emails by calling the delete method on the UserModel
        '''
        if kwargs.get('username') is not None:
            temp_id = get_id_from_username(kwargs.get('username'))
            if temp_id is None: return False
            profile_id = convert_string_to_uuid(temp_id)
            key = kwargs.get('username')
            
        if kwargs.get('encrypted_username') is not None:
            temp_id = get_id_from_encrypted_username(kwargs.get('encrypted_username'))
            if temp_id is None: return False
            profile_id = convert_string_to_uuid()
            key = kwargs.get('encrypted_username')

        if kwargs.get('id') is not None:
            profile_id = convert_string_to_uuid(kwargs.get('id'))
            key = kwargs.get('id')
        try:
            profile = self.get(id=profile_id)
        except ProfileDoesNotExistError:
            return True
            
        update_businesses_query = ''
        
        # Update the business profiles table
        for business in profile.businesses:
            update_businesses_query += f"; UPDATE business_profiles SET has_login = False, deleted = True WHERE business_name = '{business.name}' AND profile_id = {profile_id}"
        
        # Update the profiles table
        update_profiles_query = f"BEGIN BATCH UPDATE profiles SET privacy_status = 'Deleted', username = null WHERE id = {profile_id}" 
        delete_query = update_profiles_query + update_businesses_query + "; APPLY BATCH"
        
        with get_session() as session:
            try:
                session.execute(delete_query)
                UserModel().delete(key)
                return True
            except:
                return False

            