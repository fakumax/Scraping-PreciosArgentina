import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Configurar el cliente PostgreSQL usando la cadena de conexión desde el archivo .env
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Configuración para conexiones SSL, necesario para Supabase
  },
});

client
  .connect()
  .then(() => console.log('Conexión exitosa a la base de datos'))
  .catch((err) => console.error('Error de conexión:', err));

export default client;
