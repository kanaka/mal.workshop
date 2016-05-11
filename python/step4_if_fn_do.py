import sys, traceback
import readline
import mal_types as types
import reader, printer
from env import Env
import core

# read
def READ(str):
    return reader.read_str(str)

# eval
def eval_ast(ast, env):
    if type(ast) == types.Symbol:
        return env.get(ast)
    elif type(ast) == list:
        return list(map(lambda a: EVAL(a, env), ast))
    else:
        return ast

def EVAL(ast, env):
    if not type(ast) == list:
        return eval_ast(ast, env)

    # apply list
    if len(ast) == 0: return ast
    a0 = ast[0]
    if "def!" == a0:
        return env.set(ast[1], EVAL(ast[2], env))
    elif "let*" == a0:
        let_env = Env(env)
        for i in range(0, len(ast[1]), 2):
            let_env.set(ast[1][i], EVAL(ast[1][i+1], let_env))
        return EVAL(ast[2], let_env)
    elif "do" == a0:
        el = eval_ast(ast[1:], env)
        return el[-1]
    elif "if" == a0:
        a1, a2 = ast[1], ast[2]
        cond = EVAL(a1, env)
        if cond is None or cond is False:
            if len(ast) > 3: return EVAL(ast[3], env)
            else:            return None
        else:
            return EVAL(a2, env)
    elif "fn*" == a0:
        return types.Function(ast[2], ast[1], env)
    else:
        el = eval_ast(ast, env)
        f = el[0]
        if type(f) == types.Function:
            return EVAL(f.ast, Env(f.env, f.params, el[1:]))
        else:
            return f(*el[1:])


# print
def PRINT(exp):
    return printer.pr_str(exp)

# repl
repl_env = Env()
def REP(str):
    return PRINT(EVAL(READ(str), repl_env))

# core.py: defined using python
for k,v in core.ns.items(): repl_env.set(types.Symbol(k), v)

# core.mal: defined using the language itself
REP("(def! not (fn* (a) (if a false true)))")

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
