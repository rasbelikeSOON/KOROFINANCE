"use client";

import React, { useState } from "react";
import { TrendingUp, TrendingDown, Search, Filter, ArrowUpDown, Loader2 } from "lucide-react";
import useSWR from "swr";
import { supabase } from "@/lib/supabase";

const fetchStocks = async () => {
    const { data, error } = await supabase
        .from("market_cache")
        .select("*")
        .eq("market", "ngx")
        .order("price", { ascending: false });

    if (error) throw error;
    return data || [];
};

export default function StockTable() {
    const { data: stocks, isLoading } = useSWR("ngx_stocks", fetchStocks);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredStocks = stocks?.filter((s: any) =>
        s.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    ) || [];

    return (
        <div className="space-y-6">
            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by ticker or company..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-surface border border-border-card pl-10 pr-4 py-2 rounded-sm text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center space-x-2 bg-surface border border-border-card px-4 py-2 rounded-sm text-xs font-bold hover:bg-surface-2 transition-colors">
                        <Filter className="w-3 h-3" />
                        <span>Sector</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-surface border border-border-card px-4 py-2 rounded-sm text-xs font-bold hover:bg-surface-2 transition-colors">
                        <ArrowUpDown className="w-3 h-3" />
                        <span>Sort by Price</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto min-h-[400px]">
                {isLoading ? (
                    <div className="w-full space-y-4">
                        <div className="h-10 bg-surface-2 animate-pulse w-full rounded-sm" />
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-14 bg-surface-2/50 animate-pulse w-full rounded-sm" />
                        ))}
                    </div>
                ) : filteredStocks.length > 0 ? (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border-card text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest bg-surface/30">
                                <th className="py-4 px-4 whitespace-nowrap">Ticker</th>
                                <th className="py-4 px-4 whitespace-nowrap">Company</th>
                                <th className="py-4 px-4 whitespace-nowrap">Sector</th>
                                <th className="py-4 px-4 whitespace-nowrap">Price (₦)</th>
                                <th className="py-4 px-4 whitespace-nowrap text-right">Change (%)</th>
                                <th className="py-4 px-4 whitespace-nowrap text-center">Signal</th>
                                <th className="py-4 px-4 whitespace-nowrap text-right">Volume</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-card/50">
                            {filteredStocks.map((stock: any) => (
                                <tr
                                    key={stock.ticker}
                                    className="group cursor-pointer transition-all duration-200 hover:bg-surface-2 hover:-translate-y-[1px]"
                                >
                                    <td className="py-5 px-4 font-mono font-bold text-foreground">{stock.ticker}</td>
                                    <td className="py-5 px-4 font-bold text-foreground/80 text-sm whitespace-nowrap">{stock.name || stock.ticker}</td>
                                    <td className="py-5 px-4 font-mono text-[10px] text-muted-foreground uppercase">{stock.sector || "N/A"}</td>
                                    <td className="py-5 px-4 font-mono font-bold text-sm">{stock.price.toLocaleString()}</td>
                                    <td className={`py-5 px-4 font-mono font-bold text-right text-sm ${stock.change_pct >= 0 ? "text-primary" : "text-destructive"}`}>
                                        <span className="flex items-center justify-end">
                                            {stock.change_pct >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                            {stock.change_pct?.toFixed(2)}
                                        </span>
                                    </td>
                                    <td className="py-5 px-4 text-center">
                                        <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest border ${stock.change_pct > 2 ? "bg-primary/5 text-primary border-primary/20" :
                                            stock.change_pct < -2 ? "bg-destructive/5 text-destructive border-destructive/20" :
                                                "bg-warning/5 text-warning border-warning/20"
                                            }`}>
                                            {stock.change_pct > 2 ? "BUY" : stock.change_pct < -2 ? "SELL" : "HOLD"}
                                        </span>
                                    </td>
                                    <td className="py-5 px-4 font-mono text-xs text-muted-foreground text-right">{stock.volume?.toLocaleString() || "N/A"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border-card rounded-md">
                        <p className="text-muted-foreground font-mono text-xs uppercase">No NGX data found in terminal</p>
                        <p className="text-[10px] text-muted-foreground mt-2 uppercase">Connect your API keys and trigger the refresh function</p>
                    </div>
                )}
            </div>
        </div>
    );
}
