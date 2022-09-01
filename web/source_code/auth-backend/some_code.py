from libs.cass_auth.users import UserModel

u = UserModel().get('rebecca')
u.add_address('postmaster@bizniz.io')

from libs.cass_auth.users import UserModel
UserModel().create_with_profile(username='rebecca', password='ethiopia', q1='rebecca', a1='love', q2='hates', a2='trucking', first_name='Rebecca', last_name='Getahun')

