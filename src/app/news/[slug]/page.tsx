"use client";

import React from "react";
import { Clock, Facebook, Twitter, Linkedin, MessageSquare, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ArticlePage() {
    return (
        <article className="min-h-screen pt-32 pb-24 bg-background">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <Link href="/news" className="inline-flex items-center text-primary text-xs font-bold uppercase tracking-widest mb-12 hover:gap-2 transition-all">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Newsroom
                    </Link>

                    <header className="space-y-6 mb-12">
                        <div className="flex items-center space-x-4">
                            <span className="px-3 py-1 bg-primary text-background text-[10px] font-bold uppercase tracking-widest rounded-sm">Policy</span>
                            <span className="text-[10px] font-mono text-muted-foreground uppercase">Published March 3, 2026</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-black text-foreground uppercase tracking-tight italic leading-[0.95]">
                            CBN Increases Interest Rates to 24.75% to Combat Inflation
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed italic border-l-4 border-primary pl-6 py-2">
                            The Central Bank of Nigeria has announced a significant hike in the Monetary Policy Rate (MPR) in its latest move to stabilize the Naira and curb rising headline inflation.
                        </p>

                        <div className="flex items-center justify-between py-8 border-y border-border-card">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-surface-2 overflow-hidden grayscale">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Koro" alt="Author" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">Koro Editorial Board</p>
                                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">6 min read · Lagos, WAT</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="p-2 text-muted-foreground hover:text-primary transition-colors"><Twitter className="w-4 h-4" /></button>
                                <button className="p-2 text-muted-foreground hover:text-primary transition-colors"><Linkedin className="w-4 h-4" /></button>
                                <button className="p-2 text-muted-foreground hover:text-primary transition-colors"><Facebook className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </header>

                    <div className="aspect-[21/9] overflow-hidden rounded-md mb-12 grayscale">
                        <img
                            src="https://images.unsplash.com/photo-1611974714652-17852e91dac7?q=80&w=2070&auto=format&fit=crop"
                            alt="CBN Headquarters"
                            className="object-cover w-full h-full"
                        />
                    </div>

                    <div className="prose prose-invert prose-green max-w-none space-y-6 text-muted-foreground text-lg leading-relaxed font-sans">
                        <p>
                            In a widely anticipated move during the first Monetary Policy Committee (MPC) meeting of the year, the Central Bank Governor announced a 400 basis point increase in the benchmark interest rate. This brings the MPR to 24.75%, the highest in over a decade.
                        </p>
                        <p>
                            The decision comes as Nigeria battles a persistent inflationary trend, with headline inflation reaching 31.7% in February, driven primarily by food prices and the continued depreciation of the Naira in the official and parallel markets.
                        </p>
                        <h3 className="text-2xl font-display font-bold text-foreground pt-8 italic uppercase tracking-tight lowercase">Why It Matters for You</h3>
                        <p>
                            For the average Nigerian, this hike means borrowing will become more expensive. Savings rates are also expected to rise, providing a slight silver lining for those with fixed-income investments. However, the primary goal remains price stability.
                        </p>
                        <blockquote className="text-3xl font-display font-bold italic text-primary leading-tight py-8 border-y border-border-card/30">
                            &quot;The path to stability requires difficult choices today to ensure a prosperous tomorrow for all Nigerians.&quot;
                        </blockquote>
                        <p>
                            Analysts at Korofinance Research suggest that while the hike is hawkish, it signals a strong commitment from the new CBN leadership to return to orthodox monetary policy. &quot;This is a clear signal to foreign investors that Nigeria is serious about inflation targeting,&quot; says Gbenga Adeyemi, Head of Macro Strategy.
                        </p>
                    </div>

                    <footer className="mt-16 pt-12 border-t border-border-card">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Tags:</span>
                                <span className="px-2 py-1 bg-surface-2 text-[10px] font-mono font-bold uppercase tracking-widest">CBN</span>
                                <span className="px-2 py-1 bg-surface-2 text-[10px] font-mono font-bold uppercase tracking-widest">Policy</span>
                                <span className="px-2 py-1 bg-surface-2 text-[10px] font-mono font-bold uppercase tracking-widest">Macro</span>
                            </div>
                            <button className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-widest">
                                <MessageSquare className="w-4 h-4" />
                                <span>Join the conversation</span>
                            </button>
                        </div>
                    </footer>
                </div>
            </div>
        </article>
    );
}
