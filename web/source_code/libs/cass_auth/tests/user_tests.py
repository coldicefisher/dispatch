from libs.cass_auth.user_errors import DatabaseFailedError, UserDoesNotExistError
from libs.cass_auth.users import create_user, delete_user, get_user, delete_user

def test_create_user_delete_user_get_user():
    try:
        print ('Trying to get user...')
        my_user = get_user('coldicefisher@gmail.com')
        print ('User exists. Deleting...')
        delete_user('coldicefisher@gmail.com')
    except UserDoesNotExistError:
        print ('User does not exist error...')    
    
    print ('User does not exist.Creating...')
    my_user = create_user('coldicefisher@gmail.com', 'passWord', 'Jamey', 'Harris')
    my_user2 = get_user('coldicefisher@gmail.com')

    print ('Checking to see if created user and retrieved user are identical...')    
    assert my_user.first_name == my_user2.first_name, "First name: User created and user get did not equal"
    assert my_user.last_name == my_user2.last_name, "Last name: User created and user get did not equal"
    assert my_user.pwd == my_user2.pwd, "Password: User created and user get did not equal"
    assert my_user.phone_numbers == my_user2.phone_numbers, "Phone: User created and user get did not equal"
    assert my_user.trusted_devices == my_user2.trusted_devices, "Trusted devices: User created and user get did not equal"
    assert my_user.username == my_user2.username, "Username: User created and user get did not equal"


def test_update_info_and_refresh():
    pass


def test_add_phone_number():
    print ('Adding phone number...')
    my_user = get_user('coldicefisher@gmail.com')
    my_user.upsert_phone_numbers({'2063750202': 'unvalidated'})
    
    print ('Checking phone numbers...')
    my_user2 = get_user('coldicefisher@gmail.com')
    if '2063750202' not in my_user.phone_numbers: print ('Added number not in original user')
    if '2063750202' not in my_user2.phone_numbers: print ('Added number not in retrieved user')
    if '4234042162' not in my_user.phone_numbers: print ('Old number not in original user')
    if '4234042162' not in my_user.phone_numbers: print ('Old number not in retrieved user')
    

def test_is_device_trusted():
    print ('')
    print ('////////////////////////////////////////////////////')
    print ('Testing is device trusted...')
    my_user = get_user('coldicefisher@gmail.com')
    assert my_user.is_device_trusted('iPhone12') == False, 'Is device trusted failed'
    print ('Adding trusted device...')
    my_user.add_trusted_device('iPhone12')
    assert my_user.is_device_trusted('iPhone12') == True, 'Device should have been trusted in original user...'
    my_user2 = get_user('coldicefisher@gmail.com')
    assert my_user.is_device_trusted('iPhone12') == True, 'Device should have been trusted in retrieved user...'

    my_user.remove_trusted_device('iPhone12')
    assert my_user.is_device_trusted('iPhone12') == False, 'Trusted device removal failed...'
    print ('Testing updating info succeeeded...')


def test_update_info():
    print ('')
    print ('////////////////////////////////////////////////////')
    print ('Testing updating info...')
    my_user = get_user('coldicefisher@gmail.com')
    my_user.update_info(first_name='jamjam')
    my_user2 = get_user('coldicefisher@gmail.com')
    assert my_user.first_name == 'jamjam', 'First name did not get changed in update_info routine...'
    assert my_user2.first_name == 'jamjam', 'First name did not get changed for retrieved user...'

    my_user.update_info(last_name='hamham')
    assert my_user.last_name == 'hamham', 'Last name did not update'

    my_user.update_info(pwd='rebecca')
    assert my_user.check_password('rebecca'), 'Password did not update'

    print ('Testing updating info succeeded')


def test_add_and_remove_phones_emails():
    print ('')
    print ('////////////////////////////////////////////////////')
    print ('Testing adding and removing phone numbers and emails...')
    my_user = get_user('coldicefisher@gmail.com')
    my_user.upsert_phone_numbers({'+14234042162': 'unvalidated'})
    assert my_user.phone_numbers['+14234042162'] == 'unvalidated', 'Phone number did not upsert'

    my_user.remove_phone_numbers({'+14234042162',})
    assert my_user.phone_numbers.get('+14234042162') is None, 'Phone number was not removed'

    my_user.upsert_phone_numbers({'14234042162': 'unvalidated', '5554443333': 'validated'})
    assert my_user.phone_numbers['5554443333'] == 'validated', 'Phone number multiple upsert failed to validate'
    assert my_user.phone_numbers['14234042162'] == 'unvalidated', 'Phone number multiple upsert failed to validate'

    my_user.upsert_emails({'a@a.com': 'unvalidated',})
    assert my_user.emails['a@a.com'] == 'unvalidated'

    my_user.remove_emails({'a@a.com', })
    assert 'a@a.com' not in my_user.emails, 'Email upsert failed to validate'

    my_user.upsert_emails({'a@a.com': 'unvalidated', 'b@b.com': 'validated'})
    assert my_user.emails['a@a.com'] == 'unvalidated'
    
    my_user.remove_emails({'a@a.com', 'b@b.com'})
    assert 'a@a.com' not in my_user.emails and 'b@b.com' not in my_user.emails, 'Removing multiple emails failed'

    my_user.remove_phone_numbers({'+14234042162', '5554443333'})
    assert '+14234042162' not in my_user.phone_numbers and '5554443333' not in my_user.phone_numbers, 'Removing multiple emails failed validaation'

    
    
    print ('SUCCEEDED!')
    print ('////////////////////////////////////////////////////')
    print ('')

def check_login_routine():
    print ('')
    print ('////////////////////////////////////////////////////')
    print ('Testing login routine...')
    
    my_user = get_user('coldicefisher@gmail.com')
    
    if my_user.status == 'unvalidated':
        my_user.send_otp('email', my_user.email)
        # my_user.otp = 


    if not my_user.is_device_trusted('Android'):
        print (my_user.otp_options)
        my_user.send_otp('phone_number', '4234042162')
    

def check_login():
    my_user = get_user('coldicefisher@gmail.com')
    
    
# test_create_user_delete_user_get_user()
# test_update_info_and_refresh()
# test_add_phone_number()
# test_is_device_trusted()
# test_update_info()
test_add_and_remove_phones_emails()
