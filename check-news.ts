import { supabase } from './src/lib/supabase';
async function check() {
  const { data, error } = await supabase.from('news_articles').select('id, title, category, published_at').order('published_at', { ascending: false }).limit(5);
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}
check();
