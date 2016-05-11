import sys, traceback
import readline
import mal_types as types
import reader, printer

# read
def READ(str):
    return reader.read_str(str)

# eval
def eval_ast(ast, env):
    if type(ast) == types.Symbol:
        try:    return env[ast]
        except: raise Exception("'" + ast + "' not found")
    elif type(ast) == list:
        return list(map(lambda a: EVAL(a, env), ast))
    else:
        return ast

def EVAL(ast, env):
    if not type(ast) == list:
        return eval_ast(ast, env)

    # apply list
    if len(ast) == 0: return ast
    el = eval_ast(ast, env)
    f = el[0]
    return f(*el[1:])


# print
def PRINT(exp):
    return printer.pr_str(exp)

# repl
repl_env = {'+': lambda a,b: a+b,
            '-': lambda a,b: a-b,
            '*': lambda a,b: a*b,
            '/': lambda a,b: int(a/b)}

def REP(str):
    return PRINT(EVAL(READ(str), repl_env))

# repl loop
while True:
    try:
        line = input("user> ")
        if line == None: break
        if line == "": continue
        print(REP(line))
    except reader.Blank: continue
    except EOFError: break
    except Exception as e:
        print("".join(traceback.format_exception(*sys.exc_info())))
