var types = require('./types')

function escape(str) {
    return str.replace(/\\/g, "\\\\")
              .replace(/"/g, '\\"')
              .replace(/\n/g, "\\n")
}

function pr_str(obj, print_readably) {
    return obj.toString()
}

exports.pr_str = pr_str

