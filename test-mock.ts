import { generateCycleArticles } from "./src/lib/api/ai-writer";

async function run() {
    console.log("Starting script...");
    const articles = await generateCycleArticles(
        [{
            headlines: ["Test Headline"],
            summaries: ["Test Summary"],
            category: "Markets",
            sources: ["Koro"]
        }],
        "TEST DATA",
        ["Stock Picks"]
    );
    console.log("Returned articles length:", articles.length);
    console.log(JSON.stringify(articles, null, 2));
}

run().catch(console.error);
