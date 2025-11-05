import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL ist nicht gesetzt!');
}

const sql = postgres(connectionString, {
  ssl: { rejectUnauthorized: false }, // Supabase SSL
  family: 4, // IPv4 erzwingen für Render
});

export default sql;
