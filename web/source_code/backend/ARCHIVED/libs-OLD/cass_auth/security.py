from random import seed, randint
from libs.cass_auth.connect import get_secured_session as get_session
from libs.comms.mail_client import MailClient
from libs.cass_auth.users import UserModel

import jwt

from hashlib import sha256, sha384
import binascii
from ecdsa import VerifyingKey, NIST384p


mc = MailClient()
uModel = UserModel()

def send_otp(type: str, address: str) -> bool:
    seed(10)
    code = randint(10000, 99999)
    
    with get_session() as session:
        # Upsert the address for otp auth
        session.execute(f"INSERT INTO otp_validations (address, otp, type, validated) VALUES ('{address}', '{code}', '{type}', False)")
        

        disclaimer = """
            Do not share this code with anyone. 
            This code was generated as a 2 factor authentication routine to protect your identity.
            """
        mail_body = f'Your code: \r\n\r\n {code}\r\n\r\n{disclaimer}'
        if type == 'email':
            # session.execute(f"UPDATE users_by_email SET otp = {code} WHERE email = '{self.encrypted_email}' USING TTL 360")
            mc.sendmail('bizniz authentication code', mail_body, 'auth-daemon@bizniz.io', [address, ], 'AUTH_EMAIL_PWD')

        elif type == 'sms':
            pass


def validate_otp(code: int, address: str, type: str, uid: str):
    # get the otp
    with get_session() as session:
        results = session.execute(f"SELECT otp, type, validated, uid FROM otp_validations WHERE address = '{address}' AND uid = {uid}")

        for count, r in enumerate(results):
            if count == 0: row = r
            break

        if row.otp == code: # validate the otp
            
            # update the otp_validations database
            session.execute(f"UPDATE otp_validations SET validated = True WHERE address = '{address}' AND uid = {uid}")

            my_user = uModel.get(address)
            # update the appropriate database
            if row.type == "primary":
                session.execute(f"UPDATE users_by_email SET status = 'validated' WHERE email = '{address}'")
            
            elif row.type == "alternate":
                if type == "email":
                    session.execute(f"UPDATE users_by_email SET  ")
                elif type == 'phone':
                    pass


def generate_token(**kwargs):
    with open('.ssh/bizniz_rsa.key', mode='rb') as privatefile:
        privkey = privatefile.read()
    
    payload = kwargs

    encoded = jwt.encode(payload, privkey, algorithm='RS256')
    return encoded


def decode_token(token):
    with open('.ssh/bizniz_rsa_public.key', mode='rb') as publicfile:
        pubkey = publicfile.read()
    
    return jwt.decode(token, pubkey, algorithms=['RS256'])


def is_signature_valid(signature: hex, public_key: hex, contents: hex, type: str = None):
    
    # if isinstance(contents, bytes): contents = contents.decode('utf-8')
    # if isinstance(signature, bytes): signature = signature.decode('utf-8')
    # if isinstance(public_key, bytes): public_key = public_key.decode('utf-8')
    
    converted_content = binascii.unhexlify(contents)
    # converted_public_key = bytes.fromhex(public_key)
    converted_public_key = binascii.unhexlify(public_key)
    converted_signature = binascii.unhexlify(signature)

    verifying_key = VerifyingKey.from_string(converted_public_key, curve=NIST384p, hashfunc=sha384)
    return verifying_key.verify(converted_signature, converted_content)

