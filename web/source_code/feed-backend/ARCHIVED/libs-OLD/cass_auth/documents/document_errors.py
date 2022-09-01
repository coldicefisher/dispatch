
class DocumentExistsError(Exception):
    def __init__(self):
        pass
    def __str__(self):
        return f"Document Exists"