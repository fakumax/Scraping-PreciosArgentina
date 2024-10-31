import fs from 'fs/promises';
import path from 'path';
import { readComercioCsv } from './comercioReader';
import { readProductosCsv } from './productosReader';
import { readSucursalesCsv } from './sucursalesReader';

// Lee y procesa cada archivo CSV en el directorio

// export const processCSVFilesInDirectory = async (directoryPath: string) => {
//   try {
//     const files = await fs.readdir(directoryPath);
//     const csvFiles = files.filter((file) => path.extname(file) === '.csv');

//     for (const csvFile of csvFiles) {
//       const csvFilePath = path.join(directoryPath, csvFile);
//       console.log(`Procesando archivo CSV: ${csvFile}`);

//       // Ejecuta el lector específico en función del nombre del archivo
//       if (csvFile.includes('comercio')) {
//         await readComercioCsv(csvFilePath);
//       } else if (csvFile.includes('productos')) {
//         await readProductosCsv(csvFilePath);
//       } else if (csvFile.includes('sucursales')) {
//         await readSucursalesCsv(csvFilePath);
//       } else {
//         console.log(`Archivo ${csvFile} no coincide con ningún lector definido.`);
//       }

//       console.log(
//         `Datos del archivo ${csvFile} procesados e insertados en la base de datos.`
//       );
//     }
//   } catch (error) {
//     console.error('Error al procesar archivos CSV:', error);
//   }
// };

export const processCSVFilesInDirectory = async (directoryPath: string) => {
  try {
    const files = await fs.readdir(directoryPath);
    const csvFiles = files.filter((file) => path.extname(file) === '.csv');

    if (csvFiles.length === 0) {
      console.log('No se encontraron archivos CSV en el directorio.');
      return;
    }

    // Filtra solo el archivo CSV de "comercio"
    const comercioCsvFile = csvFiles.find((file) => file.includes('comercio'));

    if (comercioCsvFile) {
      const csvFilePath = path.join(directoryPath, comercioCsvFile);
      console.log(`Procesando archivo CSV de comercio: ${comercioCsvFile}`);

      // Ejecuta el lector de comercio
      await readComercioCsv(csvFilePath);

      console.log(
        `Datos del archivo ${comercioCsvFile} procesados e insertados en la base de datos.`
      );
    } else {
      console.log('No se encontró archivo CSV de comercio en el directorio.');
    }
  } catch (error) {
    console.error('Error al procesar el archivo CSV de comercio:', error);
  }
};
