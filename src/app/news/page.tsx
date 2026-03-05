"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Clock, Zap } from "lucide-react";
import useSWR from "swr";
import { getLiveNews } from "@/lib/api/news";
import { formatDistanceToNow } from "date-fns";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ALL_CATEGORIES = [
    "All",
    "Markets",
    "Analysis",
    "Stock Picks",
    "Crypto & Web3",
    "Learn",
    "Personal Finance",
    "CBN & Policy",
    "Startups & Fintech",
    "Business",
];

const CATEGORY_COLOURS: Record<string, string> = {
    "Markets": "#5B2ECC",
    "Analysis": "#0A0A0A",
    "Learn": "#1A7A4A",
    "Crypto & Web3": "#F7931A",
    "Personal Finance": "#2E86CC",
    "CBN & Policy": "#C0392B",
    "Startups & Fintech": "#0088CC",
    "Business": "#8B6914",
    "Stock Picks": "#5B2ECC",
};

function CategoryPill({ category, colour }: { category: string; colour?: string }) {
    const bg = colour || CATEGORY_COLOURS[category] || "#5B2ECC";
    return (
        <span
            className="inline-block text-white font-sans font-bold text-[11px] px-3 py-1 rounded-[100px] uppercase tracking-wide"
            style={{ backgroundColor: bg }}
        >
            {category}
        </span>
    );
}

export default function NewsPage() {
    const [activeCategory, setActiveCategory] = useState("All");
    const [page, setPage] = useState(1);
    const PER_PAGE = 12;

    const { data: news, isLoading } = useSWR("live_news_full", () => getLiveNews(60));

    const filtered = (news || []).filter((a: any) =>
        activeCategory === "All" || a.category === activeCategory
    );

    const heroArticle = filtered[0] || null;
    const gridArticles = filtered.slice(1, 1 + PER_PAGE * page);

    return (
        <div className="min-h-screen bg-white text-[#0A0A0A]">
            <Navbar />

            <main className="pt-[80px] pb-[80px]">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="pt-12 mb-10 border-b border-[#E0E0E0] pb-8">
                        <h1 className="font-display font-bold text-[52px] text-[#0A0A0A] leading-[1.1] mb-2">
                            The Newsroom.
                        </h1>
                        <p className="font-sans text-[16px] text-[#777777]">
                            Original reporting and sharp analysis, every 6 hours.
                        </p>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex space-x-2 overflow-x-auto pb-6 mb-10 scrollbar-hide">
                        {ALL_CATEGORIES.map((cat) => {
                            const isActive = activeCategory === cat;
                            return (
                                <button
                                    key={cat}
                                    onClick={() => { setActiveCategory(cat); setPage(1); }}
                                    className={`whitespace-nowrap px-5 py-2 rounded-[100px] font-sans font-semibold text-[13px] transition-colors border ${isActive
                                            ? "bg-[#5B2ECC] text-white border-[#5B2ECC]"
                                            : "bg-white text-[#555555] border-[#E0E0E0] hover:border-[#5B2ECC] hover:text-[#5B2ECC]"
                                        }`}
                                >
                                    {cat}
                                </button>
                            );
                        })}
                    </div>

                    {isLoading ? (
                        <div className="space-y-8">
                            {/* Hero Skeleton */}
                            <div className="animate-pulse rounded-[12px] bg-[#F4F1FF] h-[360px] w-full" />
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="animate-pulse rounded-[12px] bg-[#F4F1FF] h-[240px]" />
                                ))}
                            </div>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-[100px] border border-dashed border-[#E0E0E0] rounded-[12px]">
                            <p className="font-sans text-[14px] text-[#AAAAAA]">
                                No articles in this category yet. Check back after the next sync.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-12">

                            {/* Hero Article */}
                            {heroArticle && (
                                <Link href={heroArticle.url || `/news/${heroArticle.slug || heroArticle.id}`}>
                                    <div className="group grid grid-cols-1 lg:grid-cols-2 gap-8 bg-[#F4F1FF] rounded-[12px] overflow-hidden hover:shadow-[0_8px_40px_rgba(91,46,204,0.12)] transition-shadow duration-300">
                                        <div className="relative h-[280px] lg:h-[360px] overflow-hidden">
                                            <img
                                                src={heroArticle.image_url}
                                                alt={heroArticle.title}
                                                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                                            />
                                            {heroArticle.is_breaking && (
                                                <div className="absolute top-4 left-4 bg-[#C0392B] text-white font-sans font-bold text-[11px] px-3 py-1 rounded-[100px] flex items-center">
                                                    <Zap className="w-3 h-3 mr-1" /> BREAKING
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-8 flex flex-col justify-center">
                                            <div className="mb-4">
                                                <CategoryPill
                                                    category={heroArticle.category}
                                                    colour={heroArticle.tag_colour}
                                                />
                                            </div>
                                            <h2 className="font-display font-bold text-[#0A0A0A] text-[28px] leading-[1.25] mb-4 group-hover:text-[#5B2ECC] transition-colors">
                                                {heroArticle.title}
                                            </h2>
                                            <p className="font-sans text-[15px] text-[#555555] leading-[1.6] line-clamp-3 mb-6">
                                                {heroArticle.summary}
                                            </p>
                                            <div className="flex items-center text-[13px] font-sans text-[#AAAAAA] mt-auto">
                                                <Clock className="w-3.5 h-3.5 mr-1.5" />
                                                {heroArticle.read_time || 4} min read &nbsp;·&nbsp;
                                                {formatDistanceToNow(new Date(heroArticle.published_at), { addSuffix: true })}
                                                &nbsp;·&nbsp;
                                                <span className="font-semibold text-[#0A0A0A]">{heroArticle.source}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )}

                            {/* Article Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {gridArticles.map((article: any) => (
                                    <Link
                                        key={article.id}
                                        href={article.url || `/news/${article.slug || article.id}`}
                                        className="group flex flex-col bg-white rounded-[12px] border border-[#E0E0E0]/50 shadow-[0_2px_16px_rgba(0,0,0,0.07)] overflow-hidden hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300"
                                    >
                                        {/* Image */}
                                        <div className="relative h-[160px] overflow-hidden bg-[#F4F1FF]">
                                            {article.image_url && (
                                                <img
                                                    src={article.image_url}
                                                    alt={article.title}
                                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                                                />
                                            )}
                                            {article.is_breaking && (
                                                <div className="absolute top-3 left-3 bg-[#C0392B] text-white font-sans font-bold text-[10px] px-2 py-0.5 rounded-[100px] flex items-center">
                                                    <Zap className="w-2.5 h-2.5 mr-1" /> BREAKING
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex flex-col flex-grow p-5">
                                            <div className="mb-3">
                                                <CategoryPill
                                                    category={article.category}
                                                    colour={article.tag_colour}
                                                />
                                            </div>
                                            <h3 className="font-display font-bold text-[#0A0A0A] text-[17px] leading-[1.3] mb-2 line-clamp-3 group-hover:text-[#5B2ECC] transition-colors">
                                                {article.title}
                                            </h3>
                                            <p className="font-sans text-[13px] text-[#777777] leading-[1.6] line-clamp-2 flex-grow mb-4">
                                                {article.summary}
                                            </p>
                                            <div className="mt-auto flex items-center text-[12px] text-[#AAAAAA] font-sans">
                                                <Clock className="w-3 h-3 mr-1" />
                                                {article.read_time || 4} min &nbsp;·&nbsp;
                                                {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Load More */}
                            {filtered.length > 1 + PER_PAGE * page && (
                                <div className="text-center">
                                    <button
                                        onClick={() => setPage(p => p + 1)}
                                        className="inline-flex items-center px-8 py-4 border border-[#0A0A0A] text-[#0A0A0A] font-sans font-semibold text-[14px] rounded-[8px] hover:bg-[#0A0A0A] hover:text-white transition-colors"
                                    >
                                        Load more stories
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
