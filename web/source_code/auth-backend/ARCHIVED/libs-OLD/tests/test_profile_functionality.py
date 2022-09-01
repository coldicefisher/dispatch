from libs.cass_auth.businesses.business_model import BusinessModel
from libs.cass_auth.profiles.profile_model import ProfileModel, fetchType
from libs.cass_auth.profiles.profile_work_history import ProfileWorkHistory
from libs.cass_auth.profiles.profile_address import ProfileAddress
from libs.cass_auth.profiles.profile_images import ProfileImage
from libs.cass_auth.users import UserModel

from libs.public_data.users_data import UsersData
from libs.uuid.uuid import convert_string_to_uuid, is_valid_uuid

import time

def test_profile_functionality():
    print ('Testing basic profile functionality')
    start_time_main = time.time()

    print ('Trying to delete account (michaelharris)...')
    start_time = time.time()
    result = ProfileModel().delete('michaelharris', 'username')
    print (f'Result: {result}. Took {time.time() - start_time} seconds...')
    print ('')
    
    print ('Creating new profile (michaelharris)...')
    start_time = time.time()
    michael = ProfileModel().create('michaelharris', 'ethiopia', 'michael', 'love', 'hates', 'trucking', 'Michael', 'Harris')
    print (f'time elapsed: {time.time() - start_time} seconds')
    print ('')

    print ('Testing Profile get functionality...')
    start_time = time.time()
    p = ProfileModel().get(id=michael.id)
    assert p.id == michael.id, "ProfileModel get failed to fetch on id"
    p = ProfileModel().get(username=michael.username)
    assert p.id == michael.id, 'ProfileModel get failed to fetch on username'
    users_user = UserModel().get(id=michael.username)
    p = ProfileModel().get(encrypted_username=users_user.encrypted_username)
    assert p.id == michael.id, "ProfileModel get failed to fetch on encrypted username"

    print ('Checking search indexes...')
    start_time = time.time()
    results = UsersData().get_search_results(search=michael.first_name[:4])
    assert len(results) > 0, 'Create profile... No search index found'
    print ('/////////////////////////////////////////')
    print ('')
    
    print ('Creating business (M&H Express)...')
    start_time = time.time()
    mandh = BusinessModel().create('M&H Express', convert_string_to_uuid(michael.id))
    print (f'time elapsed: {time.time() - start_time} seconds')

    print ('Adding profile to business...')
    start_time = time.time()
    mandh.upsert_profile(michael.id, {})
    np = mandh.profiles[michael.id]
    assert np is not None, 'Business upsert profile failed to insert'
    assert np.first_name == michael.first_name, 'Business upsert profile info failed first name'
    assert np.last_name == michael.last_name, 'Business upsert profile info failed last name'
    print (f'time elapsed: {time.time() - start_time} seconds')


    
    print ('Creating work history object to add to profile...')
    print ('Work history id is intentionally left blank to test automatic id creation...')
    start_time = time.time()
    w = ProfileWorkHistory()
    w.start_date = '1/5/2021'
    w.end_date = '4/1/2022'
    w.business_name = 'M&H Express'
    w.positions_held = 'Driver'
    w.description = 'Moving groceries.All over. Everywhere. We moved groceries'
    w.physical_address1 = '3824 New Hwy 68'
    w.physical_city = 'Madisonville'
    w.physical_state = 'TN'
    w.physical_zip = '37354'
    w.id = michael.new_work_history_id

    print ('Adding work history to (michaelharris) using (upsert_work_history)...')
    result = michael.upsert_work_history(w)
    assert result, 'Upsert work history returned false'
    nw = michael.work_histories[w.id]
    assert nw is not None, 'Work history does not exist on profile object after insertion.'
    assert nw.physical_address1 == '3824 New Hwy 68', 'Work history address info incorrect'
    assert nw.physical_city == 'Madisonville', 'Work history city info incorrect'
    assert nw.physical_state == 'TN', 'Work history state info incorrect'
    assert nw.physical_zip == '37354', 'Work history zip info incorrect'
    assert nw.start_date == '01/05/2021', 'Work history start date info incorrect'
    assert nw.end_date == '04/01/2022', 'Work history end date info incorrect'
    print (f'time elapsed: {time.time() - start_time} seconds')
    print ('')

    print ('Removing work history...')
    start_time = time.time()
    michael.remove_work_history(w)
    
    assert len(michael.work_histories) == 0, 'Work history still on profile object after deletion.'
  
    print (f'time elapsed: {time.time() - start_time} seconds')
    
    print ('Creating address history object to add to profile...')
    print ('Address history id intentionally left blank to test automatic id creation...')
    start_time = time.time()
    a = ProfileAddress()
    a.start_date = '3/1/2022'
    a.end_date = '10/28/2022'
    a.address_type = 'mailing'
    a.address1 = '1902 Judge Ronald Rd'
    a.address2 = 'Unit B'
    a.city = 'Ellensburg'
    a.state = 'WA'
    a.zip = '98926'
    a.id = michael.new_address_id

    print ('Adding address history to (michaelharris) using (upsert_profile_address)...')
    result = michael.upsert_profile_address(a)
    assert result, 'Upsert profile address returned false'
    aw = michael.addresses[0]
    assert aw is not None, 'Address history does not exist on profile object after insertion.'
    assert aw.start_date == '03/01/2022', "Address start date info incorrect"
    assert aw.end_date == '10/28/2022', 'Address end date info incorrect'
    assert aw.address_type == 'mailing', 'Address history address type info incorrect'
    assert aw.address1 == '1902 Judge Ronald Rd', 'Address history address 1 info incorrect'
    assert aw.address2 == 'Unit B', 'Address history address 2 info incorrect'
    assert aw.city == 'Ellensburg', 'Address history city info incorrect'
    assert aw.state == 'WA', 'Address history state info incorrect'
    assert aw.zip == '98926', 'Address history zip info incorrect'
    print (f'time elapsed: {time.time() - start_time} seconds')

    print ('Removing address history')
    start_time = time.time()
    michael.remove_profile_address(a)
    assert len(michael.addresses) == 0, 'Address history still on profile object after deletion.'
    print (f'time elapsed: {time.time() - start_time} seconds')

    print ('Creating new image...')
    start_time = time.time()
    i = ProfileImage()
    i.cdn_url = 'https://test.com/cdn_url'
    i.original_url = 'https://test.com/original_url'
    i.size = 4096
    i.mime_type = 'JPEG'
    i.uuid = '5c02e0dc-d1cf-4122-8003-ab832125e314'
    i.name = 'test_image.jpeg'
    i.id = michael.new_image_id

    print ('Adding image to (michaelharris) using (upsert_image)...')
    result = michael.upsert_images(i)
    assert result, 'Upsert image returned false'
    ni = michael.images['5c02e0dc-d1cf-4122-8003-ab832125e314']
    assert ni is not None, 'Image does not exist on profile object after insertion.'    
    assert ni.cdn_url == 'https://test.com/cdn_url', 'Image cdn url info incorrect'
    assert ni.original_url == 'https://test.com/original_url', 'Image original url info incorrect'
    assert ni.size == 4096, 'Image size info incorrect'
    assert ni.mime_type == 'JPEG', 'Image mime type info incorrect'
    assert ni.uuid == '5c02e0dc-d1cf-4122-8003-ab832125e314', 'Image uuid info incorrect'
    assert ni.name == 'test_image.jpeg', 'Image name info correct'
    print (f'time elapsed: {time.time() - start_time} seconds')
    
    print ('Removing image from profile...')
    
    print ('')
    print ('')
    
    print ('//////////////////////////////////////////////////////////////////////////////////////////')
    print ('Testing update profile info...')
    start_time = time.time()
    start_time_update = time.time()
    update_work_history = [
            
                {
                    'id': 3, 
                    'startDate': '02/01/2021', 
                    'endDate': '03/11/2022', 
                    'businessName': 'Dearborne Trucking', 
                    'positionsHeld': 'Student Driver', 
                    'description': 'I showed them stuff. Like how to drive', 
                    'physicalAddress1': '123 Teacher Ave', 
                    'physicalAddress2': 'Apt B', 
                    'physicalCity': 'Englewood', 
                    'physicalState': 'GA', 
                    'physicalZip': '33229', 
                    'mailingAddress1': 'PO Box 321', 
                    'mailingAddress2': '', 
                    'mailingCity': 'Atlanta', 
                    'mailingState': 'GA', 
                    'mailingZip': '11991'
                },
                {

                }
        ]
    update_address = [
            
            {
                'id': 2, 
                'startDate': '12/01/2021', 
                'endDate': '12/31/2021', 
                'addressType': 'physical', 
                'address1': '564 Bethlehem Rd', 
                'address2': '', 
                'city': 'Madisonville', 
                'state': 'TN', 
                'zip': '37354'
            },
            {

            }
        ]
    
    michael.update_profile_info(addresses=update_address, work_history = update_work_history, 
                            gender='Male', first_name="Jamey", middle_name="Charles", last_name="Harris",
                            suffix="Jr", privacy_status="Public", seeking_status="Looking")

    assert michael.gender == 'Male', 'Update profile info failed on gender'
    assert michael.first_name == "Jamey", "Update profile info failed on first name"
    assert michael.middle_name == 'Charles', 'Update profile info failed on middle name'
    assert michael.last_name == 'Harris', 'Update profile info failed on last name'
    assert michael.suffix == 'Jr', 'Update profile info failed on suffix'
    assert michael.privacy_status == 'Public', 'Update profile info failed on privacy status'
    assert michael.seeking_status == 'Looking', 'Update profile info failed on seeking status'
    
    na = michael.addresses[2]
    assert na is not None, 'Update profile info failed on profile address insertion'
    assert na.start_date == '12/01/2021', 'Update profile info profile address start date incorrect'
    assert na.end_date == '12/31/2021', 'Update profile info profile address end date incorrect'
    assert na.address_type == 'physical', 'Update profile info profile address type incorrect'
    assert na.address1 == '564 Bethlehem Rd', 'Update profile info profile address1 incorrect'
    assert na.city == 'Madisonville', 'Update profile info profile city incorrect'
    assert na.state == 'TN', 'Update profile info profile state incorrect'
    assert na.zip == '37354', 'Update profile info profile zip incorrect'
    
    wa = michael.work_histories[3]
    assert wa is not None, 'Update profile info failed on profile work history insertion'
    assert wa.start_date == '02/01/2021', 'Update profile info wh start date incorrect'
    assert wa.end_date == '03/11/2022', 'Update profile info wh end date incorrect'
    assert wa.business_name == 'Dearborne Trucking', 'Update profile info wh business name incorrect'
    assert wa.positions_held == 'Student Driver', 'Update profile info wh positions held incorrect'
    assert wa.description == 'I showed them stuff. Like how to drive', 'Update profile info wh description incorrect'
    assert wa.physical_address1 == '123 Teacher Ave', 'Update profile info wh address1 incorrect'
    assert wa.physical_address2 == 'Apt B', 'Update profile info wh address2 incorrect'
    assert wa.physical_city == 'Englewood', 'Update profile info wh city incorrect'
    assert wa.physical_state == 'GA', 'Update profile info wh state incorrect'
    assert wa.physical_zip == '33229', 'Update profile info wh zip incorrect'
    assert wa.mailing_address1 == 'PO Box 321', 'Update profile info wh mailing address1 incorrect'
    assert wa.mailing_city == 'Atlanta', 'Update profile info wh mailing address2 incorrect'
    assert wa.mailing_state == 'GA', 'Update profile info wh mailing state incorrect'
    assert wa.mailing_zip == '11991', 'Update profile info wh mailing zip incorrect'
  
    print ('Checking the business profiles table to see if the user profile name information updated...')
    print ('Refreshing business object...')
    start_time = time.time()
    mandh.refresh()
    print (f'time elapsed: {time.time() - start_time} seconds')
    print ('refreshing profile object...')
    start_time = time.time()
    michael.refresh()
    print (f'time elapsed: {time.time() - start_time} seconds')
    print ('Checking business profile information...')
    p = mandh.profiles[michael.id]
    assert p.first_name == michael.first_name, 'Business profile first name is not in sync with profile information'
    assert p.middle_name == michael.middle_name, 'Business profile middle name is not in sync with profile information'
    assert p.last_name == michael.last_name, 'Business profile last name is not in sync with profile information'
    
    print (f'Update profile info passed all tests in {time.time() - start_time_update} seconds...')
    print ('//////////////////////////////////////////////////////////////////////////////////////////')
    print ('')

    print ('Trying to update profile on property setters...')
    start_time = time.time()
    start_time_setters = time.time()
    print ('Setting gender...')
    michael.gender = 'Female'
    assert michael.gender == 'Female', 'Profile gender setter failed'
    print ('Setting first name...')
    michael.first_name = 'Michael'
    assert michael.first_name == 'Michael', 'Profile first name setter failed'
    print ('Setting middle name...')
    michael.middle_name = 'Wayne'
    assert michael.middle_name == 'Wayne', 'Profile middle name setter failed'
    print ('Setting last name...')
    michael.last_name = 'Harrison'
    assert michael.last_name == 'Harrison', 'Profile last name setter failed'
    print ('Setting suffix...')
    michael.suffix = ''
    assert michael.suffix == '', 'Profile suffix setter failed'
    print ('Setting privacy status...')
    michael.privacy_status = 'Private'
    assert michael.privacy_status == 'Private', 'Profile privacy status failed'
    print ('Setting seeking status...')
    michael.seeking_status = 'Not Looking'
    assert michael.seeking_status == 'Not Looking', 'Profile seeking status failed'

    print ('Checking the business profiles table to see if the user profile name information updated...')
    print ('Refreshing business object...')
    start_time = time.time()
    mandh.refresh()
    print (f'time elapsed: {time.time() - start_time} seconds')
    print ('refreshing profile object...')
    start_time = time.time()
    michael.refresh()
    print (f'time elapsed: {time.time() - start_time} seconds')
    print ('Checking business profile information...')
    p = mandh.profiles[michael.id]
    assert p.first_name == michael.first_name, 'Business profile first name is not in sync with profile information'
    assert p.middle_name == michael.middle_name, 'Business profile middle name is not in sync with profile information'
    assert p.last_name == michael.last_name, 'Business profile last name is not in sync with profile information'
    print (f'Update profile using setters finished in {time.time() - start_time_setters} seconds...')   
    print (f'Testing profile functionality completed.')
    print (f'Time elapsed: {time.time() - start_time_main} seconds')
    
