var types = require('./types')

function escape(str) {
    return str.replace(/\\/g, "\\\\")
              .replace(/"/g, '\\"')
              .replace(/\n/g, "\\n")
}

function pr_str(obj, print_readably) {
    if (obj instanceof types.Symbol) {
        return obj.name
    } else if (Array.isArray(obj)) {
        return "(" + obj.map(function(x) { return pr_str(x, print_readably) }).join(" ") + ")"
    } else if (typeof obj === 'string') {
        if (print_readably) {
            return '"' + escape(obj) + '"'
        } else {
            return obj
        }
    } else if (obj === null) {
        return 'nil'
    } else if (obj instanceof types.Atom) {
        return "(atom " + obj.value + ")"
    } else {
        return obj.toString()
    }
}

exports.pr_str = pr_str

