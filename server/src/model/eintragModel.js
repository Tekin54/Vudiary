// services/eintragService.js (oder wo du die Funktionen hattest)
import { supabase } from '../../boilerplate/db/index.js';

export const getEintrag = async () => {
  const { data, error } = await supabase.from('eintraege').select('*');
  if (error) throw error;
  return data;
};

export const getEintragById = async (id) => {
  const { data, error } = await supabase.from('eintraege').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
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
  const { data, error } = await supabase
    .from('eintraege')
    .update({
      title,
      description,
      mood,
      last_changed_date,
      last_changed_time,
      last_changed,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
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
  const { data, error } = await supabase
    .from('eintraege')
    .insert([{ title, page, description, date, mood, ort, straße, plz, time }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteentry = async (id) => {
  const { data, error } = await supabase.from('eintraege').delete().eq('id', id).select().single();

  if (error) throw error;
  return data;
};
