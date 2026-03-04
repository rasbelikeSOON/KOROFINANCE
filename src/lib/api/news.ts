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
        name: "Nairametrics-V2",
        // Categories: 3 (Company News), 311837 (Companies), 302423 (Breaking News), 319514 (Bank Recap), 330528 (Banking)
        api: "https://nairametrics.com/wp-json/wp/v2/posts?_embed&per_page=10&categories=3,311837,302423,319514,330528",
        category: "Markets"
    },
    {
        name: "BusinessDay-V2",
        // Categories: 1023 (Economy), 1046 (Companies), 1045 (Markets), 1332 (Banking), 261923 (Fintech), 1007 (Analysis)
        api: "https://businessday.ng/wp-json/wp/v2/posts?_embed&per_page=10&categories=1023,1046,1045,1332,261923,1007",
        category: "Economy"
    }
];

const EXCLUDED_KEYWORDS = [
    "football", "soccer", "match", "goal", "league", "sports", "tournament",
    "fifa", "caf", "nff", "super eagles", "chelsea", "arsenal", "manchester",
    "liverpool", "real madrid", "barcelona", "sport", "epl", "premier league",
    "olympic", "athletics", "tenis", "basketball", "nba", "wolves", "stun"
];

export async function fetchExternalNews() {
    const allArticles: NewsArticle[] = [];

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

                const title = post.title.rendered.replace(/&#8217;/g, "'").replace(/&#8211;/g, "-");
                const summary = post.excerpt.rendered.replace(/<[^>]*>?/gm, '').slice(0, 200) + "...";

                // Filter out articles with sports keywords
                const isIrrelevant = EXCLUDED_KEYWORDS.some(keyword =>
                    title.toLowerCase().includes(keyword) ||
                    summary.toLowerCase().includes(keyword)
                );

                if (isIrrelevant) continue;

                allArticles.push({
                    title,
                    summary,
                    url: post.link,
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
    const { data, error } = await supabase
        .from("news_articles")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(limit);

    if (error) throw error;
    return data || [];
}
