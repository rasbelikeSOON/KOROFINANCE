"use client";

import React from "react";
import Link from "next/link";
import { Clock, TrendingUp, Filter } from "lucide-react";

const CATEGORIES = ["All", "NGX", "Crypto", "Policy", "Fintech", "Economy", "Pan-Africa"];

const NEWS_ARTICLES = [
    {
        id: "cbn-rates-hike",
        title: "CBN Increases Interest Rates to 24.75% to Combat Inflation",
        category: "Policy",
        excerpt: "The Central Bank of Nigeria has announced a significant hike in the Monetary Policy Rate (MPR) in its latest move to stabilize the Naira...",
        image: "https://images.unsplash.com/photo-1611974714652-17852e91dac7?q=80&w=2070&auto=format&fit=crop",
        time: "2h ago",
        author: "Koro Editorial",
        isHot: true,
    },
    {
        id: "btc-surge-64k",
        title: "Bitcoin Surges Past $64k as ETF Inflows Accelerate",
        category: "Crypto",
        excerpt: "Global digital asset market experiences major capital injection as spot Bitcoin ETFs see record volume in US markets...",
        image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2069&auto=format&fit=crop",
        time: "4h ago",
        author: "Gbenga Adeyemi",
        isHot: false,
    },
    {
        id: "moniepoint-series-c",
        title: "Moniepoint Secures $100M Series C for Pan-African Expansion",
        category: "Fintech",
        excerpt: "The Nigerian fintech giant plans to use the new capital to deepen its presence in Francophone Africa and launch new retail products...",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
        time: "8h ago",
        author: "Aminat Bello",
        isHot: true,
    },
    {
        id: "mtn-revenue-2024",
        title: "MTN Nigeria Declares ₦2.4 Trillion Revenue for FY 2024",
        category: "NGX",
        excerpt: "Despite macroeconomic headwinds, the telecom leader maintains strong topline growth driven by data and MoMo adoption...",
        image: "https://images.unsplash.com/photo-1523293832002-bb29f952e43b?q=80&w=2070&auto=format&fit=crop",
        time: "12h ago",
        author: "Koro Research",
        isHot: false,
    },
];

export default function NewsPage() {
    return (
        <div className="min-h-screen pt-20 pb-24 bg-background">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-12">
                    <h1 className="text-5xl md:text-7xl font-display font-black text-foreground uppercase tracking-tight italic mb-8">
                        The Newsroom
                    </h1>

                    <div className="flex items-center space-x-4 overflow-x-auto pb-4 scrollbar-hide">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                className="px-6 py-2 bg-surface-2 border border-border-card rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap hover:bg-primary hover:text-background transition-colors"
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="grid lg:grid-cols-12 gap-12">
                    {/* Main Feed */}
                    <div className="lg:col-span-8 space-y-12">
                        {NEWS_ARTICLES.map((article) => (
                            <article key={article.id} className="group grid md:grid-cols-12 gap-8 items-start cursor-pointer border-b border-border-card pb-12 last:border-0">
                                <div className="md:col-span-5 relative aspect-[16/10] overflow-hidden rounded-md grayscale group-hover:grayscale-0 transition-all duration-700">
                                    <img src={article.image} alt={article.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                                    {article.isHot && (
                                        <div className="absolute top-4 right-4 bg-destructive text-white px-2 py-1 flex items-center text-[10px] font-bold uppercase tracking-widest animate-pulse">
                                            <TrendingUp className="w-3 h-3 mr-1" /> Hot
                                        </div>
                                    )}
                                </div>
                                <div className="md:col-span-7 space-y-4">
                                    <Link href={`/news/${article.id}`}>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">{article.category}</span>
                                            <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                                            <span className="text-[10px] font-mono text-muted-foreground uppercase">{article.time}</span>
                                        </div>
                                        <h2 className="text-3xl font-display font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-3">
                                            {article.title}
                                        </h2>
                                        <p className="text-muted-foreground leading-relaxed line-clamp-2">
                                            {article.excerpt}
                                        </p>
                                        <div className="flex items-center pt-4 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                            <span className="font-bold text-foreground mr-2">By {article.author}</span>
                                            <span>· 4 min read</span>
                                        </div>
                                    </Link>
                                </div>
                            </article>
                        ))}

                        <button className="w-full py-8 border-2 border-dashed border-border-card text-muted-foreground font-mono font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-colors">
                            Load More Stories
                        </button>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-12">
                        <section className="glass p-8 rounded-md">
                            <h3 className="text-xl font-display font-bold italic uppercase tracking-tight mb-6 border-b border-border-card pb-4">Most Read</h3>
                            <div className="space-y-6">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex space-x-4 items-start group cursor-pointer">
                                        <span className="text-4xl font-display font-black text-surface-2 group-hover:text-primary/20 transition-colors">{i}</span>
                                        <div>
                                            <h4 className="font-display font-bold text-foreground text-sm leading-snug group-hover:text-primary transition-colors">
                                                Top 10 High-Yield Dividend Stocks in the NGX for 2026
                                            </h4>
                                            <p className="text-[10px] font-mono text-muted-foreground mt-2 uppercase">Policy · 2h ago</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <div className="sticky top-24 space-y-8">
                            <section className="bg-primary p-8 rounded-md text-background">
                                <h3 className="text-2xl font-display font-black italic uppercase leading-none mb-4">Invest in your intelligence.</h3>
                                <p className="text-sm font-medium mb-6 opacity-90">Get daily market summaries and exclusive insights delivered to your WhatsApp or Email.</p>
                                <button className="w-full py-3 bg-background text-primary font-bold uppercase text-xs tracking-widest hover:bg-surface-2 transition-colors">
                                    Join Koro Brief
                                </button>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
