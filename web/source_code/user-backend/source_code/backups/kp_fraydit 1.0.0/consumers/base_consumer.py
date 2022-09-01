import pandas as pd

from kp_fraydit.classes import BaseClass
from confluent_kafka import DeserializingConsumer
# from confluent_kafka.schema_registry import SchemaRegistryClient
from confluent_kafka.schema_registry.avro import AvroDeserializer

from kp_fraydit.connections.connection import KafkaConnection
from kp_fraydit.admin.schema_client import SchemaEngine
from kp_fraydit.metaclasses import SingletonMeta


kConn = KafkaConnection()
eng = SchemaEngine()

# client = SchemaRegistryClient({'url': 'http://10.100.100.8:8081'})


class Consumer(DeserializingConsumer):
    def __init__(self, topic_name: str, group_id: str, read_from_beginning: bool=True) -> None:
        # value_d = AvroDeserializer(schema_registry_client=client, schema_str=eng.get_latest_schema('test-value').schema_str)
        # key_d = AvroDeserializer(schema_registry_client=client, schema_str=eng.get_latest_schema('test-key').schema_str)
        
        '''
        Add topic value and key arguments. If they are empty, default. Consider whether that needs to be abstracted into a
        funtion under the schema engine. Same code is used in the producer.

        Check the schemas and then set the serializer to the schema for the value and the key.

        Once the serializer is set, poll the super to retrieve the data

        Time series data
        '''
        value_d = AvroDeserializer(schema_registry_client=eng, schema_str=eng.get_latest_schema('test-value').schema_str)
        key_d = AvroDeserializer(schema_registry_client=eng, schema_str=eng.get_latest_schema('test-key').schema_str)
        
        if read_from_beginning:
            conf = {'bootstrap.servers': kConn.kafka_broker_listener, 'group.id': group_id, 'value.deserializer': value_d, 'key.deserializer': key_d, 'auto.offset.reset': 'earliest', 'enable.auto.offset.store': 'false', 'enable.auto.commit': 'false'}
        else:
            conf = {'bootstrap.servers': kConn.kafka_broker_listener, 'group.id': group_id, 'value.deserializer': value_d, 'key.deserializer': key_d, 'auto.offset.reset': 'earliest', 'enable.auto.offset.store': 'true', 'enable.auto.commit': 'true'}

        self.__topic_name = topic_name
        super().__init__(conf=conf)
        self.__df = None
        

    def poll(self):
    #     pass
        self.subscribe([self.__topic_name])

        # import time
        # start_time = time.time() 
        while True:
            msg = super().poll()
            print(msg.value())
            print (msg.key())
            # add data to dataframe
    @property
    def topic_name(self):
        return self.__topic_name

    @property
    def dataframe(self):
        if self.__df is None:
            self.__df = pd.DataFrame()
            # Create the columns

            self.__df.columns = []
        else:
            return self.__df
