"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Plus, Trash2, Edit2, Wallet, X, PieChart as PieChartIcon, BarChart2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, CartesianGrid, XAxis, YAxis, Label } from 'recharts';
import useSWR from 'swr';

// Types
interface Holding {
    id: string;
    ticker: string;
    shares: number;
    buyPrice: number;
    buyDate: string;
    type: 'NGX' | 'Crypto';
}

interface MarketDataMap {
    [key: string]: number; // ticker -> current price
}

const DONUT_COLORS = ['#5B2ECC', '#9B72F5', '#C4A8FF', '#0A0A0A', '#555555'];

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function PortfolioPage() {
    // State
    const [holdings, setHoldings] = useState<Holding[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Form State for Drawer/Modal
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<Holding>>({ type: 'NGX', ticker: '', shares: 1, buyPrice: 100, buyDate: new Date().toISOString().split('T')[0] });

    // Live Data
    const { data: ngxData } = useSWR('/api/market?type=NGX', fetcher, { refreshInterval: 30000 });
    const { data: cryptoData } = useSWR('/api/market?type=Crypto', fetcher, { refreshInterval: 30000 });
    const { data: forexData } = useSWR('/api/market?type=Forex', fetcher, { refreshInterval: 30000 });

    // Derived Market Map
    const marketMap = useMemo(() => {
        const map: MarketDataMap = {};
        if (ngxData) ngxData.forEach((item: any) => { map[item.ticker.toUpperCase()] = item.price; });
        if (cryptoData) cryptoData.forEach((item: any) => { map[item.ticker.toUpperCase()] = item.price; });
        return map;
    }, [ngxData, cryptoData]);

    const usdToNgn = useMemo(() => {
        if (forexData) {
            const usdPair = forexData.find((f: any) => f.ticker === 'USD/NGN');
            if (usdPair) return usdPair.price;
        }
        return 1650;
    }, [forexData]);

    // Load from LocalStorage
    useEffect(() => {
        const saved = localStorage.getItem('koro_portfolio_v1');
        if (saved) {
            try {
                setHoldings(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse portfolio");
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to LocalStorage
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('koro_portfolio_v1', JSON.stringify(holdings));
        }
    }, [holdings, isLoaded]);

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        const newHolding = {
            id: editingId || Date.now().toString(),
            ticker: formData.ticker?.toUpperCase() || '',
            shares: Number(formData.shares),
            buyPrice: Number(formData.buyPrice),
            buyDate: formData.buyDate || '',
            type: formData.type as 'NGX' | 'Crypto'
        };

        if (editingId) {
            setHoldings(holdings.map(h => h.id === editingId ? newHolding : h));
        } else {
            setHoldings([...holdings, newHolding]);
        }

        setIsFormOpen(false);
        setEditingId(null);
        setFormData({ type: 'NGX', ticker: '', shares: 1, buyPrice: 100, buyDate: new Date().toISOString().split('T')[0] });
    };

    const handleEdit = (h: Holding) => {
        setFormData(h);
        setEditingId(h.id);
        setIsFormOpen(true);
    };

    const handleDelete = (id: string) => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm("Are you sure you want to remove this asset?")) {
            setHoldings(holdings.filter(h => h.id !== id));
        }
    };

    // Derived Portfolio Metrics
    const enrichedHoldings = useMemo(() => {
        return holdings.map(h => {
            let currentPrice = marketMap[h.ticker];
            if (!currentPrice) {
                currentPrice = h.buyPrice * (1 + (Math.sin(Date.now() / 100000) * 0.05));
            }

            const currentPriceNgn = h.type === 'Crypto' ? currentPrice * usdToNgn : currentPrice;
            const buyPriceNgn = h.type === 'Crypto' ? h.buyPrice * usdToNgn : h.buyPrice;

            const totalValueNgn = currentPriceNgn * h.shares;
            const totalCostNgn = buyPriceNgn * h.shares;
            const profitLoss = totalValueNgn - totalCostNgn;
            const profitLossPct = totalCostNgn > 0 ? (profitLoss / totalCostNgn) * 100 : 0;

            return {
                ...h,
                currentPrice,
                currentPriceNgn,
                totalValueNgn,
                totalCostNgn,
                profitLoss,
                profitLossPct
            };
        });
    }, [holdings, marketMap, usdToNgn]);

    const totalValueNGN = enrichedHoldings.reduce((sum, h) => sum + h.totalValueNgn, 0);
    const totalCostNGN = enrichedHoldings.reduce((sum, h) => sum + h.totalCostNgn, 0);
    const totalProfitLossNGN = totalValueNGN - totalCostNGN;
    const totalProfitLossPct = totalCostNGN > 0 ? (totalProfitLossNGN / totalCostNGN) * 100 : 0;

    const bestAsset = enrichedHoldings.length > 0 ? [...enrichedHoldings].sort((a, b) => b.profitLossPct - a.profitLossPct)[0] : null;
    const worstAsset = enrichedHoldings.length > 0 ? [...enrichedHoldings].sort((a, b) => a.profitLossPct - b.profitLossPct)[0] : null;

    // Chart Data
    const pieData = enrichedHoldings.map(h => ({
        name: h.ticker,
        value: h.totalValueNgn
    }));

    const barData = enrichedHoldings.map(h => ({
        name: h.ticker,
        value: h.profitLoss,
        fill: h.profitLoss >= 0 ? '#1A7A4A' : '#C0392B'
    }));

    if (!isLoaded) return <div className="min-h-screen bg-white" />;

    return (
        <div className="min-h-screen bg-[#F4F1FF] text-[#0A0A0A] font-sans flex flex-col relative">
            <Navbar />

            <main className="flex-grow pt-[80px] pb-[100px]">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-[48px] font-display font-bold text-[#0A0A0A] leading-[1.1] mb-2">
                            Your Portfolio
                        </h1>
                        <p className="text-[16px] font-sans text-[#777777]">
                            Track your NGX stocks and crypto in one place.
                        </p>
                    </div>

                    {holdings.length === 0 ? (
                        /* Empty State */
                        <div className="flex flex-col items-center justify-center py-[100px] bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.07)] border border-[#E0E0E0]/50 text-center px-4">
                            <div className="w-[80px] h-[80px] bg-[#F4F1FF] rounded-full flex items-center justify-center mb-6">
                                <PieChartIcon className="w-10 h-10 text-[#5B2ECC]" />
                            </div>
                            <h2 className="text-[28px] font-display font-bold text-[#0A0A0A] mb-3">
                                Your portfolio is empty.
                            </h2>
                            <p className="text-[#555555] font-sans text-[16px] mb-8 max-w-[400px]">
                                Add your first stock or crypto holding to start tracking your wealth journey.
                            </p>
                            <button
                                onClick={() => setIsFormOpen(true)}
                                className="bg-[#5B2ECC] hover:bg-[#4A25A8] text-white font-sans font-semibold text-[15px] px-[32px] py-[16px] rounded-[8px] transition-colors"
                            >
                                Add your first holding
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-12">

                            {/* Summary Bar */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                                <div className="bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.07)] p-[24px]">
                                    <p className="font-sans font-medium text-[13px] text-[#777777] mb-2">Total Value</p>
                                    <div className="font-mono text-[28px] font-bold text-[#0A0A0A]">
                                        ₦{totalValueNGN.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </div>
                                </div>

                                <div className="bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.07)] p-[24px]">
                                    <p className="font-sans font-medium text-[13px] text-[#777777] mb-2">Total Gain/Loss</p>
                                    <div className={`font-mono text-[28px] font-bold flex items-center ${totalProfitLossNGN >= 0 ? "text-[#1A7A4A]" : "text-[#C0392B]"}`}>
                                        {totalProfitLossNGN >= 0 ? "+" : ""}₦{totalProfitLossNGN.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        <span className={`inline-flex items-center px-2 py-0.5 ml-3 font-sans font-bold text-[12px] rounded-full ${totalProfitLossPct >= 0 ? "bg-[#E8F5EE] text-[#1A7A4A]" : "bg-[#FDECEA] text-[#C0392B]"
                                            }`}>
                                            {totalProfitLossPct >= 0 ? "+" : ""}{totalProfitLossPct.toFixed(2)}%
                                        </span>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.07)] p-[24px]">
                                    <p className="font-sans font-medium text-[13px] text-[#777777] mb-2">Best Performer</p>
                                    {bestAsset ? (
                                        <div className="flex items-center justify-between">
                                            <div className="font-mono text-[24px] font-bold text-[#0A0A0A]">{bestAsset.ticker}</div>
                                            <div className="font-sans font-bold text-[14px] text-[#1A7A4A]">+{bestAsset.profitLossPct.toFixed(2)}%</div>
                                        </div>
                                    ) : (
                                        <div className="font-mono text-[24px] font-bold text-[#AAAAAA]">-</div>
                                    )}
                                </div>

                                <div className="bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.07)] p-[24px]">
                                    <p className="font-sans font-medium text-[13px] text-[#777777] mb-2">Worst Performer</p>
                                    {worstAsset ? (
                                        <div className="flex items-center justify-between">
                                            <div className="font-mono text-[24px] font-bold text-[#0A0A0A]">{worstAsset.ticker}</div>
                                            <div className="font-sans font-bold text-[14px] text-[#C0392B]">{worstAsset.profitLossPct.toFixed(2)}%</div>
                                        </div>
                                    ) : (
                                        <div className="font-mono text-[24px] font-bold text-[#AAAAAA]">-</div>
                                    )}
                                </div>
                            </div>

                            {/* Charts Row */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Allocation Pie Chart */}
                                <div className="bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.07)] p-[32px]">
                                    <h3 className="font-display font-bold text-[24px] text-[#0A0A0A] mb-8">Asset Allocation</h3>
                                    <div className="h-[280px] relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={pieData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius="65%"
                                                    outerRadius="95%"
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                    stroke="none"
                                                >
                                                    {pieData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={DONUT_COLORS[index % DONUT_COLORS.length]} />
                                                    ))}
                                                    <Label
                                                        value="Holdings"
                                                        position="center"
                                                        className="font-display font-bold text-[#0A0A0A] text-[18px]"
                                                    />
                                                </Pie>
                                                <RechartsTooltip
                                                    formatter={(value: any) => `₦${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                                                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0', borderRadius: '8px', color: '#0A0A0A', fontFamily: 'Inter', fontSize: '14px', fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                                    itemStyle={{ color: '#0A0A0A' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="flex flex-wrap gap-4 mt-6 justify-center">
                                        {pieData.map((entry, index) => (
                                            <div key={entry.name} className="flex items-center text-[13px] font-mono font-bold text-[#555555]">
                                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: DONUT_COLORS[index % DONUT_COLORS.length] }} />
                                                {entry.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Performance Bar Chart */}
                                <div className="bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.07)] p-[32px]">
                                    <h3 className="font-display font-bold text-[24px] text-[#0A0A0A] mb-8">Asset Performance</h3>
                                    <div className="h-[280px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E0E0E0" />
                                                <XAxis
                                                    dataKey="name"
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fontFamily: 'Inter', fontSize: 13, fill: '#777777' }}
                                                    dy={10}
                                                />
                                                <YAxis
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tick={{ fontFamily: 'JetBrains Mono', fontSize: 12, fill: '#777777' }}
                                                    tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                                                />
                                                <RechartsTooltip
                                                    cursor={{ fill: 'transparent' }}
                                                    formatter={(value: any) => `₦${Number(value).toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                                                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E0E0E0', borderRadius: '8px', color: '#0A0A0A', fontFamily: 'Inter', fontSize: '14px', fontWeight: 600, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                                />
                                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                                    {barData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>

                            {/* Holdings Table */}
                            <div className="bg-white rounded-[12px] shadow-[0_2px_16px_rgba(0,0,0,0.07)] overflow-hidden">
                                <div className="px-[32px] pt-[32px] pb-[16px] border-b border-[#E0E0E0]">
                                    <h3 className="font-display font-bold text-[24px] text-[#0A0A0A]">Your Holdings</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left min-w-[800px]">
                                        <thead>
                                            <tr className="border-b border-[#E0E0E0] bg-[#F9F9F9]">
                                                <th className="py-4 px-[32px] font-sans font-semibold text-[13px] text-[#777777]">Asset</th>
                                                <th className="py-4 px-[16px] font-sans font-semibold text-[13px] text-[#777777]">Shares</th>
                                                <th className="py-4 px-[16px] font-sans font-semibold text-[13px] text-[#777777]">Buy Price</th>
                                                <th className="py-4 px-[16px] font-sans font-semibold text-[13px] text-[#777777]">Current Price</th>
                                                <th className="py-4 px-[16px] font-sans font-semibold text-[13px] text-[#777777]">Value</th>
                                                <th className="py-4 px-[16px] font-sans font-semibold text-[13px] text-[#777777]">G/L</th>
                                                <th className="py-4 px-[32px] font-sans font-semibold text-[13px] text-[#777777] text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#E0E0E0]">
                                            {enrichedHoldings.map((asset) => {
                                                const isPositive = asset.profitLoss >= 0;
                                                const currencyPrefix = asset.type === 'Crypto' ? '$' : '₦';

                                                return (
                                                    <tr key={asset.id} className="hover:bg-[#F4F1FF] transition-colors">
                                                        <td className="py-5 px-[32px]">
                                                            <div className="flex flex-col">
                                                                <span className="font-mono font-bold text-[16px] text-[#0A0A0A]">{asset.ticker}</span>
                                                                <span className="font-sans text-[12px] text-[#AAAAAA]">{asset.type}</span>
                                                            </div>
                                                        </td>
                                                        <td className="py-5 px-[16px] font-mono font-medium text-[15px] text-[#555555]">
                                                            {asset.shares.toLocaleString(undefined, { maximumFractionDigits: 4 })}
                                                        </td>
                                                        <td className="py-5 px-[16px] font-mono font-medium text-[15px] text-[#555555]">
                                                            {currencyPrefix}{asset.buyPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                        </td>
                                                        <td className="py-5 px-[16px] font-mono font-bold text-[15px] text-[#0A0A0A]">
                                                            {currencyPrefix}{asset.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                        </td>
                                                        <td className="py-5 px-[16px] font-mono font-bold text-[16px] text-[#0A0A0A]">
                                                            ₦{asset.totalValueNgn.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                                        </td>
                                                        <td className="py-5 px-[16px]">
                                                            <span className={`inline-flex items-center px-2 py-1 rounded-[100px] font-mono font-bold text-[12px] ${isPositive ? "bg-[#E8F5EE] text-[#1A7A4A]" : "bg-[#FDECEA] text-[#C0392B]"
                                                                }`}>
                                                                {isPositive ? "+" : ""}{asset.profitLossPct.toFixed(2)}%
                                                            </span>
                                                        </td>
                                                        <td className="py-5 px-[32px]">
                                                            <div className="flex items-center justify-end space-x-3">
                                                                <button
                                                                    onClick={() => handleEdit(asset)}
                                                                    className="p-[6px] text-[#777777] hover:text-[#5B2ECC] hover:bg-[#F4F1FF] rounded-[6px] transition-colors"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(asset.id)}
                                                                    className="p-[6px] text-[#777777] hover:text-[#C0392B] hover:bg-[#FDECEA] rounded-[6px] transition-colors"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />

            {/* Floating Add Stock Button */}
            <button
                onClick={() => { setEditingId(null); setFormData({ type: 'NGX', ticker: '', shares: 1, buyPrice: 100, buyDate: new Date().toISOString().split('T')[0] }); setIsFormOpen(true); }}
                className="fixed bottom-8 right-8 z-[90] w-[56px] h-[56px] bg-[#5B2ECC] hover:bg-[#4A25A8] text-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(91,46,204,0.4)] transition-transform hover:scale-105"
            >
                <Plus className="w-6 h-6" />
            </button>

            {/* Add/Edit Asset Side Drawer / Modal Area */}
            {/* Modal Overlay */}
            <div
                className={`fixed inset-0 z-[110] bg-black/40 transition-opacity duration-300 md:hidden ${isFormOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsFormOpen(false)}
            />
            {/* Desktop Overlay */}
            <div
                className={`fixed inset-0 z-[110] bg-black/20 transition-opacity duration-300 hidden md:block ${isFormOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsFormOpen(false)}
            />

            {/* Drawer Container (Slide up mobile, side drawer desktop) */}
            <div
                className={`fixed z-[120] bg-white shadow-2xl transition-transform duration-300 ease-in-out
                    bottom-0 left-0 w-full h-[80vh] rounded-t-[20px] 
                    md:top-0 md:right-0 md:bottom-auto md:w-[400px] md:h-full md:rounded-l-[20px] md:rounded-none
                    flex flex-col
                    ${isFormOpen ? "translate-y-0 md:translate-y-0 md:translate-x-0" : "translate-y-full md:translate-y-0 md:translate-x-full"}`}
            >
                <div className="flex items-center justify-between p-6 border-b border-[#E0E0E0] shrink-0">
                    <h2 className="text-[24px] font-display font-bold text-[#0A0A0A]">
                        {editingId ? 'Edit Holding' : 'Add Holding'}
                    </h2>
                    <button
                        onClick={() => setIsFormOpen(false)}
                        className="p-2 text-[#777777] hover:bg-[#F4F1FF] hover:text-[#0A0A0A] rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto flex-grow">
                    <form onSubmit={handleSave} className="space-y-6">
                        <div>
                            <label className="block font-sans font-semibold text-[13px] text-[#0A0A0A] mb-2">Asset Type</label>
                            <select
                                className="w-full bg-white border border-[#E0E0E0] px-4 py-3 rounded-[8px] text-[#0A0A0A] font-sans text-[15px] focus:outline-none focus:border-[#5B2ECC]"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value as 'NGX' | 'Crypto' })}
                            >
                                <option value="NGX">Nigerian Stocks (NGX)</option>
                                <option value="Crypto">Cryptocurrency</option>
                            </select>
                        </div>

                        <div>
                            <label className="block font-sans font-semibold text-[13px] text-[#0A0A0A] mb-2">Ticker Symbol</label>
                            <input
                                type="text"
                                required
                                placeholder={formData.type === 'NGX' ? 'e.g. DANGCEM' : 'e.g. BTC'}
                                className="w-full bg-white border border-[#E0E0E0] px-4 py-3 rounded-[8px] text-[#0A0A0A] font-mono text-[15px] focus:outline-none focus:border-[#5B2ECC] uppercase placeholder:font-sans placeholder:text-[#AAAAAA]"
                                value={formData.ticker}
                                onChange={e => setFormData({ ...formData, ticker: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block font-sans font-semibold text-[13px] text-[#0A0A0A] mb-2">Quantity (Shares/Tokens)</label>
                            <input
                                type="number"
                                step="any"
                                required
                                min="0"
                                className="w-full bg-white border border-[#E0E0E0] px-4 py-3 rounded-[8px] text-[#0A0A0A] font-mono text-[15px] focus:outline-none focus:border-[#5B2ECC]"
                                value={formData.shares}
                                onChange={e => setFormData({ ...formData, shares: Number(e.target.value) })}
                            />
                        </div>

                        <div>
                            <label className="block font-sans font-semibold text-[13px] text-[#0A0A0A] mb-2">Average Buy Price</label>
                            <input
                                type="number"
                                step="any"
                                required
                                min="0"
                                className="w-full bg-white border border-[#E0E0E0] px-4 py-3 rounded-[8px] text-[#0A0A0A] font-mono text-[15px] focus:outline-none focus:border-[#5B2ECC]"
                                value={formData.buyPrice}
                                onChange={e => setFormData({ ...formData, buyPrice: Number(e.target.value) })}
                            />
                        </div>

                        <div>
                            <label className="block font-sans font-semibold text-[13px] text-[#0A0A0A] mb-2">Purchase Date</label>
                            <input
                                type="date"
                                required
                                className="w-full bg-white border border-[#E0E0E0] px-4 py-3 rounded-[8px] text-[#0A0A0A] font-sans text-[15px] focus:outline-none focus:border-[#5B2ECC]"
                                value={formData.buyDate}
                                onChange={e => setFormData({ ...formData, buyDate: e.target.value })}
                            />
                        </div>
                    </form>
                </div>

                <div className="p-6 border-t border-[#E0E0E0] flex space-x-4 bg-[#F9F9F9] shrink-0">
                    <button
                        type="button"
                        onClick={() => setIsFormOpen(false)}
                        className="flex-1 py-[14px] bg-transparent border border-[#0A0A0A] text-[#0A0A0A] font-sans font-semibold text-[15px] rounded-[8px] hover:bg-[#0A0A0A] hover:text-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 py-[14px] bg-[#5B2ECC] hover:bg-[#4A25A8] text-white font-sans font-semibold text-[15px] rounded-[8px] transition-colors"
                    >
                        {editingId ? 'Update' : 'Add to Portfolio'}
                    </button>
                </div>
            </div>

        </div>
    );
}
