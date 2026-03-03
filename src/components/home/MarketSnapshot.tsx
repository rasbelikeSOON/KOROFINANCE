"use client";

import React from "react";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";

const DATA = [
    { name: "NGX All-Share", value: "104,256.81", change: "+1.24%", isPositive: true, status: "OPEN" },
    { name: "Bitcoin (BTC)", value: "$64,234.12", change: "+0.82%", isPositive: true, status: "24H" },
    { name: "USD / NGN", value: "₦1,645.00", change: "-0.05%", isPositive: false, status: "LAGOS" },
    { name: "Top Gainer (MTNN)", value: "₦245.00", change: "+5.32%", isPositive: true, status: "TOP" },
];

export default function MarketSnapshot() {
    return (
        <section className="bg-surface border-y border-border-card bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
            <div className="max-w-[1400px] mx-auto overflow-x-auto lg:overflow-visible">
                <div className="grid grid-cols-4 divide-x divide-border-card min-w-[1000px] lg:min-w-0">
                    {DATA.map((item, idx) => (
                        <div key={idx} className="p-8 group hover:bg-surface-2 transition-colors cursor-default">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-mono font-bold text-muted-foreground tracking-widest uppercase flex items-center">
                                    <Clock className="w-3 h-3 mr-1 opacity-50" />
                                    {item.status}
                                </span>
                                <span className={`text-xs font-mono font-bold ${item.isPositive ? "text-primary" : "text-destructive"}`}>
                                    {item.change}
                                </span>
                            </div>
                            <h3 className="text-muted-foreground text-xs font-bold uppercase mb-1">{item.name}</h3>
                            <div className="flex items-baseline space-x-2">
                                <span className="text-2xl font-mono font-bold text-foreground">{item.value}</span>
                                {item.isPositive ? (
                                    <TrendingUp className="w-4 h-4 text-primary" />
                                ) : (
                                    <TrendingDown className="w-4 h-4 text-destructive" />
                                )}
                            </div>

                            {/* Mini Sparkline Placeholder */}
                            <div className="mt-6 h-1 w-full bg-border-card relative rounded-full overflow-hidden">
                                <div
                                    className={`absolute top-0 left-0 h-full ${item.isPositive ? "bg-primary" : "bg-destructive"}`}
                                    style={{ width: item.isPositive ? "65%" : "40%" }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
