from libs.cass_auth.applications.base_application_template import BaseApplicationTemplate

class ApplicationTemplate(BaseApplicationTemplate):
    def __init__(self, id: str, name: str, business_id: str, visibility: str, description: str, author_id: str, 
                demographics_fields: list, demographics_disclaimer: 
                str, employment_history_lookback: float, employment_history_allow_gaps: bool, employment_history_disclaimer, 
                address_history_lookback: float, address_history_allow_gaps: bool, address_history_disclaimer: str, 
                driving_history_include: bool, license_history_lookback: float, license_history_disclaimer: 
                str, education_history_include: 
                bool, accident_history_include: bool, accident_history_lookback: float, accident_history_disclaimer: 
                str, equipment_experience_include: bool, equipment_types: 
                list, application_disclaimer: str):
        
        super().__init__(id=id, name=name, business_id=business_id, visibility=visibility, description=description, author_id=author_id,
        demographics_fields=demographics_fields, demographics_disclaimer=demographics_disclaimer, 
        employment_history_lookback=employment_history_lookback, employment_history_allow_gaps=employment_history_allow_gaps, employment_history_disclaimer=employment_history_disclaimer, 
        address_history_lookback=address_history_lookback, address_history_allow_gaps=address_history_allow_gaps, address_history_disclaimer=address_history_disclaimer, 
        driving_history_include=driving_history_include, license_history_lookback=license_history_lookback, license_history_disclaimer=license_history_disclaimer, 
        education_history_include=education_history_include, 
        accident_history_include=accident_history_include, accident_history_lookback=accident_history_lookback, accident_history_disclaimer=accident_history_disclaimer, 
        equipment_experience_include=equipment_experience_include, equipment_types=equipment_types, 
        application_disclaimer=application_disclaimer)
