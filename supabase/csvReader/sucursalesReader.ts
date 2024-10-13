import { parse } from 'csv-parse';
import fs from 'fs';
import client from '../supabase';

// Función para leer y procesar sucursales.csv
export const readSucursalesCsv = async (filePath: string) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const parser = parse(fileContent, {
      delimiter: '|',
      columns: true,
      skip_empty_lines: true,
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
        continue; // Salta a la siguiente fila si alguna columna importante está ausente
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
        ON CONFLICT (id_sucursal) DO NOTHING;
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
