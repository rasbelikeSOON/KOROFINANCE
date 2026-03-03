"use client";

import React from "react";
import { TrendingUp, TrendingDown, Search, Activity, Bitcoin } from "lucide-react";

const MOCK_CRYPTO = [
    { id: "1", name: "Bitcoin", ticker: "BTC", price: "$64,234.12", ngnPrice: "₦105.6M", change: "+0.82%", p2p: "₦1,655", isPositive: true },
    { id: "2", name: "Ethereum", ticker: "ETH", price: "$3,456.78", ngnPrice: "₦5.68M", change: "+1.24%", p2p: "₦1,682", isPositive: true },
    { id: "3", name: "Solana", ticker: "SOL", price: "$145.12", ngnPrice: "₦238k", change: "+5.32%", p2p: "₦1,640", isPositive: true },
    { id: "4", name: "BNB", ticker: "BNB", price: "$590.45", ngnPrice: "₦971k", change: "-0.45%", p2p: "₦1,645", isPositive: false },
    { id: "5", name: "XRP", ticker: "XRP", price: "$0.62", ngnPrice: "₦1,019", change: "+2.15%", p2p: "₦1,632", isPositive: true },
    { id: "6", name: "Cardano", ticker: "ADA", price: "$0.45", ngnPrice: "₦740", change: "-1.12%", p2p: "₦1,640", isPositive: false },
    { id: "7", name: "Toncoin", ticker: "TON", price: "$5.32", ngnPrice: "₦8,751", change: "+12.4%", p2p: "₦1,620", isPositive: true },
];

export default function CryptoPage() {
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
                                {MOCK_CRYPTO.map((coin) => (
                                    <tr key={coin.id} className="group hover:bg-surface-2 transition-colors">
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
                                        <td className="py-6 px-4 font-mono font-bold text-sm tracking-tighter">{coin.price}</td>
                                        <td className="py-6 px-4 font-mono font-bold text-sm tracking-tighter text-muted-foreground">{coin.ngnPrice}</td>
                                        <td className={`py-6 px-4 font-mono font-bold text-right text-sm ${coin.isPositive ? "text-primary" : "text-destructive"}`}>
                                            <span className="flex items-center justify-end">
                                                {coin.isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                                                {coin.change}
                                            </span>
                                        </td>
                                        <td className="py-6 px-4 font-mono font-bold text-right text-sm italic">{coin.p2p}/$</td>
                                        <td className="py-6 px-4 text-right">
                                            <button className="px-4 py-2 bg-surface-2 border border-border-card rounded-sm text-[10px] font-bold uppercase tracking-widest hover:border-primary transition-colors">
                                                Trade
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </div>
    );
}
