"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TickerItem {
    symbol: string;
    price: string;
    change: number;
}

const TICKER_DATA: TickerItem[] = [
    { symbol: "DANGCEM", price: "₦725.00", change: 1.8 },
    { symbol: "MTNN", price: "₦228.50", change: -0.9 },
    { symbol: "BTC", price: "$67,778.00", change: -2.39 },
    { symbol: "USD/NGN", price: "₦1,363.76", change: -0.12 },
    { symbol: "ZENITH", price: "₦46.25", change: 2.1 },
    { symbol: "AIRTELAFRI", price: "₦2,385.00", change: 0.4 },
    { symbol: "GTCO", price: "₦55.80", change: 1.6 },
    { symbol: "ETH", price: "$1,964.34", change: -4.47 },
];

export default function TickerTape() {
    return (
        <div className="w-full bg-surface border-y border-border-card py-2 overflow-hidden whitespace-nowrap relative ticker-mask">
            <div className="inline-block animate-scroll hover:pause">
                {/* Render twice for seamless looping */}
                {[...TICKER_DATA, ...TICKER_DATA].map((item, idx) => (
                    <div
                        key={idx}
                        className="inline-flex items-center px-6 border-r border-border-card last:border-r-0"
                    >
                        <span className="text-muted-foreground text-xs font-mono mr-2">
                            {item.symbol}
                        </span>
                        <span className="text-foreground font-mono text-sm font-medium mr-2">
                            {item.price}
                        </span>
                        <span
                            className={`flex items-center text-xs font-mono font-semibold ${item.change >= 0 ? "text-primary" : "text-destructive"
                                }`}
                        >
                            {item.change >= 0 ? (
                                <TrendingUp className="w-3 h-3 mr-1" />
                            ) : (
                                <TrendingDown className="w-3 h-3 mr-1" />
                            )}
                            {Math.abs(item.change)}%
                        </span>
                    </div>
                ))}
            </div>

            <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          display: inline-block;
          animation: scroll 40s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
        </div>
    );
}
