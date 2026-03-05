import { detectTrendingTopics } from "../../lib/api/news";
import { generateCycleArticles, getCurrentCycleCategories, CATEGORIES } from "../../lib/api/ai-writer";
import { supabase } from "../../lib/supabase";

// Netlify Scheduled Function - runs every 6 hours based on netlify.toml schedule.
// Picks cycle categories from the 48-hour rotation, generates via Gemini, saves to Supabase.
export async function handler(event: any) {
    const cycleCategories = getCurrentCycleCategories();
    console.log("[Koro] Cycle categories:", cycleCategories.join(", "));

    try {
        const { topics } = await detectTrendingTopics();
        const activeTopic = topics.length > 0 ? topics : [{
            headlines: ["Nigerian financial markets update"],
            summaries: ["Latest developments in the Nigerian economy and NGX markets"],
            category: "Markets",
            sources: ["KoroFinance"],
            image_url: "https://images.unsplash.com/photo-1611974714652-17852e91dac7?q=80&w=2070&auto=format&fit=crop"
        }];

        let marketSummary = "Market data unavailable.";
        try {
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.URL || "https://korofinance.netlify.app";
            const [ngxRes, cryptoRes] = await Promise.all([
                fetch(`${siteUrl}/api/market?type=NGX`),
                fetch(`${siteUrl}/api/market?type=Crypto`)
            ]);
            const lines: string[] = [];
            if (ngxRes.ok) {
                const ngx = await ngxRes.json();
                lines.push("NGX STOCKS:");
                ngx.forEach((s: any) => lines.push(`  ${s.ticker}: N${s.price.toFixed(2)} (${s.change_pct >= 0 ? "+" : ""}${s.change_pct.toFixed(2)}%)`));
            }
            if (cryptoRes.ok) {
                const crypto = await cryptoRes.json();
                lines.push("CRYPTO:");
                crypto.forEach((c: any) => lines.push(`  ${c.ticker}: $${c.price.toLocaleString()} (${c.change_pct >= 0 ? "+" : ""}${c.change_pct.toFixed(2)}%)`));
            }
            if (lines.length > 0) marketSummary = lines.join("\n");
        } catch (e) {
            console.warn("Market data fetch failed:", e);
        }

        const articles = await generateCycleArticles(activeTopic, marketSummary, cycleCategories);
        if (articles.length === 0) {
            return { statusCode: 200, body: JSON.stringify({ message: "No articles generated", articlesGenerated: 0 }) };
        }

        const datePrefix = new Date().toISOString().slice(0, 10);
        const toInsert = articles.map((article, idx) => {
            const uniqueSlug = `${datePrefix}-${article.slug}-${Date.now().toString(36).slice(-4)}-${idx}`;
            const categoryDef = CATEGORIES[article.category as keyof typeof CATEGORIES];
            return {
                title: article.title,
                summary: article.summary,
                content: article.content,
                url: `/news/${uniqueSlug}`,
                slug: uniqueSlug,
                image_url: activeTopic[idx % activeTopic.length]?.image_url || "https://images.unsplash.com/photo-1611974714652-17852e91dac7?q=80&w=2070&auto=format&fit=crop",
                source: "KoroFinance",
                category: article.category,
                tag_colour: categoryDef?.tag_colour || "#5B2ECC",
                read_time: categoryDef?.read_time || 4,
                is_generated: true,
                is_breaking: false,
                published_at: new Date().toISOString(),
                created_at: new Date().toISOString()
            };
        });

        const { error } = await supabase.from("news_articles").upsert(toInsert, { onConflict: "slug" });
        if (error) throw error;

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Koro content cycle complete", cycle: cycleCategories, articlesGenerated: toInsert.length, titles: toInsert.map((a) => a.title) })
        };
    } catch (error: any) {
        return { statusCode: 500, body: JSON.stringify({ error: "Content cycle failed", details: error.message }) };
    }
}
