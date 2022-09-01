from libs.kp_fraydit.classes import BaseClass
from libs.kp_fraydit.class_iterators import ClassIterator

from cassandra.encoder import Encoder

cql_encoder = Encoder()


class ApplicationFields(ClassIterator):
    def __init__(self, group_list=None):
        super().__init__(group_list=group_list, primary_key='name')

    @classmethod
    def from_list(cls, l: list):
        my_list = []
        for unconverted_field in l:
            my_list.append(ApplicationField.from_dict(unconverted_field))
        return cls(group_list=my_list)

    def convert_to_dict(self):
        d = dict()
        for field in self.objList:
            d = {**d, **field.to_dict}
        
        return d

    def convert_to_db_format(self):
        return cql_encoder.cql_encode_map_collection(self.convert_to_dict())
        



class ApplicationField(BaseClass):
    def __init__(self, name: str, type: str, values: set):
        self.__name = name
        self.__type = type
        self.__values = values

    @classmethod
    def from_db(cls, key, value):
        type, values = value.split('|')
        values_list = values.split(',')
        values_set = set(values_list)
        return cls(key, type, values_set)


    @classmethod
    def from_dict(cls, d: dict):
        if d.get('name') is not None: name = d.get('name')
        elif d.get('Name') is not None: name = d.get('Name')
        elif d.get('fieldName') is not None: name = d.get('fieldName')
        elif d.get('field_name') is not None: name = d.get('field_name')
        else: name = ''

        if d.get('type') is not None: type = d.get('type')
        elif d.get('Type') is not None: type= d.get('Type')
        elif d.get('fieldType') is not None: type = d.get('fieldType')
        elif d.get('field_type') is not None: type = d.get('field_type')
        else: type = ''

        if d.get('values') is not None: values = d.get('values')
        elif d.get('Values') is not None: values = d.get('Values')
        elif d.get('fieldValues') is not None: values = d.get('fieldValues')
        elif d.get('field_values') is not None: values = d.get('field_values')
        else: values = ''

        values_set = set(values)
        return cls(name, type, values_set)

    @property
    def name(self) -> str:
        return self.__name

    @property
    def type(self) -> str:
        return self.__type

    @property
    def values(self) -> set:
        return self.__values


    @property
    def to_dict(self) -> dict:
        d = dict()
        d[self.name] = f'{self.type}|{(",").join(self.values)}'
        return d