import { parse } from 'csv-parse';
import fs from 'fs';
import client from '../supabase';

// Función para leer y procesar productos.csv
export const readProductosCsv = async (filePath: string) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const parser = parse(fileContent, {
      delimiter: '|',
      columns: true,
      skip_empty_lines: true,
    });

    for await (const record of parser) {
      // Verificar que el registro tenga todas las columnas esperadas
      if (
        !record.id_comercio ||
        !record.id_bandera ||
        !record.id_sucursal ||
        !record.id_producto
      ) {
        console.log(`Fila ignorada por tener columnas incompletas:`, record);
        continue; // Salta a la siguiente fila si alguna columna está ausente
      }

      const {
        id_comercio,
        id_bandera,
        id_sucursal,
        id_producto,
        productos_ean,
        productos_descripcion,
        productos_cantidad_presentacion,
        productos_unidad_medida_presentacion,
        productos_marca,
        productos_precio_lista,
        productos_precio_referencia,
        productos_cantidad_referencia,
        productos_unidad_medida_referencia,
        productos_precio_unitario_promo1,
        productos_leyenda_promo1,
        productos_precio_unitario_promo2,
        productos_leyenda_promo2,
      } = record;

      await client.query(
        `
        INSERT INTO productos (
          id_comercio,
          id_bandera,
          id_sucursal,
          id_producto,
          productos_ean,
          productos_descripcion,
          productos_cantidad_presentacion,
          productos_unidad_medida_presentacion,
          productos_marca,
          productos_precio_lista,
          productos_precio_referencia,
          productos_cantidad_referencia,
          productos_unidad_medida_referencia,
          productos_precio_unitario_promo1,
          productos_leyenda_promo1,
          productos_precio_unitario_promo2,
          productos_leyenda_promo2
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        ON CONFLICT (id_producto) DO NOTHING;
        `,
        [
          parseInt(id_comercio, 10),
          parseInt(id_bandera, 10),
          parseInt(id_sucursal, 10),
          id_producto,
          productos_ean,
          productos_descripcion,
          parseFloat(productos_cantidad_presentacion),
          productos_unidad_medida_presentacion,
          productos_marca,
          parseFloat(productos_precio_lista),
          parseFloat(productos_precio_referencia),
          parseFloat(productos_cantidad_referencia),
          productos_unidad_medida_referencia,
          parseFloat(productos_precio_unitario_promo1) || null,
          productos_leyenda_promo1 || null,
          parseFloat(productos_precio_unitario_promo2) || null,
          productos_leyenda_promo2 || null,
        ]
      );
    }

    console.log(`Datos de "productos" insertados correctamente desde ${filePath}.`);
  } catch (error) {
    console.error(
      `Error al leer o insertar los datos del CSV "productos" (${filePath}):`,
      error
    );
  }
};
