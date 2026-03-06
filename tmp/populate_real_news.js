// Script to:
// 1. Delete ALL old articles from Supabase (including [MOCK] ones)
// 2. Fetch real external news from Nigerian sources
// 3. Insert them into Supabase news_articles table

const supabaseUrl = "https://cwayxilaylnchjhntxvg.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3YXl4aWxheWxuY2hqaG50eHZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1NDkxMDYsImV4cCI6MjA4ODEyNTEwNn0.MLVefYNZ6LWfUIbsEYTucMDQsdoKW1zsxgwM6xNNsPQ";

const SOURCES = [
    {
        name: "Nairametrics",
        api: "https://nairametrics.com/wp-json/wp/v2/posts?_embed&per_page=10&categories=3,311837,302423,319514,330528",
        category: "Markets"
    },
    {
        name: "BusinessDay",
        api: "https://businessday.ng/wp-json/wp/v2/posts?_embed&per_page=10&categories=1023,1046,1045,1332,261923,1007",
        category: "Economy"
    },
    {
        name: "TechCabal",
        api: "https://techcabal.com/wp-json/wp/v2/posts?_embed&per_page=10",
        category: "Startups & Fintech"
    },
    {
        name: "Punch",
        api: "https://punchng.com/wp-json/wp/v2/posts?_embed&per_page=10&categories=3",
        category: "Business"
    },
    {
        name: "TheCable",
        api: "https://www.thecable.ng/wp-json/wp/v2/posts?_embed&per_page=10",
        category: "CBN & Policy"
    }
];

const EXCLUDED = [
    "football", "soccer", "match", "goal", "league", "sports", "tournament",
    "fifa", "caf", "nff", "super eagles", "chelsea", "arsenal", "manchester",
    "liverpool", "real madrid", "barcelona", "sport", "epl", "premier league",
    "movie", "nollywood", "hollywood", "music", "song", "album", "concert",
    "big brother", "bbnaija", "celebrity", "gossip", "entertainment", "pastor",
    "church", "mosque", "sermon", "prayer", "wedding", "divorce", "reality tv"
];

const INCLUDED = [
    "finance", "fintech", "market", "economy", "bank", "naira", "cbn",
    "stock", "share", "investment", "investor", "crypto", "bitcoin", "ethereum",
    "blockchain", "policy", "government", "revenue", "tax", "gdp", "inflation",
    "fx", "forex", "exchange rate", "startup", "funding", "capital", "trade",
    "export", "import", "debt", "subsidy", "bonds", "treasury", "dividend",
    "earnings", "profit", "loss", "infrastructure", "telecom", "energy", "oil",
    "gas", "dangote", "bua", "mtn", "airtel", "seplat", "ngx", "sec",
    "pension", "insurance", "budget", "fiscal", "monetary", "interest rate",
    "recapitalisation", "ipo", "acquisition", "merger", "regulation",
    "payment", "remittance", "digital bank", "neobank", "lending", "credit"
];

function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
        .slice(0, 80);
}

async function main() {
    // STEP 1: Delete ALL old articles
    console.log("Step 1: Deleting ALL old articles from Supabase...");

    const deleteRes = await fetch(`${supabaseUrl}/rest/v1/news_articles?id=not.is.null`, {
        method: 'DELETE',
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        }
    });

    if (deleteRes.ok) {
        const deleted = await deleteRes.json();
        console.log(`   Deleted ${deleted.length} old articles.`);
    } else {
        console.error("   Delete failed:", await deleteRes.text());
    }

    // STEP 2: Fetch real external news
    console.log("\nStep 2: Fetching real news from Nigerian sources...");
    const allArticles = [];
    const seenSlugs = new Set();

    for (const source of SOURCES) {
        try {
            console.log(`   Fetching from ${source.name}...`);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);

            const response = await fetch(source.api, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) {
                console.error(`   ${source.name} returned ${response.status}`);
                continue;
            }

            const posts = await response.json();
            console.log(`   Got ${posts.length} posts from ${source.name}`);

            for (const post of posts) {
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

                const isIrrelevant = EXCLUDED.some(kw =>
                    title.toLowerCase().includes(kw) || summary.toLowerCase().includes(kw)
                );
                const isRelevant = INCLUDED.some(kw =>
                    title.toLowerCase().includes(kw) || summary.toLowerCase().includes(kw)
                );

                if (isIrrelevant || !isRelevant) continue;

                let slug = generateSlug(title);
                if (seenSlugs.has(slug)) {
                    slug += `-${Date.now().toString(36).slice(-4)}`;
                }
                seenSlugs.add(slug);

                allArticles.push({
                    title,
                    summary,
                    content: fullContent,
                    url: `/news/${slug}`,
                    slug,
                    image_url: imageUrl,
                    source: source.name,
                    category: source.category,
                    tag_colour: "#5B2ECC",
                    read_time: 4,
                    is_generated: false,
                    is_breaking: false,
                    published_at: post.date_gmt + "Z",
                    created_at: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error(`   Failed to fetch from ${source.name}:`, error.message);
        }
    }

    console.log(`\n   Total real articles collected: ${allArticles.length}`);

    if (allArticles.length === 0) {
        console.log("No articles fetched. Exiting.");
        return;
    }

    // STEP 3: Insert into Supabase
    console.log("\nStep 3: Inserting real articles into Supabase...");

    // Insert in batches of 10
    for (let i = 0; i < allArticles.length; i += 10) {
        const batch = allArticles.slice(i, i + 10);
        const insertRes = await fetch(`${supabaseUrl}/rest/v1/news_articles`, {
            method: 'POST',
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=minimal'
            },
            body: JSON.stringify(batch)
        });

        if (insertRes.ok) {
            console.log(`   Inserted batch ${Math.floor(i / 10) + 1} (${batch.length} articles)`);
        } else {
            const err = await insertRes.text();
            console.error(`   Batch ${Math.floor(i / 10) + 1} failed:`, err);
        }
    }

    console.log(`\nDone! ${allArticles.length} real articles now in Supabase.`);
    console.log("Article titles:");
    allArticles.forEach((a, i) => console.log(`  ${i + 1}. [${a.category}] ${a.title}`));
}

main();
