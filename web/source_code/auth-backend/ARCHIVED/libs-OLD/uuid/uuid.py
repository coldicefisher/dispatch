import uuid

class InvalidUuidError(Exception):
    def __init__(self, value):
        self.__value = value

    def __str__(self):
        return f"String: {self.__value} is not a valid uuid"

def is_valid_uuid(value):
    try:
        uuid.UUID(str(value), version=4)
 
        return True
    except ValueError:
        return False

def convert_string_to_uuid(s: str) -> uuid:
    if is_valid_uuid(s): return uuid.UUID(str(s), version=4)
    raise InvalidUuidError(s)

def random_uuid() -> uuid:
    return uuid.uuid4()
