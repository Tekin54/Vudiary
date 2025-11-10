import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

export const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// TEST: Verbindung prüfen
(async () => {
  const { data, error } = await supabase.from('eintraege').select('*');
  console.log('Verbindungstest:', { data, error });
})();
