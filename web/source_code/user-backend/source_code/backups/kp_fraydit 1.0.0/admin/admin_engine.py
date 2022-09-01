import requests
import json

from confluent_kafka.admin import AdminClient
from confluent_kafka.admin import NewTopic

from kp_fraydit.connections.connection import KafkaConnection
from kp_fraydit.metaclasses import SingletonMeta
from kp_fraydit.admin.kafka_api.clusters import Cluster

kConn = KafkaConnection()


class AdminEngine(AdminClient, metaclass=SingletonMeta):
    def __init__(self) -> None:
        # my_server = kConn.kafka_registry_listener.split("/")[2]
        ip, port = kConn.kafka_broker_listener.split(':')
        self.__conf = { "bootstrap.servers": f'{ip}:{port}' }
        super().__init__(self.__conf)

        self.__cluster_list = []

    def topic_exists(self, topic_name: str) -> None:
        topic_metadata = self.list_topics()
        if topic_metadata.topics.get(topic_name) is None: return False
        return True

    def create_topic(self, topic_name: str, num_partitions: int = 5, retention_time: int = -1, retention_size: int = -1) -> None:
        if not self.topic_exists(topic_name):
            my_topic = NewTopic(topic=topic_name, num_partitions=5, config={'retention.ms': f'{retention_time}', 'retention.bytes': f'{retention_size}', })
            self.create_topics([my_topic,])

    def get_clusters(self) -> list:

        r = requests.get(f'{kConn.kafka_rest_api}{kConn.kafka_rest_api_version}/clusters')
        data = r.json()
        cluster_list = data['data']
        clusters = []
        for item in cluster_list:
            
            cluster_id = item['cluster_id']
            acls = '/'.join(item['acls']['related'].split('/')[3:])
            brokers = '/'.join(item['brokers']['related'].split('/')[3:])
            broker_configs = '/'.join(item['broker_configs']['related'].split('/')[3:])
            consumer_groups = '/'.join(item['consumer_groups']['related'].split('/')[3:])
            topics = '/'.join(item['topics']['related'].split('/')[3:])
            partition_reassignments = '/'.join(item['partition_reassignments']['related'].split('/')[3:])
            c = Cluster(cluster_id, acls, brokers, broker_configs, consumer_groups, topics, partition_reassignments)
            clusters.append(c)
        self.__cluster_list = clusters

        return True

    @property
    def kafka_cluster(self) -> dict:
        if not len(self.__cluster_list):
            self.get_clusters()
        return self.__cluster_list[0]

            

