import time
from libs.cass_auth.profiles.profile_model import ProfileModel
from libs.cass_auth.businesses.business_model import BusinessModel
from libs.cass_auth.connect import get_secured_session as get_session
from libs.uuid.uuid import convert_string_to_uuid

def test_business_functionality():
    start_time_main = time.time()

    print ('This test will demonstrate a live run of the data models.')
    print ('')
    print ('A profile will be created. The profile will create a business. The profile will then create two unassociated accounts')
    print ('Two accounts will be created to associate those accounts.')
    print ('')
    print ('Two unassociated accounts will be created. The business will then add those accounts to the business. A brief permissions test will be ran.')
    print ('The users will then try to access different functions of the business to test their permissions.')

    
    print ('Creating new profile (michaelharris)...')
    michael = ProfileModel().create('michaelharris', 'ethiopia', 'michael', 'love', 'hates', 'trucking', 'Michael', 'Harris')
    print ('')

    print ('Creating business (M&H Express). Setting owner as (michaelharris)')
    print ('The users will create companies. So, there is no need to search for the user.')
    
    mandh = BusinessModel().create('M&H Express', michael.id)
    print ('')

    print ("Creating unassociated users (jamey) and (montes)...")
    biz_jamey = mandh.create_unassociated_profile(first_name="Jamey", middle_name="Charles", last_name="Harris", suffix="", email="coldicefisher@gmail.com", permissions=set())
    biz_montes = mandh.create_unassociated_profile(first_name='Montes', middle_name="Antoine", last_name="Westfield", suffix="", email="postmaster@bizniz.io")
    
    print ('')

    print ("Creating regular users (rebecca) and (milcha)")
    rebecca = ProfileModel().create('rebecca', 'ethiopia', 'rebeccaq1', 'love', 'hates', 'trucking', 'Rebecca', 'Getahun')
    milcha = ProfileModel().create('milcha', 'password', 'q1', 'a1', 'q2', 'a2', 'Milcha', 'Fissha')
    print ('')
    print ('')

    print ('/////////////////////////////////////////////////////////////////////')
    print ('Checking data integrity of the unassociated profiles for profiles...')
    print ('')
    
    print ('Checking profile (jamey) business (M&H Express) exists on object...')
    jamey = ProfileModel().get(id=biz_jamey.id)
    montes = ProfileModel().get(id=biz_montes.id)
    assert jamey.businesses[mandh.name].name == 'M&H Express', 'Profile (jamey) does not contain Business (M&H Express)'
    print ('Checking profile (jamey) business (M&H Express) exists on object...')
    assert montes.businesses[mandh.name].name == "M&H Express", 'Profile (montes) does not contain Business (M&H Express)'
    
    print ('Checking privacy status on (jamey) and (montes). Status should be (Unassociated)')
    assert jamey.privacy_status == 'Unassociated', "Profile (jamey) privacy_status should have been (Unassociated)"
    assert montes.privacy_status == 'Unassociated', "Profile (montes) privacy_status should have been (Unassociated)"
    
    print ('Checking business profile (M&H Express) to see if (jamey) and (montes) exist on profiles collection')
    mandh.refresh()
    p = mandh.profiles[jamey.id]
    assert p is not None, "Business profile (jamey) does not exist"
    assert p.profile_id == jamey.id, "Business profile (jamey) profile id does not match Profile object"
    assert p.has_login == False, "Profile (jamey) has login attribute is incorrect"
    assert p.deleted == False, "Profile (jamey) deleted attribute is incorrect"

    p = mandh.profiles[montes.id]
    assert p is not None, "Business profile (montes) does not exist"
    assert p.profile_id == montes.id, "Business profile (montes) profile id does not match Profile object"
    assert p.has_login == False, "Profile (montes) has login attribute is incorrect"
    assert p.deleted == False, "Profile (montes) deleted attribute is incorrect"

    print ('Unassociated accounts passed integrity tests...')
    print ('')
    print ('/////////////////////////////////////////////////////////////////////')

    print ('Creating new account logins for (jamey) and (montes) to associate with the profiles')
    jamey = ProfileModel().create('coldicefisher', 'ethiopia', 'jamey', 'love', 'hates', 'trucking', 'Jamey', 'Harris', 'coldicefisher@gmail.com')
    montes = ProfileModel().create('montes', 'ethiopia', 'montes', 'love', 'hates', 'trucking', 'Montes', 'Westfield', 'postmaster@bizniz.io')
    
    print ('Checking Profile (jamey) for businesses data...')
    b = jamey.businesses['M&H Express']
    assert b is not None, "Profile (jamey) does not contain business (M&H Express) in collection"
    print ("Checking profile (jamey) data integrity")
    print ("privacy_status should equal Private")
    assert jamey.privacy_status == "Private"

    print ('Checking Profile (montes) for businesses data...')
    b = montes.businesses['M&H Express']
    assert b is not None, "Profile (montes) does not contain business (M&H Express) in collection"
    print ("Checking profile (montes) data integrity")
    print ("privacy_status should equal Private")
    assert jamey.privacy_status == "Private"

    print ('Checking business profile (M&H Express) for profiles (jamey) and (montes) data integrity...')
    mandh.refresh()
    biz_jamey = mandh.profiles[jamey.id]
    assert biz_jamey is not None, "Business (M&H Express), profile (jamey) does not exist after creating Profile"
    print ('Checking the attributes of (jamey) business profile.')
    print ('has_login should equal true and deleted should equal false')
    assert biz_jamey.has_login == True, "has_login integrity failed"
    assert biz_jamey.deleted == False, "deleted integrity failed"

    biz_montes = mandh.profiles[montes.id]
    assert biz_montes is not None, "Business (M&H Express), profile (montes) does not exist after creating Profile"
    print ('Checking the attributes of (montes) business profile.')
    print ('has_login should equal true and deleted should equal false')
    assert biz_montes.has_login == True, "has_login integrity failed"
    assert biz_montes.deleted == False, "deleted integrity failed"
    
    
    print ('')
    print ('/////////////////////////////////////////////////////////////////////////////////')
    print ('/////////////////////////////////////////////////////////////////////////////////')

    print ('Adding the regular profiles (rebecca) and (milcha) to business (M&H Express)')
    mandh.upsert_profile(rebecca.id, {'Human Resources', 'Assets'})
    mandh.upsert_profile(milcha.id, {'Driver'})

    print ('Checking that the profiles (rebecca) and (milcha) have been added...')
    biz_rebecca = mandh.profiles[rebecca.id]
    biz_milcha = mandh.profiles[milcha.id]
    assert biz_rebecca is not None
    assert biz_milcha is not None
    assert biz_rebecca.has_login == True
    assert biz_rebecca.deleted == False
    assert biz_milcha.has_login == True
    assert biz_milcha.deleted == False

    print ("Business profiles data integrity passed. Checking the Profiles integrity")
    rebecca.refresh()
    milcha.refresh()
    b = rebecca.businesses['M&H Express']
    assert b is not None
    assert b.name == mandh.name
    assert rebecca.privacy_status == "Private"
    b = milcha.businesses['M&H Express']
    assert b is not None
    assert b.name == 'M&H Express'

    print ('Profiles data integrity passed')
    print ('')
    print ('')
    
    print ('All profile add functions have passed. Performing tests on permissions...')
    print ('(rebecca) should have (Human Resources, Assets) permissions on M&H Express...')
    
    print ('Testing permissions on Profile (rebecca)...')
    assert rebecca.has_permission("M&H Express", {'Human Resources'})
    assert rebecca.has_permission("M&H Express", {'Assets'})
    assert rebecca.has_permission("M&H Express", {"Human Resources", "Assets"})

    print ('Testing permissions on Business (M&H Express) for (rebecca)...')
    biz_rebecca = mandh.profiles[rebecca.id]
    assert biz_rebecca.has_permission({'Human Resources'})
    assert biz_rebecca.has_permission({'Assets'})
    assert biz_rebecca.has_permission({'Human Resources', 'Assets'})
    
    print ('(milcha) should have permissions (Driver) on M&H Express')
    print ('Testings permissions on Profile (milcha)...')
    assert milcha.has_permission('M&H Express', {'Driver'})
    
    print ('Testing permissions on Business (M&H Express) for (milcha)...')
    biz_milcha = mandh.profiles[milcha.id]
    biz_milcha.has_permission({'Driver'})

    print ('Testing profiles for permssions that are not present...')
    assert rebecca.has_permission(mandh.name, {'Owner'}) == False
    assert rebecca.has_permission(mandh.name, {'Owner', 'Cargo'}) == False
    assert biz_rebecca.has_permission({'Owner'}) == False
    assert biz_rebecca.has_permission({'Owner', 'Cargo'}) == False
    assert milcha.has_permission(mandh.name, {'Owner'}) == False
    assert milcha.has_permission(mandh.name, {'Owner', 'Cargo'}) == False
    assert biz_milcha.has_permission({'Owner'}) == False
    assert biz_milcha.has_permission({'Owner', 'Cargo'}) == False

    print ('Testing mixed permissions. One or more permissions are present but some are not...')
    assert rebecca.has_permission(mandh.name, {'Owner', 'Human Resources'}) == True
    assert rebecca.has_permission(mandh.name, {'Owner'}) == False
    assert rebecca.has_permission(mandh.name, {'Owner', 'Human Resources', "Assets"}) == True
    assert biz_rebecca.has_permission({'Owner', 'Human Resources'}) == True
    assert biz_rebecca.has_permission({'Owner'}) == False
    assert milcha.has_permission(mandh.name, {'Driver', 'Owner'}) == True
    assert milcha.has_permission(mandh.name, {'Owner'}) == False
    assert biz_milcha.has_permission({'Driver', 'Owner'}) == True
    assert biz_milcha.has_permission({'Owner'}) == False

    print ('Testing permissions on (montes) and (jamey)...')
    assert montes.has_permission(mandh.name, {}) == False
    assert montes.has_permission(mandh.name, {'Driver'}) == False
    biz_montes = mandh.profiles[montes.id]
    assert biz_montes.has_permission({}) == False
    assert jamey.has_permission(mandh.name, {}) == False
    assert jamey.has_permission(mandh.name, {'Driver'}) == False
    biz_jamey = mandh.profiles[jamey.id]
    assert biz_jamey.has_permission({}) == False
    assert biz_jamey.has_permission({'Driver'}) == False

    print ('Adding permission (Test) on all profiles and testing new permissions...')
    biz_rebecca.add_permissions({'Test'})
    biz_milcha.add_permissions({'Test'})
    biz_montes.add_permissions({'Test'})
    biz_jamey.add_permissions({'Test'})
    assert biz_rebecca.has_permission({'Test'})
    assert biz_milcha.has_permission({'Test'})
    assert biz_montes.has_permission({'Test'})
    assert biz_jamey.has_permission({'Test'})
    rebecca.refresh()
    milcha.refresh()
    montes.refresh()
    jamey.refresh()
    assert rebecca.has_permission(mandh.name, {'Test'})
    assert milcha.has_permission(mandh.name, {'Test'})
    assert montes.has_permission(mandh.name, {'Test'})
    assert jamey.has_permission(mandh.name, {'Test'})

    print ('Deleting permission (Test) on all profiles and testing new permissions...')
    biz_jamey.delete_permissions({'Test'})
    biz_montes.delete_permissions({'Test'})
    biz_rebecca.delete_permissions({'Test'})
    biz_milcha.delete_permissions({'Test'})
    jamey.refresh()
    montes.refresh()
    rebecca.refresh()
    milcha.refresh()
    assert biz_jamey.has_permission({'Test'}) == False
    assert biz_milcha.has_permission({'Test'}) == False
    assert biz_milcha.has_permission({'Driver'})
    assert biz_montes.has_permission('Test') == False
    assert biz_rebecca.has_permission({'Test'}) == False
    assert biz_rebecca.has_permission({'Assets'})
    assert rebecca.has_permission(mandh.name, {'Test'}) == False
    assert rebecca.has_permission(mandh.name, {'Human Resources'})
    assert milcha.has_permission(mandh.name, {'Test'}) == False
    assert milcha.has_permission(mandh.name, {'Driver'})
    assert montes.has_permission(mandh.name, {'Test'}) == False
    assert jamey.has_permission(mandh.name, {'Test'}) == False
    
    print ('Testing replacing all permissions...')
    biz_jamey.replace_permissions({'Administrator'})
    biz_montes.replace_permissions({'Administrator'})
    biz_milcha.replace_permissions({'Administrator'})
    biz_rebecca.replace_permissions({'Administrator'})
    rebecca.refresh()
    montes.refresh()
    jamey.refresh()
    milcha.refresh()

    assert biz_jamey.has_permission({'Administrator'})
    assert biz_jamey.has_permission({'Test'}) == False
    assert biz_rebecca.has_permission({'Administrator'})
    assert biz_rebecca.has_permission({'Test'}) == False
    assert biz_rebecca.has_permission({'Human Resources'}) == False 
    assert biz_montes.has_permission({'Administrator'})
    assert biz_montes.has_permission({"Test"}) == False
    assert biz_milcha.has_permission({'Administrator'})
    assert biz_milcha.has_permission({"Test"}) == False
    assert biz_milcha.has_permission({'Driver'}) == False


    assert jamey.has_permission(mandh.name, {'Administrator'})
    assert jamey.has_permission(mandh.name, {'Test'}) == False
    assert rebecca.has_permission(mandh.name, {'Administrator'})
    assert rebecca.has_permission(mandh.name, {'Test'}) == False
    assert rebecca.has_permission(mandh.name, {'Human Resources'}) == False 
    assert montes.has_permission(mandh.name, {'Administrator'})
    assert montes.has_permission(mandh.name, {"Test"}) == False
    assert milcha.has_permission(mandh.name, {'Administrator'})
    assert milcha.has_permission(mandh.name, {"Test"}) == False
    assert milcha.has_permission(mandh.name, {'Driver'}) == False
    print ('Finished testing advanced permissions!')
    print ('')
    print ('')

    print (f"Time elapsed: {time.time() - start_time_main}")
    
