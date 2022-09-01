from itsdangerous import URLSafeTimedSerializer, URLSafeSerializer
import os

def generate_token(id: str, salt: str = None, key: str = None):
    if salt is None: salt = os.environ.get('TOKENS_SALT_1')
    if key is None: key = os.environ.get('TOKENS_KEY_1')
    serializer = URLSafeTimedSerializer(key)
    return serializer.dumps(id, salt=salt)

def decode_token(id: str, expiration: int = 43200, salt: str = None, key: str = None):
    
    if salt is None: salt = os.environ.get('TOKENS_SALT_1')
    if key is None: key = os.environ.get('TOKENS_KEY_1')

    serializer = URLSafeTimedSerializer(key)
    try:
        value = serializer.loads(
            id,
            salt=salt,
            max_age=expiration
        )
    except:
        return False
    return value
