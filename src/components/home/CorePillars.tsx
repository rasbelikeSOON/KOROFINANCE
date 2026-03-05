import React from "react";
import { BarChart2, FileText, BookOpen, Zap } from "lucide-react";

const PILLARS = [
    {
        icon: BarChart2,
        title: "Daily Market Reports",
        description: "The biggest NGX and crypto movers, summarised every morning.",
    },
    {
        icon: FileText,
        title: "Policy Breakdowns",
        description: "CBN decisions and fiscal policy explained without the jargon.",
    },
    {
        icon: BookOpen,
        title: "Investment Education",
        description: "Step-by-step guides for anyone starting their wealth journey.",
    },
    {
        icon: Zap,
        title: "Fintech Innovation",
        description: "Startups, digital banking, and the future of African money.",
    },
];

export default function CorePillars() {
    return (
        <section className="bg-white py-[80px]">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h3 className="font-sans font-bold text-[11px] text-[#5B2ECC] tracking-[3px] uppercase mb-4">
                        What We Do
                    </h3>
                    <h2 className="font-display font-bold text-[#0A0A0A] text-[40px] leading-[1.2]">
                        Four pillars. One mission.
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {PILLARS.map((pillar, idx) => {
                        const Icon = pillar.icon;
                        return (
                            <div key={idx} className="bg-white rounded-[12px] p-6 shadow-[0_2px_16px_rgba(0,0,0,0.07)] border border-[#E0E0E0]/50 transition-transform duration-300 hover:-translate-y-1">
                                <div className="w-[40px] h-[40px] rounded-full bg-[#F4F1FF] flex items-center justify-center mb-6">
                                    <Icon className="w-6 h-6 text-[#5B2ECC]" />
                                </div>
                                <h4 className="font-sans font-semibold text-[17px] text-[#0A0A0A] mb-3">
                                    {pillar.title}
                                </h4>
                                <p className="font-sans text-[14px] text-[#555555] leading-[1.6]">
                                    {pillar.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
