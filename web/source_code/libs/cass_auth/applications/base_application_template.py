
class BaseApplicationTemplate:
    def __init__(self, id: str, name: str, business_id: str, visibility: str, author_id: str,
            description: str, demographics_fields: list, demographics_disclaimer: str,
            employment_history_lookback: float, employment_history_allow_gaps: bool, employment_history_disclaimer,
            address_history_lookback: float, address_history_allow_gaps: bool, address_history_disclaimer: str,
            driving_history_include: bool, license_history_lookback: float, license_history_disclaimer: str,
            education_history_include: bool, 
            accident_history_include: bool, accident_history_lookback: float, accident_history_disclaimer: 
            str, equipment_experience_include: bool, equipment_types: list,
            application_disclaimer: str):
        
        self.__id = id
        self.__name = name
        self.__business_id = business_id
        self.__author_id = author_id
        self.__visibility = visibility
        self.__description = description
        self.__demographics_fields = demographics_fields
        self.__demographics_disclaimer = demographics_disclaimer

        self.__employment_history_lookback = employment_history_lookback
        self.__employment_history_allow_gaps = employment_history_allow_gaps
        self.__employment_history_disclaimer = employment_history_disclaimer

        self.__address_history_lookback = address_history_lookback
        self.__address_history_allow_gaps = address_history_allow_gaps
        self.__address_history_disclaimer = address_history_disclaimer
        
        self.__driving_history_include = driving_history_include
        self.__license_history_lookback = license_history_lookback
        self.__license_history_disclaimer = license_history_disclaimer
        
        self.__education_history_include = education_history_include
        
        self.__accident_history_include = accident_history_include
        self.__accident_history_lookback = accident_history_lookback
        self.__accident_history_disclaimer = accident_history_disclaimer
        
        self.__equipment_experience_include = equipment_experience_include
        self.__equipment_types = equipment_types
        
        self.__application_disclaimer = application_disclaimer

    
    @property
    def id(self) -> str:
        return self.__id

    @property
    def name(self) -> str:
        return self.__name
    
    @property
    def business_id(self) -> str:
        return self.__business_id

    @property
    def author_id(self) -> str:
        return self.__author_id

    @property
    def visibility(self) -> str:
        return self.__visibility

    @property
    def description(self) -> str:
        return self.__description

    @property
    def demographics_fields(self) -> list:
        return self.__demographics_fields

    @property
    def demographics_disclaimer(self) -> str:
        return self.__demographics_disclaimer

    @property
    def employment_history_lookback(self) -> float:
        return self.__employment_history_lookback

    @property
    def employment_history_allow_gaps(self) -> str:
        return self.__employment_history_allow_gaps

    @property
    def employment_history_disclaimer(self) -> str:
        return self.__employment_history_disclaimer

    @property
    def address_history_lookback(self) -> str:
        return self.__address_history_lookback

    @property
    def address_history_allow_gaps(self) -> str:
        return self.__address_history_allow_gaps

    @property
    def address_history_disclaimer(self) -> str:
        return self.__address_history_disclaimer

    @property
    def driving_history_include(self) -> bool:
        return self.__driving_history_include

    @property
    def license_history_lookback(self) -> float:
        return self.__license_history_lookback

    @property
    def license_history_disclaimer(self) -> str:
        return self.__license_history_disclaimer

    @property
    def education_history_include(self) -> bool:
        return self.__education_history_include

    @property
    def accident_history_include(self) -> bool:
        return self.__accident_history_include

    @property
    def accident_history_lookback(self) -> float:
        return self.__accident_history_lookback

    @property
    def accident_history_disclaimer(self) -> str:
        return self.__accident_history_disclaimer

    @property
    def equipment_experience_include(self) -> bool:
        return self.__equipment_experience_include

    @property
    def equipment_types(self) -> set:
        return self.__equipment_types

    @property
    def application_disclaimer(self) -> str:
        return self.__application_disclaimer
        
    