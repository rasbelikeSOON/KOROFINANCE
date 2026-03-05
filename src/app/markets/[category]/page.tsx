import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ArrowLeft } from 'lucide-react';

export default async function MarketCategoryStub(props: { params: Promise<{ category: string }> }) {
    const params = await props.params;

    // Format category nicely
    const categoryName = params.category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

    return (
        <div className="min-h-screen flex flex-col pt-16">
            <Navbar />

            <main className="flex-grow bg-background flex items-center justify-center py-24">
                <div className="max-w-xl mx-auto px-4 text-center">
                    <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-sm mb-6 inline-block">
                        Market Data
                    </span>
                    <h1 className="text-4xl font-display font-extrabold text-foreground mb-6">
                        {categoryName} Terminal
                    </h1>
                    <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                        We are currently building out the dedicated advanced terminal interface for {categoryName}. In the meantime, you can track all the top movers on our aggregated markets dashboard.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                        <Link
                            href="/"
                            className="inline-flex items-center text-muted-foreground hover:text-foreground font-mono text-sm uppercase tracking-widest transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back Home
                        </Link>
                        <Link
                            href="/markets"
                            className="inline-flex items-center px-8 py-3 bg-primary text-background font-bold rounded-sm hover:-translate-y-1 transition-transform"
                        >
                            View All Markets
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
