import React from "react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-[#0A0A0A] text-white border-t-[3px] border-[#5B2ECC] pt-16 pb-12">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Column 1: Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="inline-block" aria-label="Korofinance Home">
                            <div className="flex flex-col text-white font-display font-black leading-[0.85] tracking-tighter text-[20px] mr-1">
                                <span>KORO</span>
                                <span>FINA</span>
                                <span className="flex items-end">
                                    NCE
                                    <svg width="15" height="17" viewBox="0 0 12 14" fill="none" className="ml-[2px] mb-[1px]">
                                        <path d="M2 14V4L6 0L10 4V14H8V6H4V14H2Z" fill="white" />
                                    </svg>
                                </span>
                            </div>
                        </Link>
                        <p className="text-[#AAAAAA] font-sans text-[15px] italic">
                            Where money makes sense.
                        </p>
                        <p className="text-[#777777] font-sans text-[13px] pt-4">
                            Built for Africa.
                        </p>
                    </div>

                    {/* Column 2: Markets */}
                    <div>
                        <h4 className="font-display font-bold text-white text-[18px] mb-6">Markets</h4>
                        <ul className="space-y-4">
                            <li><Link href="/markets/ngx" className="font-sans text-[15px] text-[#AAAAAA] hover:text-[#5B2ECC] hover:underline underline-offset-4 transition-colors">NGX Stocks</Link></li>
                            <li><Link href="/markets/crypto" className="font-sans text-[15px] text-[#AAAAAA] hover:text-[#5B2ECC] hover:underline underline-offset-4 transition-colors">Cryptocurrency</Link></li>
                            <li><Link href="/markets/forex" className="font-sans text-[15px] text-[#AAAAAA] hover:text-[#5B2ECC] hover:underline underline-offset-4 transition-colors">Forex Rates</Link></li>
                            <li><Link href="/markets/pan-africa" className="font-sans text-[15px] text-[#AAAAAA] hover:text-[#5B2ECC] hover:underline underline-offset-4 transition-colors">Pan-Africa</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Learn */}
                    <div>
                        <h4 className="font-display font-bold text-white text-[18px] mb-6">Learn</h4>
                        <ul className="space-y-4">
                            <li><Link href="/learn" className="font-sans text-[15px] text-[#AAAAAA] hover:text-[#5B2ECC] hover:underline underline-offset-4 transition-colors">Investing 101</Link></li>
                            <li><Link href="/learn" className="font-sans text-[15px] text-[#AAAAAA] hover:text-[#5B2ECC] hover:underline underline-offset-4 transition-colors">Crypto Basics</Link></li>
                            <li><Link href="/learn" className="font-sans text-[15px] text-[#AAAAAA] hover:text-[#5B2ECC] hover:underline underline-offset-4 transition-colors">CBN Policy</Link></li>
                            <li><Link href="/learn" className="font-sans text-[15px] text-[#AAAAAA] hover:text-[#5B2ECC] hover:underline underline-offset-4 transition-colors">Macroeconomics</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Company */}
                    <div>
                        <h4 className="font-display font-bold text-white text-[18px] mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="font-sans text-[15px] text-[#AAAAAA] hover:text-[#5B2ECC] hover:underline underline-offset-4 transition-colors">About Koro</Link></li>
                            <li><Link href="/news" className="font-sans text-[15px] text-[#AAAAAA] hover:text-[#5B2ECC] hover:underline underline-offset-4 transition-colors">Blog</Link></li>
                            <li><a href="mailto:hello@korofinance.com" className="font-sans text-[15px] text-[#AAAAAA] hover:text-[#5B2ECC] hover:underline underline-offset-4 transition-colors">Contact Us</a></li>
                            <li><a href="mailto:ads@korofinance.com" className="font-sans text-[15px] text-[#AAAAAA] hover:text-[#5B2ECC] hover:underline underline-offset-4 transition-colors">Advertise</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
