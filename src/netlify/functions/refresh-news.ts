import { detectTrendingTopics } from "../../lib/api/news";
import { generateMultipleArticles } from "../../lib/api/ai-writer";
import { supabase } from "../../lib/supabase";

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
        .slice(0, 80);
}

/**
 * Netlify Scheduled Function
 * Runs twice daily (6 AM & 6 PM UTC) to:
 * 1. Scan 6 Nigerian news sources for trending financial topics
 * 2. Use Gemini AI to write original articles about those topics
 * 3. Auto-publish to the news_articles table
 */
export async function handler(event: any, context: any) {
    console.log("Starting AI news generation pipeline...");

    try {
        // Step 1: Detect trending topics from external sources
        const { topics } = await detectTrendingTopics();
        console.log(`Found ${topics.length} trending topics`);

        if (topics.length === 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "No trending topics found", articlesGenerated: 0 }),
            };
        }

        // Step 2: Generate original articles using Gemini AI
        const articles = await generateMultipleArticles(topics);
        console.log(`AI generated ${articles.length} original articles`);

        if (articles.length === 0) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "AI generation returned no articles", articlesGenerated: 0 }),
            };
        }

        // Step 3: Publish to Supabase
        const seenSlugs = new Set<string>();
        const toInsert = articles.map((article, index) => {
            let slug = generateSlug(article.title);
            // Add date prefix for uniqueness
            const datePrefix = new Date().toISOString().slice(0, 10);
            slug = `${datePrefix}-${slug}`;

            if (seenSlugs.has(slug)) {
                slug += `-${index}`;
            }
            seenSlugs.add(slug);

            return {
                title: article.title,
                summary: article.summary,
                content: article.content,
                url: `/news/${slug}`,
                image_url: topics[index]?.image_url || "https://images.unsplash.com/photo-1611974714652-17852e91dac7?q=80&w=2070&auto=format&fit=crop",
                source: "KoroFinance",
                category: article.category,
                published_at: new Date().toISOString(),
                created_at: new Date().toISOString()
            };
        });

        const { error } = await supabase
            .from("news_articles")
            .upsert(toInsert, { onConflict: "url" });

        if (error) throw error;

        console.log(`Successfully published ${toInsert.length} AI-generated articles`);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "AI news generation complete",
                topicsAnalyzed: topics.length,
                articlesGenerated: toInsert.length,
                titles: toInsert.map(a => a.title)
            }),
        };
    } catch (error: any) {
        console.error("AI news pipeline failed:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to generate news", details: error.message }),
        };
    }
}
