import client from '../supabase';

export const createComercioTable = async () => {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS comercio (
        id_comercio INT PRIMARY KEY,
        id_bandera INT,
        comercio_cuit VARCHAR(50),
        comercio_razon_social VARCHAR(255),
        comercio_bandera_nombre VARCHAR(255),
        comercio_bandera_url VARCHAR(255),
        comercio_ultima_actualizacion TIMESTAMPTZ,
        comercio_version_sepa FLOAT
      );
    `);
    console.log('Tabla "comercio" creada o ya existente.');
  } catch (error) {
    console.error('Error al crear la tabla "comercio":', error);
  }
};
