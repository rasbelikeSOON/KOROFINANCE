import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkNews() {
    const { data, error } = await supabase
        .from('news_articles')
        .select('title, summary, source')
        .order('published_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error fetching news:', error);
        return;
    }

    console.log('Latest 10 News Articles:');
    data.forEach((article, index) => {
        console.log(`${index + 1}. [${article.source}] ${article.title}`);
    });
}

checkNews();
