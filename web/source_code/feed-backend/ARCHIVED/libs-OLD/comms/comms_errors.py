
class TextClientFailed(Exception):
    def __init__(self, msg):
        self.__msg = msg

    def __str__(self):
        return f"TextClient Error: {self.__msg}"


class ApiFailed(Exception):
    def __init__(self, api_name, msg):
        self.__api_name = api_name
        self.__msg = msg

    def __str__(self):
        return f"ApiFailed Error: {self.__api_name} | Error: {self.__msg}"


# class DatabaseFailedError(Exception):
#     def __init__(self, msg):
#         self.__message = msg

#     def __str__(self):
#         return f"Database failed: {self.__message}"