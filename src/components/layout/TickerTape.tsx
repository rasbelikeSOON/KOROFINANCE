"use client";

import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TickerItem {
    symbol: string;
    price: string;
    change: number;
}

const MOCK_DATA: TickerItem[] = [
    { symbol: "DANGCEM", price: "₦632.50", change: 2.4 },
    { symbol: "MTNN", price: "₦245.00", change: -1.2 },
    { symbol: "BTC", price: "$64,234.12", change: 0.8 },
    { symbol: "USD/NGN", price: "₦1,645.00", change: 0.05 },
    { symbol: "ZENITH", price: "₦38.40", change: 1.5 },
    { symbol: "AIRTELAFRI", price: "₦2,200.00", change: -0.5 },
    { symbol: "GTCO", price: "₦42.15", change: 3.1 },
    { symbol: "ETH", price: "$3,456.78", change: -2.3 },
];

export default function TickerTape() {
    return (
        <div className="w-full bg-surface border-y border-border-card py-2 overflow-hidden whitespace-nowrap relative ticker-mask">
            <div className="inline-block animate-scroll hover:pause">
                {/* Render twice for seamless looping */}
                {[...MOCK_DATA, ...MOCK_DATA].map((item, idx) => (
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
