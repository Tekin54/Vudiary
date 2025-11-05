import sql from '../../boilerplate/db/index.js'; // Pfad ggf. anpassen

export const getEintrag = async () => {
  const eintraege = await sql`
    SELECT * FROM eintraege;
  `;
  return eintraege;
};

export const getEintragById = async (id) => {
  const [eintrag] = await sql`
    SELECT * FROM eintraege WHERE id = ${id};
  `;
  return eintrag;
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
  const [inserted] = await sql`
    INSERT INTO eintraege(title, page, description, date, mood, ort, straße, plz, time)
    VALUES (${title}, ${page}, ${description}, ${date}, ${mood}, ${ort}, ${straße}, ${plz}, ${time})
    RETURNING *;
  `;
  return inserted;
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
  const [updated] = await sql`
    UPDATE eintraege
    SET title = ${title},
        description = ${description},
        mood = ${mood},
        last_changed_date = ${last_changed_date},
        last_changed_time = ${last_changed_time},
        last_changed = ${last_changed}
    WHERE id = ${id}
    RETURNING *;
  `;
  return updated;
};

export const deleteEintrag = async (id) => {
  const [deleted] = await sql`
    DELETE FROM eintraege WHERE id = ${id}
    RETURNING *;
  `;
  return deleted;
};
