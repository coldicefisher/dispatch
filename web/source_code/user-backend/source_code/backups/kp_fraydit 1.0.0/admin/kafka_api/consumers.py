from kp_fraydit.class_iterators import ClassIterator
from kp_fraydit.classes import BaseClass

class AdminConsumer(BaseClass):
    def __init__(self, url: str, id: str, instance_id: str, client_id: str, assignments: str) -> None:
        self.__url = url
        self.__id = id
        self.__instance_id = instance_id
        self.__client_id = client_id
        self.__assignments = assignments

    def __str__(self) -> str:
        l = []
        l.append('\n')
        l.append(f'#################################\n')
        l.append(f'url: {self.url}')
        l.append(f'id: {self.id}')
        l.append(f'instance_id: {self.instance_id}')
        l.append(f'client_id: {self.client_id}')
        l.append(f'assignments: {self.assignments}')
        l.append(f'\n ################################# \n')
        return '\n'.join

    @property
    def url(self) -> str:
        return self.__url

    @property
    def id(self) -> str:
        return self.__id

    @property
    def instance_id(self) -> str:
        return self.__instance_id

    @property
    def client_id(self) -> str:
        return self.__client_id

    @property
    def assignments(self) -> str:
        return self.__assignments


class AdminConsumers(ClassIterator):
    def __init__(self, group_list=None) -> None:
        super().__init__(group_list)

    