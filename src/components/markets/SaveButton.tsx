"use client";

import React, { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export default function SaveButton({ ticker, market }: { ticker: string, market: string }) {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => setUser(data?.user));
    }, []);

    const fetchWatchlist = async () => {
        if (!user) return false;
        const { data } = await supabase
            .from("watchlists")
            .select("id")
            .eq("user_id", user.id)
            .eq("ticker", ticker)
            .single();
        return !!data;
    };

    const { data: isSaved, mutate } = useSWR(user ? `watchlist_${ticker}` : null, fetchWatchlist);

    const toggleSave = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            router.push("/auth/login");
            return;
        }

        setLoading(true);
        try {
            if (isSaved) {
                await supabase
                    .from("watchlists")
                    .delete()
                    .eq("user_id", user.id)
                    .eq("ticker", ticker);
            } else {
                await supabase
                    .from("watchlists")
                    .insert([{ user_id: user.id, ticker, market }]);
            }
            mutate(!isSaved);
        } catch (error) {
            console.error("Error toggling watchlist:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggleSave}
            disabled={loading}
            className={`p-2 rounded-full transition-colors flex items-center justify-center ${isSaved ? "text-primary bg-primary/10 hover:bg-primary/20" : "text-muted-foreground hover:bg-surface hover:text-foreground border border-border-card"}`}
            title={isSaved ? "Remove from Watchlist" : "Save to Watchlist"}
        >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>
    );
}
