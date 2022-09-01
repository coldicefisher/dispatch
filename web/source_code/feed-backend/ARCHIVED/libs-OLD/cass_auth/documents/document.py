from datetime import datetime
import binascii
import base64

from kp_fraydit.classes import BaseClass
from kp_fraydit.class_iterators import ClassIterator


from libs.cass_auth.security import is_signature_valid
from libs.cass_auth.connect import get_secured_session as get_session

class Documents(ClassIterator):
    def __init__(self, l = None):
        super().__init__(l, "id")

    
class Document(BaseClass):
    def __init__(self, id: str, template_name: str, profile_id: str, created_at: datetime, signature: hex = None, contents: hex = None, public_key: hex = None):
        self.__id = id
        self.__template_name = template_name
        self.__profile_id = profile_id
        self.__created_at = created_at

        self.__signature = signature
        self.__contents = contents
        self.__public_key = public_key
    

    @classmethod
    def from_id(cls, id: str):
        
        with get_session() as session:
            result = session.execute(f"SELECT profile_id, created_at, template_name, signature, contents, public_key FROM documents WHERE id = {id}")
            
            for row in result: 
                my_row = row
                break

        return cls(id=id, template_name=my_row.template_name, profile_id=my_row.profile_id, created_at=my_row.created_at, signature=my_row.signature, contents=my_row.contents, public_key=my_row.public_key)


    @property
    def id(self) -> str:
        return self.__id


    @property
    def template_name(self) -> str:
        return self.__template_name


    @property
    def db_table(self) -> str:
        return self.__template_name.split('.')[0]

    
    @property
    def template_version(self) -> str:
        return self.__template_name.split('.')[1]

    
    @property
    def template_version_client_friendly(self) -> str:
        words = self.template_version.split("_")
        if len(words) > 1: words = words[:-1]
        capitalized = [w.capitalize() for w in words]
        return (" ").join(capitalized)


    @property
    def profile_id(self) -> str:
        return self.__profile_id


    @property
    def signature(self) -> str:
        return self.__signature


    @property
    def contents(self) -> str:
        return self.__contents


    @property
    def converted_contents(self) -> str:
        unhexed = binascii.unhexlify(self.__contents)
        decoded = unhexed.decode('utf-8')
        return decoded
        # Decode the Base64 string, making sure that it contains only valid characters
        

    @property
    def public_key(self) -> str:
        return self.__public_key


    @property
    def created_at(self) -> datetime:
        return self.__created_at


    @property
    def is_valid(self) -> bool:
        return is_signature_valid(signature=self.__signature, public_key=self.__public_key, contents=self.__contents)
