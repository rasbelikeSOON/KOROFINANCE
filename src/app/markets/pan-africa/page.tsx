"use client";

import React from "react";
import { Globe2, TrendingUp, TrendingDown } from "lucide-react";

const EXCHANGES = [
    { name: "JSE (South Africa)", index: "FTSE/JSE Top 40", value: "72,845.12", change: "+0.85%", isUp: true },
    { name: "NSE (Kenya)", index: "NSE 20 Share Index", value: "1,482.34", change: "-0.42%", isUp: false },
    { name: "GSE (Ghana)", index: "GSE Composite Index", value: "3,124.56", change: "+1.12%", isUp: true },
    { name: "EGX (Egypt)", index: "EGX 30 Index", value: "28,456.12", change: "+2.45%", isUp: true },
];

export default function PanAfricaPage() {
    return (
        <div className="space-y-8">
            <header>
                <div className="flex items-center space-x-2 mb-2">
                    <Globe2 className="w-4 h-4 text-primary" />
                    <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">Cross-Border Insights</span>
                </div>
                <h1 className="text-4xl font-display font-black text-foreground uppercase tracking-tight italic">
                    Pan-African Markets
                </h1>
                <p className="text-muted-foreground mt-2">Performance across Africa&apos;s leading stock exchanges</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {EXCHANGES.map((ex) => (
                    <div key={ex.name} className="glass p-8 rounded-md group hover:border-primary/50 transition-colors">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-lg font-display font-bold text-foreground mb-1 italic uppercase tracking-tight">{ex.name}</h3>
                                <p className="text-xs font-mono text-muted-foreground uppercase">{ex.index}</p>
                            </div>
                            <div className={`px-2 py-1 rounded-sm text-[10px] font-bold ${ex.isUp ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                                {ex.change}
                            </div>
                        </div>

                        <div className="flex items-baseline space-x-2">
                            <span className="text-3xl font-mono font-bold">{ex.value}</span>
                            {ex.isUp ? <TrendingUp className="w-5 h-5 text-primary" /> : <TrendingDown className="w-5 h-5 text-destructive" />}
                        </div>

                        <div className="mt-8 pt-6 border-t border-border-card/50">
                            <button className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest hover:underline decoration-2 underline-offset-4">
                                View Full Explorer →
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <section className="bg-surface border border-border-card p-12 rounded-md text-center">
                <div className="max-w-md mx-auto space-y-4">
                    <h4 className="text-xl font-display font-bold italic uppercase tracking-tight">Expand Your Portfolio</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Access real-time data and insights for over 1500+ listed companies across the African continent.
                        Koro Premium users get exclusive analyst reports for JSE and NSE stocks.
                    </p>
                    <button className="px-8 py-3 bg-primary text-background font-bold rounded-sm mt-4">
                        Upgrade to Premium
                    </button>
                </div>
            </section>
        </div>
    );
}
