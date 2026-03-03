"use client";

import React from "react";
import Link from "next/link";
import { TrendingUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Hero() {
    return (
        <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40 bg-background">
            {/* Purposeful gradient accent */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/[0.03] rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-12 gap-16 items-center">
                    {/* Left Side: Content */}
                    <div className="lg:col-span-7 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-4"
                        >
                            <span className="text-primary font-mono text-sm font-bold tracking-[0.2em] uppercase">
                                Money Simplified for Nigerians
                            </span>
                            <h1 className="text-6xl md:text-8xl font-display font-extrabold text-foreground leading-[1.05] tracking-tight">
                                Money,<br />
                                <span className="text-primary">Decoded.</span>
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl text-muted-foreground leading-relaxed max-w-2xl"
                        >
                            We break through the noise to make investing, economy, and financial growth easy to understand for every Nigerian.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1], delay: 0.4 }}
                            className="flex flex-col sm:flex-row items-center gap-4"
                        >
                            <Link
                                href="/markets"
                                className="w-full sm:w-auto px-10 py-4 bg-primary text-background font-bold rounded-sm flex items-center justify-center hover:opacity-90 transition-opacity active:scale-[0.98]"
                            >
                                Explore Markets
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </Link>
                            <Link
                                href="/learn"
                                className="w-full sm:w-auto px-10 py-4 border border-border-card text-foreground font-bold rounded-sm hover:bg-surface transition-colors active:scale-[0.98] text-center"
                            >
                                Start Learning
                            </Link>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            transition={{ duration: 1, delay: 0.8 }}
                            className="pt-8 flex flex-wrap items-center gap-8 grayscale opacity-50"
                        >
                            {["NGX", "JSE", "GSE", "Crypto", "Forex"].map((tag) => (
                                <span key={tag} className="text-xs font-mono font-bold tracking-widest uppercase">
                                    {tag}
                                </span>
                            ))}
                        </motion.div>
                    </div>

                    {/* Right Side: Animated Widget */}
                    <div className="lg:col-span-5 relative">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="relative z-10 space-y-4"
                        >
                            {/* NGX Card */}
                            <div className="glass p-6 rounded-md hover:border-primary/50 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-sm font-mono text-muted-foreground uppercase mb-1">NGX All-Share Index</h3>
                                        <p className="text-3xl font-mono font-bold">104,256.81</p>
                                    </div>
                                    <div className="flex items-center text-primary bg-primary/10 px-2 py-1 rounded-sm text-xs font-bold">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        +1.24%
                                    </div>
                                </div>
                                <div className="h-16 flex items-end space-x-1">
                                    {[40, 60, 45, 70, 55, 80, 75, 90, 85].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1], delay: 0.6 + i * 0.05 }}
                                            className="flex-1 bg-primary/20 rounded-t-[1px]"
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* BTC Card */}
                            <div className="glass p-6 rounded-md translate-x-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-[#f7931a]/10 flex items-center justify-center text-[#f7931a] font-bold">₿</div>
                                        <div>
                                            <h3 className="text-sm font-bold uppercase">Bitcoin</h3>
                                            <p className="text-xs font-mono text-muted-foreground">BTC / USD</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-mono font-bold">$67,778.00</p>
                                        <p className="text-xs font-mono text-destructive">-2.39%</p>
                                    </div>
                                </div>
                            </div>

                            {/* USD/NGN Card */}
                            <div className="glass p-6 rounded-sm -translate-x-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-sm bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            NGN
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-bold uppercase tracking-tight">Dollar Rate</h3>
                                            <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">USD / NGN</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-mono font-bold">₦1,363.76</p>
                                        <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Official</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Decorative background element */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-border-card/30 rounded-full -z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}
