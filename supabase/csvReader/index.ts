import fs from 'fs/promises';
import path from 'path';
import { readComercioCsv } from './comercioReader';
import { readProductosCsv } from './productosReader';
import { readSucursalesCsv } from './sucursalesReader';
import readline from 'readline';

const updateProgress = (message: any) => {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(message);
};

export const processCSVFilesInDirectory = async (directoryPath: any) => {
  try {
    const files = await fs.readdir(directoryPath);
    const csvFiles = files.filter((file) => path.extname(file) === '.csv');

    if (csvFiles.length === 0) {
      console.log('No se encontraron archivos CSV en el directorio.');
      return;
    }
    let count = 0;
    for (const csvFile of csvFiles) {
      const csvFilePath = path.join(directoryPath, csvFile);
      updateProgress(`Procesando archivo ${++count} de ${csvFiles.length}: ${csvFile}`);

      if (csvFile.includes('comercio')) {
        await readComercioCsv(csvFilePath);
      } else if (csvFile.includes('productos')) {
        await readProductosCsv(csvFilePath);
      }
      if (csvFile.includes('sucursales')) {
        await readSucursalesCsv(csvFilePath);
      } else {
        console.log(`\nArchivo ${csvFile} no coincide con ningún lector definido.`);
      }
    }
    console.log('\nProcesamiento de archivos CSV completado.');
  } catch (error) {
    console.error('\nError al procesar archivos CSV:', error);
  }
};
