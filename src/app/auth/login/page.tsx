"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, Github, Chrome, Loader2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Login submitted with:", { email, password });
        alert("Login button clicked! Attempting to sign in...");
        setLoading(true);
        setError(null);

        try {
            console.log("Calling supabase.auth.signInWithPassword...");
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) {
                console.error("Supabase sign in error:", signInError);
                throw signInError;
            }

            console.log("Sign in successful, redirecting...");
            alert("Success! Redirecting to markets dashboard.");
            router.push("/markets");
            router.refresh();
        } catch (err: any) {
            setError(err.message || "Failed to sign in. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const { error: googleError } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                }
            });
            if (googleError) throw googleError;
        } catch (err: any) {
            setError(err.message || "Failed to sign in with Google.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col lg:flex-row bg-background">
            {/* Left Side: Brand/Aesthetic */}
            <div className="lg:w-1/2 bg-surface hidden lg:flex flex-col justify-between p-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                <Link href="/" className="flex items-center space-x-2 relative z-10">
                    <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center font-display font-bold text-background text-lg">₦</div>
                    <span className="text-2xl font-display font-bold tracking-tight text-foreground uppercase">KORO</span>
                </Link>

                <div className="relative z-10 space-y-6">
                    <h2 className="text-6xl font-display font-black italic uppercase tracking-tighter leading-none">
                        Access the<br />
                        <span className="text-primary">Terminal.</span>
                    </h2>
                    <p className="text-muted-foreground text-xl max-w-sm leading-relaxed">
                        Join thousands of African investors who rely on Korofinance for real-time market reporting.
                    </p>
                </div>

                <div className="relative z-10 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                    © 2026 Korofinance · All Rights Reserved
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-grow flex items-center justify-center p-8">
                <div className="w-full max-w-md space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-display font-bold text-foreground">Sign In</h1>
                        <p className="text-muted-foreground">Welcome back to the future of African finance.</p>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full py-4 bg-surface border border-border-card rounded-sm flex items-center justify-center space-x-3 hover:bg-surface-2 transition-colors group disabled:opacity-50"
                        >
                            <Chrome className="w-5 h-5 group-hover:text-primary transition-colors" />
                            <span className="text-sm font-bold uppercase tracking-widest">Continue with Google</span>
                        </button>

                        <div className="relative py-4 flex items-center">
                            <div className="flex-grow border-t border-border-card" />
                            <span className="flex-shrink mx-4 text-[10px] font-mono font-bold text-muted-foreground uppercase">Or email</span>
                            <div className="flex-grow border-t border-border-card" />
                        </div>

                        {error && (
                            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-sm flex items-center space-x-3 text-destructive text-sm font-mono">
                                <AlertCircle className="w-4 h-4" />
                                <span>{error}</span>
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div className="space-y-4">
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
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full bg-surface border border-border-card p-4 pl-12 rounded-sm text-sm focus:outline-none focus:border-primary transition-colors font-mono"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-primary text-background font-bold rounded-sm uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center justify-center disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enter Dashboard"}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-xs text-muted-foreground">
                        Don&apos;t have an account?
                        <Link href="/auth/register" className="text-primary font-bold ml-1 hover:underline">Register now</Link>
                    </p>

                    <Link href="/" className="flex items-center justify-center text-[10px] space-x-2 text-muted-foreground uppercase font-bold tracking-widest hover:text-primary transition-colors">
                        <ArrowLeft className="w-3 h-3" />
                        <span>Return to Home</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
