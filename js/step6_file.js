var readline = require('./readline'),
    types = require('./types'),
    reader = require('./reader'),
    printer = require('./printer'),
    Env = require('./env').Env,
    core = require('./core')

// read
function READ(str) {
    return reader.read_str(str)
}

// eval
function eval_ast(ast, env) {
    if (ast instanceof types.Symbol) {
        return env.get(ast)
    } else if (Array.isArray(ast)) {
        return ast.map(function(a) { return EVAL(a, env) })
    } else {
        return ast
    }
}

function EVAL(ast, env) {
  while (true) {
    if (!Array.isArray(ast)) {
        return eval_ast(ast, env)
    }
    if (ast.length === 0) { return ast }

    // apply list
    var a0 = ast[0], a1 = ast[1], a2 = ast[2], a3 = ast[3]
    switch (a0.name) {
    case 'def!':
        return env.set(a1, EVAL(a2, env))
    case 'let*':
        var let_env = new Env(env)
        for (var i=0; i < a1.length; i+=2) {
            let_env.set(a1[i], EVAL(a1[i+1], let_env))
        }
        env = let_env
        ast = a2
        break // TCO
    case "do":
        eval_ast(ast.slice(1, -1), env)
        ast = ast[ast.length-1]
        break // TCO
    case "if":
        var cond = EVAL(a1, env)
        if (cond === null || cond === false) {
            ast = ast.length > 3 ? a3 : null
        } else {
            ast = a2
        }
        break // TCO
    case "fn*":
        var f = function() {
            return EVAL(a2, new Env(env, a1, arguments))
        }
        f.ast = a2
        f.params = a1
        f.env = env
        return f
    default:
        var el = eval_ast(ast, env), f = el[0]
        if (f.ast) {
            ast = f.ast
            env = new Env(f.env, f.params, el.slice(1))
            break // TCO
        } else {
            return f.apply(f, el.slice(1))
        }
    }
  }
}

// print
function PRINT(exp) {
    return printer.pr_str(exp, true)
}

// repl
repl_env = new Env(null)

// core.js: defined using javascript
for (var k in core.ns) { repl_env.set(new types.Symbol(k), core.ns[k]) }
repl_env.set(new types.Symbol('eval'), function(ast) {
    return EVAL(ast, repl_env)
})
repl_env.set(new types.Symbol('*ARGV*'), process.argv.slice(3))


// core.mal: defined using mal itself
rep("(def! not (fn* (a) (if a false true)))")
rep("(def! load-file (fn* (f) (eval (read-string (str \"(do \" (slurp f) \")\")))))")

function rep (line) {
    return PRINT(EVAL(READ(line), repl_env))
}

if (process.argv.length > 2) {
    rep('(load-file "' + process.argv[2] + '")')
    process.exit(0)
}

while ((line = readline.readlineSync('user> ')) !== null) {
    try {
        process.stdout.write(rep(line) + '\n')
    } catch (exc) {
        console.log(exc.stack)
    }
}
