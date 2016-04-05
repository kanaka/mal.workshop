function equal_Q(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
        if (a.length !== b.length) { return false }
        for(var i=0; i<a.length; i++) {
            if (!equal_Q(a[i], b[i])) { return false }
        }
        return true
    } else {
        return a === b
    }
}

var Symbol = function(name) {
    this.name = name
}

exports.equal_Q = equal_Q
exports.Symbol = Symbol
