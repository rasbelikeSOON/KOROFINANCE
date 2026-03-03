"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Layers, Zap } from "lucide-react";
import { motion } from "framer-motion";

const CONCEPTS = [
    {
        icon: <BookOpen className="w-6 h-6 text-primary" />,
        title: "Stock Market Basics",
        difficulty: "Beginner",
        description: "Learn how the NGX works and how to buy your first share in a Nigerian company.",
        readTime: "4 min read",
    },
    {
        icon: <Zap className="w-6 h-6 text-warning" />,
        title: "Understanding Inflation",
        difficulty: "Intermediate",
        description: "Why does the price of bread keep rising? We explain the macroeconomics of the Naira.",
        readTime: "6 min read",
    },
    {
        icon: <Layers className="w-6 h-6 text-primary" />,
        title: "Treasury Bills & Bonds",
        difficulty: "Beginner",
        description: "Safe, steady, and backed by the government. Everything you need to know about T-bills.",
        readTime: "5 min read",
    },
];

export default function LearnTeaser() {
    return (
        <section className="py-24 bg-background">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0 text-center md:text-left">
                    <div>
                        <h2 className="text-4xl font-display font-extrabold text-foreground mb-4 italic uppercase tracking-tight">
                            Understand Your Money
                        </h2>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                            Financial jargon, explained the way your smartest friend would. No fluff. Just clarity.
                        </p>
                    </div>
                    <Link
                        href="/learn"
                        className="inline-flex items-center text-primary font-bold hover:gap-2 transition-all p-2 group self-center md:self-end"
                    >
                        Explore all concepts <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {CONCEPTS.map((concept, idx) => (
                        <motion.div
                            key={concept.title}
                            whileHover={{ y: -10 }}
                            className="glass p-8 rounded-md group cursor-pointer hover:border-primary/40 transition-all border-l-4 border-l-transparent hover:border-l-primary"
                        >
                            <div className="mb-6">{concept.icon}</div>
                            <div className="flex items-center justify-between mb-4">
                                <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest ${concept.difficulty === "Beginner" ? "bg-primary/10 text-primary" : "bg-warning/10 text-warning"
                                    }`}>
                                    {concept.difficulty}
                                </span>
                                <span className="text-[10px] font-mono text-muted-foreground uppercase">{concept.readTime}</span>
                            </div>
                            <h3 className="text-2xl font-display font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                                {concept.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed mb-8">
                                {concept.description}
                            </p>
                            <div className="flex items-center text-primary font-bold text-sm lowercase tracking-tight opacity-0 group-hover:opacity-100 transition-opacity">
                                Read explanation <ArrowRight className="ml-2 w-4 h-4" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
