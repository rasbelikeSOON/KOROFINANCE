"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, User, Mail, Lock, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Register submitted with:", { email, fullName });
        alert("Register button clicked! Attempting to create account...");
        setLoading(true);
        setError(null);

        try {
            console.log("Calling supabase.auth.signUp...");
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                },
            });

            if (signUpError) {
                console.error("Supabase sign up error:", signUpError);
                throw signUpError;
            }

            console.log("Sign up successful, user data:", data);
            if (data.user) {
                // Profile creation is handled by Supabase triggers (assuming following standard patterns)
                // But we can also do a manual insert if the trigger isn't set up.
                // For now, redirect to login or show success.
                setError("Please check your email to confirm your account.");
                // Optionally redirect to a success page
            }
        } catch (err: any) {
            setError(err.message || "Failed to create account.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-background">
            {/* Left Side */}
            <div className="lg:w-1/2 bg-surface hidden lg:flex flex-col justify-between p-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <Link href="/" className="flex items-center space-x-2 relative z-10">
                    <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center font-display font-bold text-background text-lg">₦</div>
                    <span className="text-2xl font-display font-bold tracking-tight text-foreground uppercase">KORO</span>
                </Link>

                <div className="relative z-10 space-y-6">
                    <h2 className="text-6xl font-display font-black italic uppercase tracking-tighter leading-none">
                        Future<br />
                        <span className="text-primary">Wealth.</span>
                    </h2>
                    <p className="text-muted-foreground text-xl max-w-sm leading-relaxed">
                        Start your journey today. High-frequency data, cultural insights, and financial clarity at your fingertips.
                    </p>
                </div>

                <div className="relative z-10 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                    Empowering Africa&apos;s Investors
                </div>
            </div>

            {/* Right Side */}
            <div className="flex-grow flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-display font-bold text-foreground">Create Account</h1>
                        <p className="text-muted-foreground">Join 50,000+ smart Africans building wealth.</p>
                    </div>

                    {error && (
                        <div className={`p-4 rounded-sm flex items-center space-x-3 text-sm font-mono border ${error.includes("check your email") ? "bg-primary/10 border-primary/20 text-primary" : "bg-destructive/10 border-destructive/20 text-destructive"}`}>
                            {error.includes("check your email") ? <ShieldCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                            <span>{error}</span>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleRegister}>
                        <div className="space-y-4">
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    placeholder="Full Name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    className="w-full bg-surface border border-border-card p-4 pl-12 rounded-sm text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                                />
                            </div>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-surface border border-border-card p-4 pl-12 rounded-sm text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="password"
                                    placeholder="Create Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-surface border border-border-card p-4 pl-12 rounded-sm text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                                />
                            </div>
                        </div>

                        <div className="flex items-start space-x-3 text-[10px] text-muted-foreground">
                            <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
                            <p>By creating an account, you agree to our <Link href="/terms" className="text-foreground hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-foreground hover:underline">Privacy Policy</Link>.</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-primary text-background font-bold rounded-sm uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Join Korofinance"}
                        </button>
                    </form>

                    <p className="text-center text-xs text-muted-foreground">
                        Already have an account?
                        <Link href="/auth/login" className="text-primary font-bold ml-1 hover:underline">Sign in</Link>
                    </p>

                    <Link href="/" className="flex items-center justify-center text-[10px] space-x-2 text-muted-foreground uppercase font-bold tracking-widest hover:text-primary transition-colors">
                        <ArrowLeft className="w-3 h-3" />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
