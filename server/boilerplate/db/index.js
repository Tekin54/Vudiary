// db.js
import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config(); // unbedingt ganz oben

// Prüfen, ob DATABASE_URL gesetzt ist
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL ist nicht gesetzt! Prüfe deine .env Datei.');
}

// postgres-Client mit SSL + IPv4 (Render + Supabase kompatibel)
const sql = postgres(connectionString, {
  ssl: { rejectUnauthorized: false }, // zwingt SSL für Supabase
  family: 4, // zwingt IPv4
});

export default sql;
