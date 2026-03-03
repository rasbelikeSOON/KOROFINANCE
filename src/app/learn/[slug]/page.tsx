"use client";

import React from "react";
import { ArrowLeft, CheckCircle2, BookOpen, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ConceptPage() {
    return (
        <article className="min-h-screen pt-32 pb-24 bg-background">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <Link href="/learn" className="inline-flex items-center text-primary text-xs font-bold uppercase tracking-widest mb-12 hover:gap-2 transition-all">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Knowledge Base
                    </Link>

                    <header className="space-y-6 mb-12">
                        <div className="flex items-center space-x-4">
                            <span className="px-2 py-1 bg-primary/10 text-primary border border-primary/20 text-[10px] font-bold uppercase tracking-widest rounded-sm">Beginner</span>
                            <span className="text-[10px] font-mono text-muted-foreground uppercase">Investing 101 · Chapter 1</span>
                        </div>
                        <h1 className="text-6xl md:text-8xl font-display font-black text-foreground uppercase tracking-tight italic leading-none">
                            Stock Market<br />
                            <span className="text-primary">Basics.</span>
                        </h1>

                        <div className="glass p-6 rounded-md">
                            <h3 className="text-xs font-mono font-bold text-foreground uppercase tracking-widest mb-4 flex items-center">
                                <BookOpen className="w-4 h-4 mr-2 text-primary" /> What you&apos;ll learn
                            </h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
                                <li className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-2 text-primary" /> Difference between stocks & shares</li>
                                <li className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-2 text-primary" /> How the NGX works in Nigeria</li>
                                <li className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-2 text-primary" /> Making money with Dividends</li>
                                <li className="flex items-center"><CheckCircle2 className="w-3 h-3 mr-2 text-primary" /> Compound interest fundamentals</li>
                            </ul>
                        </div>
                    </header>

                    <div className="prose prose-invert prose-green max-w-none space-y-8 text-muted-foreground text-lg leading-relaxed font-sans">
                        <p>
                            Imagine a big marketplace, like Balogun Market in Lagos. But instead of shirts or electronics, people are buying and selling pieces of big companies like MTN, Dangote, or Zenith Bank. That, in a nutshell, is the <strong>Stock Market</strong>.
                        </p>
                        <p>
                            When you buy a &quot;stock,&quot; you are essentially buying a tiny slice of ownership in a company. You become a &quot;shareholder.&quot;
                        </p>

                        <h3 className="text-3xl font-display font-bold text-foreground pt-8 italic uppercase tracking-tight lowercase">Why do companies sell stocks?</h3>
                        <p>
                            Companies need money to grow. They could borrow from a bank, but they have to pay back with interest. Instead, they can &quot;go public&quot; and sell shares of the company to the public. They get the money to build new factories or launch new products, and you get a piece of the profit.
                        </p>

                        <div className="bg-surface-2 p-8 border-l-4 border-primary rounded-r-md italic text-foreground">
                            <strong>Koro Tip:</strong> In Nigeria, the official marketplace for this is the <strong>Nigerian Exchange Limited (NGX)</strong>. You can&apos;t just walk in alone; you need a registered stockbroker or a digital app to trade.
                        </div>

                        <h3 className="text-3xl font-display font-bold text-foreground pt-8 italic uppercase tracking-tight lowercase">Two ways you make money</h3>
                        <ol className="space-y-4">
                            <li>
                                <strong>Price Appreciation:</strong> You buy a share of MTN at ₦200 and sell it later at ₦250. You made ₦50 profit per share.
                            </li>
                            <li>
                                <strong>Dividends:</strong> When the company makes a lot of profit, they often share some of it with their owners (you). This is basically passive income.
                            </li>
                        </ol>
                    </div>

                    {/* Test Yourself Section */}
                    <section className="mt-20 glass p-8 rounded-md border-t-4 border-primary">
                        <h3 className="text-2xl font-display font-bold italic uppercase tracking-tight mb-8">Test Your Knowledge</h3>
                        <div className="space-y-8">
                            <div>
                                <p className="font-bold text-foreground mb-4">1. What is the official name of the stock exchange in Nigeria?</p>
                                <div className="space-y-3">
                                    {["Lagos Stock House", "Nigerian Exchange Limited (NGX)", "Central Bank Trading Floor", "Naira Markets Board"].map((ans) => (
                                        <button key={ans} className="w-full text-left p-4 bg-background border border-border-card rounded-sm text-sm hover:border-primary transition-colors">
                                            {ans}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="mt-16 pt-8 border-t border-border-card flex items-center justify-between">
                        <div className="flex items-center text-muted-foreground text-xs font-mono">
                            <Clock className="w-3 h-3 mr-1" /> 5 mins remaining in Path
                        </div>
                        <button className="flex items-center px-6 py-3 bg-primary text-background font-bold text-xs uppercase tracking-widest rounded-sm hover:gap-2 transition-all">
                            Next: Choosing a Broker <ArrowRight className="ml-2 w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
}
