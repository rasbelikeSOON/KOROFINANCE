import { NextResponse } from 'next/server';

const CRYPTO_IDS = "bitcoin,ethereum,solana,binancecoin,ripple";
const FOREX_PAIRS = ["USD", "EUR", "GBP", "CAD", "ZAR"];

// Seed values for mock NGX
const ngxStocks = [
    { ticker: "DANGCEM", name: "Dangote Cement", basePrice: 650 },
    { ticker: "MTNN", name: "MTN Nigeria", basePrice: 240 },
    { ticker: "AIRTELAFRI", name: "Airtel Africa", basePrice: 2100 },
    { ticker: "BUACEMENT", name: "BUA Cement", basePrice: 150 },
    { ticker: "ZENITHBANK", name: "Zenith Bank", basePrice: 42 },
];

/**
 * Deterministic pseudo-random number generator (Mulberry32).
 * Same seed always produces the same sequence — no more mismatching prices
 * between Markets and Portfolio pages.
 */
function mulberry32(seed: number) {
    return function () {
        seed |= 0;
        seed = seed + 0x6d2b79f5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

/**
 * Returns a seeded RNG locked to the current 30-second time window.
 * Every caller within the same 30s bucket gets identical random outputs,
 * so all pages display consistent prices simultaneously.
 */
function getWindowedRng(salt: number = 0) {
    const windowMs = 30_000;
    const bucket = Math.floor(Date.now() / windowMs);
    return mulberry32(bucket * 31337 + salt);
}

const generateSeededSparkline = (rand: () => number, basePrice: number, volatility: number = 0.02) => {
    let current = basePrice;
    const sparkline = [];
    for (let i = 0; i < 20; i++) {
        sparkline.push(current);
        const change = current * (rand() * volatility * 2 - volatility);
        current += change;
    }
    return sparkline;
};

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || "NGX";

    try {
        if (type === "Crypto") {
            // Fetch live crypto data with sparkline from CoinGecko
            const res = await fetch(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${CRYPTO_IDS}&sparkline=true&price_change_percentage=24h`,
                { next: { revalidate: 30 } }
            );
            if (!res.ok) throw new Error("CoinGecko API Error");
            const data = await res.json();

            const results = data.map((coin: any) => ({
                ticker: coin.symbol.toUpperCase(),
                name: coin.name,
                price: coin.current_price,
                change_pct: coin.price_change_percentage_24h,
                sparkline: coin.sparkline_in_7d.price.slice(-20)
            }));
            return NextResponse.json(results);
        }

        if (type === "Forex") {
            const API_KEY = process.env.EXCHANGERATE_API_KEY;
            let rates: Record<string, number> = {};

            if (API_KEY && API_KEY !== 'undefined') {
                const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`, { next: { revalidate: 3600 } });
                if (res.ok) {
                    const data = await res.json();
                    const usdToNgn = data.conversion_rates["NGN"];
                    rates["USD"] = usdToNgn;
                    rates["EUR"] = usdToNgn / data.conversion_rates["EUR"];
                    rates["GBP"] = usdToNgn / data.conversion_rates["GBP"];
                    rates["CAD"] = usdToNgn / data.conversion_rates["CAD"];
                    rates["ZAR"] = usdToNgn / data.conversion_rates["ZAR"];
                }
            }

            if (Object.keys(rates).length === 0) {
                rates = { USD: 1650, EUR: 1780, GBP: 2100, CAD: 1200, ZAR: 85 };
            }

            // Seeded per 30s window to keep forex values consistent across all pages
            const results = FOREX_PAIRS.map((pair, idx) => {
                const rand = getWindowedRng(idx + 100);
                const baseValue = rates[pair];
                const liveValue = baseValue * (1 + (rand() * 0.01 - 0.005));
                const sparkline = generateSeededSparkline(rand, baseValue, 0.005);
                sparkline[sparkline.length - 1] = liveValue;

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

        // Default: Mock simulated NGX data — SEEDED to 30-second window
        // This guarantees Markets page and Portfolio page show the same price
        const results = ngxStocks.map((stock, idx) => {
            const rand = getWindowedRng(idx); // same seed per window per stock
            const changePct = (rand() * 4) - 2; // -2% to +2%, deterministic
            const livePrice = stock.basePrice * (1 + (changePct / 100));

            const sparkline = generateSeededSparkline(rand, stock.basePrice, 0.02);
            sparkline[sparkline.length - 1] = livePrice;

            return {
                ticker: stock.ticker,
                name: stock.name,
                price: livePrice,
                change_pct: changePct,
                sparkline: sparkline
            };
        });

        results.sort((a, b) => Math.abs(b.change_pct) - Math.abs(a.change_pct));

        return NextResponse.json(results);

    } catch (error) {
        console.error("API Error in /api/market:", error);
        return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 });
    }
}
