"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

const NEWS_DATA = [
    {
        id: 1,
        category: "Policy",
        title: "CBN Increases Interest Rates to 24.75% to Combat Inflation",
        excerpt: "The Central Bank of Nigeria has announced a significant hike in the Monetary Policy Rate (MPR) in its latest move to stabilize the Naira and curb rising headline inflation.",
        author: "Koro Editorial",
        time: "2 hours ago",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1611974714652-17852e91dac7?q=80&w=2070&auto=format&fit=crop",
        isHero: true,
    },
    {
        id: 2,
        category: "Crypto",
        title: "Bitcoin Surges Past $64k as ETF Inflows Accelerate",
        time: "4 hours ago",
        isHero: false,
    },
    {
        id: 3,
        category: "NGX",
        title: "MTN Nigeria Declares ₦2.4 Trillion Revenue for FY 2024",
        time: "6 hours ago",
        isHero: false,
    },
    {
        id: 4,
        category: "Fintech",
        title: "Moniepoint Secures $100M Series C for Pan-African Expansion",
        time: "8 hours ago",
        isHero: false,
    },
];

export default function FeaturedNews() {
    const heroArticle = NEWS_DATA.find((a) => a.isHero);
    const sideArticles = NEWS_DATA.filter((a) => !a.isHero);

    return (
        <section className="py-24 bg-background">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-12 border-b border-border-card pb-6">
                    <div>
                        <h2 className="text-4xl font-display font-extrabold text-foreground mb-2 italic uppercase tracking-tight">
                            Latest from the Markets
                        </h2>
                        <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
                            Real-time insights & reporting
                        </p>
                    </div>
                    <Link
                        href="/news"
                        className="hidden sm:flex items-center text-primary font-bold hover:gap-2 transition-all p-2"
                    >
                        View all news <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>

                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Hero Article */}
                    {heroArticle && (
                        <div className="lg:col-span-7 group cursor-pointer">
                            <Link href={`/news/${heroArticle.id}`}>
                                <div className="relative aspect-[16/9] overflow-hidden rounded-md mb-6 grayscale hover:grayscale-0 transition-all duration-700">
                                    <img
                                        src={heroArticle.image}
                                        alt={heroArticle.title}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-primary text-background text-[10px] font-bold uppercase tracking-widest rounded-sm">
                                            {heroArticle.category}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-3xl font-display font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-tight">
                                    {heroArticle.title}
                                </h3>
                                <p className="text-muted-foreground mb-6 line-clamp-2">
                                    {heroArticle.excerpt}
                                </p>
                                <div className="flex items-center text-xs font-mono text-muted-foreground space-x-4">
                                    <span className="font-bold text-foreground uppercase tracking-widest">{heroArticle.author}</span>
                                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1" /> {heroArticle.time}</span>
                                    <span>{heroArticle.readTime}</span>
                                </div>
                            </Link>
                        </div>
                    )}

                    {/* Side Articles */}
                    <div className="lg:col-span-5 space-y-8">
                        {sideArticles.map((article) => (
                            <div key={article.id} className="group cursor-pointer border-b border-border-card/50 pb-8 last:border-0 last:pb-0">
                                <Link href={`/news/${article.id}`}>
                                    <span className="block text-[10px] font-mono font-bold text-primary uppercase tracking-widest mb-2">
                                        {article.category}
                                    </span>
                                    <h4 className="text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-3">
                                        {article.title}
                                    </h4>
                                    <span className="flex items-center text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                                        <Clock className="w-3 h-3 mr-1 opacity-50" /> {article.time} · 3 min read
                                    </span>
                                </Link>
                            </div>
                        ))}

                        <div className="pt-4">
                            <Link
                                href="/news"
                                className="flex items-center justify-center w-full py-4 border border-border-card text-foreground font-bold rounded-sm hover:bg-surface transition-all"
                            >
                                View all stories
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
