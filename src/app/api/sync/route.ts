import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { detectTrendingTopics } from "@/lib/api/news";
import { generateCycleArticles, getCurrentCycleCategories, CATEGORIES } from "@/lib/api/ai-writer";
import { fetchNGXStocks, fetchCryptoData } from "@/lib/api/market";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const type = url.searchParams.get("type"); // "market" | "news" | "all"
        const forceCategory = url.searchParams.get("category") as keyof typeof CATEGORIES | null;
        const isBreaking = url.searchParams.get("breaking") === "true";

        const results: Record<string, any> = {};

        // ─── NEWS / ARTICLE GENERATION ──────────────────────────────────────
        if (type === "news" || type === "all" || !type) {
            // 1. Detect trending topics from Nigerian news sources
            const { topics } = await detectTrendingTopics();

            // 2. Fetch live market snapshot to inject into prompts
            let marketSummary = "No live market data available.";
            try {
                const ngxStocks = await fetchNGXStocks();
                if (ngxStocks && ngxStocks.length > 0) {
                    marketSummary = ngxStocks.slice(0, 10).map((s: any) =>
                        `${s.symbol} (${s.name}): ₦${s.price.toFixed(2)} | ${s.changePct >= 0 ? "+" : ""}${s.changePct.toFixed(2)}%`
                    ).join("\n");
                }
            } catch (e) {
                console.warn("Could not fetch live market data for prompts:", e);
            }

            let cryptoSummary = "";
            try {
                const btc = await fetchCryptoData("bitcoin");
                const eth = await fetchCryptoData("ethereum");

                if (btc) cryptoSummary += `BTC (Bitcoin): $${btc.price.toLocaleString()} | ${btc.changePct >= 0 ? "+" : ""}${btc.changePct.toFixed(2)}%\n`;
                if (eth) cryptoSummary += `ETH (Ethereum): $${eth.price.toLocaleString()} | ${eth.changePct >= 0 ? "+" : ""}${eth.changePct.toFixed(2)}%`;

                if (cryptoSummary) {
                    marketSummary = marketSummary + "\n\nCRYPTO:\n" + cryptoSummary;
                }
            } catch (e) {
                console.warn("Could not fetch crypto data for prompts:", e);
            }

            // 3. Determine which categories to generate
            const currentCycle = getCurrentCycleCategories();
            const categoriesToRun = forceCategory ? [forceCategory] : currentCycle;

            console.log(`Running content cycle for categories: ${categoriesToRun.join(", ")}`);

            // 4. Generate articles via Gemini
            const articles = await generateCycleArticles(
                topics.length > 0 ? topics : [{
                    headlines: ["Nigerian financial markets update"],
                    summaries: ["Latest developments in Nigerian economy and markets"],
                    category: "Markets",
                    sources: ["KoroFinance"]
                }],
                marketSummary,
                categoriesToRun
            );

            // 5. Save to Supabase
            if (articles.length > 0) {
                const toInsert = articles.map(article => {
                    const datePrefix = new Date().toISOString().slice(0, 10);
                    const uniqueSlug = `${datePrefix}-${article.slug}-${Date.now().toString(36).slice(-4)}`;
                    const categoryDef = CATEGORIES[article.category as keyof typeof CATEGORIES];

                    return {
                        title: article.title,
                        summary: article.summary,
                        content: article.content,
                        url: `/news/${uniqueSlug}`,
                        slug: uniqueSlug,
                        image_url: "https://images.unsplash.com/photo-1611974714652-17852e91dac7?q=80&w=2070&auto=format&fit=crop",
                        source: "KoroFinance",
                        category: article.category,
                        tag_colour: categoryDef?.tag_colour || "#5B2ECC",
                        read_time: categoryDef?.read_time || 4,
                        is_generated: true,
                        is_breaking: isBreaking,
                        published_at: new Date().toISOString(),
                        created_at: new Date().toISOString()
                    };
                });

                const { error } = await supabase
                    .from("news_articles")
                    .upsert(toInsert, { onConflict: "slug" });

                if (error) {
                    console.error("Supabase insert error:", error);
                    throw error;
                }

                results.news = {
                    success: true,
                    count: toInsert.length,
                    cycle_categories: categoriesToRun,
                    titles: articles.map(a => a.title)
                };
            } else {
                results.news = { success: true, count: 0, note: "No articles generated — likely no Gemini API key or no trending topics found." };
            }
        }

        return NextResponse.json({
            success: true,
            message: "Content sync executed successfully",
            timestamp: new Date().toISOString(),
            results
        });

    } catch (error: any) {
        console.error("Sync route error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
