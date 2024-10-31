import AdmZip from 'adm-zip';
import fs from 'fs/promises';
import path from 'path';

export const extractFile = async () => {
  try {
    const downloadDir = path.join(__dirname, 'descargas');
    const tempDir = path.join(__dirname, 'temporal');

    // Crear la carpeta 'Temporal' si no existe
    await fs.mkdir(tempDir, { recursive: true });

    // Leer los archivos de la carpeta 'descargas'
    const files = await fs.readdir(downloadDir);
    const zipFiles = files.filter((file) => path.extname(file) === '.zip');

    if (zipFiles.length === 0) {
      console.log('No se encontraron archivos ZIP en la carpeta descargas.');
      return;
    }

    // Extraer el primer archivo ZIP encontrado
    const zipFilePath = path.join(downloadDir, zipFiles[0]);
    const zip = new AdmZip(zipFilePath);

    // Obtener el número de entradas (archivos y carpetas) en el archivo ZIP
    const totalFiles = zip.getEntries().length;

    // Extraer el contenido del archivo ZIP en la carpeta 'Temporal'
    zip.extractAllTo(tempDir, true);
    console.log(`Se extrajeron ${totalFiles} archivos en la carpeta Temporal.`);

    // Eliminar el archivo ZIP después de extraerlo
    await fs.unlink(zipFilePath);
    console.log(`Archivo ${zipFiles[0]} eliminado de la carpeta descargas.`);
  } catch (error) {
    console.error('Error al extraer el archivo ZIP:', error);
  }
};
