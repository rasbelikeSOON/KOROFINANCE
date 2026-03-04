"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function NewArticlePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        summary: "",
        content: "",
        image_url: "",
        category: "Economy"
    });

    const categories = ["NGX", "Crypto", "Policy", "Fintech", "Economy", "Pan-Africa"];

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const urlSlug = "/news/" + generateSlug(formData.title);

            const { data, error: insertError } = await supabase
                .from("news_articles")
                .insert([
                    {
                        title: formData.title,
                        summary: formData.summary,
                        content: formData.content,
                        image_url: formData.image_url || "https://images.unsplash.com/photo-1611974714652-17852e91dac7?q=80&w=2070&auto=format&fit=crop",
                        category: formData.category,
                        url: urlSlug,
                        source: "KoroFinance",
                        published_at: new Date().toISOString()
                    }
                ]);

            if (insertError) throw insertError;

            router.push(urlSlug);
        } catch (err: any) {
            console.error("Failed to publish article:", err);
            setError(err.message || "Failed to publish article");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20 pb-24 bg-background">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-12">
                    <h1 className="text-4xl font-display font-black text-foreground uppercase tracking-tight italic mb-2">
                        Publish News
                    </h1>
                    <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
                        Internal Content Management
                    </p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6 glass p-8 rounded-md">
                    {error && (
                        <div className="p-4 bg-destructive/10 text-destructive text-sm font-bold border border-destructive/20 rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Title</label>
                        <input
                            required
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-surface border border-border-card text-foreground px-4 py-3 rounded-sm focus:outline-none focus:border-primary transition-colors text-lg font-bold"
                            placeholder="Article Headline..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Summary</label>
                        <textarea
                            required
                            value={formData.summary}
                            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                            className="w-full bg-surface border border-border-card text-foreground px-4 py-3 rounded-sm focus:outline-none focus:border-primary transition-colors resize-none h-24"
                            placeholder="Brief excerpt for the news feed..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Full Content</label>
                        <textarea
                            required
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full bg-surface border border-border-card text-foreground px-4 py-3 rounded-sm focus:outline-none focus:border-primary transition-colors min-h-[300px]"
                            placeholder="Write the full article content here. You can use markdown or plain text depending on your frontend setup..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Image URL (Optional)</label>
                            <input
                                type="url"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                className="w-full bg-surface border border-border-card text-foreground px-4 py-3 rounded-sm focus:outline-none focus:border-primary transition-colors"
                                placeholder="https://..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">Category</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-surface border border-border-card text-foreground px-4 py-3 rounded-sm focus:outline-none focus:border-primary transition-colors appearance-none font-bold uppercase text-xs tracking-wider"
                            >
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-border-card">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-4 px-4 border border-transparent rounded-sm text-sm font-bold uppercase tracking-widest text-background bg-primary hover:bg-primary/90 focus:outline-none disabled:opacity-50 transition-colors"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish Article"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
