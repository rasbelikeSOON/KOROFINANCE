"use client";

import React from "react";
import { Send } from "lucide-react";

export default function NewsletterCTA() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Accents */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-8">
                    <span className="inline-block px-4 py-1 bg-surface-2 border border-border-card text-primary text-[10px] font-mono font-bold uppercase tracking-[0.3em] rounded-full">
                        The Koro Brief
                    </span>
                    <h2 className="text-4xl md:text-6xl font-display font-extrabold text-foreground leading-tight tracking-tight">
                        Africa&apos;s sharpest financial digest.
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                        Weekly market insights, policy analysis, and investment ideas delivered straight to your inbox. No jargon, just results.
                    </p>

                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto pt-4"
                    >
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-grow bg-surface border border-border-card px-6 py-4 rounded-sm text-foreground focus:outline-none focus:border-primary transition-colors font-mono"
                        />
                        <button
                            type="submit"
                            className="px-8 py-4 bg-primary text-background font-bold rounded-sm flex items-center justify-center hover:bg-primary/90 transition-all active:scale-95 group"
                        >
                            Subscribe
                            <Send className="ml-2 w-4 h-4 group-hover:-rotate-12 transition-transform" />
                        </button>
                    </form>

                    <div className="pt-8 flex flex-col items-center space-y-4">
                        <p className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                            Join 10,000+ readers across Nigeria, Ghana, Kenya and beyond.
                        </p>
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-surface-2 flex items-center justify-center text-[10px] overflow-hidden grayscale">
                                    <img
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`}
                                        alt="Subscriber"
                                    />
                                </div>
                            ))}
                            <div className="w-8 h-8 rounded-full border-2 border-background bg-primary flex items-center justify-center text-[8px] font-bold text-background">
                                +10k
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
