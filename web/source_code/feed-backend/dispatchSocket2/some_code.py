from libs.cass_auth.profiles.profiles import ProfileWorkHistory, UserProfile, ProfileAddress, convert_work_history_list
a = ProfileAddress()
a.start_date = '2/1/2022'
a.end_date = '2/28/2022'
a.address_imageType = 'mailing'
a.address1 = '1902 Judge Ronald Rd'
a.address2 = 'Unit B'
a.city = 'Ellensburg'
a.state = 'WA'
a.zip = '98926'

p = UserProfile('coldicefisher')
p._upsert_profile_address(a)

from libs.cass_auth.profiles.profiles import UserProfile, ProfileAddress
p = UserProfile('coldicefisher')
for a in p.addresses:
    print (a.start_date)
    print (a.end_date)


from libs.cass_auth.profiles.profiles import UserProfile, ProfileAddress
a = ProfileAddress()
a.start_date = '2/1/2022'
a.end_date = '2/28/2022'
a.address_imageType = 'mailing'
a.address1 = '1902 Judge Ronald Rd'
a.address2 = 'Unit B'
a.city = 'Ellensburg'
a.state = 'WA'
a.zip = '98926'


p = UserProfile('coldicefisher')
a.id = p.new_address_id
print (a.id)
p.upsert_profile_address(a)

p._remove_profile_address(a)


from libs.cass_auth.profiles.profiles import UserProfile, ProfileWorkHistory
p = UserProfile('coldicefisher')
w = ProfileWorkHistory()
w.start_date = '2/1/2021'
w.end_date = '3/11/2022'
w.company_name = 'M&H Express'
w.positions_held = 'Driver'
w.description = 'Moving groceries.All over. Everywhere. We moved groceries'
w.physical_address1 = '3824 New Hwy 68'
w.physical_city = 'Madisonville'
w.physical_state = 'TN'
w.physical_zip = '37354'
w.id = p.new_work_history_id
print (w.id)
p.upsert_work_history(w)
p.remove_work_history(w)


from libs.cass_auth.profiles.profiles import UserProfile, ProfileWorkHistory
p = UserProfile('coldicefisher')

p.work_histories[0].start_date
p.work_histories[0].company_name
p.work_histories[0].physical_address1
p.work_histories[0].physical_city
p.work_histories[0].physical_state


from libs.cass_auth.profiles.profiles import UserProfile, ProfileWorkHistory
p = UserProfile('coldicefisher')
d = {'id': 3, 'startDate': '02/01/2021', 'endDate': '03/11/2022', 'companyName': 'Dearborne Trucking', 'positionsHeld': 'Driver', 'description': 'Moving groceries.All over. Everywhere. We moved groceries', 'physicalAddress1': '3824 New Hwy 68', 'physicalAddress2': '', 'physicalCity': 'Madisonville', 'physicalState': 'TN', 'physicalZip': '37354', 'mailingAddress1': '', 'mailingAddress2': '', 'mailingCity': '', 'mailingState': '', 'mailingZip': ''}
w = ProfileWorkHistory.from_dict(d)
p.update_profile_info(work_history=d)

from libs.cass_auth.profiles.profiles import convert_work_history_list
l = [{'id': 4, 'startDate': '12/01/2020', 'endDate': '12/05/2020', 'companyName': 'Dicking Down Debbie', 'positionsHeld': 'gigalo', 'description': '', 'physicalAddress1': '', 'physicalAddress2': '', 'physicalCity': '', 'physicalState': '', 'physicalZip': '', 'mailingAddress1': '', 'mailingAddress2': '', 'mailingCity': '', 'mailingState': '', 'mailingZip': ''}, {'id': 3, 'startDate': '02/01/2021', 'endDate': '03/11/2022', 'companyName': 'Dearborne Trucking', 'positionsHeld': 'Driver', 'description': 'Moving groceries.All over. Everywhere. We moved groceries', 'physicalAddress1': '3824 New Hwy 68', 'physicalAddress2': '', 'physicalCity': 'Madisonville', 'physicalState': 'TN', 'physicalZip': '37354', 'mailingAddress1': '', 'mailingAddress2': '', 'mailingCity': '', 'mailingState': '', 'mailingZip': ''}]
convert_work_history_list(l)


from libs.cass_auth.profiles.profiles import UserProfile, ProfileAddress
l = [{'id': 1, 'startDate': '12/01/2021', 'endDate': '12/31/2021', 'addressimageType': 'physical', 'address1': '564 Bethlehem Rd', 'address2': '', 'city': 'Madisonville', 'state': 'TN', 'zip': '37354'}]
p = UserProfile('coldicefisher')
p.update_profile_info(addresses=l)


from libs.cass_auth.profiles.profiles import UserProfile, ProfileImage
# f'{imageType}|{uuid}|{original_url}|{cdn_url}|{name}|{mime_imageType}|{size}'
l = [{'id': 1, 'imageType': 'profileActive', 'uuid': 'ddd31464-5abf-420c-89c9-88011213115c', 'original_url': 'https://ucarecdn.com/ddd31464-5abf-420c-89c9-88011213115c/index2.jpeg', 'cdn_url': 'ddd31464-5abf-420c-89c9-88011213115c', 'name': 'index.jpg', 'mime_imageType': 'image/jpeg', 'size': 7976}]
p = UserProfile('coldicefisher')
p.update_profile_info(images=l)

