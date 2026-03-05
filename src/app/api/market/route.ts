import { NextResponse } from 'next/server';

const CRYPTO_IDS = "bitcoin,ethereum,solana,binancecoin,ripple";
const FOREX_PAIRS = ["USD", "EUR", "GBP", "CAD", "ZAR"];

const generateMockSparkline = (basePrice: number, volatility: number = 0.02) => {
    let current = basePrice;
    const sparkline = [];
    for (let i = 0; i < 20; i++) {
        sparkline.push(current);
        const change = current * (Math.random() * volatility * 2 - volatility);
        current += change;
    }
    return sparkline;
};

// Seed values for mock NGX
const ngxStocks = [
    { ticker: "DANGCEM", name: "Dangote Cement", basePrice: 650 },
    { ticker: "MTNN", name: "MTN Nigeria", basePrice: 240 },
    { ticker: "AIRTELAFRI", name: "Airtel Africa", basePrice: 2100 },
    { ticker: "BUACEMENT", name: "BUA Cement", basePrice: 150 },
    { ticker: "ZENITHBANK", name: "Zenith Bank", basePrice: 42 },
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || "NGX";

    try {
        if (type === "Crypto") {
            // Fetch live crypto data with sparkline from CoinGecko
            const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${CRYPTO_IDS}&sparkline=true&price_change_percentage=24h`, { next: { revalidate: 30 } });
            if (!res.ok) throw new Error("CoinGecko API Error");
            const data = await res.json();

            const results = data.map((coin: any) => ({
                ticker: coin.symbol.toUpperCase(),
                name: coin.name,
                price: coin.current_price,
                change_pct: coin.price_change_percentage_24h,
                sparkline: coin.sparkline_in_7d.price.slice(-20) // take last 20 data points
            }));
            return NextResponse.json(results);
        }

        if (type === "Forex") {
            const API_KEY = process.env.EXCHANGERATE_API_KEY;
            let rates: Record<string, number> = {};

            if (API_KEY && API_KEY !== 'undefined') {
                // Fetch NGN base rates to invert, or just fetch directly if possible. Exchangerate-api standard allows getting all rates from a base.
                const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`, { next: { revalidate: 3600 } });
                if (res.ok) {
                    const data = await res.json();
                    const usdToNgn = data.conversion_rates["NGN"];
                    rates["USD"] = usdToNgn; // USD to NGN
                    rates["EUR"] = usdToNgn / data.conversion_rates["EUR"];
                    rates["GBP"] = usdToNgn / data.conversion_rates["GBP"];
                    rates["CAD"] = usdToNgn / data.conversion_rates["CAD"];
                    rates["ZAR"] = usdToNgn / data.conversion_rates["ZAR"];
                }
            }

            // Fallback mock if API fails or no key
            if (Object.keys(rates).length === 0) {
                rates = { USD: 1650, EUR: 1780, GBP: 2100, CAD: 1200, ZAR: 85 };
            }

            // Add some live noise (±0.5%) to make it feel real-time
            const noise = (val: number) => val * (1 + (Math.random() * 0.01 - 0.005));

            const results = FOREX_PAIRS.map(pair => {
                const baseValue = rates[pair];
                const liveValue = noise(baseValue);
                const sparkline = generateMockSparkline(baseValue, 0.005);
                sparkline[sparkline.length - 1] = liveValue; // ensure current price is end of sparkline

                return {
                    ticker: `${pair}/NGN`,
                    name: `${pair} to Naira`,
                    price: liveValue,
                    change_pct: (liveValue - baseValue) / baseValue * 100,
                    sparkline: sparkline
                };
            });
            return NextResponse.json(results);
        }

        // Default: Mock simulated NGX data
        // Simulate real-time ticking by adjusting the base price randomly by ±2%
        const results = ngxStocks.map(stock => {
            // Fake a realistic live move every Request
            const changePct = (Math.random() * 4) - 2; // -2% to +2%
            const livePrice = stock.basePrice * (1 + (changePct / 100));

            const sparkline = generateMockSparkline(stock.basePrice, 0.02);
            sparkline[sparkline.length - 1] = livePrice;

            return {
                ticker: stock.ticker,
                name: stock.name,
                price: livePrice,
                change_pct: changePct,
                sparkline: sparkline
            };
        });

        // Sort by biggest movers 
        results.sort((a, b) => Math.abs(b.change_pct) - Math.abs(a.change_pct));

        return NextResponse.json(results);

    } catch (error) {
        console.error("API Error in /api/market:", error);
        return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 });
    }
}
