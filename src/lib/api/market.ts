/**
 * Market Data API Implementation
 * - NGX Pulse (Nigerian Stocks) - 100 req/day free
 * - iTick (Premium Nigerian Stocks) - 1000+ symbols, real-time
 * - CoinGecko (Crypto) - free, no key needed
 * - ExchangeRate-API (Forex) - 1500 req/month free
 */

export interface MarketData {
    symbol: string;
    name?: string;
    price: number;
    changePct: number;
    volume?: number;
    sector?: string;
}

export interface NGXMarketSummary {
    asi: number;
    marketCap: number;
    volume: number;
    advancers: number;
    decliners: number;
    unchanged: number;
}

const NGX_PULSE_KEY = process.env.NGX_PULSE_API_KEY;
const ITICK_KEY = process.env.ITICK_API_KEY;

// iTick (Premium Nigerian Stocks)
export async function fetchITickStocks(tickers: string[]): Promise<MarketData[]> {
    if (!ITICK_KEY) return [];
    try {
        // iTick supports batch quotes via comma-separated codes
        const codes = tickers.join(",");
        const res = await fetch(`https://api.itick.org/stock/quote?region=NG&token=${ITICK_KEY}&codes=${codes}`);
        const data = await res.json();

        if (!data.data) return [];

        return data.data.map((stock: any) => ({
            symbol: stock.code,
            name: stock.name,
            price: stock.price,
            changePct: stock.change_percent,
            volume: stock.volume,
            sector: stock.sector,
        }));
    } catch (error) {
        console.error("Error fetching iTick stocks:", error);
        return [];
    }
}

// NGX Pulse (Nigerian Stocks)
export async function fetchNGXStocks(): Promise<MarketData[]> {
    try {
        const res = await fetch("https://ngxpulse.ng/api/ngxdata/stocks", {
            headers: { "x-api-key": NGX_PULSE_KEY || "" },
        });
        const data = await res.json();

        if (!data.stocks) return [];

        return data.stocks.map((stock: any) => ({
            symbol: stock.symbol,
            name: stock.name,
            price: stock.current_price,
            changePct: stock.change_percent,
            volume: stock.volume,
            sector: stock.sector,
        }));
    } catch (error) {
        console.error("Error fetching NGX stocks:", error);
        return [];
    }
}

// NGX Pulse (Market Summary)
export async function fetchNGXMarketSummary(): Promise<NGXMarketSummary | null> {
    try {
        const res = await fetch("https://ngxpulse.ng/api/ngxdata/market", {
            headers: { "x-api-key": NGX_PULSE_KEY || "" },
        });
        const data = await res.json();
        return {
            asi: data.asi,
            marketCap: data.market_cap,
            volume: data.volume,
            advancers: data.advancers,
            decliners: data.decliners,
            unchanged: data.unchanged,
        };
    } catch (error) {
        console.error("Error fetching NGX market summary:", error);
        return null;
    }
}

// CoinGecko (Crypto) — Free, no key needed
export async function fetchCryptoData(coinId: string): Promise<MarketData | null> {
    try {
        const res = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_24hr_change=true`
        );
        const data = await res.json();

        if (!data[coinId]) return null;

        return {
            symbol: coinId.toUpperCase(),
            price: data[coinId].usd,
            changePct: data[coinId].usd_24h_change,
        };
    } catch (error) {
        console.error(`Error fetching crypto ${coinId}:`, error);
        return null;
    }
}

// ExchangeRate-API (Forex)
export async function fetchForexRate(base: string, target: string = "NGN"): Promise<number | null> {
    const API_KEY = process.env.EXCHANGERATE_API_KEY;
    try {
        const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${base}/${target}`);
        const data = await res.json();
        return data.conversion_rate || null;
    } catch (error) {
        console.error(`Error fetching forex ${base}/${target}:`, error);
        return null;
    }
}

// Signal Calculation Logic
export function calculateSignal(changePct: number, rsi14: number = 50): "BUY" | "SELL" | "HOLD" {
    if (rsi14 < 30 || changePct > 3) return "BUY";
    if (rsi14 > 70 || changePct < -3) return "SELL";
    return "HOLD";
}
