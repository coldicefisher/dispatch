import typing

def flatten_list(list_):
    list_of_lists = []
    flattened_list = []
    list_of_lists.append(list_)
    
    while len(list_of_lists) > 0:
        for my_list in list_of_lists:
            for item in my_list:
                if isinstance(item, list):
                    list_of_lists.append(item)
                else:
                    flattened_list.append(item)
            
            list_of_lists.remove(my_list)
    return flattened_list


def key_exists(dict_to_check,key_to_check):
    if key_to_check in dict_to_check: return True
    return False

def check_int(s):
    s = str(s)
    if s[0] in ('-', '+'):
        return s[1:].isdigit()
    return s.isdigit()    