# General functions

def equal_Q(a, b):
    ota, otb = type(a), type(b)
    if not (ota == otb or (type(a) == list and type(b) == list)):
        return False;
    if type(a) == list:
        if len(a) != len(b): return False
        for i in range(len(a)):
            if not equal_Q(a[i], b[i]): return False
        return True
    else:
        return a == b

class Symbol(str): pass

class Function():
    def __init__(self, ast, params, env):
        self.ast = ast
        self.params = params
        self.env = env

class Atom(object):
    def __init__(self, val):
        self.val = val
