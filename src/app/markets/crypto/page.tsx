"use client";

import { TrendingUp, TrendingDown, Search, Activity, Bitcoin } from "lucide-react";
import SaveButton from "@/components/markets/SaveButton";

import useSWR from "swr";
import { supabase } from "@/lib/supabase";

const fetchCrypto = async () => {
    const { data, error } = await supabase
        .from("market_cache")
        .select("*")
        .eq("market", "crypto")
        .order("price", { ascending: false });

    if (error) throw error;
    return data;
};

export default function CryptoPage() {
    const { data: cryptoData, isLoading } = useSWR("crypto_markets", fetchCrypto);

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center space-x-2 mb-2">
                        <Activity className="w-4 h-4 text-warning" />
                        <span className="text-[10px] font-mono font-bold text-warning uppercase tracking-widest">24/7 Global Trading</span>
                    </div>
                    <h1 className="text-4xl font-display font-black text-foreground uppercase tracking-tight italic">
                        Cryptocurrency
                    </h1>
                    <p className="text-muted-foreground mt-2">Global Digital Assets & Web3 Economy</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search coins..."
                        className="bg-surface border border-border-card pl-10 pr-4 py-3 rounded-sm text-sm focus:outline-none focus:border-primary transition-colors min-w-[300px]"
                    />
                </div>
            </header>

            <section className="glass rounded-md overflow-hidden">
                <div className="p-8">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-border-card text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                                    <th className="pb-4 px-4">Coin</th>
                                    <th className="pb-4 px-4">Price (USD)</th>
                                    <th className="pb-4 px-4">NGN Equivalent</th>
                                    <th className="pb-4 px-4 text-right">24H Change</th>
                                    <th className="pb-4 px-4 text-right">Est. P2P Rate</th>
                                    <th className="pb-4 px-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-card/50">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-muted-foreground font-mono text-xs uppercase">
                                            Loading Live Crypto Data...
                                        </td>
                                    </tr>
                                ) : cryptoData && cryptoData.length > 0 ? (
                                    cryptoData.map((coin: any) => (
                                        <tr key={coin.ticker} className="group hover:bg-surface-2 transition-colors">
                                            <td className="py-6 px-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary italic">
                                                        {coin.ticker[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-foreground">{coin.name}</p>
                                                        <p className="text-[10px] font-mono text-muted-foreground uppercase">{coin.ticker}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-6 px-4 font-mono font-bold text-sm tracking-tighter">${coin.price.toLocaleString()}</td>
                                            <td className="py-6 px-4 font-mono font-bold text-sm tracking-tighter text-muted-foreground">--</td>
                                            <td className={`py-6 px-4 font-mono font-bold text-right text-sm ${coin.change_pct >= 0 ? "text-primary" : "text-destructive"}`}>
                                                <span className="flex items-center justify-end">
                                                    {coin.change_pct >= 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                                    {coin.change_pct?.toFixed(2)}%
                                                </span>
                                            </td>
                                            <td className="py-6 px-4 font-mono font-bold text-right text-sm italic">--</td>
                                            <td className="py-6 px-4 text-right flex items-center justify-end space-x-2">
                                                <SaveButton ticker={coin.ticker} market="crypto" />
                                                <button className="px-4 py-2 bg-surface-2 border border-border-card rounded-sm text-[10px] font-bold uppercase tracking-widest hover:border-primary transition-colors">
                                                    Trade
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-muted-foreground font-mono text-xs uppercase">
                                            No Crypto Data Available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}
