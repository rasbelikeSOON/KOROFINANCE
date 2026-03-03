"use client";

import React, { useState } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, ChevronRight, ArrowRight, Loader2 } from "lucide-react";
import useSWR from "swr";
import { supabase } from "@/lib/supabase";

type MarketType = "NGX" | "Crypto" | "Forex";

const fetcher = async (type: MarketType) => {
    const marketMap: Record<MarketType, string> = {
        NGX: "ngx",
        Crypto: "crypto",
        Forex: "forex"
    };

    const { data, error } = await supabase
        .from("market_cache")
        .select("*")
        .eq("market", marketMap[type])
        .order("price", { ascending: false });

    if (error) throw error;
    return data;
};

export default function TopMovers() {
    const [activeTab, setActiveTab] = useState<MarketType>("NGX");
    const { data: movers, error, isLoading } = useSWR(activeTab, fetcher);

    return (
        <section className="py-24 bg-surface">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-border-card pb-6 space-y-6 md:space-y-0">
                    <div>
                        <h2 className="text-4xl font-display font-extrabold text-foreground mb-2 italic uppercase tracking-tight">
                            Today&apos;s Top Movers
                        </h2>
                        <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
                            {isLoading ? "Fetching Live Terminal Data..." : "Performance Leaders Across Asset Classes"}
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

                <div className="overflow-x-auto min-h-[400px]">
                    {isLoading ? (
                        <div className="w-full space-y-4">
                            <div className="h-10 bg-background animate-pulse w-full rounded-sm" />
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-14 bg-background/50 animate-pulse w-full rounded-sm" />
                            ))}
                        </div>
                    ) : movers && movers.length > 0 ? (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border-card text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest bg-background/30">
                                    <th className="py-4 px-4 whitespace-nowrap">Ticker</th>
                                    <th className="py-4 px-4 whitespace-nowrap">Asset Name</th>
                                    <th className="py-4 px-4 whitespace-nowrap">Price</th>
                                    <th className="py-4 px-4 whitespace-nowrap text-right">24H Change (%)</th>
                                    <th className="py-4 px-4 whitespace-nowrap text-center">Signal</th>
                                    <th className="py-4 px-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-card/50">
                                {movers.slice(0, 5).map((item: any) => (
                                    <tr
                                        key={item.ticker}
                                        className="group hover:bg-background/40 transition-all duration-200 hover:-translate-y-[1px] cursor-pointer"
                                    >
                                        <td className="py-6 px-4 font-mono font-bold text-foreground">{item.ticker}</td>
                                        <td className="py-6 px-4 font-bold text-foreground/80 text-sm">{item.name || item.ticker}</td>
                                        <td className="py-6 px-4 font-mono font-bold text-sm">
                                            {activeTab === "Crypto" ? "$" : ""}
                                            {item.price.toLocaleString()}
                                            {activeTab === "Forex" ? " NGN" : activeTab === "NGX" ? " ₦" : ""}
                                        </td>
                                        <td className={`py-6 px-4 font-mono font-bold text-right text-sm ${item.change_pct >= 0 ? "text-primary" : "text-destructive"}`}>
                                            <span className="flex items-center justify-end">
                                                {item.change_pct >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                                {item.change_pct?.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="py-6 px-4 text-center">
                                            <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest border ${item.change_pct > 2 ? "bg-primary/5 text-primary border-primary/20" :
                                                item.change_pct < -2 ? "bg-destructive/5 text-destructive border-destructive/20" :
                                                    "bg-warning/5 text-warning border-warning/20"
                                                }`}>
                                                {item.change_pct > 2 ? "BUY" : item.change_pct < -2 ? "SELL" : "HOLD"}
                                            </span>
                                        </td>
                                        <td className="py-6 px-4 text-right">
                                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors ml-auto" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border-card rounded-sm">
                            <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest">No terminal data found</p>
                        </div>
                    )}
                </div>

                <div className="mt-12 text-center">
                    <Link
                        href="/markets"
                        className="inline-flex items-center px-10 py-4 border border-border-card text-foreground font-bold rounded-sm hover:bg-background/50 transition-all active:scale-[0.98]"
                    >
                        View Full Terminal <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
