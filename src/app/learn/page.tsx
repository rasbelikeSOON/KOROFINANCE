"use client";

import React from "react";
import { BookOpen, Search, Filter, TrendingUp, Layers, Zap, Info } from "lucide-react";
import Link from "next/link";

const CATEGORIES = ["Investing", "Savings", "Policy & CBN", "Crypto", "Forex", "Macroeconomics", "Personal Finance"];

const CONCEPTS = [
    {
        id: "stock-market-basics",
        title: "Stock Market Basics",
        category: "Investing",
        difficulty: "Beginner",
        excerpt: "Learn how the Nigerian Exchange (NGX) works and how to buy your first share in a dividend-paying company.",
        icon: <BookOpen className="w-6 h-6 text-primary" />,
        readTime: "4 mins",
    },
    {
        id: "inflation-explained",
        title: "Understanding Inflation",
        category: "Macroeconomics",
        difficulty: "Intermediate",
        excerpt: "A plain-language guide on why the purchasing power of the Naira changes and how it impacts your daily spending.",
        icon: <Zap className="w-6 h-6 text-warning" />,
        readTime: "6 mins",
    },
    {
        id: "treasury-bills-101",
        title: "Treasury Bills & Bonds",
        category: "Savings",
        difficulty: "Beginner",
        excerpt: "Safe, steady, and backed by the Federal Government. Everything you need to know about investing in T-bills.",
        icon: <Layers className="w-6 h-6 text-primary" />,
        readTime: "5 mins",
    },
    {
        id: "cryptocurrency-wallets",
        title: "How Crypto Wallets Work",
        category: "Crypto",
        difficulty: "Intermediate",
        excerpt: "Hot vs Cold storage. Learn how to secure your digital assets in the Nigerian context without getting scammed.",
        icon: <Info className="w-6 h-6 text-indigo-400" />,
        readTime: "8 mins",
    },
];

export default function LearnPage() {
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

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {CONCEPTS.map((concept) => (
                        <Link key={concept.id} href={`/learn/${concept.id}`}>
                            <div className="glass p-8 rounded-md group hover:border-primary/50 transition-all border-l-4 border-l-transparent hover:border-l-primary h-full flex flex-col">
                                <div className="mb-8 p-3 w-fit bg-surface-2 rounded-sm">{concept.icon}</div>
                                <div className="flex items-center justify-between mb-4">
                                    <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest ${concept.difficulty === "Beginner" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"
                                        }`}>
                                        {concept.difficulty}
                                    </span>
                                    <span className="text-[10px] font-mono text-muted-foreground uppercase">{concept.readTime}</span>
                                </div>
                                <h3 className="text-2xl font-display font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-tight">
                                    {concept.title}
                                </h3>
                                <p className="text-muted-foreground/80 text-sm leading-relaxed mb-8 flex-grow">
                                    {concept.excerpt}
                                </p>
                                <div className="pt-6 border-t border-border-card/50 flex items-center text-primary font-bold text-xs uppercase tracking-widest">
                                    Start Reading <TrendingUp className="w-3 h-3 ml-2" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

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
