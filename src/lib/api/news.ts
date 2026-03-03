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
        api: "https://nairametrics.com/wp-json/wp/v2/posts?_embed&per_page=5",
        category: "Investing"
    },
    {
        name: "BusinessDay",
        api: "https://businessday.ng/wp-json/wp/v2/posts?_embed&per_page=5",
        category: "Economy"
    }
];

export async function fetchExternalNews() {
    const allArticles: NewsArticle[] = [];

    for (const source of SOURCES) {
        try {
            const response = await fetch(source.api);
            const posts = await response.json();

            for (const post of posts) {
                // Extract image from embedded data
                const imageUrl = post._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                    "https://images.unsplash.com/photo-1611974714652-17852e91dac7?q=80&w=2070&auto=format&fit=crop";

                allArticles.push({
                    title: post.title.rendered.replace(/&#8217;/g, "'").replace(/&#8211;/g, "-"),
                    summary: post.excerpt.rendered.replace(/<[^>]*>?/gm, '').slice(0, 200) + "...",
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
