import React from "react";
import Link from "next/link";
import { Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-surface border-t border-border-card pt-16 pb-8">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Column 1: Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center font-display font-bold text-background">
                                ₦
                            </div>
                            <span className="text-xl font-display font-bold tracking-tight text-foreground">
                                KORO<span className="text-primary">FINANCE</span>
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
                            Money&apos;s an Easy Thing. Real-time markets, news, and education for the modern African investor.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="https://twitter.com/korofinance" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="https://www.linkedin.com/company/korofinance" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                            <Link href="https://instagram.com/korofinance" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                                <Instagram className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Column 2: Markets */}
                    <div>
                        <h4 className="font-display font-bold text-foreground mb-6">Markets</h4>
                        <ul className="space-y-4">
                            <li><Link href="/markets/ngx" className="text-sm text-muted-foreground hover:text-primary transition-colors">NGX Stocks</Link></li>
                            <li><Link href="/markets/crypto" className="text-sm text-muted-foreground hover:text-primary transition-colors">Cryptocurrency</Link></li>
                            <li><Link href="/markets/pan-africa" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pan-Africa</Link></li>
                            <li><Link href="/markets/forex" className="text-sm text-muted-foreground hover:text-primary transition-colors">Forex Rates</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Learn */}
                    <div>
                        <h4 className="font-display font-bold text-foreground mb-6">Learn</h4>
                        <ul className="space-y-4">
                            <li><Link href="/learn" className="text-sm text-muted-foreground hover:text-primary transition-colors">Investing 101</Link></li>
                            <li><Link href="/learn" className="text-sm text-muted-foreground hover:text-primary transition-colors">Crypto Basics</Link></li>
                            <li><Link href="/learn" className="text-sm text-muted-foreground hover:text-primary transition-colors">CBN Policy</Link></li>
                            <li><Link href="/learn" className="text-sm text-muted-foreground hover:text-primary transition-colors">Macroeconomics</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Company */}
                    <div>
                        <h4 className="font-display font-bold text-foreground mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li><span className="text-sm text-muted-foreground cursor-not-allowed">About Koro</span></li>
                            <li><Link href="/news" className="text-sm text-muted-foreground hover:text-primary transition-colors">Our Blog</Link></li>
                            <li><a href="mailto:hello@korofinance.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</a></li>
                            <li><a href="mailto:hello@korofinance.com" className="text-sm text-muted-foreground hover:text-primary transition-colors">Advertise</a></li>
                        </ul>
                    </div>
                </div>

                {/* Legal Disclaimer */}
                <div className="border-t border-border-card pt-8 mt-8">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest text-center mb-8 max-w-3xl mx-auto leading-relaxed">
                        All market data and signals on Korofinance are provided for informational purposes only and do not constitute financial advice. Korofinance is not a licensed investment adviser. Past performance is not indicative of future results. Please consult a qualified financial advisor before making investment decisions.
                    </p>
                    <div className="flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground">
                        <p>© 2025 Korofinance. Built for Africa.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <span className="text-muted-foreground cursor-not-allowed">Privacy Policy</span>
                            <span className="text-muted-foreground cursor-not-allowed">Terms of Service</span>
                            <span className="text-muted-foreground cursor-not-allowed">Full Disclaimer</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
