var readline = require('./readline'),
    reader = require('./reader'),
    printer = require('./printer')

function READ(str) {
    return reader.read_str(str)
}

function EVAL(ast, env) {
    return ast
}

function PRINT(exp) {
    return printer.pr_str(exp, true)
}

function rep (line) {
    return PRINT(EVAL(READ(line), ''))
}

while ((line = readline.readlineSync('user> ')) !== null) {
    try {
        process.stdout.write(rep(line) + '\n')
    } catch (exc) {
        console.log(exc.stack)
    }
}
