import re
from mal_types import Symbol

class Blank(Exception): pass

class Reader():
    def __init__(self, tokens, position=0):
        self.tokens = tokens
        self.position = position

    def next(self):
        self.position += 1
        return self.tokens[self.position-1]

    def peek(self):
        if len(self.tokens) > self.position:
            return self.tokens[self.position]
        else:
            return None

def tokenize(str):
    tre = re.compile(r"""[\s,]*(~@|[\[\]{}()'`~^@]|"(?:[\\].|[^\\"])*"?|;.*|[^\s\[\]{}()'"`@,;]+)""");
    return [t for t in re.findall(tre, str) if t[0] != ';']

def unescape(str):
    return str.replace('\\"', '"').replace('\\n', '\n').replace('\\\\', '\\')

def read_atom(reader):
    int_re = re.compile(r"-?[0-9]+$")
    token = reader.next()
    if re.match(int_re, token):     return int(token)
    elif token[0] == '"':           return unescape(token[1:-1])
    elif token == "nil":            return None
    elif token == "true":           return True
    elif token == "false":          return False
    else:                           return Symbol(token)

def read_list(reader):
    ast = []
    token = reader.next()
    token = reader.peek()
    while token != ")":
        if not token: raise Exception("expected ')', got EOF")
        ast.append(read_form(reader))
        token = reader.peek()
    reader.next()
    return ast

def read_form(reader):
    token = reader.peek()
    # list
    if token == ')':   raise Exception("unexpected ')'")
    elif token == '(': return read_list(reader)

    else:              return read_atom(reader);

def read_str(str):
    tokens = tokenize(str)
    if len(tokens) == 0: return None
    return read_form(Reader(tokens))
