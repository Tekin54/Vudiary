// db.js
import postgres from 'postgres';
import dotenv from 'dotenv';
dotenv.config();

// Verbindung über DATABASE_URL von Supabase (am Render-Dashboard als ENV setzen)
const connectionString = process.env.DATABASE_URL;

// SSL erzwingen, IPv4 automatisch genutzt
const sql = postgres(connectionString, { ssl: { rejectUnauthorized: false } });

export default sql;
