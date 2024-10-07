import { createAllTables } from './tables/createTables';
import client from './supabase';
import fs from 'fs';
import path from 'path';
import { processCsvFiles } from './csvReader/index';

const main = async () => {
  try {
    // 1. Crear las tablas si no existen
    await createAllTables();

    // 2. Definir la ruta de la carpeta base que contiene las subcarpetas con los archivos CSV
    const baseFolder = 'ruta/a/tu/carpeta/base'; // Ajusta esta ruta según la estructura de tu proyecto

    // 3. Leer todas las subcarpetas y procesar los archivos CSV en cada una
    const folders = fs.readdirSync(baseFolder);
    for (const folder of folders) {
      const folderPath = path.join(baseFolder, folder);
      if (fs.statSync(folderPath).isDirectory()) {
        const files = fs.readdirSync(folderPath);
        const csvFiles = files.filter((file) => path.extname(file) === '.csv');

        for (const csvFile of csvFiles) {
          const csvFilePath = path.join(folderPath, csvFile);
          // Llamar a la función central para procesar el archivo CSV basado en su nombre
          await processCsvFiles(csvFilePath, csvFile);
        }
      }
    }

    console.log('Todos los archivos CSV han sido procesados correctamente.');
  } catch (error) {
    console.error('Error en la ejecución del proceso principal:', error);
  } finally {
    // Cierra la conexión al cliente
    client.end();
  }
};

// Ejecuta la función principal
main();
