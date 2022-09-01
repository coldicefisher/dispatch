import time
from libs.cass_auth.profiles.profile_model import ProfileModel
from libs.cass_auth.businesses.business_model import BusinessModel
from libs.cass_auth.connect import get_secured_session as get_session

def test_profile_association():
    print ('Testing profile association')
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
        print ('')

        print ('Creating an unassociated account for (Rebecca)...')
        start_time = time.time()
        mandh.create_unassociated_profile(first_name='Rebecca', middle_name="", last_name="Getahun", suffix="", email="postmaster@bizniz.io", permissions={'TestStudent'})
        print (f'time elapsed: {time.time() - start_time} seconds')
        print ('')

        print ('Creating a new account (rebecca) to associate with user...')
        start_time = time.time()
        rebecca = ProfileModel().create(username='rebecca', password='ethiopia', q1='rebeccaq1', a1='love', q2='hates', a2='trucking', first_name='Rebecca', last_name='Getahun', association_email='postmaster@bizniz.io')
        print (f'time elapsed: {time.time() - start_time} seconds')
        print ('')

        print (f'Checking the profiles table to ensure that only one profile exists for user (rebecca)')
        results = session.execute(f"SELECT username FROM profiles WHERE id = {rebecca.id}")
        rebecca_count = 0
        for row in results:
            if row.username == rebecca.username: rebecca_count += 1
        assert rebecca_count == 1, 'profiles table has wrong number of records'

        print ('Refreshing business...')
        start_time = time.time()
        mandh.refresh()
        print ('Checking the BusinessProfile object integrity. The profile should have no login and not deleted...')
        assert mandh.profiles[rebecca.id].has_login == True, "has login integrity failed."
        assert mandh.profiles[rebecca.id].deleted == False, "deleted integrity failed"
        print (f'time elapsed: {time.time() - start_time} seconds')
        print ('')
        
        print ('Checking the user profile for the business association...')
        print ('The business object should have the user in its profiles collection.')
        start_time = time.time()
        rebecca.refresh()
        assert rebecca.businesses[mandh.name] is not None, "Business was not found on profile"
        print (f'Took {time.time() - start_time} seconds')
        print ('')

        print ('Checking that there are no permissions for the newly created user...')
        start_time = time.time()
        rebecca.has_permission(mandh.name, {'Driver', 'Administrator', 'Human Resources'})
        print (f'time elapsed: {time.time() - start_time} seconds')
        print ('')

        print ('Adding permissions for the user...')
        start_time = time.time()
        mandh.profiles[rebecca.id].add_permissions({'Driver', 'Owner', 'Human Resources'})
        print (f'time elapsed: {time.time() - start_time} seconds')
        print ('')

        print ('Checking permissions for the user after refreshing the user...')
        start_time = time.time()
        rebecca.refresh()
        assert rebecca.has_permission(mandh.name, {'Driver'}), 'Profile user failed to test for (has permission- single parameter passed)...'
        assert rebecca.has_permission(mandh.name, {'Owner', 'Human Resources'}), 'Profile user failed to test for (has permission - two paramters passed)...'
        assert rebecca.has_permission(mandh.name, {'Driver'})
        print (f'time elapsed: {time.time() - start_time} seconds')

        print ('Checking the permissions on the business model...')
        start_time = time.time()
        assert mandh.profiles[rebecca.id].has_permission({'Driver'}), 'Business user failed to test for (has permission- single parameter passed)...'
        assert mandh.profiles[rebecca.id].has_permission({'Owner', 'Human Resources'}), 'Business user failed to test for (has permission- two parameters passed)...'
        print (f'time elapsed: {time.time() - start_time} seconds')


        print ('Deleting the newly associated profile...')
        start_time = time.time()
        ProfileModel().delete(rebecca.id, 'id')


        print (f'Checking the unassociated profiles table to ensure information was deleted')
        results = session.execute("SELECT email, profile_id FROM unassociated_profiles")
        row_count = 0
        for r in results:
            row_count += 1
        assert row_count == 0, "unassociated_profiles table has wrong number of records"


        print ('Checking the business profile data integrity. Checking: deleted = True and has_login = False')
        mandh.refresh()
        biz_profile = mandh.profiles[rebecca.id]
        assert biz_profile.deleted == True, 'BusinessProfile deleted integrity failed'
        assert biz_profile.has_login == False, "BusinessProfile has_login integrity failed"
        
        print ('Checking that the profile still exists in the database...')
        results = session.execute(f"SELECT username, id FROM profiles WHERE id = {rebecca.id}")
        row_count = 0
        for row in results:
            row_count += 1
        assert row_count == 1, "profiles table has wrong number of records."

        print ('Checking the profile to ensure deleted is true')
        rebecca.refresh()
        assert rebecca.privacy_status == 'Deleted', 'Profile privacy_status integrity failed...'
        
        
        print ('Profile and Business objects data integrity passed...')
        print ('/////////////////////////////////////////////////////////////////////////')
        print('')
        print('')
        
        print ('A profile has been deleted. However, it is still associated with a business. Create a recovery record')
        print ('for the profile so that the user can be created.')
        print ('//////////////////')
        print ('')
        
        print ('Creating unassociated_profiles record from the business profile object...')
        start_time = time.time()
        biz_profile.create_recovery_profile_record('postmaster@bizniz.io')
        print (f'Time elapsed: {time.time() - start_time} seconds')
        print ('')

        print ('Creating a new profile account that already exists and has association record...')
        start_time = time.time()
        rebecca = ProfileModel().create('rebecca', 'ethiopia', 'rebeccaq1', 'love', 'hates', 'trucking', 'Rebecca', 'Getahun', 'postmaster@bizniz.io')
        print ('Checking the data integrity of the profile...')
        assert rebecca.privacy_status == "Private", "Associate existing profile data integrity check failed on privacy status"
        assert rebecca.username != '', "Associate existing profile data integrity check failed on username"
        
        print ('Refreshing the business and checking the data integrity of the business profile')
        mandh.refresh()
        biz_profile = mandh.profiles[rebecca.id]
        assert biz_profile.has_login == True, "Associate existing profile data integrity failed on has_login for business profile"
        assert biz_profile.deleted == False, "Associate existing profile data integrity failed on deleted for business profile"


        print ('FINISHED TESTING ACCOUNT ASSOCIATION......')
        print (f'All tests took {time.time() - start_time_main} seconds to complete.')
