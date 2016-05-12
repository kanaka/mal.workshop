import mal_types as types

def escape(str):
    return str.replace('\\', '\\\\')\
              .replace('"', '\\"')\
              .replace('\n', '\\n')

def pr_str(obj, print_readably=True):
    if type(obj) == list:
        return "(" + " ".join(map(lambda x: pr_str(x, print_readably), obj)) + ")"
    elif type(obj) == str:
        if print_readably:
            return '"' + escape(obj) + '"'
        else:
            return obj
    elif obj is None:
        return "nil"
    elif obj is True:
        return "true"
    elif obj is False:
        return "false"
    elif type(obj) == types.Atom:
        return "(atom " + pr_str(obj.val, print_readably) + ")"
    else:
        return obj.__str__()

