from libs.cass_auth.businesses.business_model import BusinessModel


def get_users(payload, my_user):
    business_name = payload.get('business_name')
    biz = BusinessModel().get(business_name)
    if biz.profiles[my_user.profile_user.id].has_permission(['Owner', 'Administrator']):
        return biz.serialized_profiles
    return False

