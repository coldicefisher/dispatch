class IncorrectParameterError(Exception):
    def __init__(self, parameter: str):
        self.__parameter = parameter

    def __str__(self):
        return f"Parameter: {self.__parameter} is missing"


class ProfileDoesNotExistError(Exception):
    def __init__(self, parameter: str):
        self.__parameter = parameter

    def __str__(self):
        return f"Profile: {self.__parameter} does not exist"
