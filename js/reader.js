var types = require('./types')

function Reader(tokens) {
    this.tokens = tokens
    this.position = 0
}
Reader.prototype.next = function () {
    return this.tokens[this.position++]
}
Reader.prototype.peek = function () {
    return this.tokens[this.position]
}

function tokenize(str) {
    var re = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"|;.*|[^\s\[\]{}('"`,;)]*)/g
    var results = []
    while ((match = re.exec(str)[1]) != '') {
        if (match[0] === ';') { continue }
        results.push(match)
    }
    return results
}

function unescape(str) {
    return str.replace(/\\"/g, '"')
              .replace(/\\n/g, "\n")
              .replace(/\\\\/g, "\\")
}

function read_atom (reader) {
    var token = reader.next()
    if (token.match(/^-?[0-9]+$/)) {
        return parseInt(token)
    } else if (token.match(/^"/)) {
        return unescape(token.slice(1,token.length-1))
    } else if (token === 'nil') {
        return null
    } else if (token === 'true') {
        return true
    } else if (token === 'false') {
        return false
    } else {
        return new types.Symbol(token)
    }
}

function read_list(reader) {
    var list = []
    var token = reader.next()
    while ((token = reader.peek()) !== ')') {
        if (!token) {
            throw new Error("expected ')', got EOF")
        }
        list.push(read_form(reader))
    }
    reader.next()
    return list
}

function read_form(reader) {
    var token = reader.peek()
    switch (token) {
    case ')': throw new Error("unexpected ')'")
    case '(': return read_list(reader)
    default:  return read_atom(reader)
    }
}

function read_str(str) {
    var tokens = tokenize(str)
    if (tokens.length === 0) { return null }
    return read_form(new Reader(tokens))
}

exports.read_str = read_str
