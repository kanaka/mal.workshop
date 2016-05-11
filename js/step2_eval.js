var readline = require('./readline'),
    types = require('./types'),
    reader = require('./reader'),
    printer = require('./printer')

function READ(str) {
    return reader.read_str(str)
}

function eval_ast(ast, env) {
    if (ast instanceof types.Symbol) {
        return env[ast.name]
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

    // apply
    if (ast.length === 0) { return ast }
    var el = eval_ast(ast, env),
        f = el[0]
    return f.apply(f, el.slice(1))
}

function PRINT(exp) {
    return printer.pr_str(exp, true)
}

repl_env = {
    '+': function(a,b) { return a+b},
    '-': function(a,b) { return a-b},
    '*': function(a,b) { return a*b},
    '/': function(a,b) { return a/b},
}

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
