import requests

from kp_fraydit.connections.connection import KafkaConnection
from kp_fraydit.admin.kafka_api.consumer_groups import ConsumerGroup, ConsumerGroups
from kp_fraydit.classes import BaseClass

kConn = KafkaConnection()

class Cluster(BaseClass):
    def __init__(self, id: str, acls: str, brokers: str, broker_configs: str, consumer_groups: str, 
                    topics: str, partition_reassignments: str
                ) -> None:
        self.__id = id
        self.__acls_url = acls
        self.__brokers_url = brokers
        self.__broker_configs_url = broker_configs
        self.__consumer_groups_url = consumer_groups
        self.__topics_url = topics
        self.__partition_reassignments_url = partition_reassignments


    def __str__(self) -> str:
        l = []
        l.append('\n')
        l.append(f'#################################\n')
        l.append(f'id: {self.id}')
        l.append(f'acls_url: {self.acls_url}')
        l.append(f'broker_configs_url: {self.broker_configs_url}')
        l.append(f'brokers_url: {self.brokers_url}')
        l.append(f'consumer_groups_url: {self.consumer_groups_url}')
        l.append(f'partition_reassignments_url: {self.partition_reassignments_url}')
        l.append(f'topics_url: {self.topics_url}')
        l.append(f'consumer_groups: (count) {len(self.consumer_groups)}')
        l.append(f'\n ################################# \n')
        return '\n'.join(l)

    def _get_consumer_groups(self) -> bool:
        r = requests.get(self.consumer_groups_url)
        data = r.json()

        c_grp = ConsumerGroups()
        for item in data.get('data'):
            
            url = item.get('metadata').get('self')
            group_id = item.get('consumer_group_id')
            is_simple = item.get('is_simple')
            partition_assignor = item.get('partition_assignor')
            state = item.get('state')
            broker_coordinator = item.get('coordinator').get('related')
            try: consumers_url = item.get('consumers').get('related')
            except: consumers_url = ''
            try: lag_summary_url = item.get('lag_summary').get('related')
            except: lag_summary_url = ''

            c = ConsumerGroup(url, group_id, is_simple, partition_assignor, state, broker_coordinator, consumers_url, lag_summary_url)
            c_grp.append(c)

        
        self.__consumer_groups = c_grp
        return True

    @property
    def consumer_groups(self) -> list:
        
        self._get_consumer_groups()
        return self.__consumer_groups
            
    @property
    def id(self) -> str:
        return self.__id
    
    @property
    def acls_url(self) -> str:
        return f'{kConn.kafka_rest_api}/{self.__acls_url}'
    
    @property
    def brokers_url(self) -> str:
        return f'{kConn.kafka_rest_api}/{self.__brokers_url}'

    @property
    def broker_configs_url(self) -> str:
        return f'{kConn.kafka_rest_api}/{self.__broker_configs_url}'

    @property
    def consumer_groups_url(self) -> str:
        return f'{kConn.kafka_rest_api}/{self.__consumer_groups_url}'
    
    @property
    def topics_url(self) -> str:
        return f'{kConn.kafka_rest_api}/{self.__topics_url}'

    @property
    def partition_reassignments_url(self) -> str:
        return f'{kConn.kafka_rest_api}/{self.__partition_reassignments_url}'
