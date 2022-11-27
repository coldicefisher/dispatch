import smtplib

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import os
from threading import Thread


class MailClient:
    def __init__(self):
        pass

    '''
    The pwd is actually the name of the environment variable that is the password
    '''
    @staticmethod
    def sendmail(subject: str, body_plain: str, sender: str, recipients: list, pwd: str, body_html: str = None):
#        def _send():
            server = smtplib.SMTP('')
            server.connect('smtp-relay.sendinblue.com', 587)
            server.ehlo(sender)
#             server.starttls()
            server.login('coldicefisher@gmail.com', 'Qqzymp6f5NASYw4H')
            
            message = MIMEMultipart('alternative')
            message['Subject'] = subject
            message['From'] = 'admin@bizniz.io'
            # message['To'] = recipients
            message['To'] = ', '.join(recipients)
            part1 = MIMEText(body_plain, 'plain')
            # part2 = MIMEText(body_html, 'html')
            
            message.attach(part1)
            if body_html: 
                part2 = MIMEText(body_html, 'html')
                message.attach(part2)
            
            # server.sendmail(sender, recipients, message.as_string())
            
            server.send_message(message)
            server.quit()
            # message = f'From: {sender}\r\nTo: {recipients}\r\n\r\nSubject: {subject}\r\n\r\n{body}'
            # server.sendmail(sender, recipients, message)

#        t = Thread(target=_send, args=(), daemon=False)
#        t.start()
    
