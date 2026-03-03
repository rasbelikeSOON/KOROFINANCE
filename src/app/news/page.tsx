"use client";

import React from "react";
import Link from "next/link";
import { Clock, TrendingUp, Filter, Loader2 } from "lucide-react";
import useSWR from "swr";
import { getLiveNews } from "@/lib/api/news";
import { formatDistanceToNow } from "date-fns";

const CATEGORIES = ["All", "NGX", "Crypto", "Policy", "Fintech", "Economy", "Pan-Africa"];



export default function NewsPage() {
    const { data: news, isLoading } = useSWR("live_news_page", () => getLiveNews(20));

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
                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            </div>
                        ) : news && news.length > 0 ? (
                            news.map((article: any, index: number) => (
                                <article key={article.id} className="group grid md:grid-cols-12 gap-8 items-start cursor-pointer border-b border-border-card pb-12 last:border-0">
                                    <div className="md:col-span-5 relative aspect-[16/10] overflow-hidden rounded-md grayscale group-hover:grayscale-0 transition-all duration-700">
                                        <img src={article.image_url} alt={article.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                                        {index === 0 && (
                                            <div className="absolute top-4 right-4 bg-destructive text-white px-2 py-1 flex items-center text-[10px] font-bold uppercase tracking-widest animate-pulse">
                                                <TrendingUp className="w-3 h-3 mr-1" /> Hot
                                            </div>
                                        )}
                                    </div>
                                    <div className="md:col-span-7 space-y-4">
                                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                                            <div className="flex items-center space-x-2 mb-3">
                                                <span className="text-[10px] font-mono font-bold text-primary uppercase tracking-widest">{article.category}</span>
                                                <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                                                <span className="text-[10px] font-mono text-muted-foreground uppercase">
                                                    {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
                                                </span>
                                            </div>
                                            <h2 className="text-3xl font-display font-bold text-foreground group-hover:text-primary transition-colors leading-tight mb-3">
                                                {article.title}
                                            </h2>
                                            <p className="text-muted-foreground leading-relaxed line-clamp-2">
                                                {article.summary}
                                            </p>
                                            <div className="flex items-center pt-4 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                                <span className="font-bold text-foreground mr-2">Via {article.source}</span>
                                            </div>
                                        </a>
                                    </div>
                                </article>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border-card rounded-md">
                                <p className="text-xs font-mono text-muted-foreground uppercase opacity-50">No news articles available. Trigger sync.</p>
                            </div>
                        )}

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
