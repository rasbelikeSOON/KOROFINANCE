import useSWR from "swr";
import { getLiveNews } from "@/lib/api/news";
import { formatDistanceToNow } from "date-fns";

export default function FeaturedNews() {
    const { data: news, isLoading } = useSWR("live_news", getLiveNews);

    const heroArticle = news && news.length > 0 ? news[0] : null;
    const sideArticles = news && news.length > 1 ? news.slice(1, 4) : [];

    return (
        <section className="py-24 bg-background">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-12 border-b border-border-card pb-6">
                    <div>
                        <h2 className="text-4xl font-display font-extrabold text-foreground mb-2 italic uppercase tracking-tight">
                            Latest from the Markets
                        </h2>
                        <p className="text-muted-foreground font-mono text-sm uppercase tracking-widest">
                            Money Simplified &bull; Real-time reporting
                        </p>
                    </div>
                    <Link
                        href="/news"
                        className="hidden sm:flex items-center text-primary font-bold hover:gap-2 transition-all p-2"
                    >
                        View all news <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Syncing news terminal...</p>
                    </div>
                ) : heroArticle ? (
                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Hero Article */}
                        <div className="lg:col-span-7 group cursor-pointer">
                            <a href={heroArticle.url} target="_blank" rel="noopener noreferrer">
                                <div className="relative aspect-[16/9] overflow-hidden rounded-md mb-6 grayscale hover:grayscale-0 transition-all duration-700">
                                    <img
                                        src={heroArticle.image_url}
                                        alt={heroArticle.title}
                                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 bg-primary text-background text-[10px] font-bold uppercase tracking-widest rounded-sm">
                                            {heroArticle.category}
                                        </span>
                                    </div>
                                </div>
                                <h3 className="text-3xl font-display font-bold text-foreground mb-4 group-hover:text-primary transition-colors leading-tight">
                                    {heroArticle.title}
                                </h3>
                                <p className="text-muted-foreground mb-6 line-clamp-2">
                                    {heroArticle.summary}
                                </p>
                                <div className="flex items-center text-xs font-mono text-muted-foreground space-x-4">
                                    <span className="font-bold text-foreground uppercase tracking-widest">{heroArticle.source}</span>
                                    <span className="flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {formatDistanceToNow(new Date(heroArticle.published_at), { addSuffix: true })}
                                    </span>
                                </div>
                            </a>
                        </div>

                        {/* Side Articles */}
                        <div className="lg:col-span-5 space-y-8">
                            {sideArticles.map((article: any) => (
                                <div key={article.id} className="group cursor-pointer border-b border-border-card/50 pb-8 last:border-0 last:pb-0">
                                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                                        <span className="block text-[10px] font-mono font-bold text-primary uppercase tracking-widest mb-2">
                                            {article.category}
                                        </span>
                                        <h4 className="text-xl font-display font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-3">
                                            {article.title}
                                        </h4>
                                        <span className="flex items-center text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                                            <Clock className="w-3 h-3 mr-1 opacity-50" />
                                            {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
                                        </span>
                                    </a>
                                </div>
                            ))}

                            <div className="pt-4">
                                <Link
                                    href="/news"
                                    className="flex items-center justify-center w-full py-4 border border-border-card text-foreground font-bold rounded-sm hover:bg-surface transition-all"
                                >
                                    View all stories
                                </Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border-card rounded-md">
                        <p className="text-xs font-mono text-muted-foreground uppercase opacity-50">Terminal offline. Trigger news sync to see live reporting.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
