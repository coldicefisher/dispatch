from libs.kp_fraydit.class_iterators import ClassIterator
from libs.kp_fraydit.classes import BaseClass


class ProfileBusiness(BaseClass):

    def __init__(self, name: str = None, record: str = None):
        if name is not None: self.__name = name
        else: self.__name = None

        if record is not None:
            try:
                self.__permissions = record.split("|") 
            except:
                self.__permissions = None
        else:
            self.__permissions = None


    @classmethod
    def from_object(cls, o: dict):
        pass


    @classmethod
    def from_dict(cls, d: dict):
        '''
            Business additions are only controlled by the business model!!!!
        '''
        id = d.get('id')
        if d.get('item') is not None: item = d.get('item')
        else: item = d

        name = item.get('name')
        permissions = item.get('permissions')
        formatted_permissions = "|".join(permissions)

        record = formatted_permissions
        return cls(name, record)

    @property
    def name(self) -> str:
        return self.__name

        
    @property
    def permissions(self) -> list:
        return self.__permissions

    @property
    def formatted_permissions(self) -> list:
        l = []
        for p in self.permissions:
            l.append(f"{self.name}.{p}")
        return l

    @property
    def dict_format(self) -> dict:
        formatted_businesses = {}
        if self.name is not None:
            formatted_businesses[(self.name)] = f'{self.formatted_date}|{self.formatted_permissions}'
            return formatted_businesses
        return None
        

class ProfileBusinesses(ClassIterator):
    def __init__(self, l = None):
        super().__init__(l, "name")
