import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Mail, MapPin, Building2, Users } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen flex flex-col pt-16">
            <Navbar />

            <main className="flex-grow bg-background">
                {/* Hero Section */}
                <section className="py-24 bg-surface relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 mix-blend-screen pointer-events-none" />

                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-sm mb-6 inline-block">
                            About Us
                        </span>
                        <h1 className="text-5xl md:text-7xl font-display font-extrabold text-foreground tracking-tight mb-6">
                            Money&apos;s an <span className="text-primary italic">easy thing.</span>
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                            We are building Africa&apos;s sharpest financial digest and real-time market terminal. We exist to make financial intelligence universal.
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-24 border-b border-border-card">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
                        <h2 className="text-3xl font-display font-bold text-foreground">Our Mission</h2>
                        <div className="text-lg text-muted-foreground leading-relaxed space-y-6">
                            <p>
                                At KoroFinance, we recognize that the biggest barrier to wealth in Nigeria isn&apos;t just capital—it&apos;s information. Navigating the complexities of the Nigerian Exchange (NGX), understanding the daily fluctuation of the Naira, and keeping up with the rapid pace of Fintech innovation can feel like a full-time job.
                            </p>
                            <p>
                                That&apos;s why we built KoroFinance. Our platform combines deep-dive analytical journalism with real-time data to ensure that you are never left in the dark about your money.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-24 bg-surface/30 border-b border-border-card">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-display font-bold text-foreground mb-4">The Brains Behind Koro</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Run by a dedicated team of journalists, software engineers, and financial analysts obsessed with African markets.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {[
                                { name: "Olamide O.", role: "Editor-in-Chief", img: "https://images.unsplash.com/photo-1543132220-3ec99c6094dc?q=80&w=256&h=256&fit=crop" },
                                { name: "Chike N.", role: "Lead Engineer", img: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=256&h=256&fit=crop" },
                                { name: "Aisha M.", role: "Market Analyst", img: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=256&h=256&fit=crop" }
                            ].map(member => (
                                <div key={member.name} className="bg-background border border-border-card p-6 rounded-sm text-center group hover:border-primary/50 transition-colors">
                                    <img src={member.img} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover filter grayscale group-hover:grayscale-0 transition-all duration-500" />
                                    <h3 className="text-lg font-bold text-foreground">{member.name}</h3>
                                    <p className="text-sm text-muted-foreground font-mono uppercase tracking-wider">{member.role}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className="py-24">
                    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <div className="flex flex-col items-center text-center p-8 bg-surface rounded-sm border border-border-card">
                                <Mail className="w-8 h-8 text-primary mb-4" />
                                <h3 className="font-bold mb-2">Email Us</h3>
                                <p className="text-sm text-muted-foreground mb-4">For partnerships and tips.</p>
                                <a href="mailto:hello@korofinance.com" className="text-sm font-mono text-foreground hover:text-primary transition-colors">hello@korofinance.com</a>
                            </div>
                            <div className="flex flex-col items-center text-center p-8 bg-surface rounded-sm border border-border-card">
                                <MapPin className="w-8 h-8 text-primary mb-4" />
                                <h3 className="font-bold mb-2">Our Office</h3>
                                <p className="text-sm text-muted-foreground mb-4">HQ</p>
                                <address className="text-sm font-mono text-foreground not-italic">Lekki Phase 1,<br />Lagos, Nigeria</address>
                            </div>
                            <div className="flex flex-col items-center text-center p-8 bg-surface rounded-sm border border-border-card">
                                <Building2 className="w-8 h-8 text-primary mb-4" />
                                <h3 className="font-bold mb-2">Advertise</h3>
                                <p className="text-sm text-muted-foreground mb-4">Reach Nigerian investors.</p>
                                <a href="mailto:ads@korofinance.com" className="text-sm font-mono text-foreground hover:text-primary transition-colors">ads@korofinance.com</a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
