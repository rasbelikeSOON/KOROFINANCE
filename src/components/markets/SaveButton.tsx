"use client";

import React, { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import useSWR from "swr";

export default function SaveButton({
  ticker,
  market,
}: {
  ticker: string;
  market: string;
}) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("korofinance_watchlist");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setIsSaved(parsed.some((item: any) => item.ticker === ticker));
      } catch (e) {}
    }
  }, [ticker]);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    try {
      const stored = localStorage.getItem("korofinance_watchlist");
      let watchlist = stored ? JSON.parse(stored) : [];

      if (isSaved) {
        watchlist = watchlist.filter((item: any) => item.ticker !== ticker);
      } else {
        watchlist.push({ ticker, market });
      }

      localStorage.setItem("korofinance_watchlist", JSON.stringify(watchlist));
      setIsSaved(!isSaved);

      // Dispatch event for other components (like WatchlistPage) to update
      window.dispatchEvent(new Event("watchlist_updated"));
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
      {isSaved ? (
        <BookmarkCheck className="w-4 h-4" />
      ) : (
        <Bookmark className="w-4 h-4" />
      )}
    </button>
  );
}
