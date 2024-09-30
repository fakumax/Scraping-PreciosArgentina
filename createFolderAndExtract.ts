import AdmZip from 'adm-zip';
import fs from 'fs/promises';
import path from 'path';

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

    // Procesar cada archivo ZIP encontrado
    for (const zipFile of zipFiles) {
      const zipFilePath = path.join(tempDir, zipFile);

      // Crear una carpeta con el nombre del archivo ZIP (sin extensión)
      const zipFolderName = path.basename(zipFile, '.zip');
      const targetDir = path.join(tempDir, zipFolderName);

      // Crear la subcarpeta si no existe
      await fs.mkdir(targetDir, { recursive: true });

      // Utilizar AdmZip para extraer los archivos dentro de la carpeta recién creada
      const zip = new AdmZip(zipFilePath);
      zip.extractAllTo(targetDir, true);

      console.log(
        `Archivos del ZIP ${zipFile} extraídos correctamente en la carpeta: ${targetDir}`
      );
    }

    console.log('Todos los archivos ZIP han sido organizados.');
  } catch (error) {
    console.error('Error al organizar los archivos extraídos:', error);
  }
};
