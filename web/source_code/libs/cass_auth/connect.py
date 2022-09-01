from cassandra.cluster import Cluster
from cassandra.auth import PlainTextAuthProvider
import os


# def open_auth_session():
#     return Cluster(['dispatch-cassandra'], port=9042).connect()

# PRODUCTION
def get_secured_session():
    auth_provider = PlainTextAuthProvider(username=os.environ.get('CASS_USERNAME'), password=os.environ.get('CASS_PASSWORD'))
    session = Cluster(['dispatch-cassandra'], port=9042, auth_provider=auth_provider).connect()
    session.set_keyspace('dispatch_users')
    return session

# TEST
# def get_secured_session():
#     auth_provider = PlainTextAuthProvider(username=os.environ.get('CASS_USERNAME'), password=os.environ.get('CASS_PASSWORD'))
#     session = Cluster(['dispatch-cassandra'], port=9042, auth_provider=auth_provider).connect()
#     session.set_keyspace('dispatch_users')
#     return session
