import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface TrendingTopic {
    headlines: string[];
    summaries: string[];
    category: string;
    sources: string[];
    image_url?: string;
}

export interface GeneratedArticle {
    title: string;
    summary: string;
    content: string;
    category: string;
    tag_colour: string;
    read_time: number;
    slug: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY DEFINITIONS — tag colour, structure, word count, tone
// ─────────────────────────────────────────────────────────────────────────────

export const CATEGORIES = {
    "Markets": {
        tag_colour: "#5B2ECC",
        read_time: 4,
        prompt: (context: string, marketData: string) => `
You are writing for KoroFinance — Nigeria's sharpest financial intelligence platform.
Tone: Smart but approachable. Like your most financially savvy friend over jollof rice. NOT corporate. NOT patronising.

WRITE A "MARKETS" CATEGORY ARTICLE.

CONTEXT (trending headlines + summaries):
${context}

LIVE MARKET DATA:
${marketData}

STRUCTURE (follow exactly):
[HOOK — 2 sentences. A surprising stat or tension about a stock movement.]
[THE DATA — 3–5 bullet points with specific prices and % changes from the market data above.]
[THE CONTEXT — 2 paragraphs. What is driving this move? Macro + company level.]
[THE KORO TAKE — What should a regular Nigerian investor actually do right now?]
[RELATED TICKERS — exactly 3 tickers to watch, one sentence each]

HEADLINE STYLE (pick the right energy):
✓ "GTCO just had its best week in 4 months. Here's the quiet reason why."
✓ "The naira slipped again. These 3 stocks usually benefit when that happens."

Word count: 350–500 words. Plain text, clear paragraph breaks. No markdown headers.

Respond ONLY in valid JSON:
{"title": "...", "summary": "1-2 sentence excerpt, max 200 chars", "content": "Full article body"}`
    },

    "Analysis": {
        tag_colour: "#0A0A0A",
        read_time: 3,
        prompt: (context: string, marketData: string) => `
You are writing for KoroFinance — Nigeria's sharpest financial intelligence platform.
Tone: Confident, direct, analytical. State your take clearly. Don't hedge.

WRITE AN "ANALYSIS" CATEGORY ARTICLE.

CONTEXT:
${context}

MARKET DATA:
${marketData}

STRUCTURE (follow exactly):
[BOLD OPENING STATEMENT — 1–2 sentences. State the take. Don't hedge.]
[THE EVIDENCE — exactly 3 data points that support the argument. Be specific with numbers.]
[THE COUNTER-ARGUMENT — 1 paragraph acknowledging the other side fairly.]
[THE KORO VERDICT — final, definitive take. End with a line that sticks in the reader's head.]

HEADLINE STYLE:
✓ "Everyone is panicking about Bitcoin. Here's why long-term holders should be smiling."
✓ "DANGCEM is boring. That's exactly why you should own it."

Word count: 300–400 words.

Respond ONLY in valid JSON:
{"title": "...", "summary": "1-2 sentence excerpt, max 200 chars", "content": "Full article body"}`
    },

    "Learn": {
        tag_colour: "#1A7A4A",
        read_time: 5,
        prompt: (context: string, marketData: string) => `
You are writing for KoroFinance. Audience: everyday Nigerians who want to understand finance, not experts.
Tone: Warm, clear, educational. Like a patient teacher who grew up in Lagos.

WRITE A "LEARN" CATEGORY ARTICLE.

CONTEXT (trending topic to explain):
${context}

STRUCTURE (follow exactly):
[HOOK — open with a relatable, specific Nigerian scenario. E.g. "You're at the market in Balogun and the trader just hiked prices again..."]
[THE SIMPLE EXPLANATION — break the concept into exactly 3 numbered plain-English points. Define every financial term the first time you use it.]
[THE LOCAL ANGLE — how does this specifically affect Nigerians? Name real local institutions, apps, or scenarios.]
[THE BOTTOM LINE — one short paragraph. What's the one thing to remember?]

HEADLINE STYLE:
✓ "Why does the naira keep falling even when oil prices rise?"
✓ "Your bank stock is up 12%. Should you be excited or worried?"

Word count: 450–600 words.

Respond ONLY in valid JSON:
{"title": "...", "summary": "1-2 sentence excerpt, max 200 chars", "content": "Full article body"}`
    },

    "Crypto & Web3": {
        tag_colour: "#F7931A",
        read_time: 4,
        prompt: (context: string, marketData: string) => `
You are writing for KoroFinance. Audience: Nigerians curious about crypto — from beginners to P2P traders.
Tone: Excited but honest. Never hype without balance.

WRITE A "CRYPTO & WEB3" CATEGORY ARTICLE.

CONTEXT:
${context}

CRYPTO MARKET DATA:
${marketData}

STRUCTURE (follow exactly):
[WHAT JUST HAPPENED — the specific crypto event in one plain-English paragraph]
[THE NUMBERS — exact price, % change, volume data from the market data above]
[WHY NIGERIANS SHOULD CARE — local angle: P2P trading, CBN crypto stance, remittances, inflation hedge]
[THE RISK REALITY — honest assessment of downside. Specific risks, not generic warnings.]
[KORO VERDICT — one clear, actionable takeaway. Never just "do your research".]

HEADLINE STYLE:
✓ "Ethereum just flipped Bitcoin in one key metric. What that actually means."
✓ "This altcoin is up 40% this week. Is it real or another rug pull?"

Word count: 400–550 words.

Respond ONLY in valid JSON:
{"title": "...", "summary": "1-2 sentence excerpt, max 200 chars", "content": "Full article body"}`
    },

    "Personal Finance": {
        tag_colour: "#2E86CC",
        read_time: 5,
        prompt: (context: string, marketData: string) => `
You are writing for KoroFinance. Audience: working-class and middle-class Nigerians managing everyday money.
Tone: Real, empathetic, practical. No fluff. No generic advice.

WRITE A "PERSONAL FINANCE & BUDGETING" CATEGORY ARTICLE.

CONTEXT:
${context}

FOREX & INFLATION DATA:
${marketData}

STRUCTURE (follow exactly):
[THE PROBLEM — open with a specific, relatable Nigerian financial pain point. Be real, not condescending.]
[THE DATA BEHIND IT — connect the personal struggle to a macro datapoint. Use numbers.]
[3–5 PRACTICAL STEPS — numbered, actionable, specific to Nigeria. Name real apps and products: PiggyVest, Cowrywise, Carbon, Kuda, Rise, ARM, etc.]
[THE MINDSET SHIFT — challenge one common Nigerian money myth. Be direct.]
[QUICK WIN — one thing the reader can do TODAY. Very specific.]

HEADLINE STYLE:
✓ "Inflation hit 33%. Here's exactly how to restructure your monthly budget right now."
✓ "You're not broke. You're just spending in the wrong order."

Word count: 500–650 words.

Respond ONLY in valid JSON:
{"title": "...", "summary": "1-2 sentence excerpt, max 200 chars", "content": "Full article body"}`
    },

    "CBN & Policy": {
        tag_colour: "#C0392B",
        read_time: 6,
        prompt: (context: string, _marketData: string) => `
You are writing for KoroFinance. Audience: Nigerians who want to understand government and central bank decisions.
Tone: Clear, factual, fair. Translate every piece of jargon. Present the government version AND the critique.

WRITE A "CBN & GOVERNMENT POLICY" CATEGORY ARTICLE.

CONTEXT:
${context}

STRUCTURE (follow exactly):
[THE POLICY — what was announced, in one clear paragraph. Translate EVERY term. Zero jargon.]
[WHAT IT MEANS IN PRACTICE — exactly 3 real-world examples: impact on (1) a salaried worker, (2) a small business owner, (3) an investor]
[HISTORICAL CONTEXT — has this been tried before in Nigeria or Africa? What happened? Be specific.]
[THE CRITICISM — what are economists or commentators saying against it? Present fairly, not dismissively.]
[KORO'S READ — direct, honest assessment. Will this work? Who benefits? Who loses? One conclusive paragraph.]

HEADLINE STYLE:
✓ "The CBN just made a quiet move. Most people missed it. You shouldn't."
✓ "Government announced another policy. Here's the version they didn't explain to you."

Word count: 500–700 words.

Respond ONLY in valid JSON:
{"title": "...", "summary": "1-2 sentence excerpt, max 200 chars", "content": "Full article body"}`
    },

    "Startups & Fintech": {
        tag_colour: "#0088CC",
        read_time: 4,
        prompt: (context: string, _marketData: string) => `
You are writing for KoroFinance. Audience: Nigerians interested in African tech, startups, and fintech innovation.
Tone: Curious, analytical, honest. Call out hype. Celebrate real innovation.

WRITE A "STARTUPS & FINTECH" CATEGORY ARTICLE.

CONTEXT:
${context}

STRUCTURE (follow exactly):
[THE STORY — who, what, how much, when, why it matters. One punchy paragraph.]
[THE PRODUCT — what does it actually do? Explain it like you're describing it to your auntie who uses WhatsApp.]
[THE MARKET OPPORTUNITY — size of the problem they're solving. Real numbers, not estimates without sources.]
[THE COMPETITION — who else is in this space in Nigeria/Africa? Who's ahead and why?]
[KORO'S TAKE — is this a real business or VC theatre? Be honest. What's the biggest risk?]

HEADLINE STYLE:
✓ "This Lagos startup just raised $12M. Here's what they're actually building."
✓ "Opay vs Palmpay vs Moniepoint: which one is actually winning the Nigerian streets?"

Word count: 400–550 words.

Respond ONLY in valid JSON:
{"title": "...", "summary": "1-2 sentence excerpt, max 200 chars", "content": "Full article body"}`
    },

    "Business": {
        tag_colour: "#8B6914",
        read_time: 5,
        prompt: (context: string, _marketData: string) => `
You are writing for KoroFinance. Audience: Nigerian entrepreneurs, business owners, and aspiring founders.
Tone: Grounded, practical, real-world. Reference Nigeria-specific business realities.

WRITE A "BUSINESS & ENTREPRENEURSHIP" CATEGORY ARTICLE.

CONTEXT:
${context}

STRUCTURE (follow exactly):
[THE STORY OR INSIGHT — open with a real business scenario or trend happening in Nigeria right now. Make it vivid.]
[THE LESSON — what's the core business or entrepreneurship principle at play?]
[THE NUMBERS — market size, revenue potential, cost realities. Be specific to Nigeria — naira amounts, % margins, real data.]
[THE PRACTICAL GUIDE — exactly 3–4 steps any Nigerian entrepreneur can apply immediately. Be tactical.]
[KORO'S BUSINESS VERDICT — is this opportunity real, overhyped, or underrated? One honest conclusion.]

HEADLINE STYLE:
✓ "How this Aba manufacturer survived three naira devaluations and came out ahead."
✓ "The quiet business model making more money than most Lagos startups right now."

Word count: 500–600 words.

Respond ONLY in valid JSON:
{"title": "...", "summary": "1-2 sentence excerpt, max 200 chars", "content": "Full article body"}`
    },

    "Stock Picks": {
        tag_colour: "#5B2ECC",
        read_time: 4,
        prompt: (context: string, marketData: string) => `
You are writing for KoroFinance. This is the STOCK PICKS & WATCHLIST column — published every single cycle.
Tone: Precise, data-first, actionable. No vague statements.

WRITE A "STOCK PICKS & WATCHLISTS" ARTICLE.

MARKET DATA (use this as your primary source):
${marketData}

TRENDING CONTEXT:
${context}

STRUCTURE (follow exactly):
[THIS CYCLE'S THEME — 1–2 sentences describing the overall market narrative from the data above]
[THE WATCHLIST — pick 3 to 5 tickers from the market data. For EACH one write:
  - Current price (from data)
  - Why it's on the list (one specific reason, not generic)
  - Key price level to watch (support or resistance)
  - Risk rating: Low / Medium / High]
[THE ONE TO AVOID — one ticker showing warning signs and exactly why. Be specific.]
[DISCLAIMER — end with exactly this text: "This watchlist is for informational purposes only and does not constitute financial advice. Always do your own research."]

HEADLINE STYLE:
✓ "3 NGX stocks quietly building momentum this week — and one red flag to watch."
✓ "Volume is spiking on these 3 stocks. Here's what that usually means."

Word count: 350–500 words.

Respond ONLY in valid JSON:
{"title": "...", "summary": "1-2 sentence excerpt, max 200 chars", "content": "Full article body"}`
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// 48-HOUR ROTATION SCHEDULE
// ─────────────────────────────────────────────────────────────────────────────

const ROTATION: (keyof typeof CATEGORIES)[][] = [
    ["Stock Picks", "Markets", "Crypto & Web3"],          // Cycle 0 — 00:00
    ["Stock Picks", "Personal Finance", "CBN & Policy"],  // Cycle 1 — 06:00
    ["Stock Picks", "Startups & Fintech", "Analysis"],    // Cycle 2 — 12:00
    ["Stock Picks", "Business", "Learn"],                 // Cycle 3 — 18:00
    ["Stock Picks", "Markets", "Crypto & Web3"],          // Cycle 4 — 24:00
    ["Stock Picks", "CBN & Policy", "Personal Finance"],  // Cycle 5 — 30:00
    ["Stock Picks", "Analysis", "Startups & Fintech"],    // Cycle 6 — 36:00
    ["Stock Picks", "Learn", "Business"],                 // Cycle 7 — 42:00
];

/** Returns the categories due to publish in the current 6-hour cycle */
export function getCurrentCycleCategories(): (keyof typeof CATEGORIES)[] {
    const hoursSinceEpoch = Math.floor(Date.now() / (1000 * 60 * 60));
    const cycleIndex = Math.floor(hoursSinceEpoch / 6) % 8;
    return ROTATION[cycleIndex];
}

// ─────────────────────────────────────────────────────────────────────────────
// ARTICLE GENERATION
// ─────────────────────────────────────────────────────────────────────────────

export async function generateArticle(
    category: keyof typeof CATEGORIES,
    topic: TrendingTopic,
    marketData: string = ""
): Promise<GeneratedArticle | null> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const def = CATEGORIES[category];

        const context = topic.headlines
            .map((h, i) => `- ${h} (via ${topic.sources[i] || "Unknown"})\n  ${topic.summaries[i] || ""}`)
            .join("\n");

        const prompt = def.prompt(context, marketData);

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.75,
                maxOutputTokens: 2048,
                responseMimeType: "application/json"
            }
        });

        const responseText = result.response.text();
        const parsed = JSON.parse(responseText);

        const slug = parsed.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "")
            .slice(0, 80);

        return {
            title: parsed.title,
            summary: parsed.summary,
            content: parsed.content,
            category,
            tag_colour: def.tag_colour,
            read_time: def.read_time,
            slug
        };
    } catch (error: any) {
        console.error(`Gemini error for category "${category}":`);
        console.error(error);
        return null;
    }
}

export async function generateCycleArticles(
    topics: TrendingTopic[],
    marketData: string = "",
    overrideCategories?: (keyof typeof CATEGORIES)[]
): Promise<GeneratedArticle[]> {
    const categoriesToRun = overrideCategories ?? getCurrentCycleCategories();
    const articles: GeneratedArticle[] = [];

    for (let i = 0; i < categoriesToRun.length; i++) {
        const category = categoriesToRun[i];
        const topic = topics[i % Math.max(topics.length, 1)] || topics[0];
        if (!topic) continue;

        if (articles.length > 0) {
            await new Promise(resolve => setTimeout(resolve, 1500));
        }

        let article = await generateArticle(category, topic, marketData);

        // MOCK FALLBACK for UI testing when API Key fails
        if (!article) {
            console.log(`[Mock Fallback] Generating dummy content for "${category}"...`);
            const mockDate = Date.now().toString(36);
            const slug = `${category.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${mockDate}`;

            article = {
                title: `[MOCK] ${category}: The Latest Movement in ${topic.headlines[0]?.split(' ')[0] || 'the Market'}`,
                summary: `This is a rich mock article generated because the Gemini API key is missing or invalid. It tests the ${category} structure.`,
                content: `[THIS CYCLE'S THEME]
The market is currently reacting to the recent headlines: ${topic.headlines[0] || 'Market changes'}. Investors are watching closely as volume spikes across standard tickers.

[THE DATA]
- ${marketData.split('\n')[1] || 'NGX ASI: Up 1.2%'}
- Volumes have increased by 15% across top banking stocks.
- Forex stability is becoming a primary focus for institutional traders.

[THE CONTEXT]
In recent weeks, consumer pressure has mounted, forcing a rotation out of traditionally safe consumer goods and into high-yield dividend stocks in the banking sector. The ${category} landscape requires adapting to this new reality. The data shows exactly why sticking to old playbooks might be dangerous right now.

[THE KORO TAKE]
This is where the real money is made or lost. Do not panic sell into an algorithmic dip. Look at the specific cash flows of the companies you own. If they can pass inflation costs to consumers, hold. If they can't, it's time to rebalance.

[RELATED TICKERS]
- GTCO: Approaching a critical resistance level.
- MTNN: Showing unusual volume in the last 48 hours.
- ZENITHBANK: A classic dividend play that remains safe for now.`,
                category,
                tag_colour: CATEGORIES[category]?.tag_colour || "#5B2ECC",
                read_time: CATEGORIES[category]?.read_time || 4,
                slug
            };
        }

        if (article) {
            articles.push(article);
            console.log(`✓ Generated [${category}]: "${article.title}"`);
        }
    }

    return articles;
}

// Keep backward compat with old sync route
export async function generateMultipleArticles(topics: TrendingTopic[]): Promise<GeneratedArticle[]> {
    return generateCycleArticles(topics);
}
