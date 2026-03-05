"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import useSWR from "swr";
import { getLiveNews } from "@/lib/api/news";

export default function FeaturedNews() {
    // Keep using the existing mock logic, as NewsAPI requires key and prompt says "or mock equivalent if key missing"
    const { data: news, isLoading } = useSWR("live_news", getLiveNews);

    const articles = news ? news.slice(0, 3) : [];

    return (
        <section className="bg-white py-[80px]">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12">
                    <h3 className="font-sans font-bold text-[11px] text-[#5B2ECC] tracking-[3px] uppercase mb-4">
                        Latest News
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E0E0E0] pb-6 gap-4">
                        <h2 className="font-display font-bold text-[#0A0A0A] text-[40px] leading-[1.2]">
                            From the markets.
                        </h2>
                        <Link
                            href="/news"
                            className="font-sans font-semibold text-[14px] text-[#5B2ECC] hover:text-[#4A25A8] flex items-center mb-2"
                        >
                            View all <ArrowRight className="ml-1 w-4 h-4" />
                        </Link>
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse space-y-4">
                                <div className="h-[200px] bg-[#E0E0E0] rounded-[12px]" />
                                <div className="h-4 bg-[#E0E0E0] rounded w-full" />
                                <div className="h-4 bg-[#E0E0E0] rounded w-2/3" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {articles.map((article: any, idx: number) => {
                            // Map category to a styled tag
                            let categoryDisplay = article.category || "Markets";
                            const avatarUrl = `https://api.dicebear.com/7.x/notionists/svg?seed=${article.id || idx}&backgroundColor=F4F1FF`;

                            return (
                                <Link
                                    href={article.url || "#"}
                                    key={article.id || idx}
                                    className="group flex flex-col bg-white rounded-[12px] p-5 shadow-[0_2px_16px_rgba(0,0,0,0.07)] border border-[#E0E0E0]/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]"
                                >
                                    <div className="mb-4">
                                        <span className="inline-block bg-[#F4F1FF] text-[#5B2ECC] font-sans font-bold text-[11px] px-3 py-1 rounded-[100px] uppercase">
                                            {categoryDisplay}
                                        </span>
                                    </div>
                                    <h3 className="font-display font-bold text-[#0A0A0A] text-[20px] leading-[1.3] mb-3 line-clamp-2">
                                        {article.title}
                                    </h3>
                                    <p className="font-sans text-[14px] text-[#777777] leading-[1.6] line-clamp-2 mb-6 flex-grow">
                                        {article.summary}
                                    </p>

                                    <div className="flex items-center mt-auto pt-4 border-t border-[#E0E0E0]/50">
                                        <img
                                            src={avatarUrl}
                                            alt="Author"
                                            className="w-8 h-8 rounded-full bg-[#F4F1FF] mr-3"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-sans font-semibold text-[13px] text-[#0A0A0A]">
                                                {article.source || "Koro Desk"}
                                            </span>
                                            <span className="font-sans text-[12px] text-[#AAAAAA]">
                                                {new Date(article.published_at || Date.now()).toLocaleDateString("en-NG", { month: "short", day: "numeric" })} • 4 min read
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
