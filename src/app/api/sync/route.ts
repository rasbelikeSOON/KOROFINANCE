import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { fetchCryptoData, fetchForexRate, fetchNGXStocks, fetchITickStocks } from "@/lib/api/market";
import { fetchExternalNews } from "@/lib/api/news";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const type = url.searchParams.get("type"); // "market" or "news" or "all"

        const results = { market: null as any, news: null as any };

        if (type === "market" || type === "all" || !type) {
            const marketResults: any[] = [];
            const ngxStocks = await fetchNGXStocks();
            let finalNgxData = ngxStocks;

            const itickKey = process.env.ITICK_API_KEY;
            if (itickKey && ngxStocks.length > 0) {
                const tickers = ngxStocks.map(s => s.symbol);
                const premiumData = await fetchITickStocks(tickers.slice(0, 100));

                if (premiumData.length > 0) {
                    finalNgxData = ngxStocks.map(stock => {
                        const premium = premiumData.find(p => p.symbol === stock.symbol);
                        return premium ? { ...stock, price: premium.price, changePct: premium.changePct } : stock;
                    });
                }
            }

            for (const stock of finalNgxData) {
                marketResults.push({
                    ticker: stock.symbol,
                    name: stock.name,
                    price: stock.price,
                    change_pct: stock.changePct,
                    volume: stock.volume,
                    sector: stock.sector,
                    market: "ngx",
                });
            }

            const btc = await fetchCryptoData("bitcoin");
            if (btc) marketResults.push({ ticker: "BTC", name: "Bitcoin", price: btc.price, change_pct: btc.changePct, market: "crypto" });

            const eth = await fetchCryptoData("ethereum");
            if (eth) marketResults.push({ ticker: "ETH", name: "Ethereum", price: eth.price, change_pct: eth.changePct, market: "crypto" });

            const usdNgn = await fetchForexRate("USD", "NGN");
            if (usdNgn) marketResults.push({ ticker: "USD/NGN", name: "US Dollar / Naira", price: usdNgn, change_pct: 0, market: "forex" });

            if (marketResults.length > 0) {
                const { error } = await supabase
                    .from("market_cache")
                    .upsert(marketResults.map(r => ({ ...r, updated_at: new Date() })), { onConflict: "ticker" });
                if (error) throw error;
            }
            results.market = { count: marketResults.length, success: true };
        }

        if (type === "news" || type === "all" || !type) {
            const articles = await fetchExternalNews();
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
            results.news = { count: articles.length, success: true };
        }

        return NextResponse.json({ success: true, message: "Manual sync executed", results });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
