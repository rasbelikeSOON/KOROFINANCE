"use client";

import { BookOpen, Search, Filter, TrendingUp, Layers, Zap, Info, Loader2 } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { supabase } from "@/lib/supabase";

const CATEGORIES = ["Investing", "Savings", "Policy & CBN", "Crypto", "Forex", "Macroeconomics", "Personal Finance"];

const fetchLearnArticles = async () => {
    const { data, error } = await supabase
        .from("learn_articles")
        .select("*")
        .order("published_at", { ascending: false });

    if (error) throw error;
    return data || [];
};

const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
        case 'Zap': return <Zap className={className} />;
        case 'Layers': return <Layers className={className} />;
        case 'Info': return <Info className={className} />;
        case 'BookOpen':
        default:
            return <BookOpen className={className} />;
    }
};

export default function LearnPage() {
    const { data: articles, isLoading } = useSWR("learn_articles", fetchLearnArticles);

    return (
        <div className="min-h-screen pt-20 pb-24 bg-background">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-16">
                    <div className="flex items-center space-x-2 text-primary font-mono text-xs font-bold uppercase tracking-widest mb-4">
                        <BookOpen className="w-4 h-4" />
                        <span>The Knowledge Base</span>
                    </div>
                    <h1 className="text-5xl md:text-8xl font-display font-black text-foreground uppercase tracking-tight italic leading-none mb-8">
                        Learn Finance<br />
                        <span className="text-muted-foreground/30">From Scratch.</span>
                    </h1>

                    <div className="grid md:grid-cols-4 gap-4">
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="What do you want to master today?"
                                className="w-full bg-surface border border-border-card p-4 pl-12 rounded-sm text-sm focus:outline-none focus:border-primary transition-colors"
                            />
                        </div>
                        <button className="flex items-center justify-center space-x-2 bg-surface text-foreground py-4 border border-border-card rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-surface-2 transition-colors">
                            <Filter className="w-3 h-3" />
                            <span>Difficulty</span>
                        </button>
                        <button className="flex items-center justify-center space-x-2 bg-primary text-background py-4 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors">
                            <span>Browse Paths</span>
                        </button>
                    </div>
                </header>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : articles && articles.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article: any) => (
                            <Link key={article.id} href={`/learn/${article.slug}`}>
                                <div className="glass p-8 rounded-md group hover:border-primary/50 transition-all border-l-4 border-l-transparent hover:border-l-primary h-full flex flex-col">
                                    <div className="mb-8 p-3 w-fit bg-surface-2 rounded-sm">
                                        {renderIcon(article.icon_name, `w-6 h-6 ${article.difficulty === 'Beginner' ? 'text-primary' : article.difficulty === 'Intermediate' ? 'text-warning' : 'text-destructive'}`)}
                                    </div>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest ${article.difficulty === "Beginner" ? "bg-primary/10 text-primary" : article.difficulty === "Intermediate" ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"
                                            }`}>
                                            {article.difficulty}
                                        </span>
                                        <span className="text-[10px] font-mono text-muted-foreground uppercase">{article.read_time || "5 mins"}</span>
                                    </div>
                                    <h3 className="text-2xl font-display font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-tight">
                                        {article.title}
                                    </h3>
                                    <p className="text-muted-foreground/80 text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
                                        {article.excerpt}
                                    </p>
                                    <div className="pt-6 border-t border-border-card/50 flex items-center text-primary font-bold text-xs uppercase tracking-widest">
                                        Start Reading <TrendingUp className="w-3 h-3 ml-2" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 border border-dashed border-border-card rounded-md">
                        <BookOpen className="w-8 h-8 text-muted-foreground mb-4" />
                        <h3 className="text-xl font-display font-bold text-foreground mb-2">Knowledge Base Updating</h3>
                        <p className="text-muted-foreground text-center max-w-sm">
                            New educational modules are currently being curated by our editorial team. Check back shortly.
                        </p>
                    </div>
                )}

                {/* Learning Paths Teaser */}
                <section className="mt-24 bg-surface p-12 rounded-md relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="max-w-xl text-center md:text-left">
                            <h2 className="text-3xl font-display font-black italic uppercase tracking-tight mb-4 tracking-tighter">Master Investing in 30 Days</h2>
                            <p className="text-muted-foreground leading-relaxed">
                                Follow our curated "Investor's Journey" path designed for absolute beginners.
                                From opening a brokerage account to reading balance sheets.
                            </p>
                        </div>
                        <button className="px-12 py-4 bg-primary text-background font-black uppercase italic tracking-tight text-lg transform hover:rotate-3 transition-transform">
                            Enroll for Free
                        </button>
                    </div>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </section>
            </div>
        </div>
    );
}
