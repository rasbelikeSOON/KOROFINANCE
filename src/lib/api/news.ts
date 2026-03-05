import { supabase } from "../supabase";

export interface NewsArticle {
    id?: string;
    title: string;
    summary: string;
    url: string;
    image_url: string;
    source: string;
    category: string;
    published_at: string;
}

const SOURCES = [
    {
        name: "Nairametrics",
        // Categories: 3 (Company News), 311837 (Companies), 302423 (Breaking News), 319514 (Bank Recap), 330528 (Banking)
        api: "https://nairametrics.com/wp-json/wp/v2/posts?_embed&per_page=10&categories=3,311837,302423,319514,330528",
        category: "Markets"
    },
    {
        name: "BusinessDay",
        // Categories: 1023 (Economy), 1046 (Companies), 1045 (Markets), 1332 (Banking), 261923 (Fintech), 1007 (Analysis)
        api: "https://businessday.ng/wp-json/wp/v2/posts?_embed&per_page=10&categories=1023,1046,1045,1332,261923,1007",
        category: "Economy"
    },
    {
        name: "TechCabal",
        api: "https://techcabal.com/wp-json/wp/v2/posts?_embed&per_page=10",
        category: "Fintech"
    },
    {
        name: "Punch",
        // Business category
        api: "https://punchng.com/wp-json/wp/v2/posts?_embed&per_page=10&categories=3",
        category: "Economy"
    },
    {
        name: "Vanguard",
        // Business category
        api: "https://www.vanguardngr.com/wp-json/wp/v2/posts?_embed&per_page=10&categories=3",
        category: "Economy"
    },
    {
        name: "TheCable",
        api: "https://www.thecable.ng/wp-json/wp/v2/posts?_embed&per_page=10",
        category: "Policy"
    }
];

const EXCLUDED_KEYWORDS = [
    "football", "soccer", "match", "goal", "league", "sports", "tournament",
    "fifa", "caf", "nff", "super eagles", "chelsea", "arsenal", "manchester",
    "liverpool", "real madrid", "barcelona", "sport", "epl", "premier league",
    "olympic", "athletics", "tenis", "basketball", "nba", "wolves", "stun",
    "movie", "nollywood", "hollywood", "music", "song", "album", "concert",
    "big brother", "bbnaija", "celebrity", "gossip", "entertainment", "pastor",
    "church", "mosque", "sermon", "prayer", "wedding", "divorce", "reality tv"
];

const INCLUDED_KEYWORDS = [
    "finance", "fintech", "market", "economy", "bank", "naira", "cbn",
    "stock", "share", "investment", "investor", "crypto", "bitcoin", "ethereum",
    "blockchain", "policy", "government", "revenue", "tax", "gdp", "inflation",
    "fx", "forex", "exchange rate", "startup", "funding", "capital", "trade",
    "export", "import", "debt", "subsidy", "bonds", "treasury", "dividend",
    "earnings", "profit", "loss", "infrastructure", "telecom", "energy", "oil",
    "gas", "dangote", "bua", "mtn", "airtel", "seplat", "ngx", "sec",
    "pension", "insurance", "budget", "fiscal", "monetary", "interest rate",
    "recapitalisation", "recapitalization", "ipo", "acquisition", "merger",
    "regulation", "cbn", "fmcg", "manufacturing", "agriculture", "agritech",
    "payment", "remittance", "digital bank", "neobank", "lending", "credit"
];

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
        .slice(0, 80); // Keep slugs reasonable length
}

export async function fetchExternalNews() {
    const allArticles: NewsArticle[] = [];
    const seenSlugs = new Set<string>();

    for (const source of SOURCES) {
        try {
            console.log(`Fetching news from ${source.name}...`);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

            const response = await fetch(source.api, {
                cache: 'no-store',
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                console.error(`Status ${response.status} from ${source.name}`);
                continue;
            }

            const posts = await response.json();
            console.log(`Successfully fetched ${posts.length} posts from ${source.name}`);

            for (const post of posts) {
                // Extract image from embedded data
                const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                    "https://images.unsplash.com/photo-1611974714652-17852e91dac7?q=80&w=2070&auto=format&fit=crop";

                const title = post.title.rendered
                    .replace(/&#8217;/g, "'")
                    .replace(/&#8211;/g, "-")
                    .replace(/&#8216;/g, "'")
                    .replace(/&#8220;/g, '"')
                    .replace(/&#8221;/g, '"')
                    .replace(/&amp;/g, "&")
                    .replace(/&#8230;/g, "...")
                    .replace(/<[^>]*>?/gm, '');

                const summary = post.excerpt.rendered.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').slice(0, 200) + "...";

                // Filter out articles with sports/entertainment keywords
                const isIrrelevant = EXCLUDED_KEYWORDS.some(keyword =>
                    title.toLowerCase().includes(keyword) ||
                    summary.toLowerCase().includes(keyword)
                );

                // Require at least one finance/market keyword
                const isRelevant = INCLUDED_KEYWORDS.some(keyword =>
                    title.toLowerCase().includes(keyword) ||
                    summary.toLowerCase().includes(keyword)
                );

                if (isIrrelevant || !isRelevant) continue;

                // Generate a unique internal slug
                let slug = generateSlug(title);
                if (seenSlugs.has(slug)) {
                    slug += `-${Date.now().toString(36).slice(-4)}`;
                }
                seenSlugs.add(slug);

                // Extract full content for internal display
                const fullContent = post.content?.rendered
                    ?.replace(/<[^>]*>?/gm, '')
                    ?.replace(/&nbsp;/g, ' ')
                    ?.replace(/&#8217;/g, "'")
                    ?.replace(/&#8211;/g, "-")
                    ?.replace(/&#8216;/g, "'")
                    ?.replace(/&#8220;/g, '"')
                    ?.replace(/&#8221;/g, '"')
                    ?.replace(/&amp;/g, "&")
                    ?.trim() || null;

                allArticles.push({
                    title,
                    summary,
                    url: `/news/${slug}`,
                    image_url: imageUrl,
                    source: source.name,
                    category: source.category,
                    published_at: post.date_gmt + "Z"
                });
            }
        } catch (error) {
            console.error(`Failed to fetch from ${source.name}:`, error);
        }
    }

    return allArticles;
}

export async function getLiveNews(limit: number = 10) {
    try {
        const { data, error } = await supabase
            .from("news_articles")
            .select("*")
            .order("published_at", { ascending: false })
            .limit(limit);

        if (error) throw error;
        if (data && data.length > 0) return data;
    } catch (e) {
        console.error("Supabase news fetch failed, falling back to mock data");
    }

    // Fallback Mock Data
    return [
        {
            id: "mock-1",
            title: "CBN Retains Monetary Policy Rate at 24.75% to Curb Inflation",
            summary: "The Central Bank of Nigeria has opted to hold its benchmark interest rate steady, signaling a cautious approach to ongoing inflationary pressures in the food and energy sectors.",
            url: "/news/cbn-retains-mpr",
            image_url: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop",
            source: "Nairametrics",
            category: "Policy",
            published_at: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30 mins ago
        },
        {
            id: "mock-2",
            title: "NGX Crosses 100,000 Mark as Banking Stocks Rally",
            summary: "Lagos bourse hits an all-time high driven by aggressive buying in Tier-1 banking stocks following positive Q1 earnings guidance.",
            url: "/news/ngx-crosses-100k",
            image_url: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2070&auto=format&fit=crop",
            source: "BusinessDay",
            category: "Markets",
            published_at: new Date(Date.now() - 1000 * 60 * 120).toISOString() // 2 hours ago
        },
        {
            id: "mock-3",
            title: "Flutterwave Plans IPO on NASDAQ By 2026",
            summary: "The African payment unicorn is reportedly laying the groundwork for a public listing in the US, looking to capitalize on growing global investor interest in African tech.",
            url: "/news/flutterwave-ipo",
            image_url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop",
            source: "TechCabal",
            category: "Fintech",
            published_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() // 4 hours ago
        },
        {
            id: "mock-4",
            title: "Naira Stabilizes at Parallel Market Following FX Injections",
            summary: "The local currency found support this week as the central bank cleared the existing forward contract backlog, bringing relief to importers.",
            url: "/news/naira-fx-stability",
            image_url: "https://images.unsplash.com/photo-1621981386829-9b458a2cddde?q=80&w=2070&auto=format&fit=crop",
            source: "TheCable",
            category: "Economy",
            published_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() // 8 hours ago
        },
        {
            id: "mock-5",
            title: "Dangote Refinery Begins Supplying Aviation Fuel to Local Airlines",
            summary: "In a major milestone for energy independence, the 650,000 bpd facility has officially commenced the domestic distribution of Jet A1 fuel.",
            url: "/news/dangote-refinery-fuel",
            image_url: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?q=80&w=2070&auto=format&fit=crop",
            source: "Vanguard",
            category: "Companies",
            published_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() // 12 hours ago
        },
        {
            id: "mock-6",
            title: "Cryptocurrency Adoption in Nigeria Surges Despite Regulatory Hurdles",
            summary: "A new report shows Nigeria remains the largest crypto market in Africa, driven by youth demographics and inflation hedging strategies.",
            url: "/news/crypto-adoption-nigeria",
            image_url: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?q=80&w=2070&auto=format&fit=crop",
            source: "Punch",
            category: "Crypto",
            published_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() // 24 hours ago
        }
    ].slice(0, limit);
}

interface RawHeadline {
    title: string;
    summary: string;
    source: string;
    category: string;
    image_url: string;
}

export async function detectTrendingTopics(): Promise<{ topics: { headlines: string[]; summaries: string[]; category: string; sources: string[]; image_url: string }[] }> {
    const allHeadlines: RawHeadline[] = [];

    for (const source of SOURCES) {
        try {
            console.log(`Scanning ${source.name} for trending topics...`);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);

            const response = await fetch(source.api, {
                cache: 'no-store',
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                console.error(`Status ${response.status} from ${source.name}`);
                continue;
            }

            const posts = await response.json();

            for (const post of posts) {
                const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                    "https://images.unsplash.com/photo-1611974714652-17852e91dac7?q=80&w=2070&auto=format&fit=crop";

                const title = post.title.rendered
                    .replace(/&#8217;/g, "'").replace(/&#8211;/g, "-")
                    .replace(/&#8216;/g, "'").replace(/&#8220;/g, '"')
                    .replace(/&#8221;/g, '"').replace(/&amp;/g, "&")
                    .replace(/&#8230;/g, "...").replace(/<[^>]*>?/gm, '');

                const summary = post.excerpt.rendered.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').slice(0, 300);

                const isIrrelevant = EXCLUDED_KEYWORDS.some(kw =>
                    title.toLowerCase().includes(kw) || summary.toLowerCase().includes(kw)
                );
                const isRelevant = INCLUDED_KEYWORDS.some(kw =>
                    title.toLowerCase().includes(kw) || summary.toLowerCase().includes(kw)
                );

                if (isIrrelevant || !isRelevant) continue;

                allHeadlines.push({
                    title,
                    summary,
                    source: source.name,
                    category: source.category,
                    image_url: imageUrl
                });
            }
        } catch (error) {
            console.error(`Failed to scan ${source.name}:`, error);
        }
    }

    console.log(`Total relevant headlines found: ${allHeadlines.length}`);

    // Group similar headlines by checking keyword overlap
    const topics: { headlines: string[]; summaries: string[]; category: string; sources: string[]; image_url: string }[] = [];
    const used = new Set<number>();

    for (let i = 0; i < allHeadlines.length; i++) {
        if (used.has(i)) continue;

        const cluster = [allHeadlines[i]];
        used.add(i);

        const wordsA = allHeadlines[i].title.toLowerCase().split(/\s+/).filter(w => w.length > 3);

        for (let j = i + 1; j < allHeadlines.length; j++) {
            if (used.has(j)) continue;
            const wordsB = allHeadlines[j].title.toLowerCase().split(/\s+/).filter(w => w.length > 3);
            const overlap = wordsA.filter(w => wordsB.includes(w)).length;

            // If 2+ significant words overlap, it's the same topic
            if (overlap >= 2) {
                cluster.push(allHeadlines[j]);
                used.add(j);
            }
        }

        topics.push({
            headlines: cluster.map(c => c.title),
            summaries: cluster.map(c => c.summary),
            category: cluster[0].category,
            sources: cluster.map(c => c.source),
            image_url: cluster[0].image_url
        });
    }

    // Sort by cluster size (most covered topics first), take top 5
    topics.sort((a, b) => b.headlines.length - a.headlines.length);
    const topTopics = topics.slice(0, 5);

    console.log(`Identified ${topTopics.length} trending topics for article generation`);
    return { topics: topTopics };
}
