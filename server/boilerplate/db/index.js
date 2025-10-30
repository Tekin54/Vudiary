import pg from 'pg';

// workaround for dates
// https://github.com/brianc/node-postgres/issues/1844
const DATE_OID = 1082;
const parseDate = (value) => value;

pg.types.setTypeParser(DATE_OID, parseDate); // map timestamps

// create pool and query object
// Prefer DATABASE_URL if provided (common on hosting platforms). Otherwise build
// config from PG* env vars. Enable SSL for production/hosted providers.
const connectionString = process.env.DATABASE_URL || null;

const shouldUseSsl = process.env.NODE_ENV === 'production' || process.env.PGSSLMODE === 'require';

let _pool;
if (connectionString) {
  _pool = new pg.Pool({
    connectionString,
    ssl: shouldUseSsl ? { rejectUnauthorized: false } : false,
  });
} else {
  const poolConfig = {
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
    ssl: shouldUseSsl ? { rejectUnauthorized: false } : false,
  };
  _pool = new pg.Pool(poolConfig);
}

// log unexpected idle client errors (helps debugging on hosted platforms)
_pool.on('error', (err) => {
  // do not log credentials
  // eslint-disable-next-line no-console
  console.error('Unexpected idle client error', err.message || err);
});

export const pool = _pool;

export const query = (text, params) => pool.query(text, params);

// add close function for vitests
export const close = () => pool.end();
