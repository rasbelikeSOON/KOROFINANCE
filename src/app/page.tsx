import Navbar from "@/components/layout/Navbar";
import TickerTape from "@/components/layout/TickerTape";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import MissionSection from "@/components/home/MissionSection";
import CorePillars from "@/components/home/CorePillars";
import FeaturedNews from "@/components/home/FeaturedNews";
import TopMovers from "@/components/home/TopMovers";
import LearnTeaser from "@/components/home/LearnTeaser";
import NewsletterCTA from "@/components/home/NewsletterCTA";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Navbar />
      <TickerTape />

      <Hero />
      <MissionSection />
      <CorePillars />
      <FeaturedNews />
      <TopMovers />
      <LearnTeaser />
      <NewsletterCTA />

      <Footer />
    </main>
  );
}
