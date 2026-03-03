"use client";

import React from "react";
import { TrendingUp, TrendingDown, Search, Filter, ArrowUpDown } from "lucide-react";

interface Stock {
    id: string;
    ticker: string;
    name: string;
    sector: string;
    price: string;
    change: string;
    signal: "BUY" | "SELL" | "HOLD";
    volume: string;
    mktCap: string;
    isPositive: boolean;
}

const MOCK_STOCKS: Stock[] = [
    { id: "1", ticker: "DANGCEM", name: "Dangote Cement", sector: "Industrial", price: "₦632.50", change: "+4.2%", signal: "BUY", volume: "12.4M", mktCap: "₦10.8T", isPositive: true },
    { id: "2", ticker: "MTNN", name: "MTN Nigeria", sector: "Telecom", price: "₦245.00", change: "+3.1%", signal: "BUY", volume: "8.2M", mktCap: "₦5.1T", isPositive: true },
    { id: "3", ticker: "ZENITHBANK", name: "Zenith Bank", sector: "Banking", price: "₦38.40", change: "-0.5%", signal: "HOLD", volume: "45.1M", mktCap: "₦1.2T", isPositive: false },
    { id: "4", ticker: "AIRTELAFRI", name: "Airtel Africa", sector: "Telecom", price: "₦2,200.0", change: "0.0%", signal: "HOLD", volume: "1.2M", mktCap: "₦8.2T", isPositive: true },
    { id: "5", ticker: "GTCO", name: "GTCO Holdings", sector: "Banking", price: "₦42.15", change: "+1.2%", signal: "HOLD", volume: "18.3M", mktCap: "₦1.3T", isPositive: true },
    { id: "6", ticker: "BUACEMENT", name: "BUA Cement", sector: "Industrial", price: "₦140.00", change: "-2.4%", signal: "SELL", volume: "5.6M", mktCap: "₦4.7T", isPositive: false },
    { id: "7", ticker: "NESTLE", name: "Nestle Nigeria", sector: "Consumer", price: "₦900.00", change: "-1.5%", signal: "SELL", volume: "0.8M", mktCap: "₦0.7T", isPositive: false },
    { id: "8", ticker: "SEPLAT", name: "Seplat Energy", sector: "Oil & Gas", price: "₦3,100.0", change: "+5.6%", signal: "BUY", volume: "2.1M", mktCap: "₦1.8T", isPositive: true },
];

export default function StockTable() {
    return (
        <div className="space-y-6">
            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 justify-between">
                <div className="relative flex-grow max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search by ticker or company..."
                        className="w-full bg-surface border border-border-card pl-10 pr-4 py-2 rounded-sm text-sm focus:outline-none focus:border-primary transition-colors"
                    />
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center space-x-2 bg-surface border border-border-card px-4 py-2 rounded-sm text-xs font-bold hover:bg-surface-2 transition-colors">
                        <Filter className="w-3 h-3" />
                        <span>Sector</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-surface border border-border-card px-4 py-2 rounded-sm text-xs font-bold hover:bg-surface-2 transition-colors">
                        <ArrowUpDown className="w-3 h-3" />
                        <span>Sort by Price</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-border-card text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest bg-surface/30">
                            <th className="py-4 px-4 whitespace-nowrap">Ticker</th>
                            <th className="py-4 px-4 whitespace-nowrap">Company</th>
                            <th className="py-4 px-4 whitespace-nowrap">Sector</th>
                            <th className="py-4 px-4 whitespace-nowrap">Price (₦)</th>
                            <th className="py-4 px-4 whitespace-nowrap text-right">Change</th>
                            <th className="py-4 px-4 whitespace-nowrap text-center">Signal</th>
                            <th className="py-4 px-4 whitespace-nowrap text-right">Volume</th>
                            <th className="py-4 px-4 whitespace-nowrap text-right">Mkt Cap</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border-card/50">
                        {MOCK_STOCKS.map((stock) => (
                            <tr
                                key={stock.id}
                                className={`group cursor-pointer transition-colors ${stock.signal === "BUY" ? "hover:bg-primary/5" :
                                        stock.signal === "SELL" ? "hover:bg-destructive/5" :
                                            "hover:bg-surface-2"
                                    }`}
                            >
                                <td className="py-5 px-4 font-mono font-bold text-foreground">{stock.ticker}</td>
                                <td className="py-5 px-4 font-bold text-foreground/80 text-sm">{stock.name}</td>
                                <td className="py-5 px-4 text-xs text-muted-foreground font-mono">{stock.sector}</td>
                                <td className="py-5 px-4 font-mono font-bold text-sm">{stock.price}</td>
                                <td className={`py-5 px-4 font-mono font-bold text-right text-sm ${stock.isPositive ? "text-primary" : stock.change === "0.0%" ? "text-muted-foreground" : "text-destructive"}`}>
                                    <span className="flex items-center justify-end">
                                        {stock.isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : stock.change === "0.0%" ? null : <TrendingDown className="w-3 h-3 mr-1" />}
                                        {stock.change}
                                    </span>
                                </td>
                                <td className="py-5 px-4 text-center">
                                    <span className={`px-2 py-1 rounded-sm text-[10px] font-bold uppercase tracking-widest ${stock.signal === "BUY" ? "bg-primary/10 text-primary border border-primary/20" :
                                            stock.signal === "SELL" ? "bg-destructive/10 text-destructive border border-destructive/20" :
                                                "bg-warning/10 text-warning border border-warning/20"
                                        }`}>
                                        {stock.signal}
                                    </span>
                                </td>
                                <td className="py-5 px-4 font-mono text-xs text-muted-foreground text-right">{stock.volume}</td>
                                <td className="py-5 px-4 font-mono text-xs text-muted-foreground text-right">{stock.mktCap}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
