import pg from 'pg';

const DATE_OID = 1082;
pg.types.setTypeParser(DATE_OID, (value) => value);

export const pool = new pg.Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  ssl: {
    rejectUnauthorized: false,
  },
  // Erzwinge IPv4
  family: 4,
});

export const query = (text, params) => pool.query(text, params);
export const close = () => pool.end();
