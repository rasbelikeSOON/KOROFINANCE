import { supabase } from "../../lib/supabase";
import { fetchCryptoData, fetchForexRate, fetchNGXStocks } from "../../lib/api/market";

/**
 * Netlify Scheduled Function
 * Runs daily to refresh market data from all sources.
 * Uses only ~4 API calls per run (NGX Pulse, CoinGecko x2, ExchangeRate-API).
 */
export async function handler(event: any, context: any) {
    console.log("Refreshing market data...");

    try {
        const results: any[] = [];

        // 1. Fetch ALL NGX Stocks in one call via NGX Pulse
        const ngxStocks = await fetchNGXStocks();
        for (const stock of ngxStocks) {
            results.push({
                ticker: stock.symbol,
                name: stock.name,
                price: stock.price,
                change_pct: stock.changePct,
                volume: stock.volume,
                market: "ngx",
            });
        }
        console.log(`Fetched ${ngxStocks.length} NGX stocks`);

        // 2. Fetch Crypto (BTC/ETH)
        const btc = await fetchCryptoData("bitcoin");
        if (btc) results.push({ ticker: "BTC", name: "Bitcoin", price: btc.price, change_pct: btc.changePct, market: "crypto" });

        const eth = await fetchCryptoData("ethereum");
        if (eth) results.push({ ticker: "ETH", name: "Ethereum", price: eth.price, change_pct: eth.changePct, market: "crypto" });

        // 3. Fetch Forex (USD/NGN)
        const usdNgn = await fetchForexRate("USD", "NGN");
        if (usdNgn) results.push({ ticker: "USD/NGN", name: "US Dollar / Naira", price: usdNgn, change_pct: 0, market: "forex" });

        // 4. Upsert into Supabase `market_cache` table
        if (results.length > 0) {
            const { error } = await supabase
                .from("market_cache")
                .upsert(results.map(r => ({ ...r, updated_at: new Date() })), { onConflict: "ticker" });

            if (error) throw error;
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Market data refreshed successfully",
                assetsUpdated: results.length,
                breakdown: {
                    ngx: ngxStocks.length,
                    crypto: [btc, eth].filter(Boolean).length,
                    forex: usdNgn ? 1 : 0,
                },
            }),
        };
    } catch (error: any) {
        console.error("Refresh failed:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to refresh market data", details: error.message }),
        };
    }
}
