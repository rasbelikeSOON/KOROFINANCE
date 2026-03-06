"use client";

import React, { useState, useEffect } from "react";
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

// NGX trading hours: 10:00 AM – 2:30 PM WAT (UTC+1), Monday–Friday
const NGX_OPEN_HOUR = 10;
const NGX_OPEN_MIN = 0;
const NGX_CLOSE_HOUR = 14;
const NGX_CLOSE_MIN = 30;

function getWATTime(): Date {
    // Get current time in WAT (UTC+1)
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + 3600000); // UTC+1
}

function getMarketStatus() {
    const wat = getWATTime();
    const day = wat.getDay(); // 0=Sun, 6=Sat
    const hours = wat.getHours();
    const minutes = wat.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    const openMinutes = NGX_OPEN_HOUR * 60 + NGX_OPEN_MIN;   // 600
    const closeMinutes = NGX_CLOSE_HOUR * 60 + NGX_CLOSE_MIN; // 870

    const isWeekday = day >= 1 && day <= 5;
    const isOpen = isWeekday && totalMinutes >= openMinutes && totalMinutes < closeMinutes;

    if (isOpen) {
        // Market is open — countdown to close
        const diff = closeMinutes - totalMinutes;
        const h = Math.floor(diff / 60);
        const m = diff % 60;
        return {
            isOpen: true,
            label: "NGX OPEN",
            countdown: h > 0 ? `Closes in ${h}h ${m}m` : `Closes in ${m}m`,
        };
    } else {
        // Market is closed — calculate time to next open
        let nextOpen = new Date(wat);

        if (isWeekday && totalMinutes < openMinutes) {
            // Today before open
            nextOpen.setHours(NGX_OPEN_HOUR, NGX_OPEN_MIN, 0, 0);
        } else {
            // After close today, or weekend — find next weekday
            let daysUntil = 1;
            let nextDay = (day + 1) % 7;
            while (nextDay === 0 || nextDay === 6) {
                daysUntil++;
                nextDay = (nextDay + 1) % 7;
            }
            nextOpen.setDate(nextOpen.getDate() + daysUntil);
            nextOpen.setHours(NGX_OPEN_HOUR, NGX_OPEN_MIN, 0, 0);
        }

        const diffMs = nextOpen.getTime() - wat.getTime();
        const diffH = Math.floor(diffMs / (1000 * 60 * 60));
        const diffM = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

        let countdown: string;
        if (diffH >= 24) {
            const days = Math.floor(diffH / 24);
            const remH = diffH % 24;
            countdown = days === 1
                ? `Opens tomorrow ${remH > 0 ? `in ${remH}h` : "at 10:00 AM"}`
                : `Opens in ${days}d ${remH}h`;
        } else {
            countdown = `Opens in ${diffH}h ${diffM}m`;
        }

        return {
            isOpen: false,
            label: "NGX CLOSED",
            countdown,
        };
    }
}

export default function MarketsSidebar() {
    const pathname = usePathname();
    const [status, setStatus] = useState(getMarketStatus());

    useEffect(() => {
        const interval = setInterval(() => {
            setStatus(getMarketStatus());
        }, 30000); // Update every 30 seconds
        return () => clearInterval(interval);
    }, []);

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
                        <div className={`w-2 h-2 rounded-full ${status.isOpen ? "bg-primary animate-pulse" : "bg-muted-foreground"}`} />
                        <span className="text-xs font-bold">{status.label}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">{status.countdown}</p>
                </div>
            </div>
        </aside>
    );
}

