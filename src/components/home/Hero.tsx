"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const MOCK_USDT_DATA = [
    { value: 1340 }, { value: 1345 }, { value: 1350 }, { value: 1348 },
    { value: 1355 }, { value: 1360 }, { value: 1358 }, { value: 1363.76 }
];

export default function Hero() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="bg-white py-[80px] overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Left Column (55%) */}
                    <div className="w-full lg:w-[55%]">
                        <div className="inline-block bg-[#F4F1FF] text-[#5B2ECC] font-sans font-semibold text-[12px] px-[12px] py-[4px] rounded-[100px] mb-6">
                            Nigeria&apos;s Financial Intelligence Platform
                        </div>

                        <h1 className="font-display font-bold text-[#0A0A0A] text-[48px] md:text-[64px] leading-[1.1] mb-6">
                            Where money makes <span className="italic relative">
                                sense.
                                <svg className="absolute w-full h-[3px] bottom-1 left-0" viewBox="0 0 100 3" preserveAspectRatio="none">
                                    <path d="M0 1.5 L100 1.5" stroke="#5B2ECC" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                                </svg>
                            </span>
                        </h1>

                        <p className="font-sans text-[18px] text-[#555555] leading-[1.6] max-w-[480px] mb-10">
                            We break down investing, the Naira, CBN policy, and fintech — in plain English, for everyday Nigerians.
                        </p>

                        <div className="flex flex-row items-center space-x-4 mb-10">
                            <Link
                                href="/markets"
                                className="bg-[#5B2ECC] text-white font-sans font-semibold text-[14px] px-[24px] py-[12px] rounded-[8px] hover:bg-[#4A25A8] transition-colors"
                            >
                                Explore Markets
                            </Link>
                            <Link
                                href="/learn"
                                className="bg-transparent border-[1.5px] border-[#0A0A0A] text-[#0A0A0A] font-sans font-semibold text-[14px] px-[24px] py-[12px] rounded-[8px] hover:bg-[#0A0A0A] hover:text-white transition-colors"
                            >
                                Start Learning
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4 text-[13px] font-sans text-[#777777]">
                            <span>100K+ Tickers</span>
                            <span className="w-[1px] h-4 bg-[#E0E0E0]"></span>
                            <span>24/7 AI Monitoring</span>
                            <span className="w-[1px] h-4 bg-[#E0E0E0]"></span>
                            <span>Free Forever</span>
                        </div>
                    </div>

                    {/* Right Column (45%) */}
                    <div className="w-full lg:w-[45%] relative min-h-[400px]">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[460px]">

                            {/* Card 1: NGX */}
                            <div className="absolute top-0 right-4 w-[220px] bg-white rounded-[12px] p-5 shadow-[0_2px_16px_rgba(0,0,0,0.07)] border border-[#E0E0E0]/50 rotate-[-2deg] z-10 transition-transform hover:rotate-0 hover:z-30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] duration-300">
                                <p className="font-sans text-[13px] text-[#777777] mb-1">NGX All-Share</p>
                                <div className="flex items-end justify-between font-mono">
                                    <span className="text-[20px] font-bold text-[#0A0A0A]">102,401</span>
                                    <span className="bg-[#E8F5EE] text-[#1A7A4A] text-[11px] font-bold px-2 py-[2px] rounded-[100px] mb-1 flex items-center">
                                        +1.4%
                                    </span>
                                </div>
                            </div>

                            {/* Card 2: BTC */}
                            <div className="absolute top-12 left-0 w-[240px] bg-white rounded-[12px] p-5 shadow-[0_2px_16px_rgba(0,0,0,0.07)] border border-[#E0E0E0]/50 rotate-[1.5deg] z-20 transition-transform hover:rotate-0 hover:z-30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] duration-300">
                                <p className="font-sans text-[13px] text-[#777777] mb-1">BTC/USD</p>
                                <div className="flex items-end justify-between font-mono">
                                    <span className="text-[24px] font-bold text-[#0A0A0A]">67,778</span>
                                    <span className="bg-[#FDECEA] text-[#C0392B] text-[11px] font-bold px-2 py-[2px] rounded-[100px] mb-1 flex items-center">
                                        -2.39%
                                    </span>
                                </div>
                            </div>

                            {/* Card 3: USD/NGN */}
                            <div className="absolute top-44 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-[12px] p-5 shadow-[0_2px_16px_rgba(0,0,0,0.07)] border border-[#E0E0E0]/50 z-10 transition-transform hover:-translate-y-2 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] duration-300">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="font-sans text-[13px] text-[#777777] mb-0.5">FX Parallel Market</p>
                                        <p className="font-mono text-[16px] font-bold text-[#0A0A0A]">USD/NGN</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono text-[24px] font-bold text-[#0A0A0A]">₦1,363.76</p>
                                    </div>
                                </div>
                                <div className="h-[40px] w-full">
                                    {mounted && (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={MOCK_USDT_DATA}>
                                                <Line
                                                    type="monotone"
                                                    dataKey="value"
                                                    stroke="#5B2ECC"
                                                    strokeWidth={2}
                                                    dot={false}
                                                    isAnimationActive={false}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
