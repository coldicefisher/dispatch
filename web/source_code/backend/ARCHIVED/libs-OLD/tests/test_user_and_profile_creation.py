from libs.cass_auth.businesses.business_model import BusinessModel
from libs.cass_auth.profiles.profile_model import ProfileModel, fetchType
from libs.cass_auth.profiles.profile_work_history import ProfileWorkHistory
from libs.cass_auth.profiles.profile_address import ProfileAddress
from libs.cass_auth.profiles.profile_images import ProfileImage
from libs.cass_auth.connect import get_secured_session as get_session

from libs.cass_auth.users import UserModel

import time

# TEST PROFILE ASSOCIATION
def test_user_and_profile_creation():
    print ('Testing user and profile creation...')
    start_time_main = time.time()

    with get_session() as session:
        print ('Creating user (michaelharris)...')
        start_time = time.time()
        michael = ProfileModel().create(username='michael', password='michael', q1='question 1', a1='answer 1', q2='question 2', a2='answer 2',
                            first_name='Michael', last_name='Harris', middle_name='Wayne')
        print (f'User created in {time.time() - start_time} seconds.')
        
        print ('Creating business (M&H Express)...')
        start_time = time.time()
        mandh = BusinessModel().create(name='M&H Express', owner=michael.id)
        print (f'Business created in {time.time() - start_time} seconds.')

        print ('Checking the database...')
        start_time = time.time()
        print ('///////////////////////////////////////////////////////')
        print ('')

        print ('Checking the users table for exactly 1 record and that the usernames match in profiles...')
        results = session.execute(f"SELECT username FROM users")
        row_count = 0
        for r in results:
            row_count += 1
            row = r
        assert row_count == 1, "Users table has the wrong number of records"
        users_username = row.username

        print ('Checking the profiles table for exactly one record and theat the ids match')
        results = session.execute(f"SELECT username, id FROM profiles")
        row_count = 0
        for r in results:
            row_count += 1
            row = r
        assert row_count == 1, 'Table profiles has wrong number of profiles'
        print ('Table profiles passed. Checking the profile object...')
        assert michael.id == row.id, 'Ids do not match'
        assert michael.username == users_username, "Profile object username and users table username do not match"
        assert row.username == users_username, "Profile table and Users table username do not match"
        print ('Profiles and Users table passed integrity checks. Profile object passed integrity check')
        print ('')

        # print ('Checking the from libs.cass_auth.businesses.business_model import BusinessModel table...')
        # results = session.execute(f"SELECT username, profile_id FROM from libs.cass_auth.businesses.business_model import BusinessModel")
        # row_count = 0
        # for r in results:
        #     row_count += 1
        #     row = r
        # assert row_count == 1, "from libs.cass_auth.businesses.business_model import BusinessModel table has wrong number of records"
        # assert row.profile_id == michael.id, "from libs.cass_auth.businesses.business_model import BusinessModel profile id failed intergrity check on Profile object"
        # assert row.username == michael.username, "from libs.cass_auth.businesses.business_model import BusinessModel username failed integrity check on Profile object"
        # print ('from libs.cass_auth.businesses.business_model import BusinessModel table passed integrity checks...')

        print ('profiles, users tables passed basic integrity checks...')
        print (f'Time elapsed: {time.time() - start_time_main} seconds')
