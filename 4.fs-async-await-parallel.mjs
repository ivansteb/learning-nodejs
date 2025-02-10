import { readFile } from 'node:fs/promises';

Promise.all([
    readFile('./archivo.txt', 'utf8'),
    readFile('./archivo2.txt', 'utf8')
]).then(([text, secondText]) => {
    console.log('Primer texto: ', text);
    console.log('Segundo texto: ', secondText);
})



