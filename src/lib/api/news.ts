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
    // 1. Try Supabase first (AI-generated articles from the content engine)
    try {
        const { data, error } = await supabase
            .from("news_articles")
            .select("*")
            .order("published_at", { ascending: false })
            .limit(limit);

        if (error) throw error;
        if (data && data.length > 0) return data;
    } catch (e) {
        console.error("Supabase news fetch failed, falling back to live external news");
    }

    // 2. Fallback: fetch real articles from external Nigerian news sources
    try {
        console.log("No articles in Supabase — fetching live external news...");
        const externalArticles = await fetchExternalNews();
        if (externalArticles.length > 0) {
            return externalArticles.slice(0, limit);
        }
    } catch (e) {
        console.error("External news fetch also failed:", e);
    }

    // 3. If everything fails, return empty array (UI shows empty state)
    return [];
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
