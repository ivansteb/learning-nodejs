const fs = require ('node:fs'); // importante utiliza node:

const stats = fs.statSync('archivo.txt');

console.log(
    stats.isFile(),
    stats.isDirectory(),
    stats.isSymbolicLink(), // si es un enlace simbolico
    stats.size // tamaño del archivo en bytes
);
