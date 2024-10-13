import { createComercioTable } from './comercioTable';
import { createProductosTable } from './productosTable';
import { createSucursalesTable } from './sucursalesTable';

export const createAllTables = async () => {
  try {
    await createComercioTable();
    await createProductosTable();
    await createSucursalesTable();
    console.log('Todas las tablas han sido creadas o verificadas.');
  } catch (error) {
    console.error('Ocurrió un error al crear las tablas:', error);
  }
};
