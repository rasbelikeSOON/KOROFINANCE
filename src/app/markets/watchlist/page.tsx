"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Bookmark, TrendingDown, TrendingUp, Loader2 } from "lucide-react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import SaveButton from "@/components/markets/SaveButton";

export default function WatchlistPage() {
    const router = useRouter();
    const [savedTickers, setSavedTickers] = useState<string[]>([]);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const stored = localStorage.getItem("korofinance_watchlist");
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                const tickers = parsed.map((item: any) => item.ticker || item);
                setSavedTickers(tickers);
            } catch (e) {
                console.error("Failed to parse watchlist", e);
            }
        }

        // Listen for changes from SaveButton
        const handleStorageChange = () => {
            const updated = localStorage.getItem("korofinance_watchlist");
            if (updated) {
                try {
                    const parsed = JSON.parse(updated);
                    setSavedTickers(parsed.map((item: any) => item.ticker || item));
                } catch (e) { }
            } else {
                setSavedTickers([]);
            }
        };

        window.addEventListener("watchlist_updated", handleStorageChange);
        return () => window.removeEventListener("watchlist_updated", handleStorageChange);
    }, []);

    const fetchWatchlistData = async () => {
        if (savedTickers.length === 0) return [];

        // Fetch corresponding market data
        const { data: marketData, error: mError } = await supabase
            .from("market_cache")
            .select("*")
            .in("ticker", savedTickers)
            .order("price", { ascending: false });

        if (mError) throw mError;
        return marketData || [];
    };

    const { data: savedAssets, isLoading } = useSWR(savedTickers.length > 0 ? `watchlist_data_${savedTickers.join("_")}` : null, fetchWatchlistData);

    if (!isClient) return null;

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <Bookmark className="w-4 h-4 text-primary fill-primary/20" />
                        <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">Your Portfolio</span>
                    </div>
                    <h1 className="text-4xl font-display font-black text-foreground uppercase tracking-tight italic">
                        Watchlist
                    </h1>
                    <p className="text-muted-foreground mt-2">Saved stocks and crypto assets.</p>
                </div>
            </header>

            <section className="glass rounded-md overflow-hidden">
                <div className="p-8">
                    <div className="overflow-x-auto min-h-[400px]">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                        ) : savedAssets && savedAssets.length > 0 ? (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-border-card text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                                        <th className="pb-4 px-4">Asset</th>
                                        <th className="pb-4 px-4">Market</th>
                                        <th className="pb-4 px-4">Price</th>
                                        <th className="pb-4 px-4 text-right">Change</th>
                                        <th className="pb-4 px-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border-card/50">
                                    {savedAssets.map((asset: any) => (
                                        <tr key={asset.ticker} className="group hover:bg-surface-2 transition-colors">
                                            <td className="py-6 px-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary italic">
                                                        {asset.ticker[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-foreground">{asset.name || asset.ticker}</p>
                                                        <p className="text-[10px] font-mono text-muted-foreground uppercase">{asset.ticker}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-4 font-mono font-bold text-sm tracking-tighter uppercase text-muted-foreground">{asset.market}</td>
                                            <td className="py-6 px-4 font-mono font-bold text-sm tracking-tighter">
                                                {asset.market === "crypto" ? "$" : "₦"}{asset.price.toLocaleString()}
                                            </td>
                                            <td className={`py-6 px-4 font-mono font-bold text-right text-sm ${asset.change_pct >= 0 ? "text-primary" : "text-destructive"}`}>
                                                <span className="flex items-center justify-end">
                                                    {asset.change_pct >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                                    {asset.change_pct?.toFixed(2)}%
                                                </span>
                                            </td>
                                            <td className="py-6 px-4 text-right">
                                                <div className="flex justify-end pr-2">
                                                    <SaveButton ticker={asset.ticker} market={asset.market} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-border-card rounded-md">
                                <p className="text-muted-foreground font-mono text-xs uppercase">No saved assets.</p>
                                <p className="text-[10px] text-muted-foreground mt-2 uppercase">Explore markets to add items to your watchlist.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
