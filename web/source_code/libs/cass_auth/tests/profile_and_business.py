from libs.cass_auth.profiles.profiles import ProfileModel
from libs.cass_auth.businesses import BusinessModel


ProfileModel().delete('rebecca')
ProfileModel().delete('coldicefisher')
ProfileModel().delete('michaelharris')
ProfileModel().delete('montes')

BusinessModel().delete('M&H Express')
BusinessModel().delete('Merrise')

rebecca = ProfileModel().create('rebecca', 'ethiopia', 'rebeccaq1', 'love', 'hates', 'trucking', 'Rebecca', 'Getahun')
jamey = ProfileModel().create('coldicefisher', 'ethiopia', 'jamey', 'love', 'hates', 'trucking', 'Jamey', 'Harris')
michael = ProfileModel().create('michaelharris', 'ethiopia', 'michael', 'love', 'hates', 'trucking', 'Michael', 'Harris')
montes = ProfileModel().create('montes', 'ethiopia', 'montes', 'love', 'hates', 'trucking', 'Montes', 'Westfield')

mandh = BusinessModel().create('M&H Express', f'{michael.encrypted_username}')
merrise = BusinessModel().create('Merrise', f'{rebecca.encrypted_username}')

mandh.add_user(f'{michael.encrypted_username}', ['Owner'])
mandh.add_user(f'{jamey.encrypted_username}', ['Driver', 'Human Resources'])
michael.refresh()
jamey.refresh()
jamey.add_address('coldicefisher@gmail.com')
michael.add_address('postmaster@bizniz.io')
# unittest.assertFalse(michael.has_permission('Merrise', ["Owner"]))
assert michael.has_permission('M&H Express', ["Owner"])
