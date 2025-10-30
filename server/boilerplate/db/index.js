import pg from 'pg';

// workaround for dates
// https://github.com/brianc/node-postgres/issues/1844
const DATE_OID = 1082;
const parseDate = (value) => value;

pg.types.setTypeParser(DATE_OID, parseDate); // map timestamps

// create pool and query object
// Use explicit config so we can enable SSL when running in hosted/production environments
const poolConfig = {
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
  // enable SSL in production (many hosted Postgres providers require SSL)
  ssl:
    process.env.NODE_ENV === 'production' || process.env.PGSSLMODE === 'require'
      ? { rejectUnauthorized: false }
      : false,
};

export const pool = new pg.Pool(poolConfig);

export const query = (text, params) => pool.query(text, params);

// add close function for vitests
export const close = () => pool.end();
