"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Clock, Tag, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import useSWR from "swr";
import { supabase } from "@/lib/supabase";

const fetchArticle = async (slug: string) => {
    const { data, error } = await supabase
        .from("learn_articles")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error) throw error;
    return data;
};

export default function ArticlePage() {
    const { slug } = useParams();
    const router = useRouter();
    const { data: article, error, isLoading } = useSWR(slug ? `article-${slug}` : null, () => fetchArticle(slug as string));

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background p-8">
                <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
                <h1 className="text-2xl font-display font-bold text-foreground mb-2">Article Not Found</h1>
                <p className="text-muted-foreground mb-8">The module you are looking for doesn't exist yet.</p>
                <Link href="/learn" className="bg-primary text-background px-8 py-3 rounded-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-all">
                    Back to Learn
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-20 pb-24 bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Navigation */}
                <nav className="flex items-center space-x-2 text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground mb-12">
                    <Link href="/learn" className="hover:text-primary transition-colors flex items-center">
                        <ArrowLeft className="w-3 h-3 mr-2" />
                        Learn
                    </Link>
                    <ChevronRight className="w-3 h-3" />
                    <span className="text-foreground">{article.category}</span>
                </nav>

                {/* Header */}
                <header className="mb-16">
                    <div className="flex items-center space-x-4 mb-6">
                        <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest ${article.difficulty === "Beginner" ? "bg-primary/10 text-primary" :
                                article.difficulty === "Intermediate" ? "bg-warning/10 text-warning" :
                                    "bg-destructive/10 text-destructive"
                            }`}>
                            {article.difficulty}
                        </span>
                        <div className="flex items-center text-[10px] font-mono text-muted-foreground uppercase">
                            <Clock className="w-3 h-3 mr-2 text-primary" />
                            {article.read_time || "5 mins"} read
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-display font-black text-foreground uppercase tracking-tight italic leading-tight mb-8">
                        {article.title}
                    </h1>
                    <p className="text-xl text-muted-foreground font-display leading-relaxed italic border-l-4 border-primary pl-6">
                        {article.excerpt}
                    </p>
                </header>

                {/* Content */}
                <article className="prose prose-invert prose-emerald max-w-none">
                    <div className="text-muted-foreground/90 leading-relaxed space-y-8 text-lg font-display whitespace-pre-wrap">
                        {article.content}
                    </div>
                </article>

                {/* Footer Section */}
                <footer className="mt-24 pt-12 border-t border-border-card/50">
                    <div className="bg-surface p-8 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h4 className="text-lg font-display font-bold text-foreground mb-2 uppercase italic tracking-tight">Ready for the next lesson?</h4>
                            <p className="text-sm text-muted-foreground">Continue your journey to financial mastery.</p>
                        </div>
                        <Link href="/learn" className="bg-primary text-background px-8 py-3 rounded-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-all flex items-center">
                            Explore Hub <ChevronRight className="w-4 h-4 ml-2" />
                        </Link>
                    </div>
                </footer>
            </div>
        </div>
    );
}
