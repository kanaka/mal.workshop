var types = require('./types')

// Env implementation
function Env(outer, binds, exprs) {
    this.data = {}
    this.outer = outer || null

    if (binds && exprs) {
        // Returns a new Env with symbols in binds bound to
        // corresponding values in exprs
        for (var i=0; i<binds.length;i++) {
            if (binds[i].name === "&") {
                // variable length arguments
                this.data[binds[i+1].name] = Array.prototype.slice.call(exprs, i)
                break
            } else {
                this.data[binds[i].name] = exprs[i]
            }
        }
    }
    return this
}
Env.prototype.find = function (key) {
    if (!(key instanceof types.Symbol)) {
        throw new Error("env.find key must be a symbol")
    }
    if (key.name in this.data) { return this }
    else if (this.outer) {  return this.outer.find(key) }
    else { return null }
}
Env.prototype.set = function(key, value) {
    if (!(key instanceof types.Symbol)) {
        throw new Error("env.set key must be a symbol")
    }
    this.data[key.name] = value
    return value
}
Env.prototype.get = function(key) {
    if (!(key instanceof types.Symbol)) {
        throw new Error("env.get key must be a symbol")
    }
    var env = this.find(key)
    if (!env) { throw new Error("'" + key.name + "' not found") }
    return env.data[key.name]
}

exports.Env = Env
