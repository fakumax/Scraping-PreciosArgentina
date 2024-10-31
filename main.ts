import { downloadFile } from './downloadFile';
import { extractFile } from './extractFile';
import { createFolderAndExtract } from './createFolderAndExtract';

(async () => {
  try {
    // console.log('Iniciando proceso descarga de archivo...');
    // await downloadFile();
    //console.log('Extrayendo archivo ZIP...');
    //await extractFile();

    console.log('Procesando archivos extraídos...');
    await createFolderAndExtract();

    //console.log('Proceso completado.');
  } catch (error) {
    console.error('Error durante el proceso:', error);
  }
})();
