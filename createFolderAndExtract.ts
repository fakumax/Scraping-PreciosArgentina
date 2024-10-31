import AdmZip from 'adm-zip';
import fs from 'fs/promises';
import path from 'path';
import client from './supabase/supabase';
import { createAllTables } from './supabase/tables/createTables';
import { processCSVFilesInDirectory } from './supabase/csvReader';

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
      for (const zipFile of zipFiles) {
        const zipFilePath = path.join(tempDir, zipFile);
        const zipFolderName = path.basename(zipFile, '.zip');
        const targetDir = path.join(tempDir, zipFolderName);

        // Extraer el archivo ZIP en la carpeta correspondiente
        await fs.mkdir(targetDir, { recursive: true });
        const zip = new AdmZip(zipFilePath);
        zip.extractAllTo(targetDir, true);

        // Llama a processCSVFilesInDirectory para procesar los archivos CSV extraídos
        await processCSVFilesInDirectory(targetDir);
      }
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
