const os = require('node:os');
const { uptime } = require('node:process');

console.log(
    os.arch(),
    os.platform(),
    os.cpus().length,
    uptime() / 60 / 60 // horas de ejecución
)