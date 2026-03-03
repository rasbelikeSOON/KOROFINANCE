import { supabase } from "../../lib/supabase";
import { fetchCryptoData, fetchForexRate, fetchStockData } from "../../lib/api/market";

/**
 * Netlify Scheduled Function
 * Runs every 5 minutes to refresh market data.
 */
export async function handler(event: any, context: any) {
    console.log("Refreshing market data...");

    try {
        const results = [];

        // 1. Fetch Crypto (BTC/ETH)
        const btc = await fetchCryptoData("bitcoin");
        if (btc) results.push({ ticker: "BTC", price: btc.price, change_pct: btc.changePct, market: "crypto" });

        const eth = await fetchCryptoData("ethereum");
        if (eth) results.push({ ticker: "ETH", price: eth.price, change_pct: eth.changePct, market: "crypto" });

        // 2. Fetch Forex (USD/NGN)
        const usdNgn = await fetchForexRate("USD", "NGN");
        if (usdNgn) results.push({ ticker: "USD/NGN", price: usdNgn, market: "forex" });

        // 3. Fetch NGX Stocks (Sample)
        const dangcem = await fetchStockData("DANGCEM.LAG");
        if (dangcem) results.push({ ticker: "DANGCEM", price: dangcem.price, change_pct: dangcem.changePct, market: "ngx" });

        const mtnn = await fetchStockData("MTNN.LAG");
        if (mtnn) results.push({ ticker: "MTNN", price: mtnn.price, change_pct: mtnn.changePct, market: "ngx" });

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
                assetsUpdated: results.length
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
