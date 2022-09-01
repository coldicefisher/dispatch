
class ConsumerError(Exception):
    def __init__(self, message: str):
        self.__message = message
    def __str__(self):
        return f"Consumer Error: {self.__message}"
