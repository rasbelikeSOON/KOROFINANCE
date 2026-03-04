"use client";

import React, { useEffect, useState } from "react";
import { Clock, Facebook, Twitter, Linkedin, MessageSquare, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { formatDistanceToNow } from "date-fns";

export default function ArticlePage() {
    const params = useParams();
    const slug = params.slug as string;

    const [article, setArticle] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!slug) return;
            try {
                // url is stored as `/news/slug-name` in our custom system
                const fullUrl = `/news/${slug}`;

                const { data, error } = await supabase
                    .from("news_articles")
                    .select("*")
                    .eq("url", fullUrl)
                    .single();

                if (error) {
                    // Try without /news/ just in case for external fallback
                    const { data: fallbackData } = await supabase
                        .from("news_articles")
                        .select("*")
                        .ilike("url", `%${slug}%`)
                        .limit(1)
                        .single();

                    if (fallbackData) {
                        setArticle(fallbackData);
                    } else {
                        console.error("Article fetch error:", error);
                    }
                } else {
                    setArticle(data);
                }
            } catch (err) {
                console.error("Failed to fetch article", err);
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen pt-32 pb-24 bg-background flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground font-mono text-xs uppercase tracking-widest">Loading Report...</p>
            </div>
        );
    }

    if (!article) {
        return (
            <div className="min-h-screen pt-32 pb-24 bg-background flex flex-col items-center justify-center">
                <p className="text-destructive font-mono text-xs uppercase tracking-widest mb-4">Article Not Found</p>
                <Link href="/news" className="text-primary font-bold hover:underline">Return to Newsroom</Link>
            </div>
        );
    }

    // Determine if it's an external article that got synced before, or internal
    const isExternal = article.url.startsWith('http');

    return (
        <article className="min-h-screen pt-32 pb-24 bg-background">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <Link href="/news" className="inline-flex items-center text-primary text-xs font-bold uppercase tracking-widest mb-12 hover:gap-2 transition-all">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Newsroom
                    </Link>

                    <header className="space-y-6 mb-12">
                        <div className="flex items-center space-x-4">
                            <span className="px-3 py-1 bg-primary text-background text-[10px] font-bold uppercase tracking-widest rounded-sm">{article.category}</span>
                            <span className="text-[10px] font-mono text-muted-foreground uppercase">
                                Published {article.published_at ? new Date(article.published_at).toLocaleDateString() : 'Recently'}
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-display font-black text-foreground uppercase tracking-tight italic leading-[0.95]">
                            {article.title}
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed italic border-l-4 border-primary pl-6 py-2">
                            {article.summary}
                        </p>

                        <div className="flex items-center justify-between py-8 border-y border-border-card">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full bg-surface-2 overflow-hidden grayscale">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Koro" alt="Author" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-foreground">{article.source || "Koro Editorial Board"}</p>
                                    <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                                        {article.published_at ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true }) : ''}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button className="p-2 text-muted-foreground hover:text-primary transition-colors"><Twitter className="w-4 h-4" /></button>
                                <button className="p-2 text-muted-foreground hover:text-primary transition-colors"><Linkedin className="w-4 h-4" /></button>
                                <button className="p-2 text-muted-foreground hover:text-primary transition-colors"><Facebook className="w-4 h-4" /></button>
                            </div>
                        </div>
                    </header>

                    {article.image_url && (
                        <div className="aspect-[21/9] overflow-hidden rounded-md mb-12 grayscale">
                            <img
                                src={article.image_url}
                                alt={article.title}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    )}

                    <div className="prose prose-invert prose-green max-w-none space-y-6 text-muted-foreground text-lg leading-relaxed font-sans whitespace-pre-wrap">
                        {article.content ? (
                            article.content
                        ) : isExternal ? (
                            <div className="p-8 border border-border-card rounded-md bg-surface text-center">
                                <p className="mb-4">This is an external news story.</p>
                                <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block bg-primary text-background font-bold px-6 py-3 rounded-sm uppercase tracking-widest text-xs hover:bg-primary/90 transition-colors"
                                >
                                    Read Full Article on {article.source}
                                </a>
                            </div>
                        ) : (
                            <p className="italic opacity-50">No full content provided.</p>
                        )}
                    </div>

                    <footer className="mt-16 pt-12 border-t border-border-card">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Tags:</span>
                                <span className="px-2 py-1 bg-surface-2 text-[10px] font-mono font-bold uppercase tracking-widest">{article.category}</span>
                            </div>
                            <button className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-widest">
                                <MessageSquare className="w-4 h-4" />
                                <span>Join the conversation</span>
                            </button>
                        </div>
                    </footer>
                </div>
            </div>
        </article>
    );
}
