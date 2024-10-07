import { createComercioTable } from './comercioTable';
import { createProductosTable } from './productosTable';
import { createSucursalesTable } from './sucursalesTable';

export const createAllTables = async () => {
  await createComercioTable();
  await createProductosTable();
  await createSucursalesTable();
};

// Si deseas que el archivo se ejecute directamente
createAllTables().then(() =>
  console.log('Todas las tablas han sido creadas o verificadas.')
);
