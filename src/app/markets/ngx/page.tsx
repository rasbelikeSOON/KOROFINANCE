"use client";

import React from "react";
import StockTable from "@/components/markets/StockTable";
import { Info } from "lucide-react";

export default function NGXStocksPage() {
    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">Market Open</span>
                    </div>
                    <h1 className="text-4xl font-display font-black text-foreground uppercase tracking-tight italic">
                        NGX Stocks
                    </h1>
                    <p className="text-muted-foreground mt-2">Nigerian Exchange Limited All-Share Index</p>
                </div>

                <div className="flex items-center space-x-6 bg-surface border border-border-card p-4 rounded-md">
                    <div>
                        <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">ASI Value</p>
                        <p className="text-xl font-mono font-bold">104,256.81</p>
                    </div>
                    <div className="h-10 w-px bg-border-card" />
                    <div>
                        <p className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">Today</p>
                        <p className="text-xl font-mono font-bold text-primary">+1.24%</p>
                    </div>
                </div>
            </header>

            <section className="glass rounded-md overflow-hidden">
                <div className="p-8">
                    <StockTable />
                </div>
            </section>

            <section className="glass p-6 rounded-md">
                <div className="flex items-start space-x-4">
                    <Info className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-foreground text-sm uppercase tracking-tight">How signals are calculated</h4>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            Signals (BUY/SELL/HOLD) are algorithmic and based on a combination of 14-day relative strength index (RSI),
                            moving average crossovers, and current price momentum. They are provided for informational purposes only
                            and do not constitute financial advice.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
