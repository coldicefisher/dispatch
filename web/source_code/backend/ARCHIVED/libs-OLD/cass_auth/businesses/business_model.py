import uuid

from libs.cass_auth.connect import get_secured_session as get_session
from libs.kp_fraydit.classes import BaseClass
from libs.uuid.uuid import convert_string_to_uuid, is_valid_uuid, random_uuid
from libs.cass_auth.businesses.business import Business
from libs.cass_auth.profiles.base_profile import convert_address_list
from libs.exceptions.auth_exceptions import DatabaseFailedError
from libs.exceptions.business_exceptions import BusinessExistsError
from cassandra.encoder import Encoder


cql_encoder = Encoder()

class BusinessModel(BaseClass):
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


    def create(self, name: str, owner: uuid.uuid4, **fieldArgs):

        if not is_valid_uuid(owner): raise ValueError(f"Create Business: owner ({owner}) was not a valid uuid.")
        if self.exists(name): raise BusinessExistsError(name)

        with get_session() as session:

            value_args = []
            field_args = []
            
            my_set = {owner}
            # encoded_set = cql_encoder.cql_encode_set_collection(my_set)
            field_args.append(f"owner")
            value_args.append(f"{convert_string_to_uuid(owner)}")
            
            field_args.append(f"name")
            value_args.append(f"'{name}'")

            field_args.append(f"id")
            value_args.append(str(random_uuid()))
            
            for key, value in fieldArgs.items():
                if key == 'display_name':
                    field_args.append(f"display_name")
                    value_args.append(f"'{value}'")
                    
                elif key == 'dot_number': 
                    field_args.append(f"dot_number")
                    value_args.append(f"'{value}'")
                    
                elif key == 'mc_number':
                    field_args.append(f"mc_number")
                    value_args.append(f"'{value}'")
            
                elif key == 'industry': 
                    field_args.append(f"industry")
                    value_args.append(f"'{value}'")
                    
                elif key == 'industry_category': 
                    field_args.append(f"industry_category")
                    value_args.append(f"'{value}'")
                    
                elif key == 'legal_structure':
                    field_args.append(f"legal_structure")
                    value_args.append(f"'{value}'")

                # MAPS //////////////////////////////////////////////////////////////////////////
                elif key == 'addresses':
                    l = []
                    if not isinstance(value, list): l.append(value)
                    else: l = value
                    ah = convert_address_list(l)
                    field_args.append(f"addresses")
                    value_args.append(f"{cql_encoder.cql_encode_map_collection(ah)}")
        
                
            field_str = ', '.join(field_args)
            value_str = ', '.join(value_args)
            
            query_str = f"INSERT INTO businesses ({field_str}) VALUES ({value_str}) IF NOT EXISTS"
            
            try:
                session.execute(query_str)
                
            except Exception as e:
                raise DatabaseFailedError(e)

        # Business Created ///////////////////////////////////////////////////
        # Add the profile to the account
        biz = Business(name)
        biz.upsert_profile(owner,['Owner'])
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