require('dotenv').config();

const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

// ── Helper: call Groq with retry ──────────────────────────────
const callGroq = async (prompt, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.1-8b-instant",
          messages: [{ role: "user", content: prompt }]
        },
        {
          headers: {
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );
      return response.data.choices[0].message.content;
    } catch (err) {
      const isRateLimit = err.response?.data?.error?.code === "rate_limit_exceeded";
      if (isRateLimit && i < retries - 1) {
        console.log(`Rate limited, retrying in 5s... (attempt ${i + 1})`);
        await new Promise(r => setTimeout(r, 5000));
      } else {
        throw err;
      }
    }
  }
};

// ── Helper: search NewsAPI for corroborating sources ──────────
const searchCorroboratingNews = async (searchQuery) => {
  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchQuery)}&sortBy=relevancy&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`;
    const response = await axios.get(url);
    const articles = response.data.articles || [];

    // Return titles, sources and descriptions of found articles
    return articles.slice(0, 5).map(a => ({
      title: a.title,
      source: a.source?.name || "Unknown",
      description: a.description || "",
    }));
  } catch (err) {
    console.error("NewsAPI corroboration error:", err.message);
    return [];
  }
};

// ── GET /news ─────────────────────────────────────────────────
app.get("/news", async (req, res) => {
  try {
    const category = req.query.category;
    const url = category
      ? `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${process.env.NEWS_API_KEY}`
      : `https://newsapi.org/v2/top-headlines?country=us&apiKey=${process.env.NEWS_API_KEY}`;

    const response = await axios.get(url);
    const articles = response.data.articles.slice(0, 3).map(article => ({
      title: article.title,
      description: article.description,
    }));

    res.json(articles);
  } catch (error) {
    console.error("News fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

// ── GET /search ───────────────────────────────────────────────
app.get("/search", async (req, res) => {
  try {
    const query = req.query.q;
    if (!query) return res.status(400).json({ error: "Query is required" });

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=relevancy&pageSize=3&apiKey=${process.env.NEWS_API_KEY}`;
    const response = await axios.get(url);

    const articles = response.data.articles.slice(0, 3).map(article => ({
      title: article.title,
      description: article.description,
    }));

    res.json(articles);
  } catch (error) {
    console.error("Search error:", error.message);
    res.status(500).json({ error: "Failed to search news" });
  }
});

// ── POST /summarize ───────────────────────────────────────────
app.post("/summarize", async (req, res) => {
  try {
    const { text } = req.body;
    const summary = await callGroq(
      `Summarize this news article in 3 simple sentences:\n\n${text || "No content available."}`
    );
    console.log("Generated summary:", summary);
    res.json({ summary });
  } catch (error) {
    console.error("Summarization error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to summarize" });
  }
});

// ── POST /analyze ─────────────────────────────────────────────
app.post("/analyze", async (req, res) => {
  try {
    const { title, text } = req.body;

    const prompt = `Analyze this news article and respond ONLY with a valid JSON object, no explanation, no markdown, no backticks.

Article title: ${title}
Article text: ${text}

Respond with exactly this format:
{"credibilityScore": <number between 0-100>, "bias": "<one of: Left, Center-Left, Center, Center-Right, Right>"}

Base credibilityScore on: presence of sources, factual tone, sensationalism, clarity.
Base bias on: political leaning of the framing and language used.`;

    const raw = await callGroq(prompt);
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON found in response");
    const result = JSON.parse(jsonMatch[0]);

    console.log("Analysis result:", result);
    res.json(result);
  } catch (error) {
    console.error("Analysis error:", error.response?.data || error.message);
    res.status(500).json({ credibilityScore: 50, bias: "Center" });
  }
});

// ── POST /factcheck ───────────────────────────────────────────
app.post("/factcheck", async (req, res) => {
  try {
    const { title, text } = req.body;

    // Step 1: Extract claim + search keywords using Groq
    const claimPrompt = `From this news article, extract two things and respond ONLY as JSON, no markdown, no backticks:
1. The single most important factual claim (one sentence)
2. A short 3-5 word search query to find corroborating news articles (focus on the key names, events, or topics)

Title: ${title}
Text: ${text}

Respond with exactly:
{"claim": "<one sentence claim>", "searchQuery": "<3-5 word search query>"}`;

    const claimRaw = await callGroq(claimPrompt);
    const claimJson = claimRaw.match(/\{[\s\S]*\}/);
    if (!claimJson) throw new Error("No JSON in claim extraction");

    const { claim, searchQuery } = JSON.parse(claimJson[0]);
    console.log("Extracted claim:", claim);
    console.log("Search query:", searchQuery);

    // Step 2: RETRIEVE corroborating articles from NewsAPI (RAG retrieval)
    const corroboratingArticles = await searchCorroboratingNews(searchQuery);
    console.log(`Found ${corroboratingArticles.length} corroborating articles`);

    // Format the retrieved sources for Groq
    const sourcesText = corroboratingArticles.length > 0
      ? corroboratingArticles.map((a, i) =>
          `Source ${i + 1} - ${a.source}: "${a.title}" — ${a.description}`
        ).join("\n")
      : "No corroborating sources found.";

    const sourceCount = corroboratingArticles.length;

    // Small delay before next Groq call
    await new Promise(r => setTimeout(r, 3000));

    // Step 3: Augmented generation — Groq evaluates claim vs retrieved sources
    const factCheckPrompt = `You are a news fact-checker. Evaluate whether the claim is corroborated by multiple news sources.

CLAIM TO VERIFY:
${claim}

RETRIEVED NEWS SOURCES (${sourceCount} sources found):
${sourcesText}

Verdict rules:
- "Verified": 3 or more sources report the same or very similar information
- "Unverified": 1-2 sources found, or sources are loosely related but not directly confirming
- "Likely False": Sources found directly contradict the claim

Respond ONLY with valid JSON, no markdown, no backticks:
{"verdict": "<Verified, Unverified, or Likely False>", "explanation": "<2-3 sentences. Mention how many sources were found and what they say. Be specific.>", "claim": "<repeat the claim here>", "sourceCount": ${sourceCount}}`;

    const raw = await callGroq(factCheckPrompt);
    console.log("Raw fact-check response:", raw);

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("No JSON in fact-check response");
    const result = JSON.parse(jsonMatch[0]);

    console.log("Fact-check result:", result);
    res.json(result);

  } catch (error) {
    console.error("Fact-check error:", error.response?.data || error.message);
    res.status(500).json({
      verdict: "Unverified",
      explanation: "Could not complete fact-check at this time. Please try again in a few seconds.",
      claim: "",
      sourceCount: 0,
    });
  }
});

// ── Start server ──────────────────────────────────────────────
app.listen(5000, () => {
  console.log("Server running on port 5000");
});