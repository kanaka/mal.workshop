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
        return EVAL(a2, let_env)
    case "do":
        var el = eval_ast(ast.slice(1), env)
        return el[el.length-1]
    case "if":
        var cond = EVAL(a1, env)
        if (cond === null || cond === false) {
            return ast.length > 3 ? EVAL(a3, env) : null
        } else {
            return EVAL(a2, env)
        }
    case "fn*":
        return function() {
            return EVAL(a2, new Env(env, a1, arguments))
        }
    default:
        var el = eval_ast(ast, env), f = el[0]
        return f.apply(f, el.slice(1))
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

// core.mal: defined using mal itself
rep("(def! not (fn* (a) (if a false true)))")

function rep (line) {
    return PRINT(EVAL(READ(line), repl_env))
}

while ((line = readline.readlineSync('user> ')) !== null) {
    try {
        process.stdout.write(rep(line) + '\n')
    } catch (exc) {
        console.log(exc.stack)
    }
}
