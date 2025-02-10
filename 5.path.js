const path = require('node:path');

// barra separadora de carpetas según sistema operativo
console.log(path.sep);

// unir rutas con path.join
const filePath = path.join('content', 'subfolder', 'test.txt');
console.log(filePath);

const base = path.basename('/temp/ivan-secrets-files/temp.txt');
console.log(base); // devuelve el nombre del fichero

const baseWithoutExtension = path.basename('/temp/ivan-secrets-files/temp.txt', '.txt');
console.log(baseWithoutExtension); // devuelve el nombre del fichero sin la extensión

const extension = path.extname('image.jpeg');
console.log(extension); // devuelve la extensión del fichero