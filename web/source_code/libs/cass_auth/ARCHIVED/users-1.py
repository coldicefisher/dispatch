
    # def recover_username(self, a1: str, a2: str) -> str:

    #     with get_session() as session:
            
    #         select_query = f"SELECT a1, a2, secret FROM users WHERE username = '{self.encrypted_username}'"
    #         results = session.execute(select_query)

    #         for count, r in enumerate(results):
    #             if count == 0: row = r
    #             break

    #         a1_fernet = Fernet(os.environ.get('A1_KEY'))
    #         decrypted_a1 = a1_fernet.decrypt(bytes(row.a1, "utf-8"))

    #         a2_fernet = Fernet(os.environ.get('A2_KEY'))
    #         decrypted_a2 = a2_fernet.decrypt(bytes(a2, "utf-8"))

    #         secret_fernet = Fernet(os.environ.get('SECRET_KEY'))
    #         decrypted_secret = secret_fernet.decrypt(bytes(row.secret, "utf-8"))
            
    #         if self.a1 == decrypted_a1 and self.a2 == decrypted_a2:
    #             return decrypted_secret

    #         return None


    # def refresh(self) -> object:
    #     u = _get_user(self.username)
    #     self.__init__(username=u.username, encrypted_username=u.encrypted_username, pwd=u.pwd, uid=self.uid, first_name=u.first_name,
    #                     last_name=u.last_name, trusted_devices=u.trusted_devices, phone_numbers=u.phone_numbers, 
    #                     emails=u.emails, status=u.status)



        # # Check to see if any of the phone numbers have been verified by another user
        # scrubbed_emails = {}

        # update_emails = False
        # for key, value in self.__emails.items():
        #     users = ac.lookup_users_by_email(key)
        #     if users is None:
        #         scrubbed_emails[key] = value
        #         continue

        #     if not users[0] == self.encrypted_username:
        #         update_emails = True
        #         continue

        #     elif users[0] == self.encrypted_username:
        #         scrubbed_emails[key] = value
        #         continue

        # if update_emails:
        #     with get_session() as session:
        #         session.execute(f"UPDATE users SET emails = {scrubbed_emails} WHERE username = '{self.encrypted_username}'") 
        # return scrubbed_emails


        # Check to see if any of the phone numbers have been verified by another user
        # This code tremendously slows performance
        
        # scrubbed_numbers = {}

        # update_numbers = False
        # for key, value in self.__phone_numbers.items():
        #     users = ac.lookup_users_by_phone_number(key)
        #     if users is None:
        #         scrubbed_numbers[key] = value
        #         continue

        #     if not users[0] == self.encrypted_username:
        #         update_numbers = True
        #         continue

        #     elif users[0] == self.encrypted_username:
        #         scrubbed_numbers[key] = value
        #         continue

        # if update_numbers:
        #     with get_session() as session:
        #         session.execute(f"UPDATE users SET phone_numbers = {scrubbed_numbers} WHERE username = '{self.encrypted_username}'") 
        # return scrubbed_numbers
