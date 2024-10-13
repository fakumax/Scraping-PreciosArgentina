import { readComercioCsv } from './comercioReader';
import { readProductosCsv } from './productosReader';
import { readSucursalesCsv } from './sucursalesReader';

export const processCsvFiles = async (filePath: string, fileName: string) => {
  if (fileName.includes('comercio')) {
    await readComercioCsv(filePath);
    // } else if (fileName.includes('productos')) {
    //   await readProductosCsv(filePath);
    // } else if (fileName.includes('sucursales')) {
    //   await readSucursalesCsv(filePath);
  }
};
