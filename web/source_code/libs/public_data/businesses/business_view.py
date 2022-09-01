from libs.cass_auth.connect import get_secured_session as get_session
from libs.kp_fraydit.classes import BaseClass
from libs.kp_fraydit.class_iterators import ClassIterator

from libs.cass_auth.businesses.businesses import Businesses
from libs.cass_auth.businesses.business import Business

class BusinessView:
    def __init__(self):
        self.__businesses = None

    def _get_businesses(self):
        with get_session() as session:
            results = session.execute(f'''SELECT id, name, display_name, dot_number, dot_verified, industry, owner,  
                                        addresses, mc_number, images, about
                                        FROM businesses''')

                                        
            businesses = Businesses()
            for row in results:
                if row.id is None: continue
                else: id = row.id
                if row.owner is None: continue
                else: owner = row.owner

                if row.name is None: name = ''
                else: name = row.name
                if row.display_name is None: display_name = ''
                else: display_name = row.display_name
                if row.dot_number is None: dot_number = ''
                else: dot_number = row.dot_number
                if row.dot_verified is None: dot_verified = ''
                else: dot_verified = row.dot_verified
                if row.industry is None: industry = ''
                else: industry = row.industry
                if row.addresses is None: addresses = []
                else: addresses = row.addresses
                if row.mc_number is None: mc_number = ''
                else: mc_number = row.mc_number
                if row.images is None: images = []
                else: images = row.images
                if row.about is None: about = ''
                else: about = row.about

                biz = Business(name=name, id=row.id, display_name=display_name, dot_number=dot_number,
                                        dot_verified=dot_verified, industry=industry, owner=owner, addresses=addresses,
                                        mc_number=mc_number, images=images, about=about
                                        )
                
                businesses.append(biz)
        
        return businesses



    @property
    def businesses(self) -> list:
        return self._get_businesses()
        
    
    @property
    def serialized_businesses(self) -> list:
        businesses = self.businesses
        if businesses is None: return []
        if len(businesses) == 0: return []
        
        d = []
        for biz in businesses:
        
            d.append({
                'id': biz.id,
                'name': biz.name,
                'displayName': biz.display_name,
                'dotNumber': biz.dot_number,
                'mcNumber': biz.mc_number,
                'dotVerified': biz.dot_verified,
                'addresses': biz.serialized_addresses,
                'activeProfileImage': biz.active_profile_image
            })
        
        return d
