const fs = require('node:fs/promises');
const path = require('node:path');
const pc = require('picocolors');

const folder = process.argv[2] ?? '.';

async function ls (directory) {
    let files;
    try {
        files = await fs.readdir(directory);
    } catch (error) {
        console.error(pc.bgRed(`No se pudo leer el directorio ${directory}`));
        process.exit(1);
    }

    const filePromises = files.map(async file => {
        const filePath = path.join(directory, file);
        let stats;

        try {
            stats = await fs.stat(filePath); // status - información del archivo
        } catch (error) {
            console.error(`No se pudo leer la información de ${filePath}`);
            process.exit(1);
        }

        const isDirectory = stats.isDirectory();
        const fileType = isDirectory ? 'd:' : 'f:';
        const fileSize = stats.size.toString();
        const fileModified = stats.mtime.toLocaleString();

        return `${fileType} ${pc.blue(file.padEnd(25))} ${pc.green(fileSize.padStart(10))} bytes - modified: ${pc.yellow(fileModified)}`;
    })

    const filesInfo = await Promise.all(filePromises);

    filesInfo.forEach(fileInfo => console.log(fileInfo));
}

ls(folder)