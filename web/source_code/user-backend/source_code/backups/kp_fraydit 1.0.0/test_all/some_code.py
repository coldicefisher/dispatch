from microservice.source_code.kp_fraydit.connectors.connector import Connector
from kp_fraydit.connections.connection import KafkaConnection
kConn = KafkaConnection()
kConn.kafka_broker_listener = '10.100.100.8:9092'
kConn.kafka_registry_listener = 'http://10.100.100.8:8081'


from kp_fraydit.schema_client import SchemaEngine
eng = SchemaEngine()

# all_fields = eng.get_key_fields('test-key')
# all_fields = eng.get_value_fields('test-value')

from kp_fraydit.producers.producer import Producer

prod = Producer('test_no_schema')

from kp_fraydit.test_all import test_main




# ////////////////////////////////////

from confluent_kafka.admin import AdminClient
from confluent_kafka.admin import NewTopic

from kp_fraydit.connections.connection import KafkaConnection
from kp_fraydit.metaclasses import SingletonMeta

kConn = KafkaConnection()

admin = AdminClient({'bootstrap.servers': '10.100.100.8'})

my_topic = NewTopic(topic='test_create_1', num_partitions=5, config={'retention.bytes': '-1', 'retention.ms': '-1'})
admin.create_topics([my_topic,])



# //////////////////////////////////////

from kp_fraydit.connections.connection import KafkaConnection
kConn = KafkaConnection()
kConn.kafka_broker_listener = '10.100.100.8:9092'
kConn.kafka_registry_listener = 'http://10.100.100.8:8081'

from kp_fraydit.financial.price_connector import PriceConnector
from kp_fraydit.connectors.connector import Connector

price_conn = PriceConnector('test_price_6')
conn = Connector('test_price_6')

price_conn.alter_field('maybe_works', ['float', 'integer'], False)
price_conn.alter_field('maybe_works', 'float', False)
price_conn.alter_field('maybe_works', 'float', True)

from kp_fraydit.schema_client import SchemaEngine

eng = SchemaEngine()

from kp_fraydit.admin import AdminEngine

admin = AdminEngine()



# /////////////CONSUMER THAT READS FROM BEGINNING

from kp_fraydit.connections.connection import KafkaConnection
kConn = KafkaConnection()
kConn.kafka_broker_listener = '10.100.100.8:9092'
kConn.kafka_registry_listener = 'http://10.100.100.8:8081'

from confluent_kafka import DeserializingConsumer

from kp_fraydit.admin.schema_client import SchemaEngine
eng = SchemaEngine()

from confluent_kafka.schema_registry import SchemaRegistryClient
client = SchemaRegistryClient({'url': 'http://10.100.100.8:8081'})

from confluent_kafka.schema_registry.avro import AvroDeserializer
value_d = AvroDeserializer(schema_registry_client=client, schema_str=eng.get_latest_schema('test-value').schema_str)
key_d = AvroDeserializer(schema_registry_client=client, schema_str=eng.get_latest_schema('test-key').schema_str)

from confluent_kafka import DeserializingConsumer
c = DeserializingConsumer({'bootstrap.servers': '10.100.100.8:9092', 'group.id': '3', 'value.deserializer': value_d, 'key.deserializer': key_d, 'auto.offset.reset': 'earliest', 'enable.auto.offset.store': 'false', 'enable.auto.commit': 'false'})

c.subscribe(['test'])

import time
start_time = time.time() 
while True:
    msg = c.poll()
    #msg = c.consume(num_messages=10000)
    print (msg.value())
    print (msg.key())
    if start_time + 60 < time.time():
        print ('gotta go!')
        break

# END CONSUMER THAT READS FROM BEGINNING ////////////////////////////////


# CONSUMER THAT READS LATEST ////////////////////////////////////////////
from kp_fraydit.connections.connection import KafkaConnection
kConn = KafkaConnection()
kConn.kafka_broker_listener = '10.100.100.8:9092'
kConn.kafka_registry_listener = 'http://10.100.100.8:8081'


from confluent_kafka import DeserializingConsumer

from kp_fraydit.admin.schema_client import SchemaEngine
eng = SchemaEngine()

from confluent_kafka.schema_registry import SchemaRegistryClient
client = SchemaRegistryClient({'url': 'http://10.100.100.8:8081'})

from confluent_kafka.schema_registry.avro import AvroDeserializer
value_d = AvroDeserializer(schema_registry_client=client, schema_str=eng.get_latest_schema('test-value').schema_str)
key_d = AvroDeserializer(schema_registry_client=client, schema_str=eng.get_latest_schema('test-key').schema_str)

from confluent_kafka import DeserializingConsumer
c = DeserializingConsumer({'bootstrap.servers': '10.100.100.8:9092', 'group.id': '2', 'value.deserializer': value_d, 'key.deserializer': key_d, 'auto.offset.reset': 'earliest'})

c.subscribe(['test'])

import time
start_time = time.time() 
while True:
    msg = c.poll()
    #msg = c.consume(num_messages=10000)
    print (msg.value())
    print (msg.key())
    if start_time + 600 < time.time():
        print ('gotta go!')
        break


# END CONSUMER THAT READS LATEST ////////////////////////////////////////


from kp_fraydit.connections.connection import KafkaConnection
kConn = KafkaConnection()
kConn.kafka_broker_listener = '10.100.100.8:9092'
kConn.kafka_registry_listener = 'http://10.100.100.8:8081'

from kp_fraydit.admin.schema_client import SchemaEngine
eng = SchemaEngine()

# all_fields = eng.get_key_fields('test-key')
# all_fields = eng.get_value_fields('test-value')

# /////////// REST API CODE


from kp_fraydit.connections.connection import KafkaConnection
kConn = KafkaConnection()
kConn.kafka_broker_listener = '10.100.100.8:9092'
kConn.kafka_registry_listener = 'http://10.100.100.8:8081'
import requests
import json

            
from kp_fraydit.admin.admin_engine import AdminEngine

admin = AdminEngine()

my_cluster = admin.first_cluster




import requests

from kp_fraydit.admin.admin_engine import AdminEngine

admin = AdminEngine()
my_cluster = admin.first_cluster
grp = my_cluster.consumer_groups["2"]
# print (my_cluster.consumer_groups)
repr(my_cluster.consumer_groups)


for c in grp.consumers:
    print (f'Consumer id: {c.id} url: {c.url} instance id: {c.instance_id} client id: {c.client_id} assignments: {c.assignments}')



from kp_fraydit.consumers.base_consumer import Consumer
con = Consumer('test', '')
con.poll()



            
from kp_fraydit.admin.schema_client import SchemaEngine
eng = SchemaEngine()
#current_schema = eng.get_latest_schema('test_key_json_value_json-value')
eng.delete_field('test_key_json_value_json-value', 'myField4')


from kp_fraydit.producers.base_producer import BaseProducer

prod = BaseProducer.from_schema_names('test')
prod.addValueArgs(open=213,high=231,low=213,close=213,volume=21434,sourceNested='hello',timestampNested=4353245)
prod.addKeyArgs(key='key', date=3142342)


from kp_fraydit.schema.processed_schema import ProcessedSchema
from kp_fraydit.schema.schema_client import SchemaEngine

eng = SchemaEngine()
schema = ProcessedSchema(eng.get_latest_schema('test-key'), True)
print (schema.fields.required)

schema = ProcessedSchema.from_subject_name('test-value')