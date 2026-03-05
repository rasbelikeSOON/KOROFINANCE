"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
    { label: "Home", href: "/" },
    { label: "Markets", href: "/markets" },
    { label: "News", href: "/news" },
    { label: "Learn", href: "/learn" },
    { label: "Portfolio", href: "/portfolio" },
];

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isMobileMenuOpen]);

    return (
        <nav className="sticky top-0 z-[100] w-full bg-[#FFFFFF] border-b border-[#E0E0E0] h-[64px]">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex items-center justify-between h-full">
                    {/* Logo */}
                    <Link href="/" className="flex items-center shrink-0" aria-label="Korofinance Home">
                        <div className="flex flex-col text-[#0A0A0A] font-display font-black leading-[0.85] tracking-tighter text-[16px] mr-1">
                            <span>KORO</span>
                            <span>FINA</span>
                            <span className="flex items-end">
                                NCE
                                <svg width="12" height="14" viewBox="0 0 12 14" fill="none" className="ml-[2px] mb-[1px]">
                                    <path d="M2 14V4L6 0L10 4V14H8V6H4V14H2Z" fill="#0A0A0A" />
                                </svg>
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8 h-full">
                        {NAV_LINKS.map((link) => {
                            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                            return (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className={`relative flex items-center h-full text-[15px] font-medium font-sans transition-colors duration-150 ${isActive ? "text-[#5B2ECC]" : "text-[#0A0A0A] hover:text-[#5B2ECC]"
                                        }`}
                                >
                                    {link.label}
                                    {isActive && (
                                        <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#5B2ECC]" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right Section */}
                    <div className="hidden md:flex items-center shrink-0">
                        <button className="bg-[#5B2ECC] hover:bg-[#4A25A8] text-white font-sans font-semibold text-[14px] px-[20px] py-[10px] rounded-[8px] transition-colors">
                            Subscribe
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center shrink-0">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-[#0A0A0A] hover:text-[#5B2ECC] transition-colors"
                            aria-label="Toggle Menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed inset-0 z-[110] bg-black/20 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            <div
                className={`fixed top-0 right-0 z-[120] w-[80vw] max-w-[320px] h-full bg-[#FFFFFF] shadow-2xl transition-transform duration-300 ease-in-out md:hidden flex flex-col ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex items-center justify-end p-4 border-b border-[#E0E0E0] h-[64px]">
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 text-[#0A0A0A] hover:text-[#5B2ECC] transition-colors"
                        aria-label="Close Menu"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="flex flex-col py-6 px-6 space-y-6 flex-grow overflow-y-auto">
                    {NAV_LINKS.map((link) => {
                        const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                        return (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-[18px] font-medium font-sans block ${isActive ? "text-[#5B2ECC]" : "text-[#0A0A0A]"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-6 border-t border-[#E0E0E0]">
                    <button className="w-full bg-[#5B2ECC] hover:bg-[#4A25A8] text-white font-sans font-semibold text-[16px] py-[14px] rounded-[8px] transition-colors">
                        Subscribe
                    </button>
                </div>
            </div>
        </nav>
    );
}
