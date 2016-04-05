var fs = require('fs'),
    fd = fs.openSync('/dev/stdin', 'r'),
    buf = new Buffer(1024)

function readlineSync(prompt) {
    process.stdout.write(prompt)
    var cnt = fs.readSync(fd, buf, 0, 1023)
    if (cnt === 0) { return null }
    var line = buf.toString('utf8', 0, cnt)
    return line.replace('\n', '')
}

exports.readlineSync = readlineSync
