// Argumentos de entrada
console.log(process.argv);

// Controlar el proceso y su salida
// process.exit(1); // 0 = OK, 1 = Error

// // Podemos controlar eventos del proceso
// process.on('exit', () => {
//     console.log('El proceso terminó');
// });

// Current working directory
console.log(process.cwd());

// Platform
console.log(process.env.CUALQUIERA);