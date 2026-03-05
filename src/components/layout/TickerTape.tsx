"use client";

import React, { useState } from "react";

interface TickerItem {
    symbol: string;
    price: string;
    change: number;
}

const TICKER_DATA: TickerItem[] = [
    { symbol: "DANGCEM", price: "725.00", change: 1.8 },
    { symbol: "MTNN", price: "228.50", change: -0.9 },
    { symbol: "ZENITH", price: "46.25", change: 2.1 },
    { symbol: "GTCO", price: "55.80", change: 1.6 },
    { symbol: "AIRTELAFRI", price: "2385.00", change: 0.4 },
    { symbol: "BTC/USD", price: "67778.00", change: -2.39 },
    { symbol: "ETH/USD", price: "1964.34", change: -4.47 },
    { symbol: "USD/NGN", price: "1363.76", change: -0.12 },
];

export default function TickerTape() {
    const [isPaused, setIsPaused] = useState(false);

    return (
        <div
            className="w-full bg-[#0A0A0A] h-[36px] overflow-hidden whitespace-nowrap flex items-center relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className={`inline-block whitespace-nowrap ${isPaused ? 'animation-paused' : 'animate-ticker'}`}>
                {/* Render three times to guarantee seamless scrolling loop across wide screens */}
                {[...TICKER_DATA, ...TICKER_DATA, ...TICKER_DATA].map((item, idx) => (
                    <div
                        key={idx}
                        className="inline-flex items-center px-4 font-mono text-[13px]"
                    >
                        <span className="text-white mr-2">
                            {item.symbol}
                        </span>
                        <span className="text-white mr-2">
                            {item.price}
                        </span>
                        <span
                            className={item.change >= 0 ? "text-[#1A7A4A]" : "text-[#C0392B]"}
                        >
                            {item.change >= 0 ? "▲" : "▼"} {Math.abs(item.change)}%
                        </span>
                    </div>
                ))}
            </div>

            <style jsx>{`
                @keyframes ticker {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.333%); }
                }
                .animate-ticker {
                    animation: ticker 40s linear infinite;
                    will-change: transform;
                }
                .animation-paused {
                    animation: ticker 40s linear infinite;
                    animation-play-state: paused;
                    will-change: transform;
                }
            `}</style>
        </div>
    );
}
