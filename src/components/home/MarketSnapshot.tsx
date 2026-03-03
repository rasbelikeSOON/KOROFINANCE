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
        <section className="bg-surface border-y border-border-card bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]">
            <div className="max-w-[1400px] mx-auto overflow-x-auto lg:overflow-visible">
                <div className="grid grid-cols-4 divide-x divide-border-card min-w-[1000px] lg:min-w-0">
                    {isLoading ? (
                        <div className="col-span-4 py-8 flex items-center justify-center space-x-3">
                            <Loader2 className="w-4 h-4 text-primary animate-spin" />
                            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Syncing with Market Terminal...</span>
                        </div>
                    ) : snapshot && snapshot.length > 0 ? (
                        snapshot.map((item: any, idx) => (
                            <div key={idx} className="p-8 group hover:bg-surface-2 transition-colors cursor-default">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[10px] font-mono font-bold text-muted-foreground tracking-widest uppercase flex items-center">
                                        <Clock className="w-3 h-3 mr-1 opacity-50" />
                                        {item.market.toUpperCase()}
                                    </span>
                                    <span className={`text-xs font-mono font-bold ${item.change_pct >= 0 ? "text-primary" : "text-destructive"}`}>
                                        {item.change_pct >= 0 ? "+" : ""}{item.change_pct?.toFixed(2)}%
                                    </span>
                                </div>
                                <h3 className="text-muted-foreground text-xs font-bold uppercase mb-1">{item.ticker}</h3>
                                <div className="flex items-baseline space-x-2">
                                    <span className="text-2xl font-mono font-bold text-foreground">
                                        {item.market === "crypto" ? "$" : item.market === "forex" ? "" : "₦"}
                                        {item.price.toLocaleString()}
                                    </span>
                                    {item.change_pct >= 0 ? (
                                        <TrendingUp className="w-4 h-4 text-primary" />
                                    ) : (
                                        <TrendingDown className="w-4 h-4 text-destructive" />
                                    )}
                                </div>

                                <div className="mt-6 h-1 w-full bg-border-card relative rounded-full overflow-hidden">
                                    <div
                                        className={`absolute top-0 left-0 h-full ${item.change_pct >= 0 ? "bg-primary" : "bg-destructive"}`}
                                        style={{ width: item.change_pct >= 0 ? "65%" : "40%" }}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-4 py-8 text-center">
                            <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Connect API keys to see live snapshot</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
