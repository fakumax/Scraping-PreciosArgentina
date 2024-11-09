import fs from 'fs/promises';
import { parse } from 'csv-parse';
import client from '../supabase';
import path from 'path';

async function removeLastTwoLines(filePath: string) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const lines = data.trim().split('\n');

    // Elimina las últimas dos líneas
    const filteredLines = lines.slice(0, -2);

    // Devuelve el contenido del archivo sin las últimas dos líneas
    return filteredLines.join('\n');
  } catch (error) {
    console.error('Error al eliminar las últimas dos líneas:', error);
    throw error;
  }
}

// Función para leer y procesar sucursales.csv
export const readSucursalesCsv = async (filePath: string) => {
  try {
    const cleanedCsv = await removeLastTwoLines(filePath); // Elimina las últimas dos líneas

    const parser = parse(cleanedCsv, {
      delimiter: '|',
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    for await (const record of parser) {
      // Verificar que el registro tenga las columnas esperadas
      if (
        !record.id_comercio ||
        !record.id_bandera ||
        !record.id_sucursal ||
        !record.sucursales_nombre
      ) {
        console.log(`Fila ignorada por tener columnas incompletas:`, record);
        continue;
      }

      const {
        id_comercio,
        id_bandera,
        id_sucursal,
        sucursales_nombre,
        sucursales_tipo,
        sucursales_calle,
        sucursales_numero,
        sucursales_latitud,
        sucursales_longitud,
        sucursales_observaciones,
        sucursales_barrio,
        sucursales_codigo_postal,
        sucursales_localidad,
        sucursales_provincia,
        sucursales_lunes_horario_atencion,
        sucursales_martes_horario_atencion,
        sucursales_miercoles_horario_atencion,
        sucursales_jueves_horario_atencion,
        sucursales_viernes_horario_atencion,
        sucursales_sabado_horario_atencion,
        sucursales_domingo_horario_atencion,
      } = record;

      await client.query(
        `
        INSERT INTO sucursales (
          id_comercio,
          id_bandera,
          id_sucursal,
          sucursales_nombre,
          sucursales_tipo,
          sucursales_calle,
          sucursales_numero,
          sucursales_latitud,
          sucursales_longitud,
          sucursales_observaciones,
          sucursales_barrio,
          sucursales_codigo_postal,
          sucursales_localidad,
          sucursales_provincia,
          sucursales_lunes_horario_atencion,
          sucursales_martes_horario_atencion,
          sucursales_miercoles_horario_atencion,
          sucursales_jueves_horario_atencion,
          sucursales_viernes_horario_atencion,
          sucursales_sabado_horario_atencion,
          sucursales_domingo_horario_atencion
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
        `,
        [
          parseInt(id_comercio, 10),
          parseInt(id_bandera, 10),
          parseInt(id_sucursal, 10),
          sucursales_nombre,
          sucursales_tipo,
          sucursales_calle,
          sucursales_numero || null,
          parseFloat(sucursales_latitud),
          parseFloat(sucursales_longitud),
          sucursales_observaciones || null,
          sucursales_barrio,
          sucursales_codigo_postal,
          sucursales_localidad,
          sucursales_provincia,
          sucursales_lunes_horario_atencion,
          sucursales_martes_horario_atencion,
          sucursales_miercoles_horario_atencion,
          sucursales_jueves_horario_atencion,
          sucursales_viernes_horario_atencion,
          sucursales_sabado_horario_atencion,
          sucursales_domingo_horario_atencion,
        ]
      );
    }

    console.log(`Datos de "sucursales" insertados correctamente desde ${filePath}.`);
  } catch (error) {
    console.error(
      `Error al leer o insertar los datos del CSV "sucursales" (${filePath}):`,
      error
    );
  }
};
