const supabaseUrl = "https://cwayxilaylnchjhntxvg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3YXl4aWxheWxuY2hqaG50eHZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NDkxMDYsImV4cCI6MjA4ODEyNTEwNn0.MLVefYNZ6LWfUIbsEYTucMDQsdoKW1zsxgwM6xNNsPQ";

async function clearNews() {
    const response = await fetch(`${supabaseUrl}/rest/v1/news_articles?source=neq.Placeholder`, {
        method: 'DELETE',
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        console.log('Successfully cleared news articles.');
    } else {
        console.error('Failed to clear news articles:', await response.text());
    }
}

clearNews();
