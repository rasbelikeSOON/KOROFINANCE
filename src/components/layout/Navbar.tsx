"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Markets", href: "/markets" },
    { label: "News", href: "/news" },
    { label: "Learn", href: "/learn" },
];

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border-card">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-3 group transition-transform duration-200 hover:-translate-y-[2px]">
                        <div className="w-10 h-10 bg-primary rounded-sm flex items-center justify-center font-display font-bold text-background">
                            K
                        </div>
                        <span className="text-xl font-display font-bold tracking-tight text-foreground flex flex-col leading-none">
                            <span>KORO<span className="text-primary">FINANCE</span></span>
                            <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-[0.2em] mt-1 ml-0.5">Decoded</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Section */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                        <Link
                            href="/auth/login"
                            className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/auth/register"
                            className="px-4 py-2 bg-primary text-background text-sm font-bold rounded-sm hover:bg-primary/90 transition-all active:scale-95"
                        >
                            Get Started
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-muted-foreground hover:text-foreground"
                        >
                            {isMobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="md:hidden fixed inset-0 top-16 bg-background z-40 px-4 py-6 space-y-6 animate-in slide-in-from-right">
                    <div className="flex flex-col space-y-4">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-2xl font-display font-bold text-foreground hover:text-primary"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <div className="pt-6 border-t border-border-card flex flex-col space-y-4">
                        <Link
                            href="/auth/login"
                            className="text-lg font-medium text-foreground"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/auth/register"
                            className="w-full py-4 bg-primary text-background text-center font-bold rounded-sm text-lg"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
