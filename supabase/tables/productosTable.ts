import client from '../supabase';

export const createProductosTable = async () => {
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id SERIAL PRIMARY KEY, 
        id_comercio INT,
        id_bandera INT,
        id_sucursal INT,
        id_producto VARCHAR(50), 
        productos_ean VARCHAR(50),
        productos_descripcion VARCHAR(255),
        productos_cantidad_presentacion FLOAT,
        productos_unidad_medida_presentacion VARCHAR(50),
        productos_marca VARCHAR(255),
        productos_precio_lista FLOAT,
        productos_precio_referencia FLOAT,
        productos_cantidad_referencia FLOAT,
        productos_unidad_medida_referencia VARCHAR(50),
        productos_precio_unitario_promo1 FLOAT,
        productos_leyenda_promo1 VARCHAR(255),
        productos_precio_unitario_promo2 FLOAT,
        productos_leyenda_promo2 VARCHAR(255)
      );
    `);
    console.log('Tabla "productos" creada o ya existente.');
  } catch (error) {
    console.error('Error al crear la tabla "productos":', error);
  }
};
