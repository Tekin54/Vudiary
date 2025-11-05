import pg from 'pg';

// workaround for dates
const DATE_OID = 1082;
pg.types.setTypeParser(DATE_OID, (value) => value);

// create pool with SSL + IPv4
export const pool = new pg.Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  ssl: { rejectUnauthorized: false }, // Supabase erfordert SSL
  family: 4, // zwingt IPv4, ENETUNREACH vermeiden
});

export const query = (text, params) => pool.query(text, params);
export const close = () => pool.end();
