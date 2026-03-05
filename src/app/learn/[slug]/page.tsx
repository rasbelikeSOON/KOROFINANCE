import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, BookOpen, User } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const ARTICLES: Record<string, { title: string, content: React.ReactNode, readTime: string, difficulty: string, category: string }> = {
    "stock-market-basics": {
        title: "Stock Market Basics: How to Buy Your First Share",
        category: "Investing 101",
        readTime: "4 min read",
        difficulty: "Beginner",
        content: (
            <>
                <p>Welcome to the absolute beginner&apos;s guide to the Nigerian Stock Exchange (NGX). We know that investing can sound complicated, like an exclusive club where everyone speaks a secret language. But the reality is much simpler: buying a stock simply means buying a tiny fraction of a company.</p>

                <h2>1. What is the NGX?</h2>
                <p>The Nigerian Exchange Group (NGX) is basically a supermarket for company shares. Just like you go to Balogun Market to buy fabrics, investors go to the NGX to buy pieces of companies like MTN Nigeria, Dangote Cement, or Zenith Bank. When these companies make a profit, they share a portion of it with you (this is called a <strong>dividend</strong>).</p>

                <h2>2. Why Should You Care?</h2>
                <p>Leaving your money in a standard savings account means you are losing purchasing power to inflation. If inflation is 30% and your savings account yields 4%, your money is actively shrinking. Investing in strong companies that grow their revenue in line with—or faster than—inflation is one of the best ways to protect your wealth over the long term.</p>

                <h2>3. How to Start in 3 Simple Steps</h2>
                <p>Getting started now is easier than it has ever been in Nigerian history. You no longer need to call a stockbroker on a landline.</p>
                <ul>
                    <li><strong>Step 1: Get a CSCS Account.</strong> The Central Securities Clearing System (CSCS) is like a bank account, but instead of holding Naira, it holds your shares. Any modern fintech broker will open this for you automatically when you sign up.</li>
                    <li><strong>Step 2: Choose a Trading App.</strong> Platforms like Trove, Bamboo, or traditional banking apps (like Stanbic IBTC Stockbrokers) allow you to fund your wallet and buy NGX shares directly from your smartphone.</li>
                    <li><strong>Step 3: Buy Your First Share.</strong> Start small. Research a company you use every day, check their recent earnings reports, and execute a &apos;Buy&apos; order. It is completely normal for the price to fluctuate daily—don&apos;t panic sell!</li>
                </ul>

                <p>The golden rule of the stock market is consistency. Investing ₦10,000 every month is statistically much more powerful than trying to "time" the market with a lump sum once a year. Stay patient, stay informed, and let compound interest do the heavy lifting.</p>
            </>
        )
    },
    "understanding-inflation": {
        title: "Understanding Inflation: Why the Price of Bread Keeps Rising",
        category: "Macroeconomics",
        readTime: "6 min read",
        difficulty: "Intermediate",
        content: (
            <>
                <p>If you&apos;ve gone to the market recently, you don&apos;t need an economist to tell you what inflation is. It is the silent tax that eats away at your purchasing power. But understanding the mechanics behind <em>why</em> prices rise is crucial for making smart financial decisions.</p>

                <h2>The Mechanics of Inflation</h2>
                <p>At its core, inflation happens when there is "too much money chasing too few goods." If the Central Bank of Nigeria (CBN) prints more Naira, but the actual production of goods (like rice, cement, or petrol) doesn&apos;t increase at the same rate, the value of each individual Naira drops. Consequently, it takes more Naira to buy the exact same item.</p>

                <h2>Types of Inflation in Nigeria</h2>
                <p>Nigeria typically battles two main types of inflation simultaneously:</p>
                <ul>
                    <li><strong>Cost-Push Inflation:</strong> This happens when the cost of production goes up, forcing companies to raise prices. In Nigeria, the removal of the petrol subsidy and the devaluation of the Naira against the Dollar made transportation and imported raw materials much more expensive. Businesses pass these costs directly to you, the consumer.</li>
                    <li><strong>Demand-Pull Inflation:</strong> This occurs when demand for a product far exceeds its supply. For example, if there is a poor harvest season for tomatoes, but the population still wants to eat the same amount of stew, the scarcity drives the price up.</li>
                </ul>

                <h2>How the CBN Fights Back</h2>
                <p>To cool down inflation, the Central Bank uses a tool called the <strong>Monetary Policy Rate (MPR)</strong>—often referred to as the interest rate. By raising the MPR, the CBN makes borrowing more expensive. When loans become expensive, businesses and individuals spend less money. Slower spending reduces demand, which theoretically forces sellers to stabilize or reduce prices to attract buyers. It represents a delicate balancing act, as raising rates too high can choke economic growth entirely.</p>

                <h2>Protecting Your Wealth</h2>
                <p>You cannot stop inflation, but you can outrun it. Keeping your money idle in a current account is the worst possible strategy. Instead, look towards high-yield savings (like Treasury Bills), owning hard assets (real estate), or investing in companies that have pricing power—meaning they can raise the prices of their products without losing customers, effectively passing the inflation burden away from their shareholders.</p>
            </>
        )
    },
    "treasury-bills-bonds": {
        title: "Treasury Bills & Bonds: The Safe Haven",
        category: "Fixed Income",
        readTime: "5 min read",
        difficulty: "Beginner",
        content: (
            <>
                <p>The stock market moves up and down like a rollercoaster, and crypto is even wilder. So where do you put your money when you just want it to grow steadily without losing sleep? Enter government securities: Treasury Bills and Bonds.</p>

                <h2>What is a Treasury Bill?</h2>
                <p>A Treasury Bill (T-Bill) is basically a short-term loan you give to the Federal Government of Nigeria. In return for your cash, the government promises to pay you back your principal plus interest after a set period—usually 91 days, 182 days, or 364 days.</p>
                <p>The best part about T-Bills is that the interest is paid <strong>upfront</strong>. For example, if you buy a ₦1,000,000 T-Bill at a 10% discount rate for one year, the government takes ₦900,000 from your account immediately. At the end of the year, they deposit exactly ₦1,000,000 into your account. You get to keep and reinvest your ₦100,000 profit from day one.</p>

                <h2>What is a Federal Government Bond?</h2>
                <p>Bonds are similar to T-Bills, but they are for the long haul. While T-Bills max out at one year, Bonds last for 2, 5, 10, or even 30 years. When you buy a bond, the government pays you interest (called a "coupon") twice a year throughout the life of the bond. At the very end of the term, you get your original principal back.</p>

                <h2>Why Are They Considered "Safe"?</h2>
                <p>They are considered risk-free investments because they are backed by the full faith and credit of the Federal Government. The government literally owns the printing press for the currency; therefore, the chance of them defaulting on a Naira-denominated debt is practically zero. You are guaranteed to get exactly the amount stated on the maturity date.</p>

                <h2>How to Buy Them</h2>
                <p>Previously, buying T-Bills required walking into a physical bank branch with millions of Naira. Today, thanks to fintech innovation, you can buy fractional T-Bills directly from apps like Cowrywise or PiggyVest with as little as ₦10,000. For direct primary market auctions, commercial banks like GTBank or FirstBank allow you to submit bids through their mobile apps if you meet the ₦50,000,000 minimum threshold set by the CBN for direct bidding. But for retail investors, mutual funds and fintech apps remain the best, most accessible route.</p>
            </>
        )
    }
}

export default async function LearnArticlePage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    const article = ARTICLES[params.slug];

    if (!article) {
        notFound();
    }

    return (
        <div className="min-h-screen flex flex-col pt-16">
            <Navbar />

            <main className="flex-grow bg-background py-20 mt-16">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

                    <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-primary mb-10 transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                    </Link>

                    {/* Meta */}
                    <div className="flex items-center space-x-4 mb-6">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-sm">
                            {article.category}
                        </span>
                        <span className="px-3 py-1 border border-border-card text-muted-foreground text-[10px] font-bold uppercase tracking-widest rounded-sm">
                            {article.difficulty}
                        </span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-display font-extrabold text-foreground leading-tight mb-8">
                        {article.title}
                    </h1>

                    {/* Author & Read Time */}
                    <div className="flex items-center space-x-6 border-b border-border-card pb-8 mb-12">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-surface-2 rounded-full flex items-center justify-center mr-3">
                                <User className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-foreground font-bold text-sm">KoroFinance Editorial</p>
                                <p className="text-muted-foreground text-xs font-mono uppercase">Financial Literacy Desk</p>
                            </div>
                        </div>
                        <div className="flex items-center text-muted-foreground text-sm font-mono uppercase tracking-widest opacity-80">
                            <Clock className="w-4 h-4 mr-2" /> {article.readTime}
                        </div>
                    </div>

                    {/* Content */}
                    <article className="prose prose-invert prose-green max-w-none text-muted-foreground">
                        {article.content}
                    </article>

                    {/* CTA */}
                    <div className="mt-16 p-8 bg-surface border border-border-card rounded-md text-center">
                        <h3 className="text-2xl font-bold text-foreground mb-4">Ready to start your journey?</h3>
                        <p className="text-muted-foreground mb-6">Join thousands of Nigerians mastering the markets daily.</p>
                        <Link href="/markets" className="inline-flex items-center px-10 py-4 bg-primary text-background font-bold rounded-sm transition-transform active:scale-95 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20">
                            Launch Market Terminal
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
