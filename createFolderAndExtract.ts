import AdmZip from 'adm-zip';
import fs from 'fs/promises';
import path from 'path';
import client from './supabase/supabase';
import { createAllTables } from './supabase/tables/createTables';

export const createFolderAndExtract = async () => {
  try {
    const tempDir = path.join(__dirname, 'temporal');

    // Leer los archivos de la carpeta 'temporal'
    const files = await fs.readdir(tempDir);
    const zipFiles = files.filter((file) => path.extname(file) === '.zip');

    if (zipFiles.length === 0) {
      console.log('No se encontraron archivos ZIP en la carpeta temporal.');
      return;
    }

    // Conectar a la base de datos antes de comenzar las operaciones
    try {
      await client.connect();
      console.log('Conexión exitosa a la base de datos');

      // Crear todas las tablas necesarias
      await createAllTables();

      // Procesar cada archivo ZIP
      // for (const zipFile of zipFiles) {
      //   const zipFilePath = path.join(tempDir, zipFile);
      //   const zipFolderName = path.basename(zipFile, '.zip');
      //   const targetDir = path.join(tempDir, zipFolderName);

      //   // Extraer el archivo ZIP en la carpeta correspondiente
      //   await fs.mkdir(targetDir, { recursive: true });
      //   const zip = new AdmZip(zipFilePath);
      //   zip.extractAllTo(targetDir, true);

      //   console.log(`Archivos del ZIP ${zipFile} extraídos en la carpeta: ${targetDir}`);

      //   // Leer los archivos extraídos y procesar los datos
      //   const extractedFiles = await fs.readdir(targetDir);
      //   const csvFiles = extractedFiles.filter((file) => path.extname(file) === '.csv');

      //   for (const csvFile of csvFiles) {
      //     const csvFilePath = path.join(targetDir, csvFile);
      //     // Leer el archivo CSV y hacer las inserciones en la base de datos
      //     console.log(`Insertando datos del archivo CSV: ${csvFile}`);

      //     // Aquí podés agregar la lógica para leer el CSV e insertar datos en las tablas correspondientes
      //   }
      // }
    } catch (queryError) {
      console.error('Error al crear las tablas o procesar los datos:', queryError);
    } finally {
      // Cerrar la conexión una vez terminadas todas las operaciones
      try {
        await client.end();
        console.log('Conexión cerrada correctamente');
      } catch (closeError) {
        console.error('Error al cerrar la conexión:', closeError);
      }
    }

    console.log('Proceso completado.');
  } catch (error) {
    console.error('Error al organizar y procesar los archivos extraídos:', error);
  }
};
