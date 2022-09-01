from libs.cass_auth.businesses.base_business import BaseBusiness
from libs.cass_auth.connect import get_secured_session as get_session
from libs.cass_auth.profiles.profile_model import ProfileModel
from libs.uuid.uuid import convert_string_to_uuid

from libs.cass_auth.profiles.base_profile import convert_address_list, convert_images_list
from libs.exceptions.auth_exceptions import DatabaseFailedError
from cassandra.encoder import Encoder

cql_encoder = Encoder()


class Business(BaseBusiness):
    def __init__(self, name: str, id: str = None, display_name: str = None, dot_number: str = None, dot_verified: str = None, 
                    industry: str = None, owner: str = None, addresses: list = None, mc_number: str = None, images = None, about: str = None
                ):

        super().__init__(name=name, id=id, display_name=display_name, dot_number=dot_number, dot_verified=dot_verified,
                            industry=industry, owner=owner,addresses=addresses, mc_number=mc_number, images=images, about=about
                        )

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


    @property
    def serialized_images(self):
        d = []
        if self.images is None: return []
        if len(self.images) == 0: return []
        for a in self.images:
            d.append({
                'id': a.id,
                'item': {
                    'id': a.id,
                    'imageType': a.image_type,
                    'uuid': a.uuid,
                    'originalUrl': a.original_url,
                    'cdnUrl': a.cdn_url,
                    'name': a.name,
                    'mimeType': a.mime_type,
                    'size': a.size
                }
            })
        
        return d

    @property
    def active_profile_image(self) -> str:
        for image in self.images:
            print (image.image_type)
            if image.image_type == 'profileActive': return image.cdn_url
        
        return ''