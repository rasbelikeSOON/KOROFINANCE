/**
 * Market Data API Implementation
 */

export interface MarketData {
    symbol: string;
    price: number;
    changePct: number;
    volume?: number;
}

const ALPHA_VANTAGE_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// Alpha Vantage (Forex/Stocks)
export async function fetchStockData(symbol: string): Promise<MarketData | null> {
    try {
        const res = await fetch(
            `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`
        );
        const data = await res.json();
        const quote = data["Global Quote"];

        if (!quote) return null;

        return {
            symbol: quote["01. symbol"],
            price: parseFloat(quote["05. price"]),
            changePct: parseFloat(quote["10. change percent"]?.replace("%", "") || "0"),
            volume: parseInt(quote["06. volume"]),
        };
    } catch (error) {
        console.error(`Error fetching stock ${symbol}:`, error);
        return null;
    }
}

// CoinGecko (Crypto)
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
