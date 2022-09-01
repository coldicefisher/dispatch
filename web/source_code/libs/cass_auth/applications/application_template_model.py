from libs.cass_auth.applications.application_template import ApplicationTemplate
from libs.cass_auth.connect import get_secured_session as get_session
from libs.uuid.uuid import random_uuid
from cassandra.encoder import Encoder
from libs.cass_auth.applications.application_field import ApplicationField, ApplicationFields

cql_encoder = Encoder

class ApplicationTemplateModel:

    def create_from_dict(self, d: dict):
        print (d)

        if d.get('name') is not None: name = d.get('name')
        else: raise ValueError('Create Application: name could not be parsed')

        if d.get('businessId') is not None: business_id = d.get('businessId')
        elif d.get('business_id') is not None: business_id = d.get('business_id')
        else: raise ValueError('Create Application: business id could not be parsed')

        if d.get('visibility') is not None: visibility = d.get('visibility')
        else: raise ValueError('Create Application: visibility could not be parsed')

        if d.get('description') is not None: description = d.get('description')
        else: description = ''

        if d.get('author_id') is not None: author_id = d.get('author_id')
        elif d.get('authorId') is not None: author_id = d.get('authorId')
        else: raise ValueError('Create Application: author id cold not be parsed')

        if d.get('demographics_fields') is not None: demographics_fields = d.get('demographics_fields')
        elif d.get('demographicsFields') is not None: demographics_fields = d.get('demographicsFields')
        else: raise ValueError('Create Application: demographics fields could not be parsed')

        if d.get('demographics_disclaimer') is not None: demographics_disclaimer = d.get('demographics_disclaimer')
        elif d.get('demographicsDisclaimer') is not None: demographics_disclaimer = d.get('demographicsDisclaimer')
        else: demographics_disclaimer = ''

        if d.get('employment_history_lookback') is not None: employment_history_lookback = d.get('employment_history_lookback')
        elif d.get('employmentHistoryLookback') is not None: employment_history_lookback = d.get('employmentHistoryLookback')
        else: raise ValueError('Create Application: employment history lookback could not be parsed')

        if d.get('employment_history_allow_gaps') is not None: employment_history_allow_gaps = d.get('employment_history_allow_gaps')
        elif d.get('employmentHistoryAllowGaps') is not None: employment_history_allow_gaps = d.get('employmentHistoryAllowGaps')
        else: raise ValueError('Create Application: employment history allow gaps could not be parsed')

        
        if d.get('employment_history_disclaimer') is not None: employment_history_disclaimer = d.get('employment_history_disclaimer')
        elif d.get('employmentHistoryDisclaimer') is not None: employment_history_disclaimer = d.get('employmentHistoryDisclaimer')
        else: employment_history_disclaimer = ''


        if d.get('address_history_lookback') is not None: address_history_lookback = d.get('address_history_lookback')
        elif d.get('addressHistoryLookback') is not None: address_history_lookback = d.get('addressHistoryLookback')
        else: raise ValueError('Create Application: address history lookback could not be parsed')

        if d.get('address_history_allow_gaps') is not None: address_history_allow_gaps = d.get('address_history_allow_gaps')
        elif d.get('addressHistoryAllowGaps') is not None: address_history_allow_gaps = d.get('addressHistoryAllowGaps')
        else: raise ValueError('Create Application: address history allow gaps could not be parsed')

        if d.get('address_history_disclaimer') is not None: address_history_disclaimer = d.get('address_history_disclaimer')
        elif d.get('addressHistoryDisclaimer') is not None: address_history_disclaimer = d.get('addressHistoryDislcaimer')
        else: address_history_disclaimer = ''

        if d.get('driving_history_include') is not None: driving_history_include = d.get('driving_history_include')
        elif d.get('drivingHistoryInclude') is not None: driving_history_include = d.get('drivingHistoryInclude')
        else: raise ValueError('Create Application: driving history include could not be parsed')

        if d.get('license_history_lookback') is not None: license_history_lookback = d.get('license_history_lookback')
        elif d.get('licenseHistoryLookback') is not None: license_history_lookback = d.get('licenseHistoryLookback')
        else: license_history_lookback = 0

        if d.get('license_history_disclaimer') is not None: license_history_disclaimer = d.get('license_history_disclaimer')
        elif d.get('license_history_disclaimer') is not None: license_history_disclaimer = d.get('licenseHistoryDisclaimer')
        else: license_history_disclaimer = ''

        if d.get('education_history_include') is not None: education_history_include = d.get('education_history_include')
        elif d.get('educationHistoryInclude') is not None: education_history_include = d.get('educationHistoryInclude')
        else: raise ValueError('Create Application: education history include could not be parsed')

        if d.get('accident_history_include') is not None: accident_history_include = d.get('accident_history_include')
        elif d.get('accidentHistoryInclude') is not None: accident_history_include = d.get('accidentHistoryInclude')
        else: accident_history_include = False

        if d.get('accident_history_lookback') is not None: accident_history_lookback = d.get('accident_history_lookback')
        elif d.get('accidentHistoryLookback') is not None: accident_history_lookback = d.get('accidentHistoryLookback')
        else: accident_history_lookback = 0

        if d.get('accident_history_disclaimer') is not None: accident_history_disclaimer = d.get('accident_history_disclaimer')
        elif d.get('accidentHistoryDisclaimer') is not None: accident_history_disclaimer = d.get('accidentHistoryDisclaimer')
        else: accident_history_disclaimer = ''

        if d.get('equipment_experience_include') is not None: equipment_experience_include = d.get('equipment_experience_include')
        elif d.get('equipmentExperienceInclude') is not None: equipment_experience_include = d.get('equipmentExperienceInclude')
        else: raise ValueError('Create Application: equipment history include could not be parsed')

        if d.get('equipment_types') is not None: equipment_types = d.get('equipment_types')
        elif d.get('equipmentTypes') is not None: equipment_types = d.get('equipmentTypes')
        else: equipment_types = {}

        if d.get('application_disclaimer') is not None: application_disclaimer = d.get('application_disclaimer')
        elif d.get('applicationDisclaimer') is not None: application_disclaimer = d.get('applicationDisclaimer')
        else: application_disclaimer = ''
        
        self.create(name=name, business_id=business_id, visibility=visibility, description=description, author_id=author_id,
                    demographics_fields=demographics_fields, demographics_disclaimer=demographics_disclaimer,
                    employment_history_allow_gaps=employment_history_allow_gaps, employment_history_disclaimer=employment_history_disclaimer, employment_history_lookback=employment_history_lookback,
                    address_history_allow_gaps=address_history_allow_gaps, address_history_disclaimer=address_history_disclaimer, address_history_lookback=address_history_lookback,
                    driving_history_include=driving_history_include, license_history_lookback=license_history_lookback, license_history_disclaimer=license_history_disclaimer,
                    education_history_include=education_history_include,
                    accident_history_disclaimer=accident_history_disclaimer, accident_history_include=accident_history_include, accident_history_lookback=accident_history_lookback,
                    equipment_experience_include=equipment_experience_include, equipment_types=equipment_types,
                    application_disclaimer=application_disclaimer)

    @staticmethod        
    def create(name: str, business_id: str, visibility: str, description: str, author_id: str, 
                demographics_fields: list, demographics_disclaimer: str, 
                employment_history_lookback: float, employment_history_allow_gaps: bool, employment_history_disclaimer: str,
                address_history_lookback: float, address_history_allow_gaps: bool, address_history_disclaimer: str, 
                driving_history_include: bool, license_history_lookback: float, license_history_disclaimer: str, 
                education_history_include: bool, 
                accident_history_include: bool, accident_history_lookback: float, accident_history_disclaimer: str,
                equipment_experience_include: bool, equipment_types: list, 
                application_disclaimer: str):


        # Convert the demographics fields
        my_fields = None
        if isinstance(demographics_fields, list): 
            if isinstance(demographics_fields[0], dict): my_fields = ApplicationFields.from_list(demographics_fields).convert_to_db_format()
            elif isinstance(demographics_fields[0], ApplicationField): my_fields = ApplicationFields(group_list=demographics_fields).convert_to_db_format()
        elif isinstance(demographics_fields, ApplicationFields): my_fields = demographics_fields.convert_to_db_format()
        else: raise ValueError("Create Application: Demographics fields need to be a list of dicts, a list of ApplicationField classes, or an ApplicationFields class")

        if isinstance(equipment_types, set): equipment_types_set = set(equipment_types)
        elif isinstance(equipment_types, list): equipment_types_set = set(equipment_types)
        else: raise ValueError(f'Create Application: equipment_types must be a set or a list')
        print (equipment_types_set)
        with get_session() as session:
            my_id = random_uuid()
            insert_query = f"INSERT INTO applications_templates ("
            insert_query += f"id, name, business_id, visibility, description, author_id, "
            insert_query += f"demographics_fields, demographics_disclaimer, "
            insert_query += f"employment_history_lookback, employment_history_allow_gaps, employment_history_disclaimer, "
            insert_query += f"address_history_lookback, address_history_allow_gaps, address_history_disclaimer, "
            insert_query += "driving_history_include, license_history_lookback, license_history_disclaimer, "
            insert_query += "education_history_include, "
            insert_query += f"accident_history_include, accident_history_lookback, accident_history_disclaimer, "
            if len(equipment_types) > 0: insert_query += "equipment_experience_include, equipment_types, "
            else: insert_query += "equipment_experience_include, "
            insert_query += f"application_disclaimer) VALUES ("
            insert_query += f"{my_id}, '{name}', {business_id} , '{visibility}', '{description}', {author_id}, "
            insert_query += f"{my_fields}, '{demographics_disclaimer}', "
            insert_query += f"{employment_history_lookback}, {employment_history_allow_gaps}, '{employment_history_disclaimer}', "
            insert_query += f"{address_history_lookback}, {address_history_allow_gaps}, '{address_history_disclaimer}', "
            insert_query += f"{driving_history_include}, {license_history_lookback}, '{license_history_disclaimer}', "
            insert_query += f"{education_history_include}, "
            insert_query += f"{accident_history_include}, {accident_history_lookback}, '{accident_history_disclaimer}', "
            if len(equipment_types) > 0: insert_query += f"{equipment_experience_include}, {equipment_types_set}, "
            else: insert_query += f"{equipment_experience_include}, "
            insert_query += f"'{application_disclaimer}'"
            insert_query += f")IF NOT EXISTS"
            
            print ('Creating application...')
            print (insert_query)
            
            session.execute(insert_query)
            return ApplicationTemplate(id=my_id, name=name, business_id=business_id, visibility=visibility, description=description, author_id=author_id,
                                demographics_fields=demographics_fields, demographics_disclaimer=demographics_disclaimer, 
                                employment_history_lookback=employment_history_lookback, employment_history_allow_gaps=employment_history_allow_gaps, employment_history_disclaimer=employment_history_disclaimer,
                                address_history_lookback=address_history_lookback, address_history_disclaimer=address_history_disclaimer, address_history_allow_gaps=address_history_allow_gaps,
                                driving_history_include=driving_history_include, license_history_lookback=license_history_lookback, license_history_disclaimer=license_history_disclaimer,
                                education_history_include=education_history_include,
                                equipment_experience_include=equipment_experience_include, equipment_types=equipment_types,
                                accident_history_disclaimer=accident_history_disclaimer, accident_history_lookback=accident_history_lookback, accident_history_include=accident_history_include,
                                application_disclaimer=application_disclaimer
                                )
            