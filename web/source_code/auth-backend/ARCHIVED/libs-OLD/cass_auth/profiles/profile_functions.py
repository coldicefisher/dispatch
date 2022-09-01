from libs.cass_auth.connect import get_secured_session as get_session
import hashlib, os


def get_id_from_username(username: str):
    
    if not isinstance(username, str): return None
    encrypted_username = encrypt_username(username)
    
    # Get the profile id
    with get_session() as session:
        results = session.execute(f"SELECT id FROM profiles WHERE username = '{encrypted_username}'")
        row_count = 0
        for count, r in enumerate(results):
            if count == 0: row = r
            row_count += 1
        if row_count > 0: 
            # Check to see if profile exists
            return row.id
    return None

def get_id_from_encrypted_username(encrypted_username: str):
    if not isinstance(encrypted_username, str): return None
    
    # Get the profile id
    with get_session() as session:
        results = session.execute(f"SELECT id FROM profiles WHERE username = '{encrypted_username}'")
        row_count = 0
        for count, r in enumerate(results):
            if count == 0: row = r
            row_count += 1
        if row_count == 1: return row.id
    return None


def encrypt_username(username: str) -> str:

    username_pepper = os.environ.get('USERNAME_PEPPER')
    prepared_username = str(username) + username_pepper
    digest = hashlib.sha256()
    digest.update(bytes(prepared_username, 'utf-8'))
    final_username = digest.hexdigest()
    return final_username


def get_unassociated_account_information(email: str):
    # Check for unassociated account
    select_query = f'''SELECT profile_id, business_name FROM unassociated_profiles 
                    WHERE email = '{email}'
                    '''

    with get_session() as session:
        
        results = session.execute(select_query)


    row_count = 0
    for count, r in enumerate(results):
        if count == 0: row = r
        row_count += 1

    if row_count == 0: return None
    return row.profile_id, row.business_name


