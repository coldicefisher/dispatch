from kp_fraydit.producers.base_producer import BaseProducer
from kp_fraydit.admin.schema_client import SchemaEngine
from kp_fraydit.connections.connection import KafkaConnection

from confluent_kafka.schema_registry import Schema

kConn = KafkaConnection()
eng = SchemaEngine()


'''
The subject naming strategy is assumed to be confluent kafkas subject naming strategy of "topic"-value and "topic"-key.
If this strategy is not used, then this class is useless
'''
class AutoProducer(BaseProducer):
    def __init__(self, topic_name: str, value_schema: str = None, key_schema: Schema = None, 
            optional_value_args: list = [], optional_key_args: list = [], cache_schemas: bool = True
        ) -> None:
        super().__init__(topic_name, value_schema, key_schema, optional_value_args, optional_key_args)

    def __validate_field(self, field_name: str, field_type: list, value_schema: str = True):
        '''
        Create or change a field in the schema if its not the same. The update_field holds whether the schema needs to be 
        updated. If the field does not exist or the type does not match, then an update is applied
        '''
        update_field = False
        if value_schema == True:
            if field_name not in self.value_field_names: update_field = True # Field does not exist.
            else: # Field does exist. Check the type
                # Get the types of the current schema
                comp_field_types = ''

        eng.alter_field()
        
    @property
    def value_schema_name(self):
        return f'{self.topic_name}-value'

    @property
    def key_schema_name(self):
        return f'{self.topic_name}-key'

    
    
