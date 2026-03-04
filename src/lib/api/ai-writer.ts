import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface TrendingTopic {
    headlines: string[];
    summaries: string[];
    category: string;
    sources: string[];
}

export interface GeneratedArticle {
    title: string;
    summary: string;
    content: string;
    category: string;
}

const SYSTEM_PROMPT = `You are a senior financial journalist and editor for KoroFinance, a leading Nigerian financial news and market intelligence platform. Your audience consists of Nigerian investors, business professionals, fintech enthusiasts, and financially literate readers across Africa.

Your writing style should be:
- Professional yet accessible — avoid jargon without explanation
- Data-driven — reference specific numbers, percentages, and dates when available
- Analytical — don't just report news, explain WHY it matters and WHAT it means for Nigerian investors/businesses
- Balanced — present multiple perspectives where applicable
- Forward-looking — include implications and what to watch for next

Format your articles with clear paragraphs. Each article should be 300-500 words. Do NOT use markdown formatting like headers or bullet points in the article body — write in flowing editorial prose with clear paragraph breaks.`;

export async function generateArticle(topic: TrendingTopic): Promise<GeneratedArticle | null> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const headlineContext = topic.headlines.map((h, i) => `- ${h} (via ${topic.sources[i] || 'Unknown'})`).join("\n");

        const prompt = `Based on the following trending headlines and context from Nigerian financial news sources, write an ORIGINAL article for KoroFinance. Do NOT copy from the sources — synthesize the information and write a fresh, insightful piece.

TRENDING HEADLINES:
${headlineContext}

CONTEXT/SUMMARIES:
${topic.summaries.join("\n")}

CATEGORY: ${topic.category}

Respond ONLY in valid JSON format with these exact fields:
{
  "title": "Your original headline (compelling, specific, max 80 chars)",
  "summary": "A 1-2 sentence excerpt for the news feed (max 200 chars)",
  "content": "The full 300-500 word article body in plain text with paragraph breaks"
}`;

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            systemInstruction: SYSTEM_PROMPT,
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 2048,
                responseMimeType: "application/json"
            }
        });

        const responseText = result.response.text();

        try {
            const parsed = JSON.parse(responseText);
            return {
                title: parsed.title,
                summary: parsed.summary,
                content: parsed.content,
                category: topic.category
            };
        } catch (parseError) {
            console.error("Failed to parse Gemini response:", responseText.slice(0, 200));
            return null;
        }
    } catch (error) {
        console.error("Gemini API error:", error);
        return null;
    }
}

export async function generateMultipleArticles(topics: TrendingTopic[]): Promise<GeneratedArticle[]> {
    const articles: GeneratedArticle[] = [];

    for (const topic of topics) {
        // Rate limit: wait 2 seconds between API calls
        if (articles.length > 0) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        const article = await generateArticle(topic);
        if (article) {
            articles.push(article);
            console.log(`Generated article: "${article.title}"`);
        }
    }

    return articles;
}
