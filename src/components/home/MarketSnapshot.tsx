"use client";

import React from "react";
import { TrendingUp, TrendingDown, Clock, Loader2 } from "lucide-react";
import useSWR from "swr";
import { supabase } from "@/lib/supabase";

const fetchSnapshot = async () => {
    const { data, error } = await supabase
        .from("market_cache")
        .select("*")
        .in("ticker", ["BTC", "ETH", "USD/NGN", "DANGCEM"]);

    if (error) throw error;

    // Ensure we return exactly what the UI expects or empty array
    return data || [];
};

export default function MarketSnapshot() {
    const { data: snapshot, isLoading } = useSWR("market_snapshot", fetchSnapshot);

    return (
        <section className="bg-surface border-y border-border-card">
            <div className="max-w-[1400px] mx-auto overflow-x-auto lg:overflow-visible">
                <div className="grid grid-cols-4 divide-x divide-border-card min-w-[1000px] lg:min-w-0">
                    {isLoading ? (
                        [1, 2, 3, 4].map((i) => (
                            <div key={i} className="p-8 space-y-4">
                                <div className="flex justify-between">
                                    <div className="h-3 bg-surface-2 animate-pulse w-16 rounded-sm" />
                                    <div className="h-3 bg-surface-2 animate-pulse w-10 rounded-sm" />
                                </div>
                                <div className="h-8 bg-surface-2 animate-pulse w-3/4 rounded-sm" />
                                <div className="h-1 bg-surface-2 animate-pulse w-full rounded-sm" />
                            </div>
                        ))
                    ) : snapshot && snapshot.length > 0 ? (
                        snapshot.map((item: any, idx) => (
                            <div key={idx} className="p-8 group hover:bg-surface-2 transition-all duration-200 cursor-default">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-mono font-bold text-muted-foreground tracking-widest uppercase flex items-center">
                                        <div className="w-1 h-1 rounded-full bg-primary/40 mr-2" />
                                        {item.market.toUpperCase()}
                                    </span>
                                    <span className={`text-xs font-mono font-bold ${item.change_pct >= 0 ? "text-primary" : "text-destructive"}`}>
                                        {item.change_pct >= 0 ? "+" : ""}{item.change_pct?.toFixed(2)}%
                                    </span>
                                </div>
                                <h3 className="text-muted-foreground text-xs font-bold uppercase mb-1 tracking-tight">{item.ticker}</h3>
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-2xl font-mono font-bold text-foreground">
                                        {item.market === "crypto" ? "$" : item.market === "forex" ? "" : "₦"}
                                        {item.price.toLocaleString()}
                                    </span>
                                    {item.change_pct >= 0 ? (
                                        <TrendingUp className="w-3 h-3 text-primary opacity-50" />
                                    ) : (
                                        <TrendingDown className="w-3 h-3 text-destructive opacity-50" />
                                    )}
                                </div>

                                <div className="mt-6 h-[2px] w-full bg-border-card relative rounded-sm overflow-hidden">
                                    <div
                                        className={`absolute top-0 left-0 h-full ${item.change_pct >= 0 ? "bg-primary" : "bg-destructive"}`}
                                        style={{ width: item.change_pct >= 0 ? "65%" : "40%" }}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-4 py-8 text-center border-t border-border-card/50">
                            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Connect API keys for live terminal snapshot</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
