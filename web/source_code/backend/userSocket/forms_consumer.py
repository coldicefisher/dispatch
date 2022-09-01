from libs.cass_auth.security import is_signature_valid
from libs.cass_auth.documents.document_model import DocumentModel
from libs.exceptions.document_exceptions import DocumentExistsError

from libs.exceptions.handle_errors import handleErrors

class FormsConsumer:

    @staticmethod
    # @handleErrors
    def validate_document(payload):
                    
        signature = payload.get('signature')
        public_key = payload.get('publicKey')
        contents = payload.get('contents')
        profile_id = payload.get('profileId')
        template_name = payload.get('templateName')
        allow_duplicates = payload.get('allowDuplicates')

        if not is_signature_valid(signature=signature, public_key=public_key, contents=contents): return False
        return True


    @staticmethod
    # @handleErrors
    def get_doc():

        doc = DocumentModel().get(id='24ade91f-6725-4999-9ff8-cbc7e21322cf')
        encoded = doc.converted_contents
        return ({'key': 'document', 'command': 'document_fetched', 'payload': {
                'contents': encoded
        }})

    # @handleErrors
    def signed_document(self, payload):

        if not self.validate_document(payload):
            return self.send_json({'key': 'document', 'command': 'document_processed', 'payload': {
            'status': 'invalidSignature',
            'templateName': payload.get('templateName')
        }})
        else:
            
            try:
                doc = DocumentModel().create(profile_id=payload.get('profileId'), template_name=payload.get('templateName'), contents=payload.get('contents'), signature=payload.get('signature'), public_key=payload.get('publicKey'), allow_duplicates=payload.get('allowDuplicates'))
                return ({'key': 'document', 'command': 'document_processed', 'payload': {
                    'status': 'documentCreated',
                    'templateName': payload.get('templateName'),
                    'documentType': doc.template_version_client_friendly,
                }}) 

            except DocumentExistsError:
                return ({'key': 'document', 'command': 'document_processed', 'payload': {
                    'status': 'documentExists',
                    'templateName': payload.get('template_name')
                }})

            except Exception as e:
                return ({'key': 'document', 'command': 'document_processed', 'payload': {
                    'status': 'unknownFailure',
                }})
