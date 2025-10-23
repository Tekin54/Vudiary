import { query } from '../../boilerplate/db/index.js';

// eslint-disable-next-line import/prefer-default-export
export const getEintrag = async () => {
  const { rows } = await query('SELECT * from eintraege;');
  return rows;
};
export const getEintragById = async (id) => {
  const { rows } = await query('SELECT * from eintraege where id=$1;', [id]);
  return rows[0];
};
export const changeEintragById = async (
  id,
  title,
  description,
  mood,
  last_changed_date,
  last_changed_time,
  last_changed,
) => {
  const { rows } = await query(
    'UPDATE eintraege SET title = $2, description = $3, mood = $4, last_changed_date = $5, last_changed_time = $6, last_changed = $7 WHERE id = $1;',
    [id, title, description, mood, last_changed_date, last_changed_time, last_changed],
  );
  return rows[0];
};

export const insertEintrag = async (
  title,
  page,
  description,
  date,
  mood,
  ort,
  straße,
  plz,
  time,
) => {
  const { rows } = await query(
    'insert into eintraege(title,page,description,date,mood,ort,straße,plz,time) values ($1,$2,$3,$4,$5,$6,$7,$8,$9);',
    [title, page, description, date, mood, ort, straße, plz, time],
  );
  return rows[0];
};

export const deleteEintrag = async (id) => {
  const { rows } = await query('delete from eintraege e where e.id = $1 returning*', [id]);
  return rows[0];
};
