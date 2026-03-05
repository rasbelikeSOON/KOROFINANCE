import { detectTrendingTopics } from "./src/lib/api/news";
import { generateArticle } from "./src/lib/api/ai-writer";

async function test() {
    console.log("--- Testing News Scraper ---");
    const { topics } = await detectTrendingTopics();
    console.log(`Found ${topics.length} topics.`);

    if (topics.length > 0) {
        console.log("Topic 1:", topics[0].headlines[0]);
    }

    console.log("\n--- Testing Gemini AI Writer ---");
    const testTopic = topics[0] || {
        headlines: ["Nigeria's Inflation Rate Hits New High"],
        summaries: ["The National Bureau of Statistics reported a surge in the consumer price index..."],
        category: "Markets",
        sources: ["NBS"]
    };

    const article = await generateArticle("Markets", testTopic, "NGX: ₦100 (+2%)");
    if (article) {
        console.log("✓ AI generated article successfully.");
        console.log("Title:", article.title);
        console.log("Content length:", article.content.length);
    } else {
        console.log("✗ AI generation failed. check GEMINI_API_KEY.");
    }
}

test();
