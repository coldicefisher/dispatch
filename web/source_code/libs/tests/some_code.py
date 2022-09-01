from libs.cass_auth.businesses.business_model import BusinessModel, BusinessProfile
my_profile = BusinessProfile('86af673b-374e-49bd-a205-b75b1f8a4152', True, {'Administrator', 'Driver', 'Human Resources'}, "M&H Express")
mandh = BusinessModel().get('M&H Express')
mandh.upsert_profile(my_profile)
mandh.add_permissions('86af673b-374e-49bd-a205-b75b1f8a4152',{'Administrator', 'Driver', 'human3', 'human4'})


from libs.cass_auth.businesses.business_model import BusinessModel, BusinessProfile
# my_profile = BusinessProfile('86af673b-374e-49bd-a205-b75b1f8a4152', True, {'Administrator', 'Driver', 'Human Resources'})
mandh = BusinessModel().get('M&H Express')
profile = mandh.profiles['86af673b-374e-49bd-a205-b75b1f8a4152']

profile.add_permissions({'turkey', 'burger'})

profile.delete_permissions({'burger'})

profile.replace_permissions({'Administrator', 'Owner'})


from libs.cass_auth.profiles.profile_model import ProfileModel, fetchType
jamey = ProfileModel().get('coldicefisher', fetchType.username)
montes = ProfileModel().get('montes', fetchType.username)
michael = ProfileModel().get('michaelharris', 'username')
rebecca = ProfileModel().get('rebecca', fetchType.username)

from libs.cass_auth.businesses.business_model import BusinessModel, BusinessProfile
mandh = BusinessModel().create('M&H Express', f'{michael.username}')
BusinessModel().delete('M&H Express')
mandh = BusinessModel().create('M&H Express', f'{michael.username}')


# TEST BUSINESS
from libs.cass_auth.businesses.business_model import BusinessModel, BusinessProfile
mandh = BusinessModel().get('M&H Express')
mandh.create_profile_no_login('Rebecca', '', 'Getahun', '', 'postmaster@bizniz.io')

from libs.cass_auth.profiles.profile_model import ProfileModel

profile_id = None 
business_name = None
try:
    profile_id, business_name = ProfileModel().get_unassociated_account_information('postmaster@bizniz.io')
except:
    pass
if profile_id is not None:
    print (profile_id)
    print (business_name)


from libs.tests.tests import run_tests
run_tests()

from libs.tests.test_delete import delete_data
delete_data()


import eth_keys, eth_utils, binascii, os

h = 48, 69, 2, 33, 0, 251, 85, 0, 189, 98, 205, 246, 249, 91, 55, 182, 46, 163, 39, 229, 210, 18, 61, 227, 187, 186, 96, 204, 99, 40, 64, 67, 192, 29, 87, 176, 142, 2, 32, 22, 151, 5, 234, 168, 244, 117, 193, 136, 181, 18, 39, 179, 232, 66, 238, 214, 139, 85, 91, 201, 134, 60, 123, 215, 116, 41, 49, 221, 132, 229, 167
r = 'fb5500bd62cdf6f95b37b62ea327e5d2123de3bbba60cc63284043c01d57b08e'
s = '169705eaa8f475c188b51227b3e842eed68b555bc9863c7bd7742931dd84e5a7'
eth_keys.keys.Signature(vrs=(1,binascii.unhexlify(r), binascii.unhexlify(s)))

rc = int.from_bytes(bytes(r, 'utf-8'), byteorder='big')
sc = int.from_bytes(bytes(s, 'utf-8'), byteorder='big')
eth_keys.keys.Signature(vrs=(1, rc, sc))
eth_keys.keys.Signature(vrs=(1, int.from_bytes(binascii.unhexlify(r), byteorder='big'), int.from_bytes(binascii.unhexlify(s), byteorder='big')))


from hashlib import sha256, sha384
import binascii
from ecdsa.ellipticcurve import Point
from ecdsa import VerifyingKey, NIST384p
public = '04c5a66e5efe72ec2ac0b028b8746ed46e374b5d10c06ca3beb5cfca94ffc09a9831eb147a312d787fd6916486e644340bf87944bf5be3aba1e668d878d581f1e48b3c3a8b588e53e200dfbcd2d573ff4e09678c843aa465365357ffee8b40ec82'
message = b'Hellof'
signature = 'f095de6188a640581625a533d720c798af97a9672f415bbcce35de0164c3abc532a0fb136dc9d0fd36521461f97759f69ad144fb7943b8e71417afb7b48edd276c90d551fab31afd358bb90fb08ab98ed6da06829d647da85521428e4debbbfb'
verifying_key = VerifyingKey.from_string(bytes.fromhex(public), curve=NIST384p, hashfunc=sha384)
verifying_key.verify(binascii.unhexlify(signature), message)


from libs.cass_auth.documents.document_model import DocumentModel
d = DocumentModel().get(id='24ade91f-6725-4999-9ff8-cbc7e21322cf')

from libs.cass_auth.documents.document_model import DocumentModel

DocumentModel().exists(id='236156bb-865f-4d18-9967-40727d6031ef')
DocumentModel().exists(id='0e83c399-4157-4e21-9e44-c2c3e29caa67')

DocumentModel().exists(profile_id='3975557a-cfec-4267-a60f-76a8ca1ffc0b', template_name="bizniz.business_disclaimer_1")

from libs.cass_auth.businesses.business_model import BusinessModel
from libs.cass_auth.profiles.profile_model import ProfileModel
b = BusinessModel().get('Laurel Mountain Holdings')
p = ProfileModel().get(username="coldicefisher")


from libs.cass_auth.profiles.profile_functions import get_id_from_encrypted_username, get_id_from_username
get_id_from_encrypted_username('725fba3d4eaae05d03998c21c1cb9bf1352d4db65ca5e0c5db81077c0a0a4010')



from libs.cass_auth.businesses.business_model import BusinessModel
from libs.cass_auth.profiles.profile_model import ProfileModel
p = ProfileModel().get(encrypted_username='725fba3d4eaae05d03998c21c1cb9bf1352d4db65ca5e0c5db81077c0a0a4010')

b = BusinessModel().get('Test 4 Biz')
b = BusinessModel().get('Test 4 Biz')
b.upsert_profile(p.id)

from libs.cass_auth.businesses.business_model import BusinessModel
from libs.cass_auth.profiles.profile_model import ProfileModel
p = ProfileModel().get(username="coldicefisher")
p.profile_picture

p = ProfileModel().get(encrypted_username='74b380193c6947175644d403c0745f5d08f80b5cec841c0b376d2291aea1a196')
p.profile_picture
p = ProfileModel().get(encrypted_username='e9a3ef7a1f87f92d005018b43c022738913631c26465bfb605bf4bf8c3d59f64')
p.profile_picture
p = ProfileModel().get(encrypted_username='725fba3d4eaae05d03998c21c1cb9bf1352d4db65ca5e0c5db81077c0a0a4010')
p.profile_picture
p = ProfileModel().get(encrypted_username='81c7d2c132403a4205cc7f61b7f72e471b9fb9026e93e80af8ce48caa9bfafd3')
p.profile_picture
p = ProfileModel().get(encrypted_username='2e05362a95302d3e7ad3d46bd094cbc8f3942a3903c3684ac8bcbecde68d04b4')
p.profile_picture


from libs.kp_fraydit.schema.processed_schema import ProcessedSchema as ps
from libs.kp_fraydit.schema.fields import Field
a = ps.from_topic_name('business.Fiddlesticks')
f1 = Field('command', 'string')
f2 = Field('payload', 'string')
a.validate(additional_fields=[f1,f2],name='business.Fiddlesticks-value', namespace='business.Fiddlesticks')


from libs.kp_fraydit.schema.schema_client import SchemaEngine as eng
from libs.kp_fraydit.schema.processed_schema import ProcessedSchema
ps = ProcessedSchema.from_raw('{"doc": "Automatically created by kp_fraydit.","fields": [],"name": "base_schema_value","namespace": "kp_fraydit.base_schema_value","type": "record"}', 'AVRO', 'business.Fiddlesticks')
eng().register_schema('business.Fiddlesticks-value', ps.raw_schema)

from libs.kp_fraydit.schema.schema_client import SchemaEngine as eng
eng().alter_field('business.Fiddlesticks-value', 'command', 'string', True)

from libs.kp_fraydit.admin.admin_engine import AdminEngine
AdminEngine().kafka_cluster.topics['business.Fiddlesticks'].create_value_schema(field_list=[{'name': 'command','type': 'string'},{'name': 'payload', 'type': 'string'}])

from libs.cass_auth.users import UserModel
u = UserModel().get('montes')
['{device_type: desktop, user_agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:99.0) Gecko/20100101 Firefox/99.0, os: Linux, os_version: unknown, browser_version: 99.0, is_desktop: true, is_tablet: false, is_mobile: false, ip: 134.209.47.101}']


from libs.cass_auth.profiles.profile_model import ProfileModel
p = ProfileModel().get(username="coldicefisher")
from libs.cass_auth.middleware import authorized

@authorized
def print_name(user, business, permissions):
    print (f"{p.first_name} {p.last_name} is authorized...")

print_name(p, 'Dearborne', 'Owner')
print_name(user=p, business='Dearborne', permissions={'Owner'})


from libs.cass_auth.businesses.business_model import BusinessModel
biz = BusinessModel().get('Laurel')
for p in biz.profiles:
    print (p.last_name)
    print (p.profile_id)
biz.profiles['bfbc3d14-15d6-4d4d-b0fb-4681755157f2'].delete()


from libs.cass_auth.businesses.business import Business
biz = Business('Laurel Mountain Holdings')
biz.images


from libs.cass_auth.applications.application_field import ApplicationField, ApplicationFields
site_data = [
                {'fieldName': 'First Name', 'fieldType': 'Text'}, 
                {'fieldName': 'Last Name', 'fieldType': 'Text'},
                {'fieldName': 'Gender', 'fieldType': 'Select', 'fieldValues': ['Male', 'Female']}
            ]
fields = ApplicationFields.from_list(site_data)
