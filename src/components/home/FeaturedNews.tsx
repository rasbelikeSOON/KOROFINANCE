"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import useSWR from "swr";
import { getLiveNews } from "@/lib/api/news";
import { formatDistanceToNow } from "date-fns";

export default function FeaturedNews() {
    const { data: news, isLoading } = useSWR("live_news", getLiveNews);

    const heroArticle = news && news.length > 0 ? news[0] : null;
    const sideArticles = news && news.length > 1 ? news.slice(1, 4) : [];

    return (
        <section className="py-24 bg-background">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-12 border-b border-border-card pb-6">
                    <div>
                        <h2 className="text-4xl font-display font-extrabold text-foreground mb-2 italic uppercase tracking-tight">
                            Latest from the Markets
                        </h2>
                        <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
                            Money Simplified &bull; Real-time reporting
                        </p>
                    </div>
                    <Link
                        href="/news"
                        className="hidden sm:flex items-center text-primary font-bold hover:gap-2 transition-all p-2"
                    >
                        View all news <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Hero Skeleton */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="aspect-[16/9] bg-surface-2 animate-pulse rounded-sm" />
                            <div className="h-10 bg-surface-2 animate-pulse w-3/4 rounded-sm" />
                            <div className="space-y-3">
                                <div className="h-4 bg-surface-2 animate-pulse w-full rounded-sm" />
                                <div className="h-4 bg-surface-2 animate-pulse w-5/6 rounded-sm" />
                            </div>
                        </div>
                        {/* Side List Skeleton */}
                        <div className="lg:col-span-5 space-y-10">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="space-y-3 border-b border-border-card/50 pb-8 last:border-0">
                                    <div className="h-3 bg-surface-2 animate-pulse w-16 rounded-sm" />
                                    <div className="h-6 bg-surface-2 animate-pulse w-full rounded-sm" />
                                    <div className="h-3 bg-surface-2 animate-pulse w-24 rounded-sm" />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : heroArticle ? (
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Hero Article */}
                        <div className="lg:col-span-7 group cursor-pointer">
                            <Link href={heroArticle.url}>
                                <div className="relative aspect-[16/9] overflow-hidden rounded-md mb-6 grayscale hover:grayscale-0 transition-all duration-700">
                                    <img
                                        src={heroArticle.image_url}
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
                                    {heroArticle.summary}
                                </p>
                                <div className="flex items-center text-xs font-mono text-muted-foreground space-x-4">
                                    <span className="font-bold text-foreground uppercase tracking-widest">{heroArticle.source}</span>
                                    <span className="flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {formatDistanceToNow(new Date(heroArticle.published_at), { addSuffix: true })}
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Side Articles */}
                        <div className="lg:col-span-5 space-y-8">
                            {sideArticles.map((article: any) => (
                                <div key={article.id} className="group cursor-pointer border-b border-border-card/50 pb-8 last:border-0 last:pb-0">
                                    <Link href={article.url}>
                                        <span className="block text-[10px] font-mono font-bold text-primary uppercase tracking-widest mb-2">
                                            {article.category}
                                        </span>
                                        <h4 className="text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-3">
                                            {article.title}
                                        </h4>
                                        <span className="flex items-center text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                                            <Clock className="w-3 h-3 mr-1 opacity-50" />
                                            {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
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
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border-card rounded-md">
                        <p className="text-xs font-mono text-muted-foreground uppercase opacity-50">Terminal offline. Trigger news sync to see live reporting.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
