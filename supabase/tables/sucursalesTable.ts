import client from '../supabase';

export const createSucursalesTable = async () => {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS sucursales (
        id SERIAL PRIMARY KEY,
        id_comercio INT,
        id_bandera INT,
        id_sucursal INT,
        sucursales_nombre VARCHAR(255),
        sucursales_tipo VARCHAR(50),
        sucursales_calle VARCHAR(255),
        sucursales_numero VARCHAR(50),
        sucursales_latitud FLOAT,
        sucursales_longitud FLOAT,
        sucursales_observaciones TEXT,
        sucursales_barrio VARCHAR(255),
        sucursales_codigo_postal VARCHAR(50),
        sucursales_localidad VARCHAR(255),
        sucursales_provincia VARCHAR(50),
        sucursales_lunes_horario_atencion VARCHAR(50),
        sucursales_martes_horario_atencion VARCHAR(50),
        sucursales_miercoles_horario_atencion VARCHAR(50),
        sucursales_jueves_horario_atencion VARCHAR(50),
        sucursales_viernes_horario_atencion VARCHAR(50),
        sucursales_sabado_horario_atencion VARCHAR(50),
        sucursales_domingo_horario_atencion VARCHAR(50)
      );
    `);
    console.log('Tabla "sucursales" creada o ya existente.');
  } catch (error) {
    console.error('Error al crear la tabla "sucursales":', error);
  }
};
