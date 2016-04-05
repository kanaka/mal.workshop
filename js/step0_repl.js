var rlSync = require('./readline').readlineSync
while ((line = rlSync('user> ')) !== null) {
    console.log(line)
}
