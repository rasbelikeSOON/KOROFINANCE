"use client";

import React, { useState, useEffect } from "react";
import { Bell, CalendarRange, Filter, MessageSquare, Smartphone, Globe, ChevronRight, ChevronLeft, ThumbsUp } from "lucide-react";

const FEATURES = [
    {
        id: "alerts",
        icon: <Bell className="w-5 h-5 text-primary" />,
        title: "Price Alerts",
        description: "Get notified when a stock hits your target price."
    },
    {
        id: "earnings",
        icon: <CalendarRange className="w-5 h-5 text-warning" />,
        title: "Earnings Calendar",
        description: "Track upcoming NGX company earnings reports."
    },
    {
        id: "screener",
        icon: <Filter className="w-5 h-5 text-primary" />,
        title: "AI Stock Screener",
        description: "Filter stocks by P/E ratio, volume, momentum."
    },
    {
        id: "forum",
        icon: <MessageSquare className="w-5 h-5 text-purple-500" />,
        title: "Community Forum",
        description: "Discuss trades with other Nigerian investors."
    },
    {
        id: "mobile",
        icon: <Smartphone className="w-5 h-5 text-blue-500" />,
        title: "Mobile App",
        description: "iOS and Android native apps coming soon."
    },
    {
        id: "panafrica",
        icon: <Globe className="w-5 h-5 text-emerald-500" />,
        title: "Pan-Africa Expansion",
        description: "JSE, GSE, NSE (Kenya) markets integrations."
    }
];

export default function RoadmapBanner() {
    const [upvotes, setUpvotes] = useState<Record<string, number>>({});
    const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
    const [isLoaded, setIsLoaded] = useState(false);

    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    // Initialize random base upvotes and load user votes
    useEffect(() => {
        const savedVotes = localStorage.getItem("korofinance_roadmap_votes");
        const parsedUserVotes = savedVotes ? JSON.parse(savedVotes) : [];
        setUserVotes(new Set(parsedUserVotes));

        // Generate consistent random base votes based on ID string length to make it look alive
        const baseVotes = FEATURES.reduce((acc, f) => {
            acc[f.id] = (f.id.length * 13) + (parsedUserVotes.includes(f.id) ? 1 : 0);
            return acc;
        }, {} as Record<string, number>);

        setUpvotes(baseVotes);
        setIsLoaded(true);
    }, []);

    const handleUpvote = (id: string) => {
        if (!isLoaded) return;

        let newVotesArray = Array.from(userVotes);
        const newUpvotes = { ...upvotes };

        if (userVotes.has(id)) {
            // Remove vote
            newVotesArray = newVotesArray.filter(v => v !== id);
            newUpvotes[id] -= 1;
        } else {
            // Add vote
            newVotesArray.push(id);
            newUpvotes[id] += 1;
        }

        setUserVotes(new Set(newVotesArray));
        setUpvotes(newUpvotes);
        localStorage.setItem("korofinance_roadmap_votes", JSON.stringify(newVotesArray));
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (!isLoaded) return null; // Prevent hydration mismatch entirely for simple banner

    return (
        <section className="py-24 bg-surface-2 border-y border-border-card overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div>
                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-sm mb-4 inline-block">
                            Product Roadmap
                        </span>
                        <h2 className="text-3xl md:text-4xl font-display font-extrabold text-foreground tracking-tight">
                            Help Shape Our Future
                        </h2>
                        <p className="text-muted-foreground mt-2 max-w-xl text-sm md:text-base">
                            Vote on the features you want to see next.
                        </p>
                    </div>

                    <div className="hidden md:flex space-x-2 mt-4 md:mt-0">
                        <button onClick={() => scroll('left')} className="p-3 bg-surface border border-border-card text-foreground rounded-sm hover:border-primary transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={() => scroll('right')} className="p-3 bg-surface border border-border-card text-foreground rounded-sm hover:border-primary transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Horizontal Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex space-x-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {FEATURES.map(feature => {
                        const hasVoted = userVotes.has(feature.id);
                        return (
                            <div
                                key={feature.id}
                                className="min-w-[280px] md:min-w-[320px] snap-start bg-background border border-border-card p-6 rounded-sm flex flex-col hover:border-primary/50 transition-colors"
                            >
                                <div className="p-3 bg-surface border border-border-card rounded-sm inline-flex w-fit mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-foreground">{feature.title}</h3>
                                <p className="text-sm text-muted-foreground mb-8 line-clamp-2 leading-relaxed">
                                    {feature.description}
                                </p>

                                <div className="mt-auto">
                                    <button
                                        onClick={() => handleUpvote(feature.id)}
                                        className={`w-full flex items-center justify-between px-4 py-3 border font-bold text-sm rounded-sm transition-all focus:outline-none ${hasVoted
                                                ? "bg-primary/10 border-primary text-primary"
                                                : "bg-surface border-border-card text-muted-foreground hover:text-foreground hover:border-muted-foreground"
                                            }`}
                                    >
                                        <span className="flex items-center">
                                            <ThumbsUp className={`w-4 h-4 mr-2 ${hasVoted ? 'fill-primary' : ''}`} />
                                            {hasVoted ? 'Upvoted' : 'Upvote'}
                                        </span>
                                        <span className={`font-mono text-xs px-2 py-0.5 rounded-sm ${hasVoted ? 'bg-background' : 'bg-background border border-border-card'}`}>
                                            {upvotes[feature.id]}
                                        </span>
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}
