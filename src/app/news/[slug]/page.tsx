"use client";

import React, { useEffect, useState } from "react";
import { Clock, ArrowLeft, Share2, Copy, Check, Zap } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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

export default function ArticlePage() {
    const params = useParams();
    const slug = params.slug as string;

    const [article, setArticle] = useState<any>(null);
    const [related, setRelated] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!slug) return;
            setLoading(true);
            try {
                const fullUrl = `/news/${slug}`;
                let found = null;

                // Try by slug column first
                const { data: bySlug } = await supabase
                    .from("news_articles")
                    .select("*")
                    .eq("slug", slug)
                    .maybeSingle();
                if (bySlug) { found = bySlug; }

                // Fallback: match by url
                if (!found) {
                    const { data: byUrl } = await supabase
                        .from("news_articles")
                        .select("*")
                        .eq("url", fullUrl)
                        .maybeSingle();
                    if (byUrl) { found = byUrl; }
                }

                // Fallback: partial match
                if (!found) {
                    const { data: partial } = await supabase
                        .from("news_articles")
                        .select("*")
                        .ilike("url", `%${slug}%`)
                        .limit(1)
                        .maybeSingle();
                    if (partial) { found = partial; }
                }

                setArticle(found);

                // Fetch related articles
                if (found?.category) {
                    const { data: relatedData } = await supabase
                        .from("news_articles")
                        .select("id, title, summary, url, slug, category, tag_colour, read_time, published_at, image_url")
                        .eq("category", found.category)
                        .neq("id", found.id)
                        .order("published_at", { ascending: false })
                        .limit(3);
                    setRelated(relatedData || []);
                }
            } catch (err) {
                console.error("Failed to fetch article", err);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [slug]);

    const handleCopy = () => {
        if (typeof window !== "undefined") {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShare = (platform: "twitter" | "whatsapp") => {
        const url = typeof window !== "undefined" ? window.location.href : "";
        const text = article?.title || "Check this out on KoroFinance";
        if (platform === "twitter") {
            window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, "_blank");
        } else {
            window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
        }
    };

    const tagColour = article ? (article.tag_colour || CATEGORY_COLOURS[article.category] || "#5B2ECC") : "#5B2ECC";

    if (loading) {
        return (
            <div className="min-h-screen bg-white text-[#0A0A0A]">
                <Navbar />
                <main className="pt-[80px] min-h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-10 h-10 border-2 border-[#5B2ECC] border-t-transparent rounded-full animate-spin" />
                        <p className="font-sans text-[14px] text-[#AAAAAA]">Loading article...</p>
                    </div>
                </main>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-white text-[#0A0A0A]">
                <Navbar />
                <main className="pt-[80px] min-h-screen flex flex-col items-center justify-center gap-6">
                    <p className="font-sans text-[16px] text-[#C0392B] font-semibold">Article not found.</p>
                    <Link href="/news" className="text-[#5B2ECC] font-sans font-semibold hover:underline">
                        ← Back to Newsroom
                    </Link>
                </main>
            </div>
        );
    }

    // Split article content into paragraphs for readable rendering
    const paragraphs = (article.content || "").split(/\n+/).filter((p: string) => p.trim());

    return (
        <div className="min-h-screen bg-white text-[#0A0A0A]">
            <Navbar />

            <main className="pt-[80px]">
                {/* Article Hero */}
                {article.image_url && (
                    <div className="w-full h-[340px] md:h-[440px] overflow-hidden bg-[#F4F1FF]">
                        <img
                            src={article.image_url}
                            alt={article.title}
                            className="object-cover w-full h-full"
                        />
                    </div>
                )}

                <div className="max-w-[760px] mx-auto px-4 sm:px-6 py-12">
                    {/* Back nav */}
                    <Link
                        href="/news"
                        className="inline-flex items-center gap-2 font-sans font-semibold text-[13px] text-[#777777] hover:text-[#5B2ECC] transition-colors mb-8"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Newsroom
                    </Link>

                    {/* Category tag */}
                    <div className="mb-6 flex items-center gap-3">
                        <span
                            className="inline-block text-white font-sans font-bold text-[12px] px-4 py-1.5 rounded-[100px] uppercase tracking-wider"
                            style={{ backgroundColor: tagColour }}
                        >
                            {article.category}
                        </span>
                        {article.is_breaking && (
                            <span className="inline-flex items-center gap-1 bg-[#C0392B] text-white font-sans font-bold text-[11px] px-3 py-1 rounded-[100px]">
                                <Zap className="w-3 h-3" /> BREAKING
                            </span>
                        )}
                    </div>

                    {/* Headline */}
                    <h1 className="font-display font-bold text-[38px] md:text-[48px] text-[#0A0A0A] leading-[1.15] mb-6">
                        {article.title}
                    </h1>

                    {/* Summary pull quote */}
                    <p
                        className="font-sans text-[18px] text-[#555555] leading-[1.65] mb-8 border-l-4 pl-5 italic"
                        style={{ borderColor: tagColour }}
                    >
                        {article.summary}
                    </p>

                    {/* Meta row */}
                    <div className="flex items-center justify-between py-5 border-y border-[#E0E0E0] mb-10">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#F4F1FF] overflow-hidden">
                                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=KoroEditorial" alt="Author" />
                            </div>
                            <div>
                                <p className="font-sans font-semibold text-[14px] text-[#0A0A0A]">{article.source || "Koro Editorial"}</p>
                                <div className="flex items-center gap-2 text-[12px] text-[#AAAAAA] font-sans">
                                    <Clock className="w-3 h-3" />
                                    {article.read_time || 4} min read &nbsp;·&nbsp;
                                    {article.published_at
                                        ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true })
                                        : "Recently"}
                                </div>
                            </div>
                        </div>

                        {/* Share buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleShare("twitter")}
                                className="p-2 text-[#777777] hover:text-[#1DA1F2] hover:bg-[#F4F1FF] rounded-full transition-colors"
                                title="Share on X"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </button>
                            <button
                                onClick={() => handleShare("whatsapp")}
                                className="p-2 text-[#777777] hover:text-[#25D366] hover:bg-[#F4F1FF] rounded-full transition-colors"
                                title="Share on WhatsApp"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z M11.994 1.5C6.166 1.5 1.5 6.168 1.5 12c0 1.89.48 3.664 1.319 5.213L1.5 22.5l5.45-1.3A10.48 10.48 0 0011.994 22.5C17.822 22.5 22.5 17.832 22.5 12c0-5.832-4.678-10.5-10.506-10.5z" /></svg>
                            </button>
                            <button
                                onClick={handleCopy}
                                className="p-2 text-[#777777] hover:text-[#5B2ECC] hover:bg-[#F4F1FF] rounded-full transition-colors"
                                title="Copy link"
                            >
                                {copied ? <Check className="w-4 h-4 text-[#1A7A4A]" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Article Body */}
                    <div className="font-sans text-[17px] text-[#2A2A2A] leading-[1.75] space-y-5">
                        {paragraphs.map((para: string, idx: number) => {
                            // Detect "THE KORO TAKE" / "KORO VERDICT" callout sections
                            const isKoroTake = /^(\[)?THE KORO (TAKE|VERDICT|'S (TAKE|VERDICT|READ|BUSINESS VERDICT))/i.test(para.trim());
                            const isSection = /^\[.+\]/.test(para.trim()) || /^[A-Z][A-Z\s&]+:/.test(para.trim());

                            if (isKoroTake) {
                                // Strip the label
                                const bodyText = para.replace(/^\[?THE KORO (TAKE|VERDICT|'S (TAKE|VERDICT|READ|BUSINESS VERDICT))\]?\s*[—–-]?\s*/i, "");
                                return (
                                    <div
                                        key={idx}
                                        className="my-8 bg-[#F4F1FF] border-l-4 rounded-r-[8px] p-6"
                                        style={{ borderColor: tagColour }}
                                    >
                                        <p className="font-sans font-bold text-[13px] uppercase tracking-widest mb-3" style={{ color: tagColour }}>
                                            🎯 The Koro Take
                                        </p>
                                        <p className="font-sans text-[16px] text-[#0A0A0A] leading-[1.7]">{bodyText}</p>
                                    </div>
                                );
                            }

                            if (isSection) {
                                // Bold structural headers like [THE DATA], THE EVIDENCE, etc.
                                const label = para.match(/^\[?([A-Z][A-Z\s&]+)\]?/)?.[1]?.trim() || "";
                                const rest = para.replace(/^\[?[A-Z][A-Z\s&—–-]+\]?\s*[—–-]?\s*/g, "");
                                return (
                                    <div key={idx}>
                                        {label && (
                                            <p className="font-sans font-bold text-[12px] uppercase tracking-widest text-[#AAAAAA] mb-1">{label}</p>
                                        )}
                                        {rest && <p>{rest}</p>}
                                    </div>
                                );
                            }

                            return <p key={idx}>{para}</p>;
                        })}
                    </div>

                    {/* Disclaimer for Stock Picks */}
                    {article.category === "Stock Picks" && (
                        <div className="mt-10 p-4 border border-[#E0E0E0] rounded-[8px] bg-[#F9F9F9]">
                            <p className="font-sans text-[12px] text-[#AAAAAA] leading-[1.6]">
                                This watchlist is for informational purposes only and does not constitute financial advice. Always do your own research.
                            </p>
                        </div>
                    )}

                    {/* Category tag footer */}
                    <div className="mt-12 pt-8 border-t border-[#E0E0E0] flex items-center justify-between">
                        <span
                            className="inline-block text-white font-sans font-bold text-[11px] px-3 py-1 rounded-[100px] uppercase tracking-wide"
                            style={{ backgroundColor: tagColour }}
                        >
                            {article.category}
                        </span>
                        <Link href="/news" className="font-sans text-[13px] text-[#5B2ECC] font-semibold hover:underline">
                            ← More stories
                        </Link>
                    </div>
                </div>

                {/* Related Articles */}
                {related.length > 0 && (
                    <div className="bg-[#F4F1FF] py-16">
                        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                            <h2 className="font-display font-bold text-[28px] text-[#0A0A0A] mb-8">
                                More in {article.category}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {related.map((rel: any) => (
                                    <Link
                                        key={rel.id}
                                        href={rel.url || `/news/${rel.slug || rel.id}`}
                                        className="group bg-white rounded-[12px] border border-[#E0E0E0]/50 shadow-[0_2px_16px_rgba(0,0,0,0.07)] overflow-hidden hover:-translate-y-1 transition-transform duration-300"
                                    >
                                        {rel.image_url && (
                                            <div className="h-[140px] overflow-hidden">
                                                <img src={rel.image_url} alt={rel.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700" />
                                            </div>
                                        )}
                                        <div className="p-5">
                                            <h3 className="font-display font-bold text-[16px] text-[#0A0A0A] leading-[1.35] line-clamp-3 group-hover:text-[#5B2ECC] transition-colors mb-3">
                                                {rel.title}
                                            </h3>
                                            <div className="flex items-center gap-1 text-[12px] text-[#AAAAAA] font-sans">
                                                <Clock className="w-3 h-3" />
                                                {rel.read_time || 4} min
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
