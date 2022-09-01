
class BusinessExistsError(Exception):
    def __init__(self, business: str):
        self.__business = business
    def __str__(self):
        return f"Business: {self.__business} is already registered"
