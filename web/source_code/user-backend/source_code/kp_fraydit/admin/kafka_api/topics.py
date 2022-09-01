from typing import ChainMap
from kp_fraydit.class_iterators import ClassIterator
import requests
import json

from confluent_kafka.admin import NewTopic
from confluent_kafka.admin import AdminClient


from kp_fraydit.connections.connection import KafkaConnection
from kp_fraydit.classes import BaseClass
from kp_fraydit.admin.kafka_api.partitions import Partition, Partitions
from kp_fraydit.admin.kafka_api.subjects import Subject, Subjects
# from kp_fraydit.admin.kafka_api.clusters import main_cluster
from kp_fraydit.admin.kafka_api.topic_configs import TopicConfig, TopicConfigs
from kp_fraydit.admin.kafka_api.brokers import Broker, Brokers

'''
Uses version 2 of the rest api. Needs to be updated to use version 3
'''
kConn = KafkaConnection()


class Topic(BaseClass):
    def __init__(self, cluster_id: str, name: str, replication_factor = None) -> None:
        self.__name = name
        self.__replication_factor = replication_factor
        self.__cluster_id = cluster_id
        self.__configs = None
        self.__partitions = None

    def __str__(self) -> str:
        l = []
        l.append('\n')
        l.append(f'#################################\n')
        l.append(f'name: {self.name}')
        l.append(f'replication factor: {self.replication_factor}')
        l.append(f'cluster id: {self.cluster_id}')
        l.append(f'configs: {self.configs}')
        l.append(f'partitions: {self.partitions}')
        l.append(f'\n ################################# \n')
        return '\n'.join(l)
    

    @property
    def cluster_id(self):
        return self.__cluster_id

    @property
    def name(self):
        return self.__name

    @property
    def replication_factor(self):
        return self.__replication_factor
    
    @property
    def configs(self):
        return TopicConfigs(self.name, self.cluster_id)

    
    @property
    def partitions(self):
        # if self.__partitions is None: self.__get_partitions
        # return self.__partitions
        return Partitions(cluster_id=self.cluster_id, topic_name=self.name)


def get_topics(cluster_id):
    r = requests.get(f'{kConn.kafka_rest_api}/{kConn.kafka_rest_api_version}/clusters/{cluster_id}/topics')
    # self.debug (f'{kConn.kafka_rest_api}/{kConn.kafka_rest_api_version}/clusters/{cluster_id}/topics')
    data = r.json()
    topic_list = data['data']
    topics = []
    for item in topic_list:
        topics.append({'name': item['topic_name'], 'replication_factor': item['replication_factor']})
        
    return topics


class Topics(ClassIterator):
    def __init__(self, cluster_id, group_list=None) -> None:
        self.debug_on = False
        self.debug(f'Initializing Topics')
        self.debug(f'First time...')
        
        self.__cluster_id  = cluster_id
        l = []
        for item in get_topics(cluster_id):
            l.append(Topic(self.cluster_id, item['name'], item['replication_factor']))
        
        super().__init__(l)
        

    @property
    def cluster_id(self) -> str:
        return self.__cluster_id


    def debug(self, msg: str) -> None:
        if self.debug_on:
            print (msg)

        
    def __getitem__(self, key) -> object:
        for group in self.objList:
            if group.name == key: return Topic(cluster_id=self.cluster_id, name=group.name)


    def create(self, topic_name: str, num_partitions: int = 20, retention_time: int = -1, 
                retention_size: int = -1, replication_factor: int = 3) -> None:
        
        self.debug(f'Creating topic: {topic_name}')
        
        if not self.exists(topic_name):
            
            '''
            Check that the replication factor is not greater than the brokers. If it is greater than the brokers,
            set it equal to the number of brokers
            '''
            self.debug(f'replication factor: {replication_factor} Broker Count: {len(Brokers(self.cluster_id))}')
            if replication_factor > len(Brokers(self.cluster_id)): replication_factor = len(Brokers(self.cluster_id))
            self.debug(f'replication factor: {replication_factor} Broker Count: {len(Brokers(self.cluster_id))}')
            headers = {
                "Content-Type": "application/json"
            }

            payload = {
                "topic_name": topic_name,
                "partitions_count": num_partitions,
                "replication_factor": replication_factor,
            }
            self.debug(payload)
            # Create topic
            r = requests.post(f'{kConn.kafka_rest_api}/{kConn.kafka_rest_api_version}/clusters/{self.cluster_id}/topics', data=json.dumps(payload), headers=headers)
            self.debug(r)
            self.debug(r.status_code)
            self.debug(r.request)
            self.debug(r.reason)
            self.debug(r.headers)
            self.debug(r.text)
            if r.status_code == 201:
                # reload topics
                self.__init__(self.cluster_id)
                return True, r.status_code

            else:
                return False, r.status_code, r.text
        else:
            self.debug('Topic exists.')
            return False, 0, 'Topic Exists'   

    
    def delete(self, topic_name: str) -> tuple:
        if self.exists(topic_name):
            self.debug(f'Deleting topic: {topic_name}...')
            

            r = requests.delete(f'{kConn.kafka_rest_api}/{kConn.kafka_rest_api_version}/clusters/{self.cluster_id}/topics/{topic_name}')
            self.debug(f'Deleted')
        try:
            self.debug(f'Deleting subject: {topic_name}-value...')
            Subjects().delete(f'{topic_name}-value')
            self.debug(f'Deleted')
        except Exception as e:
            return False, e

        try:
            self.debug(f'Deleting subject: {topic_name}-key...')
            Subjects().delete(f'{topic_name}-key')
            self.debug(f'Deleted')
        except Exception as e:
            return False, e

        self.__init__(self.cluster_id)
        return True, ''