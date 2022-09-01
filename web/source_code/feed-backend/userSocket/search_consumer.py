from libs.public_data.users_data import UsersData
from libs.cass_auth.addresses import AddressClient

class SearchConsumer:

    @staticmethod
    def search_profiles(payload):
        search_results = UsersData().search_profiles(payload.get('searchString'))
        print (search_results)
        return ({'key': 'search', 'command': 'profiles', 'payload': search_results})


    @staticmethod
    def search_business_profiles(payload):
        return ({'key': 'search', 'command': 'business_profiles', 'payload': UsersData().search_profiles(payload.get('searchString'), 'business_profiles')})

    @staticmethod
    def search_emails(payload):
        print ('Searched emails')
        print ('')
        print ('')
        print ('')
        print (payload)
        print ('')
        print ('')
        print ('')
        print ('Searched emails')
        email = payload.get('email')
        exists = AddressClient().is_email_registered(email)
        if exists:
            return ({'key': 'search', 'command': 'email_exists', 'payload': {
                            'status': 'true'
                        }
                    })   
        else:
            return ({'key': 'search', 'command': 'email_exists', 'payload': {
                            'status': 'false'
                        }
                    })   

        return({'key': 'search', 'command': 'emails', 'payload': {"exists": ""}})