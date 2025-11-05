import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config(); // unbedingt hier!

// workaround for dates
const DATE_OID = 1082;
const parseDate = (value) => value;
pg.types.setTypeParser(DATE_OID, parseDate);

export const pool = new pg.Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false, // wichtig für Render + Supabase
  },
});

export const query = (text, params) => pool.query(text, params);
export const close = () => pool.end();
