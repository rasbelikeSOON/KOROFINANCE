const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = "https://cwayxilaylnchjhntxvg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3YXl4aWxheWxuY2hqaG50eHZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NDkxMDYsImV4cCI6MjA4ODEyNTEwNn0.MLVefYNZ6LWfUIbsEYTucMDQsdoKW1zsxgwM6xNNsPQ";

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkDatabase() {
    const { count, error } = await supabase
        .from('news_articles')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error('Error fetching count:', error);
        return;
    }

    console.log('Total news articles:', count);

    const { data: recent, error: recentError } = await supabase
        .from('news_articles')
        .select('*')
        .order('published_at', { ascending: false })
        .limit(5);

    if (recentError) {
        console.error('Error fetching recent:', recentError);
        return;
    }

    console.log('Recent 5 articles:', JSON.stringify(recent, null, 2));
}

checkDatabase().catch(err => {
    console.error('Unhandled promise rejection:', err);
    process.exit(1);
});
