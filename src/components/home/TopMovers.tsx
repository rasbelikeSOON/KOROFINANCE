"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

type MarketType = "NGX" | "Crypto" | "Forex";

const fetcher = async (url: string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch");
    return res.json();
};

export default function TopMovers() {
    const [activeTab, setActiveTab] = useState<MarketType>("NGX");

    // Auto refresh every 30 seconds
    const { data: movers, error, isLoading } = useSWR(`/api/market?type=${activeTab}`, fetcher, {
        refreshInterval: 30000,
    });

    return (
        <section className="bg-[#F4F1FF] py-[80px]">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <div className="flex items-center mb-4">
                        <span className="w-2 h-2 rounded-full bg-[#1A7A4A] animate-pulse mr-2" />
                        <h3 className="font-sans font-bold text-[11px] text-[#5B2ECC] tracking-[3px] uppercase">
                            Live Terminal
                        </h3>
                    </div>

                    <h2 className="font-display font-bold text-[#0A0A0A] text-[40px] leading-[1.2] mb-8">
                        Today&apos;s movers.
                    </h2>

                    {/* Tabs */}
                    <div className="flex space-x-6 border-b border-[#E0E0E0]">
                        {(["NGX", "Crypto", "Forex"] as MarketType[]).map((tab) => {
                            const isActive = activeTab === tab;
                            return (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`pb-3 font-sans font-semibold text-[15px] transition-colors relative ${isActive ? "text-[#5B2ECC]" : "text-[#777777] hover:text-[#0A0A0A]"
                                        }`}
                                >
                                    {tab}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#5B2ECC]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.07)] border border-[#E0E0E0] overflow-hidden">
                    <div className="overflow-x-auto min-h-[300px]">
                        {isLoading && !movers ? (
                            <div className="p-8 space-y-4">
                                <div className="h-6 bg-[#F4F1FF] animate-pulse rounded w-full" />
                                <div className="h-12 bg-[#F4F1FF] animate-pulse rounded w-full" />
                                <div className="h-12 bg-[#F4F1FF] animate-pulse rounded w-full" />
                            </div>
                        ) : movers && movers.length > 0 ? (
                            <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead>
                                    <tr className="border-b border-[#E0E0E0]">
                                        <th className="py-4 px-6 font-sans font-semibold text-[13px] text-[#777777]">#</th>
                                        <th className="py-4 px-6 font-sans font-semibold text-[13px] text-[#777777]">Asset</th>
                                        <th className="py-4 px-6 font-sans font-semibold text-[13px] text-[#777777]">Price</th>
                                        <th className="py-4 px-6 font-sans font-semibold text-[13px] text-[#777777]">24h Change</th>
                                        <th className="py-4 px-6 font-sans font-semibold text-[13px] text-[#777777]">Volume</th>
                                        <th className="py-4 px-6 font-sans font-semibold text-[13px] text-[#777777]">Trend</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E0E0E0]">
                                    {movers.slice(0, 5).map((item: any, idx: number) => {
                                        const isPositive = item.change_pct >= 0;
                                        const chartData = item.sparkline?.map((val: number, i: number) => ({ value: val, index: i })) || [];

                                        // Format currency correctly based on active tab
                                        const currencyPrefix = activeTab === "Crypto" || activeTab === "Forex" ? "$" : "₦";
                                        const priceFormatted = item.price.toLocaleString(undefined, {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: item.price < 1 ? 6 : 2
                                        });

                                        return (
                                            <tr
                                                key={item.ticker}
                                                className="group hover:bg-[#F4F1FF] transition-colors duration-150 cursor-pointer"
                                            >
                                                <td className="py-5 px-6 font-sans text-[14px] text-[#777777]">{idx + 1}</td>
                                                <td className="py-5 px-6">
                                                    <div className="flex flex-col">
                                                        <span className="font-sans font-bold text-[15px] text-[#0A0A0A]">{item.ticker}</span>
                                                        <span className="font-sans text-[13px] text-[#777777]">{item.name || item.ticker}</span>
                                                    </div>
                                                </td>
                                                <td className="py-5 px-6 font-mono font-medium text-[15px] text-[#0A0A0A]">
                                                    {currencyPrefix}{priceFormatted}
                                                </td>
                                                <td className="py-5 px-6">
                                                    <span className={`inline-flex items-center px-2 py-1 rounded-[100px] font-mono font-bold text-[12px] ${isPositive
                                                            ? "bg-[#E8F5EE] text-[#1A7A4A]"
                                                            : "bg-[#FDECEA] text-[#C0392B]"
                                                        }`}>
                                                        {isPositive ? "+" : ""}{item.change_pct?.toFixed(2)}%
                                                    </span>
                                                </td>
                                                <td className="py-5 px-6 font-mono font-medium text-[14px] text-[#555555]">
                                                    {(item.volume || (item.price * 10000)).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                                </td>
                                                <td className="py-5 px-6 w-[120px]">
                                                    {chartData.length > 0 && (
                                                        <div className="w-[80px] h-[40px]">
                                                            <ResponsiveContainer width="100%" height="100%">
                                                                <LineChart data={chartData}>
                                                                    <YAxis domain={['auto', 'auto']} hide />
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
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-12">
                                <p className="text-[#AAAAAA] font-sans text-[14px]">
                                    {error ? "Error connecting to terminal server" : "No terminal data found"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
