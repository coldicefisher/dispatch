import requests

from kp_fraydit.class_iterators import ClassIterator
from kp_fraydit.classes import BaseClass
from kp_fraydit.admin.kafka_api.consumers import AdminConsumer, AdminConsumers
from kp_fraydit.connections.connection import KafkaConnection

kConn = KafkaConnection()

class ConsumerGroup(BaseClass):
    def __init__(self, url: str, group_id: str, is_simple: str, partition_assignor: str, state: str, broker_coordinator: str, consumers_url: str, lag_summary_url: str) -> None:
        self.__url = url
        self.__id = group_id
        self.__is_simple = is_simple
        self.__partition_assignor = partition_assignor
        self.__state = state
        self.__broker_coordinator = broker_coordinator
        self.__consumers_url = '/'.join(consumers_url.split('/')[3:])
        self.__lag_summary_url = '/'.join(lag_summary_url.split('/')[3:])

    def __str__(self) -> str:
        l = []
        l.append('\n')
        l.append(f'#################################\n')
        l.append(f'url: {self.url}')
        l.append(f'id: {self.id}')
        l.append(f'is_simple: {self.is_simple}')
        l.append(f'partition_assignor: {self.partition_assignor}')
        l.append(f'state: {self.state}')
        l.append(f'broker_coordinator: {self.broker_coordinator}')
        l.append(f'consumers_url: {self.consumers_url}')
        l.append(f'lag_summary_url: {self.__lag_summary_url}')
        l.append(f'consumers count: {len(self.consumers)}')
        l.append(f'\n ################################# \n')
        return '\n'.join(l)

    @property
    def url(self) -> str:
        return self.__url

    @property
    def id(self) -> str:
        return self.__id

    @property
    def is_simple(self) -> str:
        return self.__is_simple

    @property
    def partition_assignor(self) -> str:
        return self.__partition_assignor

    @property
    def state(self) -> str:
        return self.__state

    @property
    def broker_coordinator(self) -> str:
        return f'{kConn.kafka_rest_api}/{self.__broker_coordinator}'

    @property
    def consumers_url(self) -> str:
        
        return f'{kConn.kafka_rest_api}/{self.__consumers_url}'

    @property
    def consumers(self) -> list():
        r = requests.get(self.consumers_url)
        data = r.json()

        consumers = AdminConsumers()
        for item in data['data']:
            
            url = item.get('metadata').get('self')
            id = item.get('consumer_id')
            instance_id = item.get('instance_id')
            client_id = item.get('client_id')
            assignments = item.get('assignments').get('related')
            
            c = AdminConsumer(url, id, instance_id, client_id, assignments)
            consumers.append(c)

        return consumers

class ConsumerGroups(ClassIterator):
    def __init__(self, group_list=None) -> None:
        super().__init__(group_list)
