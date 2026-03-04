"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Target, Users, Zap, Globe, BarChart3, TrendingUp, HandCoins } from "lucide-react";

const values = [
    {
        icon: ShieldCheck,
        title: "Trust & Transparency",
        description: "We believe in clear, honest financial information. Our data is sourced from verified market terminals and analyzed by AI to give you the truth without the jargon."
    },
    {
        icon: Target,
        title: "Precision Markets",
        description: "In high-volatility markets like the NGX and Crypto, timing is everything. KoroFinance provides the tools to track movements with surgical precision."
    },
    {
        icon: Users,
        title: "Inclusive Finance",
        description: "Financial growth shouldn't be a privilege. We are building the gateway for every Nigerian—from Gen Z to seasoned execs—to understand how money works."
    }
];

export default function MissionSection() {
    return (
        <section className="py-24 bg-surface/30">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="max-w-3xl mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
                            Our Mission: To Make Financial <span className="text-primary">Intelligence Universal.</span>
                        </h2>
                        <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                            <p>
                                At KoroFinance, we recognize that the biggest barrier to wealth in Nigeria isn't just capital—it's information. Navigating the complexities of the Nigerian Exchange (NGX), understanding the daily fluctuation of the Naira, and keeping up with the rapid pace of Fintech innovation can feel like a full-time job.
                            </p>
                            <p>
                                That's why we built KoroFinance. We are more than just a news aggregator; we are Africa's sharpest financial digest and real-time market terminal. Our platform combines deep-dive analytical journalism with real-time data to ensure that you are never left in the dark about your money.
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Values Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-24">
                    {values.map((v, i) => (
                        <motion.div
                            key={v.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            className="bg-background/40 border border-border-card p-8 rounded-sm hover:border-primary/40 transition-colors"
                        >
                            <div className="w-12 h-12 bg-primary/10 flex items-center justify-center rounded-sm text-primary mb-6">
                                <v.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{v.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {v.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Extended Content for SEO */}
                <div className="grid lg:grid-cols-2 gap-16 items-start border-t border-border-card pt-24">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h3 className="text-3xl font-display font-bold">Why Knowledge is the Best Asset</h3>
                        <div className="space-y-4 text-muted-foreground leading-relaxed">
                            <p>
                                The Nigerian financial landscape is evolving faster than ever. From the Central Bank of Nigeria (CBN) policies on bank recapitalization to the surging interest in digital assets and crypto-remittances, staying ahead requires a reliable source of truth. KoroFinance bridges the gap between raw market data and actionable insights.
                            </p>
                            <p>
                                Whether you're tracking the growth of top NGX movers, monitoring the official and parallel market exchange rates, or looking for the next breakout fintech startup stories, our AI-powered editorial bureau synthesizes the most important trends into original, easy-to-digest articles.
                            </p>
                            <p>
                                We believe that by simplifying financial growth, we can help build a more resilient and prosperous Nigeria. Our commitment is to provide a platform that is fast, accurate, and visually stunning—giving you the premium experience your financial future deserves.
                            </p>
                        </div>
                        <div className="flex gap-4 pt-4">
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold font-mono text-primary">100k+</span>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Market Tickers</span>
                            </div>
                            <div className="border-l border-border-card h-10 mx-4" />
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold font-mono text-primary">24/7</span>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">AI Monitoring</span>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="bg-surface p-8 rounded-sm relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

                        <h3 className="text-2xl font-bold mb-6">Explore Our Core Pillars</h3>
                        <ul className="space-y-6">
                            {[
                                { title: "Daily Market Reports", desc: "A summary of the day's biggest movers on the NGX and NASDAQ.", icon: BarChart3 },
                                { title: "Policy Breakdowns", desc: "Unbiased analysis of CBN policies and government fiscal decisions.", icon: Globe },
                                { title: "Investment Education", desc: "Step-by-step guides for beginners to start their wealth journey.", icon: HandCoins },
                                { title: "Fintech Innovation", desc: "Keeping you updated on the startups scaling across Lagos and beyond.", icon: Zap }
                            ].map((pill, i) => (
                                <li key={pill.title} className="flex gap-4">
                                    <div className="mt-1 text-primary">
                                        <pill.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-foreground">{pill.title}</h4>
                                        <p className="text-sm text-muted-foreground">{pill.desc}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
