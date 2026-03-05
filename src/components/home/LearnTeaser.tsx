"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, X } from "lucide-react";

const CONCEPTS = [
    {
        id: "stock-market-basics",
        title: "Stock Market Basics",
        difficulty: "Beginner",
        theme: "green",
        description: "Learn how the NGX works and how to buy your first share in a Nigerian company.",
        readTime: "4 min read",
        content: "The Nigerian Exchange Group (NGX) is where public companies list their shares for people like you to buy. Owning a share means you own a tiny piece of that company. If they make a profit, you might get a dividend. If they grow, the value of your share might go up.\n\nTo start, you need a stockbroker registered with the SEC. It sounds intimidating, but many fintech apps now act as brokers, allowing you to open an account with just your BVN and a few thousand Naira. The key rule? Don't invest money you need for rent next week. The stock market is a long-term game."
    },
    {
        id: "understanding-inflation",
        title: "Understanding Inflation",
        difficulty: "Intermediate",
        theme: "purple",
        description: "Why does the price of bread keep rising? We explain the macroeconomics of the Naira.",
        readTime: "6 min read",
        content: "Inflation is simply the rate at which the general level of prices for goods and services is rising. If inflation is 20%, it means what cost you ₦1,000 last year now costs ₦1,200. It silently eats away your purchasing power.\n\nIn Nigeria, inflation is driven by a mix of factors: a weaker Naira making imported goods (like machinery and refined fuel) more expensive, security issues affecting local food production, and monetary policy (how much money the CBN is printing or allowing in circulation). To protect yourself, your money needs to be invested in assets that grow faster than the inflation rate."
    },
    {
        id: "treasury-bills-bonds",
        title: "Treasury Bills & Bonds",
        difficulty: "Beginner",
        theme: "green",
        description: "Safe, steady, and backed by the government. Everything you need to know about T-bills.",
        readTime: "5 min read",
        content: "When the government needs money to build roads or fund the budget, they borrow from the public by issuing Treasury Bills (short-term) and Bonds (long-term). \n\nBecause they are backed by the Federal Government, they are considered one of the safest investments in Nigeria. You lend them your money for a fixed period (say, 364 days), and they promise to pay you back your principal plus interest at maturity. In times of high interest rates, T-bills can offer attractive, risk-free returns. You can usually buy them through your commercial bank or an investment app."
    },
];

export default function LearnTeaser() {
    const [selectedArticle, setSelectedArticle] = useState<typeof CONCEPTS[0] | null>(null);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (selectedArticle) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [selectedArticle]);

    return (
        <section className="bg-white py-[80px]">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h3 className="font-sans font-bold text-[11px] text-[#5B2ECC] tracking-[3px] uppercase mb-4">
                        Learn
                    </h3>
                    <h2 className="font-display font-bold text-[#0A0A0A] text-[40px] leading-[1.2] mb-4">
                        Understand your money.
                    </h2>
                    <p className="font-sans text-[16px] text-[#777777] max-w-[600px] leading-[1.6]">
                        Financial jargon, explained the way your smartest friend would. No fluff. Just clarity.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {CONCEPTS.map((concept) => (
                        <div
                            key={concept.id}
                            className="group flex flex-col bg-white rounded-[12px] p-6 shadow-[0_2px_16px_rgba(0,0,0,0.07)] border border-[#E0E0E0]/50 relative overflow-hidden h-full cursor-pointer"
                            onClick={() => setSelectedArticle(concept)}
                        >
                            {/* Hover left border effect */}
                            <div className="absolute left-0 top-0 w-[4px] h-full bg-[#5B2ECC] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                            <div className="flex items-start justify-between mb-8 pl-1">
                                <span className={`inline-block font-sans font-bold text-[11px] px-3 py-1 rounded-[100px] uppercase ${concept.theme === "green"
                                        ? "bg-[#E8F5EE] text-[#1A7A4A]"
                                        : "bg-[#F4F1FF] text-[#5B2ECC]"
                                    }`}>
                                    {concept.difficulty}
                                </span>
                                <span className="font-sans text-[12px] text-[#AAAAAA]">
                                    {concept.readTime}
                                </span>
                            </div>

                            <h3 className="font-sans font-semibold text-[18px] text-[#0A0A0A] mb-3 pl-1">
                                {concept.title}
                            </h3>

                            <p className="font-sans text-[14px] text-[#555555] leading-[1.6] mb-8 flex-grow pl-1">
                                {concept.description}
                            </p>

                            <div className="mt-auto pl-1">
                                <button className="font-sans font-semibold text-[14px] text-[#5B2ECC] hover:text-[#4A25A8] flex items-center transition-colors">
                                    Read explanation <ArrowRight className="ml-1 w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Overlay */}
            <div
                className={`fixed inset-0 z-[200] bg-black/50 transition-opacity duration-300 flex items-center justify-center p-4 ${selectedArticle ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setSelectedArticle(null)}
            >
                {/* Modal Content */}
                <div
                    className={`bg-white w-full max-w-[760px] max-h-[80vh] overflow-y-auto rounded-[12px] p-8 md:p-12 shadow-2xl relative transition-transform duration-300 ${selectedArticle ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
                        }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={() => setSelectedArticle(null)}
                        className="absolute top-6 right-6 p-2 text-[#AAAAAA] hover:text-[#0A0A0A] bg-[#F9F9F9] hover:bg-[#E0E0E0] rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    {selectedArticle && (
                        <div className="mt-2">
                            <div className="mb-6">
                                <span className={`inline-block font-sans font-bold text-[11px] px-3 py-1 rounded-[100px] uppercase ${selectedArticle.theme === "green"
                                        ? "bg-[#E8F5EE] text-[#1A7A4A]"
                                        : "bg-[#F4F1FF] text-[#5B2ECC]"
                                    }`}>
                                    {selectedArticle.difficulty}
                                </span>
                            </div>

                            <h2 className="font-display font-bold text-[#0A0A0A] text-[32px] md:text-[40px] leading-[1.2] mb-8">
                                {selectedArticle.title}
                            </h2>

                            <div className="font-sans text-[16px] text-[#555555] leading-[1.8] space-y-6 whitespace-pre-line">
                                {selectedArticle.content}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
