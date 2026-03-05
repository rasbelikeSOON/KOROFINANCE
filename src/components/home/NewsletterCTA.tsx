"use client";

import React, { useState } from "react";

export default function NewsletterCTA() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "success">("idle");

    const handleSubmit = (e: React.FormEvent) => {
        // Mock beehiiv logic
        setStatus("success");
    };

    return (
        <section className="bg-[#5B2ECC] py-[80px]">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-[560px] mx-auto text-center flex flex-col items-center">

                    <h3 className="font-sans font-bold text-[11px] text-white/70 tracking-[3px] uppercase mb-4">
                        The Koro Brief
                    </h3>

                    <h2 className="font-display font-bold text-white text-[40px] leading-[1.2] mb-4">
                        Africa&apos;s sharpest financial digest.
                    </h2>

                    <p className="font-sans text-[16px] text-white/80 leading-[1.6] mb-10">
                        Weekly market insights, policy analysis, and investment ideas. No jargon. Just results.
                    </p>

                    <form
                        action="#"
                        method="POST"
                        onSubmit={handleSubmit}
                        className="flex flex-col sm:flex-row w-full mb-10"
                    >
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex-grow bg-white text-[#0A0A0A] placeholder:text-[#AAAAAA] font-sans text-[15px] px-[16px] py-[14px] rounded-t-[8px] sm:rounded-t-none sm:rounded-l-[8px] sm:rounded-r-none outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-[#0A0A0A] hover:bg-black text-white font-sans font-semibold text-[14px] px-[24px] py-[14px] rounded-b-[8px] sm:rounded-b-none sm:rounded-r-[8px] sm:rounded-l-none transition-colors border-none"
                        >
                            {status === "success" ? "Subscribed ✅" : "Subscribe"}
                        </button>
                    </form>

                    <div className="flex flex-col items-center">
                        <div className="flex -space-x-3 mb-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <img
                                    key={i}
                                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=sub${i}&backgroundColor=F4F1FF`}
                                    alt="Subscriber"
                                    className="w-10 h-10 rounded-full border-[2px] border-[#5B2ECC] bg-white relative z-10"
                                    style={{ zIndex: 10 - i }}
                                />
                            ))}
                        </div>
                        <p className="font-sans text-[13px] text-white/70">
                            +10K readers across Africa
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
