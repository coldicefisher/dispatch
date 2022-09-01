
class UserDoesNotExistError(Exception):
    def __init__(self, username):
        self.__username = username

    def __str__(self):
        return f"Username: {self.__username} is not registered"

class InvalidCredentialsError(Exception):
    def __init__(self):
        pass
    def __str__(self):
        return f"Invalid Credentials"

class DatabaseFailedError(Exception):
    def __init__(self, msg):
        self.__message = msg
        
    def __str__(self):
        return f"Database failed: {self.__message}"

class AddressAlreadyRegisteredError(Exception):
    def __init__(self, address):
        self.__address = address

    def __str__(self):
        return f"Address: {self.__address} is registered to another account"

class InvalidPhoneNumberError(Exception):
    def __init__(self, phone):
        self.__phone_number = phone

    def __str__(self):
        return f"Phone number: {self.__phone_number} is not in a format that can be parsed as a valid phone number"


class InvalidEmailError(Exception):
    def __init__(self, email):
        self.__email = email

    def __str__(self):
        return f"Email: {self.__email} is not in a format that can be parsed as a valid email"


class InvalidAddressTypeError(Exception):
    def __init__(self, address):
        self.__address = address

    def __str__(self):
        return f"Address: {self.__address} could not be parsed as a phone number or an email"



class InvalidCassUserArgs(Exception):
    def __init__(self):
        pass
    def __str__(self):
        return f"Invalid arguments in initializing CassUser. Must pass a username or an encrypted username"


class OtpCodeExpiredError(Exception):
    def __init__(self):
        pass
    def __str__(self):
        return f"OTP code has expired or does not exist"

class AddressNotRegisteredError(Exception):
    def __init__(self, address: str):
        self.__address = address
    def __str__(self):
        return f"Address: {self.__address} is not registered to a user"

class UserUnauthorizedError(Exception):
    def __init__(self):
        pass
    def __str__(self):
        return f"User not authorized"