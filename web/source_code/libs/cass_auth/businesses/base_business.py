from libs.cass_auth.connect import get_secured_session as get_session
from cassandra.encoder import Encoder
from libs.exceptions.auth_exceptions import AddressAlreadyRegisteredError
# from libs.cass_auth.profiles.profiles import ProfileModel
from libs.cass_auth.profiles.profile_address import ProfileAddress
from libs.cass_auth.profiles.profile_model import ProfileModel
from libs.cass_auth.profiles.base_profile import convert_address_list, convert_images_list
from libs.exceptions.auth_exceptions import DatabaseFailedError

from libs.kp_fraydit.classes import BaseClass
from libs.cass_auth.addresses import AddressClient
from libs.cass_auth.businesses.business_profile import BusinessProfile, BusinessProfiles

from libs.cass_auth.profiles.profile_address import ProfileAddress, ProfileAddresses
from libs.cass_auth.profiles.profile_images import ProfileImage


from libs.uuid.uuid import convert_string_to_uuid, is_valid_uuid, random_uuid

cql_encoder = Encoder()

import uuid

class BaseBusiness(BaseClass):

    def __init__(self, name: str, id: str = None, display_name: str = None, dot_number: str = None, dot_verified: str = None, 
                    industry: str = None, owner: str = None, addresses: list = None, mc_number: str = None, images: list = None,
                    about: str = None
                ):


        self.__name = name
        
        '''
            Check whether all properties are initialized. If so, this was created by the business view for feeds. 
            If not, this is being using as part of the business logic to manage the company's data
        '''
        if id is None or display_name is None or dot_number is None or dot_verified is None or industry is None or owner is None or addresses is None or mc_number is None or images is None or about is None:
            fetched = False
            with get_session() as session:

                results = session.execute(f'''SELECT id, name, display_name, dot_number, dot_verified, industry, owner,  
                                            addresses, mc_number, images, about
                                            FROM businesses WHERE name = '{name}'
                                            ''')
                
                row_count = 0
                for count, r in enumerate(results):
                    if count == 0: row = r
                    row_count += 1
                    
                
                # Create business
                if row_count > 0: fetched = True
                if not fetched:
                    try:
                        results = session.execute(f'''SELECT id, name, display_name, dot_number, dot_verified, industry, owner,  
                                            addresses, mc_number, images, about
                                            FROM businesses WHERE id = {name}
                                            ''')

                        row_count = 0
                        for count, r in enumerate(results):
                            if count == 0: row = r
                            row_count += 1
                        if row_count > 0: fetched = True
                    except:
                        pass    
                
                
                if not fetched:
                    insert_query = f"INSERT INTO businesses (name) VALUES ('{name}')"
                    session.execute(insert_query)
                    self.__display_name = None
                    self.__id = None
                    self.__dot_number = None
                    self.__dot_verified = None
                    self.__industry = None
                    self.__owner = None
                    self.__addresses = None
                    self.__mc_number = None
                    self.__images = None
                    self.__about = None
                    
                else:
                    self.__id = row.id
                    self.__dot_number = row.dot_number
                    self.__dot_verified = row.dot_verified
                    self.__industry = row.industry
                    self.__owner = row.owner
                    self.__addresses = row.addresses
                    self.__display_name = row.display_name                
                    self.__mc_number = row.mc_number
                    self.__images = row.images
                    self.__about = row.about

        # Initialize from passed arguments
        else:
            self.__id = id
            self.__dot_number = dot_number
            self.__dot_verified = dot_verified
            self.__industry = industry
            self.__owner = owner
            self.__addresses = addresses
            self.__display_name = display_name                
            self.__mc_number = mc_number
            self.__images = images
            self.__about = about
            '''
                STILL THINKING ON THIS!!! Only fetch the profiles when business logic is encountered. 
            '''
        self.__profiles = None

    
    @property
    def name(self) -> str:
        return self.__name


    @property
    def display_name(self) -> str:
        return self.__display_name


    @property
    def id(self) -> str:
        return str(self.__id)

    
    @id.setter
    def id(self, value: str):
        self.__id = value

    
    @property
    def dot_number(self) -> str:
        return self.__dot_number


    @dot_number.setter
    def dot_number(self, value: str):
        self.__dot_number = value


    @property
    def mc_number(self) -> str:
        return self.__mc_number


    @mc_number.setter
    def mc_number(self, value):
        self.__mc_number = value


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
    def about(self) -> str:
        return self.__about


    @property
    def owner(self) -> str:
        return self.__owner

    
    @owner.setter
    def owner(self, value: str):
        self.__owner = value



    def _get_profiles(self) -> bool:
        '''
            Retrieve the users from the business_profiles table
        '''
        select_query = f'''SELECT profile_id, permissions, has_login, deleted, association_email, 
        first_name, middle_name, last_name, suffix, profile_picture, full_name
        FROM business_profiles WHERE business_name = '{self.name}'
        '''

        with get_session() as session:
            results = session.execute(select_query)
            
            profiles = BusinessProfiles()
            for row in results:
                profiles.append(BusinessProfile(profile_id=row.profile_id, has_login=row.has_login, permissions=row.permissions, business_name=self.name, deleted=row.deleted,
                association_email=row.association_email, first_name=row.first_name, middle_name=row.middle_name, last_name=row.last_name, 
                suffix=row.suffix, profile_picture=row.profile_picture, full_name=row.full_name))
            
            self.__profiles = profiles
            return True


    @property
    def profiles(self):
        # try:
        #     return self.__profiles
        # except:
        #     self._get_profiles()
        #     return self.__profiles
        if self.__profiles is None: self._get_profiles()
        return self.__profiles
        


    def create_unassociated_profile(self, first_name: str, middle_name: str, last_name: str, suffix: str, email: str,
                        permissions: set = None
                    ):
        
        # Check the email to make sure that it is not already registered
        if AddressClient().is_address_registered(email): raise AddressAlreadyRegisteredError(email)
        
        if email is None or email == '': raise ValueError('Create unassociated profile: Email is blank')
        # formatted_start_date = datetime.strptime(start_date, "%m/%d/%Y")

        if permissions is not None: formatted_permissions = "|".join(permissions)
        else: formatted_permissions = ''
        businesses_dict = {}
        businesses_dict[self.name] = formatted_permissions
        
        # PROFILE INFORMATION /////////////////////////////////////////////////////////////////////////////////////////////
        field_args = []
        profile_field_args = []
        value_args = []

        field_args.append(f"first_name")
        profile_field_args.append(f"first_name")
        value_args.append(f"'{first_name}'")

        field_args.append(f"middle_name")        
        profile_field_args.append(f"middle_name")
        value_args.append(f"'{middle_name}'")

        field_args.append(f"last_name")
        profile_field_args.append(f"last_name")
        value_args.append(f"'{last_name}'")
        
        field_args.append(f"suffix")
        profile_field_args.append(f"suffix")
        value_args.append(f"'{suffix}'")

        field_args.append(f"id")
        profile_field_args.append(f"profile_id")
        my_id = random_uuid()
        value_args.append(str(my_id))


        with get_session() as session:
            field_str = ', '.join(field_args)
            profile_field_str = ", ".join(profile_field_args)
            value_str = ', '.join(value_args)
            '''
                1. Create the business profile
                2. Create the profile
                3. Create an unassociated profiles record with the supplied email
                
            '''

            # upsert_search_query = f'''INSERT INTO search_profiles_by_name(search, first_name, middle_name, last_name, suffix, profile_id) 
            #         VALUES
            #         ('{first_name[:4].lower()}', 
            #         '{first_name.lower()}',
            #         '{middle_name.lower()}', 
            #         '{last_name.lower()}',
            #         '{suffix.lower()}', 
            #         {str(my_id)}
            #         )
            #         '''

            query_str = f"BEGIN BATCH INSERT INTO profiles ({field_str}, privacy_status, businesses) VALUES ({value_str}, 'Unassociated', {businesses_dict})"
            if permissions is not None:
                query_str += f"; INSERT INTO business_profiles ({profile_field_str}, has_login, deleted, business_name, permissions, association_email) VALUES ({value_str}, False, False, '{self.name}', {cql_encoder.cql_encode_set_collection(permissions)}, '{email}')"
            else:
                query_str += f"; INSERT INTO business_profiles ({profile_field_str}, has_login, deleted, business_name) VALUES ({value_str}, False, False, '{self.name}')"
            query_str += f"; INSERT INTO unassociated_profiles (email, business_name, profile_id) VALUES ('{email}', '{self.name}', {my_id})"
            # query_str += '; '
            # query_str += upsert_search_query
            query_str += "; APPLY BATCH"
            
            session.execute(query_str)

        
        self._get_profiles
        my_profile = ProfileModel().get(id=my_id)
        self.refresh()
        return my_profile
        

    
    def upsert_profile(self, profile_id: uuid.uuid4, permissions: set):

        my_set = cql_encoder.cql_encode_set_collection(permissions)
        # Update the profile permissions
        # format the permissions
        formatted_permissions = "|".join(permissions)
        profile_upsert_dict = {}
        profile_upsert_dict[self.name] = formatted_permissions
        
        with get_session() as session:
        
            profile = ProfileModel().get(id=profile_id)
            if profile.username is not None: 
                has_login = True
                deleted = False
            else: 
                has_login = False
                deleted = True

            # Handle the profile picture
            profile_picture = ''
            for image in profile.images:
                if image.image_type == 'profileActive': profile_picture = image.cdn_url


            insert_query = f'''BEGIN BATCH 
                    INSERT INTO business_profiles (business_name, profile_id, permissions, has_login, deleted, first_name, middle_name, last_name, suffix, profile_picture) 
                    VALUES ('{self.name}',{profile_id}, {my_set}, {has_login}, {deleted}, '{profile.first_name}', '{profile.middle_name}', '{profile.last_name}', '{profile.suffix}', '{profile_picture}'); 
                    UPDATE profiles SET businesses = businesses + {profile_upsert_dict} WHERE id = {profile_id}; 
                    APPLY BATCH'''
            session.execute(insert_query)
        

        self._get_profiles()
        return profile



    def refresh(self):
        self.__init__(self.name)


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
    def new_address_id(self) -> int:
        if self.__addresses is None: return 0
        if len(self.__addresses) == 0: return 0
        last_key = sorted(self.__addresses)[-1]
        return int(last_key) + 1


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


    def update_info(self, **fieldArgs) -> bool: # Returns true on success
        
        with get_session() as session:

            set_args = []
            update_valid = False
            
            for key, value in fieldArgs.items():
                if key == 'display_name':
                    set_args.append(f"display_name = '{value}'")
                    update_valid = True
                    update_business_profiles = True

                elif key == 'dot_number': 
                    set_args.append(f"dot_number = '{value}'")
                    update_valid = True
                    update_business_profiles = True
                    
                    
                elif key == 'mc_number':
                    set_args.append(f"mc_number = '{value}'")
                    update_valid = True
                    create_index = True
                    update_business_profiles = True
                    

                elif key == 'industry': 
                    set_args.append(f"industry = '{value}'")
                    update_valid = True
                    update_business_profiles = True
                    

                elif key == 'industry_category': 
                    set_args.append(f"industry_category = '{value}'")
                    update_valid = True


                elif key == 'legal_structure':
                    set_args.append(f"legal_structure = '{value}'")
                    update_valid = True
                
                elif key == 'about':
                    set_args.append(f"about = '{value}'")
                    update_valid = True
                    
                # MAPS //////////////////////////////////////////////////////////////////////////
                
                elif key == 'addresses':
                    l = []
                    if not isinstance(value, list): l.append(value)
                    else: l = value
                    ah = convert_address_list(l)
                    set_args.append(f"addresses = {cql_encoder.cql_encode_map_collection(ah)}")
                    update_valid = True


                elif key == 'images':
                    l = []
                    if not isinstance(value, list): l.append(value)
                    else: l = value
                    ih = convert_images_list(l)
                    set_args.append(f"images = {cql_encoder.cql_encode_map_collection(ih)}")
                    update_valid = True
                    
                    
            if update_valid:
                
                set_str = ', '.join(set_args)
                query_str = f"UPDATE businesses SET {set_str} WHERE name = '{self.name}' IF EXISTS"
                     
                try:
                    session.execute(query_str)
                    
                except Exception as e:
                    raise DatabaseFailedError(e)

            self.refresh()
            return True
