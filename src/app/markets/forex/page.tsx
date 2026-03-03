"use client";

import React, { useState } from "react";
import { RefreshCcw, ArrowRightLeft, TrendingUp, TrendingDown } from "lucide-react";

export default function ForexPage() {
    const [baseAmount, setBaseAmount] = useState<string>("1");

    return (
        <div className="space-y-8">
            <header>
                <div className="flex items-center space-x-2 mb-2">
                    <RefreshCcw className="w-4 h-4 text-primary animate-spin-slow" />
                    <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">Live Rates · WAT</span>
                </div>
                <h1 className="text-4xl font-display font-black text-foreground uppercase tracking-tight italic">
                    Forex Rates
                </h1>
                <p className="text-muted-foreground mt-2">Naira Exchange Rates & Major Global Pairs</p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8">
                {/* Converter Widget */}
                <div className="lg:col-span-4">
                    <section className="glass p-8 rounded-md sticky top-32">
                        <h3 className="text-xl font-display font-bold mb-6 italic uppercase tracking-tight">Quick Converter</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-2">I have</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={baseAmount}
                                        onChange={(e) => setBaseAmount(e.target.value)}
                                        className="w-full bg-background border border-border-card p-4 rounded-sm font-mono font-bold text-xl focus:outline-none focus:border-primary"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-primary">$ USD</div>
                                </div>
                            </div>

                            <div className="flex justify-center">
                                <div className="p-2 bg-surface-2 rounded-full border border-border-card">
                                    <ArrowRightLeft className="w-4 h-4 text-muted-foreground rotate-90" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest mb-2">I get (Est.)</label>
                                <div className="relative">
                                    <div className="w-full bg-surface border border-border-card p-4 rounded-sm font-mono font-bold text-xl">
                                        {(parseFloat(baseAmount || "0") * 1645).toLocaleString()}
                                    </div>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-white">₦ NGN</div>
                                </div>
                            </div>

                            <div className="pt-4 space-y-2">
                                <div className="flex justify-between text-[10px] font-mono text-muted-foreground uppercase">
                                    <span>Market Rate</span>
                                    <span>₦1,645.00</span>
                                </div>
                                <div className="flex justify-between text-[10px] font-mono text-muted-foreground uppercase">
                                    <span>Parallel Rate</span>
                                    <span>₦1,720.00</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Forex Tables */}
                <div className="lg:col-span-8 space-y-8">
                    <section className="glass p-8 rounded-md">
                        <h3 className="text-sm font-display font-bold mb-6 uppercase tracking-widest text-primary italic">Naira Pairs (NGN)</h3>
                        <div className="space-y-4">
                            {[
                                { pair: "USD / NGN", official: "₦1,645.00", parallel: "₦1,720.00", change: "+0.15%", isUp: true },
                                { pair: "EUR / NGN", official: "₦1,782.40", parallel: "₦1,840.00", change: "-0.24%", isUp: false },
                                { pair: "GBP / NGN", official: "₦2,084.15", parallel: "₦2,150.00", change: "+0.05%", isUp: true },
                                { pair: "GHS / NGN", official: "₦124.50", parallel: "₦132.00", change: "-1.24%", isUp: false },
                            ].map((rate) => (
                                <div key={rate.pair} className="flex items-center justify-between py-4 border-b border-border-card/50 last:border-0">
                                    <div className="flex items-center space-x-4">
                                        <p className="font-mono font-bold text-lg">{rate.pair}</p>
                                        <span className={`text-[10px] font-bold ${rate.isUp ? "text-primary" : "text-destructive"}`}>
                                            {rate.change}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-12">
                                        <div className="text-right">
                                            <p className="text-[10px] font-mono text-muted-foreground uppercase">Official</p>
                                            <p className="font-mono font-bold">{rate.official}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-mono text-primary uppercase">Parallel</p>
                                            <p className="font-mono font-bold text-primary">{rate.parallel}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="glass p-8 rounded-md">
                        <h3 className="text-sm font-display font-bold mb-6 uppercase tracking-widest text-muted-foreground italic">Major Global Pairs</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {[
                                { pair: "EUR / USD", price: "1.0842", change: "-0.12%" },
                                { pair: "GBP / USD", price: "1.2675", change: "+0.04%" },
                                { pair: "USD / JPY", price: "150.12", change: "+0.25%" },
                                { pair: "USD / ZAR", price: "19.04", change: "-0.45%" },
                                { pair: "USD / KES", price: "142.50", change: "+0.12%" },
                            ].map((rate) => (
                                <div key={rate.pair} className="bg-surface p-4 border border-border-card rounded-sm">
                                    <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase mb-1">{rate.pair}</p>
                                    <p className="text-lg font-mono font-bold">{rate.price}</p>
                                    <p className={`text-[10px] font-bold ${rate.change.startsWith("+") ? "text-primary" : "text-destructive"}`}>{rate.change}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
