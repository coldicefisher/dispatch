from libs.cass_auth.documents.document import Document, Documents 
from libs.cass_auth.connect import get_secured_session as get_session
from libs.uuid.uuid import random_uuid
from libs.exceptions.document_exceptions import DocumentExistsError

class DocumentModel:

    @staticmethod
    def get(**kwargs):
        if kwargs.get('id') is not None:
            return Document.from_id(kwargs.get('id'))

        # Set the ids only if passed. This will speed up or add functionality. Defaults to True
        if kwargs.get('ids_only') is not None: ids_only = kwargs.get('ids_only')
        else: ids_only = True

        # Return a list
        if kwargs.get('profile_id') is not None and kwargs.get('template_name') is not None:
            with get_session() as session:
                # results = session.execute(f"SELECT document_id FROM documents_by_profile_and_template WHERE profile_id = {kwargs.get('profile_id')} AND template_name = '{kwargs.get('template_name')}'")
                results = session.execute(f"SELECT id FROM documents WHERE profile_id = {kwargs.get('profile_id')}")
                # AND template_name = '{kwargs.get('template_name')}'")
                docs = []
                dDocs = Documents()
                for row in results:
                    if kwargs.get('template_name') == row.template_name: 
                        docs.append((row.id))
                        if not ids_only: dDocs.append(Document().from_id(row.id))

            if ids_only: return docs
            else: return dDocs


        if kwargs.get('profile_id') is None and kwargs.get('template_name') is not None:
            with get_session() as session:
                results = session.execute(f"SELECT id FROM documents WHERE template_name = '{kwargs.get('template_name')}'")
                docs = []
                dDocs = Documents()
                for row in results:
                    docs.append(row.id)
                    if not ids_only: dDocs.append(Document().from_id(row.id))

                if ids_only: return docs
                else: return dDocs

        if kwargs.get('profile_id') is not None and kwargs.get('template_name') is None:
            with get_session() as session:
                results = session.execute(f"SELECT id FROM documents WHERE template_name = '{kwargs.get('template_name')}'")
                docs = []
                dDocs = Documents()
                for row in results:
                    docs.append(row.id)
                    if not ids_only: dDocs.append(Document().from_id(row.id))

                if ids_only: return docs
                else: return dDocs

        
    def exists(self,**kwargs):
        if kwargs.get('id') is not None:
            try:
                d = Document.from_id(kwargs.get('id'))
                return True
            except: return False

        if kwargs.get('profile_id') is not None and kwargs.get('template_name') is not None:
            docs = self.get(profile_id=kwargs.get('profile_id'), template_name=kwargs.get('template_name'))
            if len(docs) > 0: return True

        return False

    def create(self, profile_id: str, template_name: str, contents: str, signature: str, public_key: str, allow_duplicates: bool = False):
        if not allow_duplicates:
            if self.exists(profile_id=profile_id, template_name=template_name): raise DocumentExistsError()
        

        with get_session() as session:

            id = random_uuid()
            insert_query = f"INSERT INTO documents (id, template_name, profile_id, created_at, contents, signature, public_key) VALUES "
            insert_query += f"({id}, '{template_name}', {profile_id}, toTimeStamp(now()), textAsBlob('{contents}'), textAsBlob('{signature}'), textAsBlob('{public_key}')); "
            session.execute(insert_query)
            
            # insert_query = f"BEGIN BATCH "
            # insert_query += f"INSERT INTO documents_by_profile_and_template (document_id, template_name, profile_id) VALUES ({id}, '{template_name}', {profile_id}); "
            # insert_query += f"INSERT INTO documents_by_template (document_id, profile_id, template_name) VALUES ({id}, {profile_id}, '{template_name}'); "
            # insert_query += "APPLY BATCH"
            
            # with open('query.txt', 'w') as f:
            #     f.write(insert_query)
            
            # session.execute(insert_query)

        return self.get(id=id)
        