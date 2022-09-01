from datetime import datetime
import time
from kp_fraydit.class_iterators import ClassIterator
from kp_fraydit.classes import BaseClass


class ProfileAddress(BaseClass):
    def __init__(self, id: int = None, record: str = None):
        if id is not None: self.__id = id
        else: self.__id = None

        
        if record is not None:
            try:
                self.__start_date, self.__end_date, self.__address_type, self.__address1, self.__address2, self.__city, self.__state, self.__zip = record.split("|")
            except:
                self.__start_date = None
                self.__end_date = None
                self.__address_type = None
                self.__address1 = None
                self.__address2 = None
                self.__city = None
                self.__state = None
                self.__zip = None
        else:
            self.__start_date = None
            self.__end_date = None
            self.__address_type = None
            self.__address1 = None
            self.__address2 = None
            self.__city = None
            self.__state = None
            self.__zip = None
    
    def __str__(self) -> str:

        l = []
        l.append('\n')
        l.append(f'#################################\n')
        l.append(f"Id: {self.id}")
        l.append(f"Start date: {self.start_date}")
        l.append(f"End date: {self.end_date}")
        l.append(f"Address type: {self.address_type}")
        l.append(f"Address 1: {self.address1}")
        l.append(f"Address 2: {self.address2}")
        l.append(f"City: {self.city}")
        l.append(f"State: {self.state}")
        l.append(f"Zip: {self.zip}")
        l.append(f'\n ################################# \n')
        return '\n'.join(l)


    @classmethod
    def from_object(cls, o: dict):
        id = o['id']
        item = o['item']

    @classmethod
    def from_dict(cls, d: dict):
        
        id = d.get('id')
        if d.get('item') is not None: item = d.get('item')
        else: item = d

        if item.get('startDate') is not None: unformatted_start_date = item.get('startDate')
        elif item.get('start_date') is not None: unformatted_start_date = item.get('start_date')
        else: unformatted_start_date = None
        if unformatted_start_date is not None and not unformatted_start_date == '': 
            start_date = time.mktime(datetime.strptime(unformatted_start_date, "%m/%d/%Y").timetuple())
        else: start_date = ''
        
        if item.get('endDate') is not None: unformatted_end_date = item.get('endDate')
        elif item.get('end_date') is not None: unformatted_end_date = item.get('end_date')
        else: unformatted_end_date = None
        if unformatted_end_date is not None and not unformatted_end_date == '':
            end_date = time.mktime(datetime.strptime(unformatted_end_date, "%m/%d/%Y").timetuple())
        else: end_date = ''

        if item.get('addressType') is not None: address_type = item.get('addressType')
        elif item.get('address_type') is not None: address_type = item.get('address_type')
        else: address_type = None

        if item.get('address1') is not None: address1 = item.get('address1')
        else: address1 = None

        if item.get('address2') is not None: address2 = item.get('address2')
        else: address2 = None

        if item.get('city') is not None: city = item.get('city')
        else: city = None

        if item.get('state') is not None: state = item.get('state')
        else: state = None

        if item.get('zip') is not None: zip = item.get('zip')
        else: zip = None

        record = f'{start_date}|{end_date}|{address_type}|{address1}|{address2}|{city}|{state}|{zip}'
        return cls(id, record)

    @property
    def id(self) -> str:
        if self.__id is None: return None
        return int(self.__id)


    @id.setter
    def id(self, value: int):
        self.__id = value


    @property
    def start_date(self) -> datetime:
        try:
            return datetime.strftime(datetime.fromtimestamp(float(self.__start_date)),"%m/%d/%Y")
            
        except Exception as e:
            return None


    @start_date.setter
    def start_date(self, value: str):
        try:
            self.__start_date = time.mktime(datetime.strptime(value, "%m/%d/%Y").timetuple())
            return
        except:
            pass

        raise ValueError()

    @property
    def end_date(self) -> datetime:
        try:
            return datetime.strftime(datetime.fromtimestamp(float(self.__end_date)),"%m/%d/%Y")
        except:
            return None


    @end_date.setter
    def end_date(self, value: str):
        try:
            self.__end_date = time.mktime(datetime.strptime(value, "%m/%d/%Y").timetuple())
            return
        except:
            pass
     
        raise ValueError()


    @property
    def address_type(self) -> str:
        if self.__address_type == 'None': return ''
        return self.__address_type


    @address_type.setter
    def address_type(self, value: str):
        self.__address_type = value


    @property
    def address1(self) -> str:
        if self.__address1 == 'None': return ''
        return self.__address1


    @address1.setter
    def address1(self, value: str):
        self.__address1 = value


    @property
    def address2(self) -> str:
        if self.__address2 == 'None': return ''
        return self.__address2


    @address2.setter
    def address2(self, value: str):
        self.__address2 = value


    @property
    def city(self) -> str:
        if self.__city == 'None': return ''
        return self.__city


    @city.setter
    def city(self, value: str):
        self.__city = value


    @property
    def state(self) -> str:
        if self.__state == 'None': return ''
        return self.__state


    @state.setter
    def state(self, value: str):
        self.__state = value


    @property
    def zip(self) -> str:
        if self.__zip == 'None': return ''
        return self.__zip


    @zip.setter
    def zip(self, value: str):
        self.__zip = value


    @property
    def formatted_record(self) -> str:
        return f'{self.address_type}|{self.address1}|{self.address2}|{self.city}|{self.state}|{self.zip}'

    
    @property
    def formatted_date(self) -> str:
        if self.__start_date is None: raise ValueError()
        # if not isinstance(self.__start_date, float): raise ValueError()
        if self.__end_date is None : raise ValueError()
        # if not isinstance(self.__end_date, float): raise ValueError()

        return f'{self.__start_date}|{self.__end_date}'
    
    @property
    def dict_format(self)-> dict:
        formatted_address = {}
        if self.id is not None:
            formatted_address[int(self.id)] = f'{self.formatted_date}|{self.formatted_record}'
            return formatted_address
        return None


class ProfileAddresses(ClassIterator):
    def __init__(self, l = None):
        super().__init__(l)
