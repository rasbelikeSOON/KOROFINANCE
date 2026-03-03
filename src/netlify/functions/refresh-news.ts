import { fetchExternalNews } from "../../lib/api/news";
import { supabase } from "../../lib/supabase";

/**
 * Netlify Scheduled Function
 * Runs daily to aggregate news from top Nigerian financial sources.
 */
export async function handler(event: any, context: any) {
    console.log("Syncing news articles...");

    try {
        const articles = await fetchExternalNews();
        console.log(`Fetched ${articles.length} articles from external APIs`);

        if (articles.length > 0) {
            const { error } = await supabase
                .from("news_articles")
                .upsert(
                    articles.map(a => ({
                        ...a,
                        created_at: new Date().toISOString()
                    })),
                    { onConflict: "url" }
                );

            if (error) throw error;
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "News sync complete",
                articlesProcessed: articles.length
            }),
        };
    } catch (error: any) {
        console.error("News sync failed:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to sync news", details: error.message }),
        };
    }
}
