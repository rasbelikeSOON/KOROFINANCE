"use client";

import React, { useState, useEffect } from "react";
import { X, Send, Loader2, CheckCircle2, BellRing } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function NewsletterPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Check if user has already subscribed or closed the popup
        const hasSeenPopup = localStorage.getItem("koro_newsletter_popup_seen");

        if (!hasSeenPopup) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 5000); // Show after 5 seconds

            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        localStorage.setItem("koro_newsletter_popup_seen", "true");
    };

    const handleSubmit = (e: React.FormEvent) => {
        setStatus("success");
        setMessage("Redirecting to finalize...");
        setTimeout(() => setIsOpen(false), 3000);
    };

    const pubId = process.env.NEXT_PUBLIC_BEEHIIV_PUB_ID;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-surface border border-border-card rounded-md shadow-2xl overflow-hidden"
                    >
                        {/* Decorative background element */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />

                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-foreground transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8 md:p-10 space-y-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-primary/10 rounded-sm flex items-center justify-center text-primary">
                                    <BellRing className="w-5 h-5" />
                                </div>
                                <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-primary">
                                    Weekly Updates
                                </span>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-3xl font-display font-extrabold text-foreground leading-tight tracking-tight">
                                    Don&apos;t miss a beat.
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">
                                    Join 10,000+ investors getting the sharpest financial insights across Africa, delivered weekly to your inbox.
                                </p>
                            </div>

                            <form
                                action="https://app.beehiiv.com/ad-sub"
                                method="POST"
                                target="_blank"
                                onSubmit={handleSubmit}
                                className="space-y-4"
                            >
                                <input type="hidden" name="pub_id" value={pubId} />
                                <div className="relative group">
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-surface-2 border border-border-card px-5 py-4 rounded-sm text-foreground focus:outline-none focus:border-primary transition-colors font-mono disabled:opacity-50"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-primary text-background font-bold rounded-sm flex items-center justify-center hover:bg-primary/90 transition-all active:scale-[0.98] group disabled:opacity-50"
                                >
                                    {status === "success" ? (
                                        <>
                                            <CheckCircle2 className="w-5 h-5 mr-2" />
                                            Subscribed successfully
                                        </>
                                    ) : (
                                        <>
                                            Subscribe Now
                                            <Send className="ml-2 w-4 h-4 group-hover:-rotate-12 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>

                            {message && (
                                <p className={`text-xs font-mono text-center ${status === "success" ? "text-primary" : "text-destructive"}`}>
                                    {message}
                                </p>
                            )}

                            <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest leading-relaxed">
                                No spam. Unsubscribe anytime. By subscribing, you agree to receive news and updates from Koro Finance.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
