"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    BarChart3,
    Bitcoin,
    Coins,
    Globe2,
    LayoutDashboard,
    LineChart,
    Bookmark
} from "lucide-react";

const SIDEBAR_ITEMS = [
    { label: "Overview", href: "/markets", icon: <LayoutDashboard className="w-4 h-4" /> },
    { label: "Watchlist", href: "/markets/watchlist", icon: <Bookmark className="w-4 h-4" /> },
    { label: "NGX Stocks", href: "/markets/ngx", icon: <BarChart3 className="w-4 h-4" /> },
    { label: "Crypto", href: "/markets/crypto", icon: <Bitcoin className="w-4 h-4" /> },
    { label: "Pan-Africa", href: "/markets/pan-africa", icon: <Globe2 className="w-4 h-4" /> },
    { label: "Forex", href: "/markets/forex", icon: <LineChart className="w-4 h-4" /> },
    // { label: "Commodities", href: "/markets/commodities", icon: <Coins className="w-4 h-4" />, comingSoon: true },
];

export default function MarketsSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r border-border-card bg-surface hidden lg:flex flex-col h-[calc(100vh-64px)] sticky top-16">
            <div className="p-6">
                <h2 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-[0.2em] mb-6">
                    Market Terminal
                </h2>
                <nav className="space-y-1">
                    {SIDEBAR_ITEMS.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center justify-between px-4 py-3 rounded-sm text-sm font-medium transition-all ${pathname === item.href
                                ? "bg-primary/10 text-primary border-l-2 border-primary"
                                : "text-muted-foreground hover:text-foreground hover:bg-surface-2"
                                }`}
                        >
                            <div className="flex items-center space-x-3">
                                {item.icon}
                                <span>{item.label}</span>
                            </div>
                        </Link>
                    ))}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-border-card">
                <div className="glass p-4 rounded-md">
                    <p className="text-[10px] font-mono font-bold text-primary uppercase mb-2">Market Status</p>
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                        <span className="text-xs font-bold">NGX OPEN</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">Closes in 2h 45m</p>
                </div>
            </div>
        </aside>
    );
}
