from libs.comms.text_client import TextClient
import os

os.environ['NUMVERIFY_API_KEY'] = '3cb70d06a0bd28ea543b89c0bb8daadf'
tc = TextClient()

def validate_number():
    print (tc.get_numverify_validation('4234042162'))