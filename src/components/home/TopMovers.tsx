"use client";

import React, { useState } from "react";
import { TrendingUp, TrendingDown, ChevronRight, ArrowRight } from "lucide-react";

type MarketType = "NGX" | "Crypto" | "Forex";

const MOCK_DATA: Record<MarketType, any[]> = {
    NGX: [
        { rank: 1, ticker: "DANGCEM", name: "Dangote Cement", price: "₦632.50", change: "+4.2%", volume: "12.4M", signal: "BUY" },
        { rank: 2, ticker: "MTNN", name: "MTN Nigeria", price: "₦245.00", change: "+3.1%", volume: "8.2M", signal: "BUY" },
        { rank: 3, ticker: "ZENITHBANK", name: "Zenith Bank", price: "₦38.40", change: "-0.5%", volume: "45.1M", signal: "HOLD" },
        { rank: 4, ticker: "FBNH", name: "First Bank", price: "₦22.15", change: "-2.4%", volume: "32.8M", signal: "SELL" },
        { rank: 5, ticker: "GTCO", name: "GTCO Holdings", price: "₦42.15", change: "+1.2%", volume: "18.3M", signal: "HOLD" },
    ],
    Crypto: [
        { rank: 1, ticker: "BTC", name: "Bitcoin", price: "$64,234", change: "+2.1%", volume: "$45B", signal: "BUY" },
        { rank: 2, ticker: "ETH", name: "Ethereum", price: "$3,456", change: "+1.8%", volume: "$18B", signal: "BUY" },
        { rank: 3, ticker: "SOL", name: "Solana", price: "$145", change: "+5.4%", volume: "$4.2B", signal: "BUY" },
        { rank: 4, ticker: "BNB", name: "Binance Coin", price: "$590", change: "-1.2%", volume: "$2.1B", signal: "HOLD" },
        { rank: 5, ticker: "DOGE", name: "Dogecoin", price: "$0.16", change: "-4.5%", volume: "$1.5B", signal: "SELL" },
    ],
    Forex: [
        { rank: 1, ticker: "USD/NGN", name: "US Dollar / Naira", price: "₦1,645", change: "+0.2%", volume: "High", signal: "HOLD" },
        { rank: 2, ticker: "GBP/NGN", name: "British Pound / Naira", price: "₦2,084", change: "-0.5%", volume: "Med", signal: "HOLD" },
        { rank: 3, ticker: "EUR/NGN", name: "Euro / Naira", price: "₦1,782", change: "+0.1%", volume: "Med", signal: "HOLD" },
        { rank: 4, ticker: "GHS/NGN", name: "Ghana Cedi / Naira", price: "₦124", change: "-1.4%", volume: "Low", signal: "SELL" },
        { rank: 5, ticker: "USD/GHS", name: "US Dollar / Cedi", price: "GH₵13.2", change: "+0.4%", volume: "Med", signal: "BUY" },
    ],
};

export default function TopMovers() {
    const [activeTab, setActiveTab] = useState<MarketType>("NGX");

    return (
        <section className="py-24 bg-surface">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-border-card pb-6 space-y-6 md:space-y-0">
                    <div>
                        <h2 className="text-4xl font-display font-extrabold text-foreground mb-2 italic uppercase tracking-tight">
                            Today&apos;s Top Movers
                        </h2>
                        <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
                            Performance Leaders Across Asset Classes
                        </p>
                    </div>

                    <div className="flex bg-background p-1 rounded-sm border border-border-card">
                        {(["NGX", "Crypto", "Forex"] as MarketType[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 text-xs font-mono font-bold uppercase tracking-widest transition-all rounded-sm ${activeTab === tab
                                    ? "bg-primary text-background"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border-card text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                                <th className="pb-4 px-4 whitespace-nowrap"># Rank</th>
                                <th className="pb-4 px-4 whitespace-nowrap">Ticker</th>
                                <th className="pb-4 px-4 whitespace-nowrap">Asset Name</th>
                                <th className="pb-4 px-4 whitespace-nowrap">Price</th>
                                <th className="pb-4 px-4 whitespace-nowrap text-right">24H Change</th>
                                <th className="pb-4 px-4 whitespace-nowrap text-center">Signal</th>
                                <th className="pb-4 px-4 whitespace-nowrap text-right">Volume</th>
                                <th className="pb-4 px-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-card/50">
                            {MOCK_DATA[activeTab].map((item: any) => (
                                <tr
                                    key={item.ticker}
                                    className="group hover:bg-surface-2 transition-colors"
                                >
                                    <td className="py-6 px-4 font-mono text-sm text-muted-foreground">{item.rank}</td>
                                    <td className="py-6 px-4 font-mono font-bold text-foreground">{item.ticker}</td>
                                    <td className="py-6 px-4 font-bold text-foreground/80">{item.name}</td>
                                    <td className="py-6 px-4 font-mono font-bold">{item.price}</td>
                                    <td className={`py-6 px-4 font-mono font-bold text-right ${item.change.startsWith("+") ? "text-primary" : "text-destructive"}`}>
                                        <span className="flex items-center justify-end">
                                            {item.change.startsWith("+") ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                            {item.change}
                                        </span>
                                    </td>
                                    <td className="py-6 px-4 text-center">
                                        <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest ${item.signal === "BUY" ? "bg-primary/10 text-primary border border-primary/20" :
                                            item.signal === "SELL" ? "bg-destructive/10 text-destructive border border-destructive/20" :
                                                "bg-warning/10 text-warning border border-warning/20"
                                            }`}>
                                            {item.signal}
                                        </span>
                                    </td>
                                    <td className="py-6 px-4 font-mono text-xs text-muted-foreground text-right">{item.volume}</td>
                                    <td className="py-6 px-4 text-right">
                                        <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-12 text-center">
                    <button className="inline-flex items-center px-8 py-4 border border-border-card text-foreground font-bold rounded-sm hover:bg-surface transition-all active:scale-95">
                        View full market data <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
}
