import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TickerTape from "@/components/layout/TickerTape";
import MarketsSidebar from "@/components/layout/MarketsSidebar";

export default function MarketsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <TickerTape />

            <div className="flex-grow flex max-w-[1400px] mx-auto w-full">
                <MarketsSidebar />
                <main className="flex-grow p-6 lg:p-10 bg-background">
                    {children}
                </main>
            </div>

            <Footer />
        </div>
    );
}
