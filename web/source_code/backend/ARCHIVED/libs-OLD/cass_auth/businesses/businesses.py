from libs.cass_auth.connect import get_secured_session as get_session
from libs.kp_fraydit.classes import BaseClass
from libs.kp_fraydit.class_iterators import ClassIterator


class Businesses(ClassIterator):
    def __init__(self, group_list=None, primary_key: str = "id") -> None:
        primary_key = 'display_name'
        super().__init__(group_list, primary_key)


