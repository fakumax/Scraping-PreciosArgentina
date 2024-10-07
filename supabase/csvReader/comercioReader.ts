import { parse } from 'csv-parse';
import fs from 'fs';
import client from '../../supabase';

// Función para leer y procesar comercio.csv
export const readComercioCsv = async (filePath: string) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const parser = parse(fileContent, {
      delimiter: '|',
      columns: true,
      skip_empty_lines: true,
    });

    for await (const record of parser) {
      const {
        id_comercio,
        id_bandera,
        comercio_cuit,
        comercio_razon_social,
        comercio_bandera_nombre,
        comercio_bandera_url,
        comercio_ultima_actualizacion,
        comercio_version_sepa,
      } = record;

      await client.query(
        `
        INSERT INTO comercio (
          id_comercio,
          id_bandera,
          comercio_cuit,
          comercio_razon_social,
          comercio_bandera_nombre,
          comercio_bandera_url,
          comercio_ultima_actualizacion,
          comercio_version_sepa
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id_comercio) DO NOTHING;
        `,
        [
          parseInt(id_comercio, 10),
          parseInt(id_bandera, 10),
          comercio_cuit,
          comercio_razon_social,
          comercio_bandera_nombre,
          comercio_bandera_url || null,
          comercio_ultima_actualizacion,
          parseFloat(comercio_version_sepa),
        ]
      );
    }

    console.log(`Datos de "comercio" insertados correctamente desde ${filePath}.`);
  } catch (error) {
    console.error(
      `Error al leer o insertar los datos del CSV "comercio" (${filePath}):`,
      error
    );
  }
};
