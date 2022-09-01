from libs.cass_auth.connect import get_secured_session as get_session
import time

def delete_data():
    print ('Manually deleting all data!')
    start_time = time.time()
    with get_session() as session:
        # DELETE ALL USERS
        results = session.execute("SELECT username FROM users")
        for row in results:
            session.execute(f"DELETE FROM users WHERE username = '{row.username}'")
        
        # DELETE ALL PROFILES
        results = session.execute("SELECT id FROM profiles")
        for row in results:
            session.execute(f"DELETE FROM profiles WHERE id = {row.id}")
        
        # DELETE ALL BUSINESS PROFILES
        results = session.execute("SELECT business_name FROM business_profiles")
        for row in results:
            session.execute(f"DELETE FROM business_profiles WHERE business_name = '{row.business_name}'")
        
        # DELETE ALL BUSINESSES
        results = session.execute("SELECT name FROM businesses")
        for row in results:
            session.execute(f"DELETE FROM businesses WHERE name = '{row.name}'")
        
        # DELETE ALL UNASSOCIATED PROFILES
        results = session.execute("SELECT email FROM unassociated_profiles")
        for row in results:
            session.execute(f"DELETE FROM unassociated_profiles WHERE email = '{row.email}'")
        
        # DELETE ALL PROFILES BY USERNAME
        # results = session.execute('SELECT username FROM from libs.cass_auth.businesses.business_model import BusinessModel')
        # for row in results:
        #     session.execute(f"DELETE FROM from libs.cass_auth.businesses.business_model import BusinessModel WHERE username = '{row.username}'")
        
        # DELETE ALL SEARCH PROFILES BY NAME
        results = session.execute('SELECT search FROM search_profiles_by_name')
        for row in results:
            session.execute(f"DELETE FROM search_profiles_by_name WHERE search = '{row.search}'")
        
        # DELETE ALL VERIFIED ADDRESSES
        results = session.execute('SELECT address, username FROM verified_addresses')
        for row in results:
            session.execute(f"DELETE FROM verified_addresses WHERE address = '{row.address}' AND username = '{row.username}'")
        

        print ('Finished deleting all data.')
        print (f'Time elapsed: {time.time() - start_time} seconds')