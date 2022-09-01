
# UPLOAD IMAGES ////////////////////////////////////////////////////////////////////////////////////////
        
if cmd == 'upload_profile_image':
    ''' Old code'''
    await self.send_json({'key': 'profile', "command": "upload_profile_image_success", "image": content.get('image')})

 