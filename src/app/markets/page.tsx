"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight, Activity } from "lucide-react";

export default function MarketsOverview() {
    return (
        <div className="space-y-10">
            <header>
                <div className="flex items-center space-x-2 text-muted-foreground text-xs font-mono uppercase tracking-widest mb-2">
                    <Activity className="w-3 h-3" />
                    <span>Real-time Terminal</span>
                </div>
                <h1 className="text-4xl font-display font-black text-foreground uppercase tracking-tight italic">
                    Market Overview
                </h1>
                <p className="text-muted-foreground mt-2">March 3, 2026 · 12:45 PM WAT</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "NGX ASI", value: "104,256.81", change: "+1.2%", isUp: true },
                    { label: "Market Cap", value: "₦58.2T", change: "+₦450B", isUp: true },
                    { label: "Volume", value: "482.5M", change: "-12.4%", isUp: false },
                    { label: "Deals", value: "12,452", change: "+842", isUp: true },
                ].map((stat) => (
                    <div key={stat.label} className="glass p-6 rounded-md">
                        <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-2xl font-mono font-bold text-foreground mb-2">{stat.value}</p>
                        <div className={`flex items-center text-xs font-bold ${stat.isUp ? "text-primary" : "text-destructive"}`}>
                            {stat.isUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                            {stat.change}
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                <section className="glass p-8 rounded-md">
                    <h3 className="text-xl font-display font-bold mb-6 italic uppercase tracking-tight">Active NGX Stocks</h3>
                    <div className="space-y-4">
                        {[
                            { ticker: "ACCESSCORP", name: "Access Holdings", price: "₦24.50", change: "+2.1%" },
                            { ticker: "UBA", name: "United Bank for Africa", price: "₦28.15", change: "+1.8%" },
                            { ticker: "TRANSCORP", name: "Transcorp Group", price: "₦14.20", change: "-0.5%" },
                            { ticker: "FBNH", name: "First Bank", price: "₦22.15", change: "-2.4%" },
                        ].map((stock) => (
                            <div key={stock.ticker} className="flex items-center justify-between py-3 border-b border-border-card/50 last:border-0 hover:bg-surface-2 -mx-4 px-4 transition-colors">
                                <div>
                                    <p className="font-mono font-bold text-sm">{stock.ticker}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase">{stock.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-mono font-bold text-sm">{stock.price}</p>
                                    <p className={`text-[10px] font-bold ${stock.change.startsWith("+") ? "text-primary" : "text-destructive"}`}>{stock.change}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="glass p-8 rounded-md">
                    <h3 className="text-xl font-display font-bold mb-6 italic uppercase tracking-tight">Top Crypto</h3>
                    <div className="space-y-4">
                        {[
                            { ticker: "BTC", name: "Bitcoin", price: "$64,234", change: "+0.8%" },
                            { ticker: "ETH", name: "Ethereum", price: "$3,456", change: "+1.2%" },
                            { ticker: "SOL", name: "Solana", price: "$145", change: "+5.4%" },
                            { ticker: "BNB", name: "Binance", price: "$590", change: "-0.4%" },
                        ].map((coin) => (
                            <div key={coin.ticker} className="flex items-center justify-between py-3 border-b border-border-card/50 last:border-0 hover:bg-surface-2 -mx-4 px-4 transition-colors">
                                <div>
                                    <p className="font-mono font-bold text-sm">{coin.ticker}</p>
                                    <p className="text-[10px] text-muted-foreground uppercase">{coin.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-mono font-bold text-sm">{coin.price}</p>
                                    <p className={`text-[10px] font-bold ${coin.change.startsWith("+") ? "text-primary" : "text-destructive"}`}>{coin.change}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}
