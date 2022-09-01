from kp_fraydit.class_iterators import ClassIterator


class Field:
    def __init__(self, name: str, types: list, desc: str, record: str = None, parent: str = None) -> None:
        self.__name = name
        self.__types = types
        self.__desc = desc
        self.__record = record
        self.__parent = parent

    def __str__(self) -> str:
        l = []
        l.append('\n')
        l.append(f'#################################\n')
        l.append(self.name)
        l.append(self.types)
        l.append(self.desc)
        l.append(f'\n ################################# \n')
        return '\n'.join(l)


    @property
    def name(self):
        return self.__name

    @property
    def types(self):
        if len(self.__types) == 0: return
        elif len(self.__types) == 1: return self.types[0]
        else: return self.__types

    @property
    def desc(self):
        return self.__desc

    @property
    def record(self):
        return self.__record

    @property
    def parent(self):
        return self.__parent


class Fields(ClassIterator):
    def __init__(self, group_list=None) -> None:
        super().__init__(group_list)


    @property
    def required(self):
        l = ClassIterator()
        for field in self.objList:
            if 'null' not in field.types:
                l.append(field)
        return l


    @property
    def optional(self):
        l = ClassIterator()
        for field in self.objList:
            if 'null' in field.types:
                l.append(field)
        return l

