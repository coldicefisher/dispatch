from kp_fraydit.class_iterators import ClassIterator
from kp_fraydit.classes import BaseClass


class ProfileImage(BaseClass):

    def __init__(self, id: int = None, record: str = None):
        if id is not None: self.__id = id
        else: self.__id = None

        
        if record is not None:
            try:
                self.__image_type, self.__uuid, self.__original_url, self.__cdn_url, self.__name, self.__mime_type, self.__size = record.split("|")
            except Exception as e:
                
                self.__image_type = None
                self.__uuid = None
                self.__original_url = None
                self.__cdn_url = None
                self.__name = None
                self.__mime_type = None
                self.__size = None
                
        else:
            
            self.__image_type = None
            self.__uuid = None
            self.__original_url = None
            self.__cdn_url = None
            self.__name = None
            self.__mime_type = None
            self.__size = None
    

    @classmethod
    def from_object(cls, o: dict):
        id = o['id']
        item = o['item']

    @classmethod
    def from_dict(cls, d: dict):
        
        id = d.get('id')
        if d.get('item') is not None: item = d.get('item')
        else: item = d
        
        if item.get('imageType') is not None: image_type = item.get('imageType')
        elif item.get('image_type') is not None: image_type = item.get('image_type')
        else: image_type = None
        
        uuid = item.get('uuid')
        
        if item.get('cdnUrl') is not None: cdn_url = item.get('cdnUrl')
        elif item.get('cdn_url') is not None: cdn_url = item.get('cdn_url')
        else: cdn_url = None

        if item.get('originalUrl') is not None: original_url = item.get('originalUrl')
        elif item.get('original_url') is not None: original_url = item.get('original_url')
        else: original_url = None

        if item.get('mimeType') is not None: mime_type = item.get('mimeType')
        elif item.get('mime_type') is not None: mime_type = item.get('mime_type')
        else: mime_type = None

        size = item.get('size')
        name = item.get('name')

        record = f'{image_type}|{uuid}|{original_url}|{cdn_url}|{name}|{mime_type}|{size}'
        return cls(id, record)


    @property
    def id(self) -> str:
        if self.__id is None: return None
        return int(self.__id)


    @id.setter
    def id(self, value: int):
        self.__id = value


    @property
    def image_type(self) -> str:
        if self.__image_type == 'None': return ''
        return self.__image_type

    
    @image_type.setter
    def image_type(self, value: str):
        self.__image_type = value

    
    @property
    def uuid(self) -> str:
        if self.__uuid == 'None': return ''
        return self.__uuid


    @uuid.setter
    def uuid(self, value: str):
        self.__uuid = value


    @property
    def name(self) -> str:
        if self.__name == 'None': return ''
        return self.__name


    @name.setter
    def name(self, value: str):
        self.__name = value


    @property
    def original_url(self) -> str:
        if self.__original_url == 'None': return ''
        return self.__original_url


    @original_url.setter
    def original_url(self, value: str):
        self.__original_url = value


    @property
    def cdn_url(self) -> str:
        if self.__cdn_url == 'None': return ''
        return self.__cdn_url


    @cdn_url.setter
    def cdn_url(self, value: str):
        self.__cdn_url = value


    @property
    def mime_type(self) -> str:
        if self.__mime_type == 'None': return ''
        return self.__mime_type


    @mime_type.setter
    def mime_type(self, value: str):
        self.__mime_type = value


    @property
    def size(self) -> float:
        try:
            return float(self.__size)
        except:
            return 0


    @size.setter
    def size(self, value: float):
        self.__size = value
    

    @property
    def formatted_record(self) -> str:
        
        return f'{self.image_type}|{self.uuid}|{self.original_url}|{self.cdn_url}|{self.name}|{self.mime_type}|{self.size}'

    
    @property
    def dict_format(self)-> dict:
        formatted_address = {}
        if self.id is not None:
            formatted_address[int(self.id)] = f'{self.formatted_record}'
            return formatted_address
        return None


class ProfileImages(ClassIterator):
    def __init__(self, l = None):
        super().__init__(l, "uuid")
