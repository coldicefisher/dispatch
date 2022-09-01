from libs.uuid.uuid import convert_string_to_uuid, is_valid_uuid


class BusinessUser:

    def __init__(self, id: int = None, record: str = None):
        if id is not None: 
            self.__id = id
        else: self.__id = None

        
        if record is not None:
            try:
                self.__first_name, self.__middle_name, self.__last_name, self.__suffix, self.__permissions = record.split("|")
            except:
                self.__first_name = None
                self.__middle_name = None
                self.__last_name = None
                self.__suffix = None
                self.__permissions = None
                
        else:
            self.__first_name = None
            self.__middle_name = None
            self.__last_name = None
            self.__suffix = None
            self.__permissions = None
    

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
        if unformatted_start_date is not None: 
            start_date = time.mktime(datetime.strptime(unformatted_start_date, "%m/%d/%Y").timetuple())
        else: start_date = ''
        
        if item.get('endDate') is not None: unformatted_end_date = item.get('endDate')
        elif item.get('end_date') is not None: unformatted_end_date = item.get('end_date')
        else: unformatted_end_date = None
        if unformatted_end_date is not None:
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



    