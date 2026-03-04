const EXCLUDED_KEYWORDS = [
    "football", "soccer", "match", "goal", "league", "sports", "tournament",
    "fifa", "caf", "nff", "super eagles", "chelsea", "arsenal", "manchester",
    "liverpool", "real madrid", "barcelona", "sport", "epl", "premier league",
    "olympic", "athletics", "tenis", "basketball", "nba"
];

const testTitle = "EPL: Wolves stun thriller";

const isIrrelevant = EXCLUDED_KEYWORDS.some(keyword =>
    testTitle.toLowerCase().includes(keyword)
);

console.log(`Title: "${testTitle}"`);
console.log(`Is Irrelevant: ${isIrrelevant}`);
if (isIrrelevant) {
    const matchingKeyword = EXCLUDED_KEYWORDS.find(keyword => testTitle.toLowerCase().includes(keyword));
    console.log(`Matched keyword: ${matchingKeyword}`);
}
