import fs from 'fs/promises';
import path from 'path';
import { parse } from 'csv-parse';
import client from '../supabase';

async function removeLastTwoLines(filePath: any) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const lines = data.trim().split('\n');

    // Elimina las últimas dos líneas
    const filteredLines = lines.slice(0, -2);

    // Sobrescribe el archivo temporalmente o usa el contenido filtrado para procesar
    return filteredLines.join('\n');
  } catch (error) {
    console.error('Error al eliminar las últimas dos líneas:', error);
    throw error;
  }
}

function normalizeFecha(fechaStr: any) {
  if (!fechaStr) return null; // Retorna null si la fecha no está definida

  // Detectar formato ISO estándar
  const isoMatch = fechaStr.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
  if (isoMatch) {
    return new Date(fechaStr).toISOString(); // Convierte a formato ISO si ya es válido
  }

  // Buscar fecha en formato dentro de "Última actualización: 2024-10-01T16:30:00-03:00"
  const match = fechaStr.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}-\d{2}:\d{2})/);
  if (match) {
    return new Date(match[0]).toISOString();
  }

  // Para formatos atípicos (si vienen fechas más simples)
  const simpleMatch = fechaStr.match(/(\d{4}-\d{2}-\d{2})/);
  if (simpleMatch) {
    return new Date(simpleMatch[0]).toISOString();
  }

  console.warn('Fecha no válida:', fechaStr); // Advertir si no se puede procesar
  return null; // Retorna null si no se detecta una fecha válida
}

export const readComercioCsv = async (filePath: any) => {
  try {
    const cleanedCsv = await removeLastTwoLines(filePath); // Obtener contenido sin las últimas 2 líneas

    const parser = parse({
      delimiter: '|',
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    parser.write(cleanedCsv);
    parser.end();

    for await (const record of parser) {
      try {
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

        if (!id_comercio || !id_bandera || !comercio_cuit) {
          console.log('Fila ignorada por falta de datos obligatorios:', record);
          continue;
        }

        const fechaNormalizada = normalizeFecha(comercio_ultima_actualizacion);

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
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
          `,
          [
            parseInt(id_comercio, 10),
            parseInt(id_bandera, 10),
            comercio_cuit.trim(),
            comercio_razon_social.trim(),
            comercio_bandera_nombre.trim(),
            comercio_bandera_url?.trim() || null,
            fechaNormalizada,
            parseFloat(comercio_version_sepa).toFixed(1),
          ]
        );
      } catch (error) {
        console.error('Error al insertar el registro:', record, error);
      }
    }
    console.log('Procesamiento completado.');
  } catch (error) {
    console.error('Error al procesar archivo:', error);
  }
};
