from confluent_kafka.schema_registry import Schema

from kp_fraydit.schema.fields import Field, Fields
from kp_fraydit.schema.schema_client import SchemaEngine
from kp_fraydit.connections.connection import KafkaConnection

kConn = KafkaConnection()
eng = SchemaEngine()

'''
todo create error classes to handle data types
'''
class ProcessedSchema:
    def __init__(self, schema: Schema, is_value_schema: bool=None) -> None:
        # if not isinstance(schema, Schema): raise TypeError
        
        self.__raw_schema = schema
        self.__is_value_schema = is_value_schema
        self.__fields = None
        self.__process_schema()

    @classmethod
    def from_topic_name(cls, topic_name: str, is_value_schema: bool = True):
        if is_value_schema == True: subject_name = f'{topic_name}-value'
        else: subject_name = f'{topic_name}-key'
        return cls.__init__(eng.get_latest_schema(subject_name), is_value_schema)
    
    @classmethod
    def from_subject_name(cls, subject_name: str) -> object:
        fetched_schema = eng.get_latest_schema(subject_name)
        schema_type = subject_name.split('-')[-1:]
        if schema_type == 'value': is_value_schema = True
        elif schema_type == 'key': is_value_schema = False
        else: is_value_schema = True
        '''
        self.__raw_schema will be None if the schema does not exist. This should be handled in the processor method
        '''
        
        return cls.__init__(fetched_schema, is_value_schema)


    @classmethod
    def from_raw(cls, schema_string: str, schema_type: str, is_value_schema: bool=None) -> object:
        if is_value_schema is None: is_value_schema = True # default to value schema when not specified
        created_schema = Schema()
        created_schema.schema_str = schema_string
        created_schema.schema_type = schema_type
        return cls.__init__(created_schema, is_value_schema)


    @property
    def raw_schema(self) -> Schema:
        return self.__raw_schema

    
    @property
    def is_value_schema(self) -> bool:
        return self.__is_value_schema

    @property
    def schema_type(self) -> str:
        return self.__schema_type

    @property
    def fields(self) -> Fields:
        return self.__fields
    
    
    # PROCESS SCHEMA ///////////////////////////////////////////////////////////////////////////////////////////////
    # //////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    def __process_schema(self) -> dict:
        current_schema = self.raw_schema
        value_fields = []
        all_fields = []
        required_fields = []
        optional_fields = []

        '''
            NO SCHEMA methods. 
            get whether it is a value or a key schema. Use that to build for a no schema type and return fields
        '''

        # no schema (raw schema applies to None if it is pulled If one is passed, no worries). 
        # and no type specified. Return value schema
        self.__schema_type = None

        def return_value_schema():

            fields_ = Fields()
            field_ = Field()
            name = 'value'
            types = ['string', 'float'] # set to all value types
            desc = ""
            fields_.append(field_(name, types, desc))
            
            self.__fields = fields_
        
            return True


        def return_key_schema():

            fields_ = Fields()
            field_ = Field()
            name = 'key'
            types = ['string', 'float', 'null'] # set to all value types
            desc = ""
            fields_.append(field_(name, types, desc))
            
            self.__fields = fields_
        
            return True


        if self.raw_schema is None and self.__is_value_schema is None: 
            return return_value_schema()

        if self.raw_schema is None and self.__is_value_schema is True: 
            return return_value_schema()

        if self.raw_schema is None and self.__is_value_schema is False:
            return return_key_schema()
        
        
        '''
        Process the schema fields by schema type. all_fields uses eval to build a list of dictionaries that represent the
        fields
        '''

        if current_schema.schema_type == 'AVRO': # Avro schema
            self.__schema_type = 'AVRO'
            all_fields = eval('dict('+current_schema.schema_str+')')['fields']
            
        elif current_schema.schema_type == 'JSON': # JSON schema
            self.__schema_type = 'JSON'
            json_list = []
            value_fields = eval('dict('+current_schema.schema_str+')')['properties']
            for value_field_name, value_field_contents in value_fields.items():
                my_dict = {}
                my_dict['name'] = value_field_name
                for k, v in value_field_contents.items():
                    if k == 'description': my_dict['doc'] = v
                    else: my_dict[k] = v
                    
                json_list.append(my_dict)
            all_fields = json_list
        
        
        fields_ = Fields()

        for value_field in all_fields:
            name = value_field['name']
            my_type = value_field['type']
            try: desc = value_field.get('doc')
            except: desc = ''
            
            '''
            1.1 iterate the field types. 1.2 If any type is a dictionary, then the record is a nested type. Ex:
            type: [
                'null',
                {                                                 1.2 will test true here
                    'name': 'TestPathElement',
                    'type': 'record',                             1.3 will test true here 1.4 will test true for 'record'
                    'fields': [
                        {                                  1.5 will iterate these elements
                            'name': 'sourceNested',
                            'type': ['string', 'float']
                        }
                    ]
                }
                
            ]
            nested stores the value of whether the rcord is nested or not. At the end of the loops, all non-nested fields
            are added and this boolean controls that. Both record and parent is set to none at the beginning of the iteration
            
            1.3 Check if the nested field has a 'type' key. 1.5 Iterate the fields of the nested element and build a field
            '''
            for type_ in value_field['type']: # 1.1 Iterate the field types.
                nested = False
                record = None
                parent = None            

                if isinstance(type_, dict): # 1.2 The field type contains a record
                    nested = True # toggle nested for the purposes of adding the non-nested fields
                    if 'type' in type_.keys(): # 1.3 Ensure the that 'type' is in the keys of the nested field. If not, we are not going to evaluate
                        if type_['type'] == 'record': # 1.4 type is record
                            for element in type_['fields']: # 1.5 iterate the sub elements
                                record = type_['name']
                                parent = value_field['name']
                                name = element['name']
                                my_type = element['type']
                                if isinstance(my_type, list): list_type = my_type
                                else:
                                    list_type = []
                                    list_type.append(my_type)
                                if 'null' in value_field['type']: list_type.append('null')
                                try: desc = value_field.get('doc')
                                except: desc = ''
                                fields_.append(Field(name, my_type, desc, record, parent))
                                continue
                        else: # the type is a dict. there is a dictionary in the type. type does not exist in in the keys
                            pass
                    else: # the type is a dict. there is a dictionary in the type
                        pass

                else: # the type is not a dict. It is not nested
                    pass
            
            if not nested: fields_.append(Field(name, my_type, desc, record, parent))
        
        self.__fields = fields_
        return True
        
    # END PROCESS SCHEMA ///////////////////////////////////////////////////////////////////////////////////////////
    # //////////////////////////////////////////////////////////////////////////////////////////////////////////////
            
