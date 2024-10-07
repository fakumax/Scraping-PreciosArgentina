import { downloadFile } from './downloadFile'; // Importa la función principal del archivo scrape
import { extractFile } from './extractFile'; // Importa la función principal del archivo extract
import { createFolderAndExtract } from './createFolderAndExtract'; // Importa la función principal del archivo process

(async () => {
  try {
    //console.log('Iniciando proceso de scraping...');
    //await downloadFile();

    //console.log('Extrayendo archivo ZIP...');
    //await extractFile();

    console.log('Procesando archivos extraídos...');
    await createFolderAndExtract();

    console.log('Proceso completado.');
  } catch (error) {
    console.error('Error durante el proceso:', error);
  }
})();
