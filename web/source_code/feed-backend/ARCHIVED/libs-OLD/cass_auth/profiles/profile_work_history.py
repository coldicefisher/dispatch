from kp_fraydit.class_iterators import ClassIterator
from kp_fraydit.classes import BaseClass

from datetime import datetime
import time

class ProfileWorkHistory(BaseClass):
    def __init__(self, id: str = None, record: str = None):
        if id is not None: self.__id = id
        else: self.__id = None

        if record is not None:
            try:
                self.__start_date, self.__end_date, self.__business_name, self.__physical_address1, self.__physical_address2, self.__physical_city, self.__physical_state, \
                    self.__physical_zip, self.__mailing_address1, self.__mailing_address2, self.__mailing_city, self.__mailing_state, self.__mailing_zip, \
                    self.__positions_held, self.__description, self.__supervisor, self.__phone_number, self.__email, self.__website = record.split("|")
            
            except Exception as e:
                self.__start_date = None
                self.__end_date = None
                self.__business_name = None
                self.__physical_address1 = None
                self.__physical_address2 = None
                self.__physical_city = None
                self.__physical_state = None
                self.__physical_zip = None
                self.__mailing_address1 = None
                self.__mailing_address2 = None
                self.__mailing_city = None
                self.__mailing_state = None
                self.__mailing_zip = None
                self.__positions_held = None
                self.__description = None
                self.__supervisor = None
                self.__phone_number = None
                self.__email = None
                self.__website = None
        else:
                self.__start_date = None
                self.__end_date = None
                self.__business_name = None
                self.__physical_address1 = None
                self.__physical_address2 = None
                self.__physical_city = None
                self.__physical_state = None
                self.__physical_zip = None
                self.__mailing_address1 = None
                self.__mailing_address2 = None
                self.__mailing_city = None
                self.__mailing_state = None
                self.__mailing_zip = None
                self.__positions_held = None
                self.__description = None
                self.__supervisor = None
                self.__phone_number = None
                self.__email = None
                self.__website = None

    def __str__(self) -> str:

        l = []
        l.append('\n')
        l.append(f'#################################\n')
        l.append(f"Id: {self.id}")
        l.append(f"Start date: {self.start_date}")
        l.append(f"End date: {self.end_date}")
        l.append(f"Business name: {self.business_name}")
        l.append(f"Physical address 1: {self.physical_address1}")
        l.append(f"Physical address 2: {self.physical_address2}")
        l.append(f"Physical city: {self.physical_city}")
        l.append(f"Physical state: {self.physical_state}")
        l.append(f"Physical zip: {self.physical_zip}")
        l.append(f"Mialing address 1: {self.mailing_address1}")
        l.append(f"Mailing address 2: {self.mailing_address2}")
        l.append(f"Mailng city: {self.mailing_city}")
        l.append(f"Mailing state: {self.mailing_state}")
        l.append(f"Mailing zip: {self.mailing_zip}")
        l.append(f"Positions held: {self.positions_held}")
        l.append(f"Description: {self.description}")
        l.append(f"Supervisor: {self.supervisor}")
        l.append(f"Phone number: {self.phone_number}")
        l.append(f"Email: {self.email}")
        l.append(f"Website: {self.website}")
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
            # s = datetime.strftime(datetime.strptime(unformatted_start_date, "%m/%d/%Y"), "%m/%d/%Y")
            # print (s)
            start_date = time.mktime(datetime.strptime(unformatted_start_date, "%m/%d/%Y").timetuple())
        else: start_date = ''
        
        if item.get('endDate') is not None: unformatted_end_date = item.get('endDate')
        elif item.get('end_date') is not None: unformatted_end_date = item.get('end_date')
        else: unformatted_end_date = None
        if unformatted_end_date is not None and not unformatted_end_date == '':
            end_date = time.mktime(datetime.strptime(unformatted_end_date, "%m/%d/%Y").timetuple())
        else: end_date = ''
        
        if item.get('businessName') is not None: business_name = item.get('businessName')
        elif item.get('business_name') is not None: business_name = item.get('business_name')
        else: business_name = ''

        if item.get('physicalAddress1') is not None: physical_address1 = item.get('physicalAddress1')
        elif item.get('physical_address1') is not None: physical_address1 = item.get('physical_address1')
        else: physical_address1 = ''

        if item.get('physicalAddress2') is not None: physical_address2 = item.get('physicalAddress2')
        elif item.get('physical_address2') is not None: physical_address2 = item.get('physical_address2')
        else: physical_address2 = ''

        if item.get('physicalCity') is not None: physical_city = item.get('physicalCity')
        elif item.get('physical_city') is not None: physical_city = item.get('physical_city')
        else: physical_city = ''

        if item.get('physicalState') is not None: physical_state = item.get('physicalState')
        elif item.get('physical_state') is not None: physical_state = item.get('physical_state')
        else: physical_state = ''

        if item.get('physicalZip') is not None: physical_zip = item.get('physicalZip')
        elif item.get('physical_zip') is not None: physical_zip = item.get('physical_zip')
        else: physical_zip = ''

        if item.get('mailingAddress1') is not None: mailing_address1 = item.get('mailingAddress1')
        elif item.get('mailing_address1') is not None: mailing_address1 = item.get('mailing_address1')
        else: mailing_address1 = ''

        if item.get('mailingAddress2') is not None: mailing_address2 = item.get('mailingAddress2')
        elif item.get('mailing_address2') is not None: mailing_address2 = item.get('mailing_address2')
        else: mailing_address2 = ''

        if item.get('mailingCity') is not None: mailing_city = item.get('mailingCity')
        elif item.get('mailing_city') is not None: mailing_city = item.get('mailing_city')
        else: mailing_city = ''

        if item.get('mailingState') is not None: mailing_state = item.get('mailingState')
        elif item.get('mailing_state') is not None: mailing_state = item.get('mailing_state')
        else: mailing_state = ''

        if item.get('mailingZip') is not None: mailing_zip = item.get('mailingZip')
        elif item.get('mailing_zip') is not None: mailing_zip = item.get('mailing_zip')
        else: mailing_zip = ''

        if item.get('positionsHeld') is not None: positions_held = item.get('positionsHeld')
        elif item.get('positions_held') is not None: positions_held = item.get('positions_held')
        else: positions_held = ''

        if item.get('description') is not None: description = item.get('description')
        else: description = ''

        if item.get('supervisor') is not None: supervisor = item.get('supervisor')
        else: supervisor = ''

        if item.get('phoneNumber') is not None: phone_number = item.get('phoneNumber')
        elif item.get('phone_number') is not None: phone_number = item.get('phone_number')
        else: phone_number = ''
        
        if item.get('email') is not None: email = item.get('email')
        else: email = ''
        
        if item.get('website') is not None: website = item.get('website')
        else: website = ''
        record = f'{start_date}|{end_date}|{business_name}|{physical_address1}|{physical_address2}|{physical_city}|{physical_state}|{physical_zip}|'
        record += f'{mailing_address1}|{mailing_address2}|{mailing_city}|{mailing_state}|{mailing_zip}|'
        record += f'{positions_held}|{description}|{supervisor}|{phone_number}|{email}|{website}'

        return cls(id, record)

    @property
    def id(self) -> int:
        if self.__id is None: return None
        return int(self.__id)

    @id.setter
    def id(self, value: int):
        self.__id = value


    @property
    def business_name(self) -> str:
        if self.__business_name == 'None': return ''
        return self.__business_name


    @business_name.setter
    def business_name(self, value: str):
        self.__business_name = value


    @property
    def positions_held(self) -> str:
        if self.__positions_held == 'None': return ''
        return self.__positions_held


    @positions_held.setter
    def positions_held(self, value: str):
        self.__positions_held = value


    @property
    def description(self) -> str:
        if self.__description == 'None': return ''
        return self.__description


    @description.setter
    def description(self, value: str):
        self.__description = value


    @property
    def start_date(self) -> datetime:
        try:
            return datetime.strftime(datetime.fromtimestamp(float(self.__start_date)),"%m/%d/%Y")
        except:
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
    def physical_address1(self) -> str:
        if self.__physical_address1 == 'None': return ''
        return self.__physical_address1


    @physical_address1.setter
    def physical_address1(self, value: str):
        self.__physical_address1 = value


    @property
    def physical_address2(self) -> str:
        if self.__physical_address2 == 'None': return ''
        return self.__physical_address2


    @physical_address2.setter
    def physical_address2(self, value: str):
        self.__physical_address2 = value


    @property
    def physical_city(self) -> str:
        if self.__physical_city == 'None': return ''
        return self.__physical_city


    @physical_city.setter
    def physical_city(self, value: str):
        self.__physical_city = value


    @property
    def physical_state(self) -> str:
        if self.__physical_state == 'None': return ''
        return self.__physical_state


    @physical_state.setter
    def physical_state(self, value: str):
        self.__physical_state = value


    @property
    def physical_zip(self) -> str:
        if self.__physical_zip == 'None': return ''
        return self.__physical_zip


    @physical_zip.setter
    def physical_zip(self, value: str):
        self.__physical_zip = value


    @property
    def mailing_address1(self) -> str:
        if self.__mailing_address1 == 'None': return ''
        return self.__mailing_address1


    @mailing_address1.setter
    def mailing_address1(self, value: str):
        self.__mailing_address1 = value


    @property
    def mailing_address2(self) -> str:
        if self.__mailing_address2 == 'None': return ''
        return self.__mailing_address2


    @mailing_address2.setter
    def mailing_address2(self, value: str):
        self.__mailing_address2 = value


    @property
    def mailing_city(self) -> str:
        if self.__mailing_city == 'None': return ''
        return self.__mailing_city


    @mailing_city.setter
    def mailing_city(self, value: str):
        self.__mailing_city = value


    @property
    def mailing_state(self) -> str:
        if self.__mailing_state == 'None': return ''
        return self.__mailing_state


    @mailing_state.setter
    def mailing_state(self, value: str):
        self.__mailing_state = value


    @property
    def mailing_zip(self) -> str:
        if self.__mailing_zip == 'None': return ''
        return self.__mailing_zip


    @mailing_zip.setter
    def mailing_zip(self, value: str):
        self.__mailing_zip = value


    @property
    def supervisor(self) -> str:
        if self.__supervisor == 'None': return ''
        return self.__supervisor


    @supervisor.setter
    def supervisor(self, value: str):
        self.__supervisor = value


    @property
    def phone_number(self) -> str:
        if self.__phone_number == 'None': return ''
        return self.__phone_number


    @phone_number.setter
    def phone_number(self, value: str):
        self.__phone_number = value


    @property
    def email(self) -> str:
        if self.__email == 'None': return ''
        return self.__email


    @email.setter
    def email(self, value: str):
        self.__email = value

    @property
    def website(self) -> str:
        if self.__website == 'None': return ''
        return self.__website

    
    @website.setter
    def website(self, value: str):
        self.__website = value

    
    @property
    def formatted_record(self) -> str:
        return f'{self.business_name}|{self.physical_address1}|{self.physical_address2}|{self.physical_city}|{self.physical_state}|{self.physical_zip}|{self.mailing_address1}|{self.mailing_address2}|{self.mailing_city}|{self.mailing_state}|{self.mailing_zip}|{self.positions_held}|{self.description}|{self.supervisor}|{self.phone_number}|{self.email}|{self.website}'


    @property
    def dict_format(self) -> dict:
        formatted_work_history = {}
        if self.id is not None:
            formatted_work_history[int(self.id)] = f'{self.formatted_date}|{self.formatted_record}'
            return formatted_work_history
        return None


    @property
    def formatted_date(self) -> str:
        
        if self.__start_date is None: raise ValueError()
        # if not isinstance(self.__start_date, float): raise ValueError()
        if self.__end_date is None : raise ValueError()
        # if not isinstance(self.__end_date, float): raise ValueError()

        return f'{self.__start_date}|{self.__end_date}'



class ProfileWorkHistories(ClassIterator):
    def __init__(self, l = None):
        super().__init__(l)
