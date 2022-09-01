from libs.kp_fraydit.classes import BaseClass

class BusinessSubscription(BaseClass):
    
    @property
    def name(self):
        try: return self.__name
        except: return None

    @name.setter
    def name(self, value):
        self.__name = value

    @property
    def isDriver(self):
        try: return self.__isDriver
        except: return False

    @isDriver.setter
    def isDriver(self, value):
        self.__isDriver = value

    @property
    def isEmployee(self):
        try: return self.__isEmployee
        except: return False

    @isEmployee.setter
    def isEmployee(self, value):
        self.__isEmployee = value

    @property
    def isHr(self):
        try: return self.__isHr
        except: return False

    @isHr.setter
    def isHr(self, value):
        self.__isHr = value

    @property
    def isAssets(self):
        try: return self.__isAssets
        except: return False

    @isAssets.setter
    def isAssets(self, value):
        self.__isAssets = value

    @property
    def isDispatching(self):
        try: return self.__isDispatching
        except: return False

    @isDispatching.setter
    def isDispatching(self, value):
        self.__isDispatching = value

    @property
    def isAdministrator(self):
        try: return self.__isAdministrator
        except: return False

    @isAdministrator.setter
    def isAdministrator(self, value):
        self.__isAdministrator = value
