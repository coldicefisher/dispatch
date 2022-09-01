from libs.cass_auth.businesses.base_business import BaseBusiness
from libs.cass_auth.connect import get_secured_session as get_session
from libs.cass_auth.profiles.profile_model import ProfileModel
from libs.uuid.uuid import convert_string_to_uuid

class Business(BaseBusiness):
    def __init__(self, name: str):
        super().__init__(name)

    @property
    def serialized_profiles(self):
        l = []
        
        for profile in self.profiles:
            l.append({
                'firstName': profile.first_name,
                'middleName': profile.middle_name,
                'lastName': profile.last_name,
                'suffix': profile.suffix,
                'profileId': str(profile.profile_id),
                'permissions': list(profile.permissions),
                'hasLogin': profile.has_login,
                'deleted': profile.deleted,
                'profilePicture': profile.profile_picture,
                'associationEmail': profile.association_email
            })
        return l

    def delete_profile(self, profile_id: str) -> bool:
        if self.profiles[str(profile_id)] is None: return False
        self.profiles[str(profile_id)].delete()
        self.refresh()
        return True