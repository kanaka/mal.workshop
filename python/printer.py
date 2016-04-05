import mal_types as types

def escape(str):
    return str.replace('\\', '\\\\')\
              .replace('"', '\\"')\
              .replace('\n', '\\n')

def pr_str(obj, print_readably=True):
    return obj.__str__()

