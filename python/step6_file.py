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
  while True:
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
        env = let_env
        ast = ast[2] # TCO
    elif "do" == a0:
        eval_ast(ast[1:-1], env)
        ast = ast[-1] # TCO
    elif "if" == a0:
        a1, a2 = ast[1], ast[2]
        cond = EVAL(a1, env)
        if cond is None or cond is False:
            if len(ast) > 3: ast = ast[3] # TCO
            else:            return None
        else:
            ast = a2 # TCO
    elif "fn*" == a0:
        f = types.Function(ast[2], ast[1], env)
        f.apply = lambda args: EVAL(f.ast, Env(f.env, f.params, list(args)))
        return f
    else:
        el = eval_ast(ast, env)
        f = el[0]
        if type(f) == types.Function:
            ast = f.ast
            env = Env(f.env, f.params, el[1:]) # TCO
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
repl_env.set(types.Symbol('eval'), lambda ast: EVAL(ast, repl_env))
repl_env.set(types.Symbol('*ARGV*'), list(sys.argv[2:]))

# core.mal: defined using the language itself
REP("(def! not (fn* (a) (if a false true)))")
REP("(def! load-file (fn* (f) (eval (read-string (str \"(do \" (slurp f) \")\")))))")

if len(sys.argv) >= 2:
    REP('(load-file "' + sys.argv[1] + '")')
    sys.exit(0)

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
