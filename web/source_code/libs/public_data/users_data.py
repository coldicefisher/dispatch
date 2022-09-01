from datetime import datetime
from re import L


from cassandra.encoder import Encoder
cql_encoder = Encoder()

# from multiprocessing.sharedctypes import Value
import time
import json

from libs.cass_auth.connect import get_secured_session as get_session

class UsersData:

    def __init__(self):
        pass

    def search_profiles(self, search: str, table: str = 'profiles'):
        if search == '' or search is None: return []
        if not table == 'profiles' and not table == 'business_profiles': return []

        with get_session() as session:
            if table == 'profiles':
                select_qry = f"SELECT first_name, middle_name, last_name, suffix, full_name, id, profile_picture FROM profiles WHERE full_name LIKE '%{search}%'"
            elif table == 'business_profiles':
                select_qry = f"SELECT first_name, middle_name, last_name, suffix, full_name, profile_id, profile_picture FROM business_profiles WHERE full_name LIKE '%{search}%'"

            results = session.execute(select_qry)
        
        l = []
        for row in results:
            if table == 'profiles': profile_id = row.id
            elif table == 'business_profiles': profile_id = row.profile_id
            if row.middle_name == 'None': middle_name = ''
            else: middle_name  = row.middle_name
            if row.suffix == 'None': suffix = ''
            else: suffix  = row.suffix
            l.append({
                'firstName': row.first_name,
                'middleName': middle_name,
                'lastName': row.last_name,
                'suffix': suffix,
                'fullName': row.full_name,
                'profilePicture': row.profile_picture,
                'profileId': str(profile_id)
            })

        return l


    def create_search_index(self, search: str, first_name: str, middle_name: str, last_name: str,
                                suffix: str, full_name: str, profile_id: str) -> bool:
        pass    
        # if first_name == 'None' or first_name is None: first_name = ''
        # if middle_name == 'None' or middle_name is None: middle_name = ''
        # if last_name == 'None' or last_name is None: last_name = ''
        # if suffix == 'None' or suffix is None: suffix = ''
        
        # upsert_query = f'''INSERT INTO search_profiles_by_name(search, first_name, middle_name, last_name, suffix, profile_id) 
        #                     VALUES
        #                     ('{search.lower()}', 
        #                     '{first_name.lower()}',
        #                     '{middle_name.lower()}', 
        #                     '{last_name.lower()}',
        #                     '{suffix.lower()}', 
        #                     {str(profile_id)}
        #                     )
        #                     '''
        # with get_session() as session:
            
        #     session.execute(upsert_query)

    

    @property
    def serialized_search_index(self) -> list:
        # with get_session() as session:

        #     results = session.execute(f'''SELECT search, first_name, middle_name, last_name, suffix, profile_id FROM search_profiles_by_name
        #                                 ''')
            
        #     index_list = []
        #     row_count = 0
        #     for count, row in enumerate(results):
        #         index_list.append({
        #             'id': count,
        #             'item': {
        #                 'id': count,
        #                 'firstName': row.first_name,
        #                 'middleName': row.middle_name,
        #                 'lastName': row.last_name,
        #                 'suffix': row.suffix,
        #                 'search': row.search,
        #                 'profileId': str(row.profile_id)
        #             }
        #         })                
        #         row_count += 1

        #     return index_list
        pass