import React from "react";

export default function MissionSection() {
    return (
        <section className="bg-[#F4F1FF] py-[80px]">
            <div className="max-w-[720px] mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
                <span className="font-display font-bold text-[#5B2ECC] text-[80px] leading-none mb-[-20px] p-0 font-serif">
                    &ldquo;
                </span>
                <h2 className="font-display italic text-[#0A0A0A] text-[24px] md:text-[28px] leading-[1.7] font-medium">
                    At Koro, we believe money shouldn&apos;t be confusing. We&apos;re building a community where finance feels less intimidating and more empowering — because money works best when it works for you.
                </h2>
            </div>
        </section>
    );
}
