import { useEffect, useState } from "react";
import Header from "../components/Header";
import NewsCard from "../components/NewsCard";
import { TOPIC_CATEGORIES } from "../constants";

export default function Dashboard({ user, onLogout }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [loadingTopic, setLoadingTopic] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const enrichArticles = async (articles) => {
    for (const article of articles) {
      await new Promise(r => setTimeout(r, 1500));

      const [summaryRes, analyzeRes] = await Promise.all([
        fetch("http://localhost:5000/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: article.description || article.title }),
        }),
        fetch("http://localhost:5000/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: article.title, text: article.description || article.title }),
        }),
      ]);

      const summaryData = await summaryRes.json();
      const analyzeData = await analyzeRes.json();

      setNews(prev => [...prev, {
        ...article,
        aiSummary: summaryData.summary,
        credibilityScore: analyzeData.credibilityScore,
        bias: analyzeData.bias,
      }]);
    }
  };

  const fetchNews = async (topic) => {
    setLoading(true);
    setLoadingTopic(true);
    setSearchQuery("");
    setNews([]);
    try {
      const categoryParam = TOPIC_CATEGORIES[topic] ? `category=${TOPIC_CATEGORIES[topic]}` : "";
      const response = await fetch(`http://localhost:5000/news?${categoryParam}`);
      const articles = await response.json();
      await enrichArticles(articles);
    } catch (err) {
      console.error("Error fetching news:", err);
    } finally {
      setLoading(false);
      setLoadingTopic(false);
    }
  };

  const handleSearch = async (query) => {
    setLoading(true);
    setLoadingTopic(true);
    setSearchQuery(query);
    setSelectedTopic("");
    setNews([]);
    try {
      const response = await fetch(`http://localhost:5000/search?q=${encodeURIComponent(query)}`);
      const articles = await response.json();
      await enrichArticles(articles);
    } catch (err) {
      console.error("Error searching news:", err);
    } finally {
      setLoading(false);
      setLoadingTopic(false);
    }
  };

  useEffect(() => { fetchNews(selectedTopic); }, []);

  const handleTopic = (topic) => {
    setSelectedTopic(topic);
    fetchNews(topic);
  };

  return (
    <div style={{ minHeight: "100vh", width: "100%", background: "#f0f4ff" }}>

      <Header
        user={user}
        onLogout={onLogout}
        selectedTopic={selectedTopic}
        onTopicChange={handleTopic}
        loadingTopic={loadingTopic}
        onSearch={handleSearch}
      />

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "36px 48px" }}>

        {/* Page title */}
        <div style={{ marginBottom: "28px", animation: "fadeUp 0.5s ease forwards" }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(22px, 3vw, 32px)",
            color: "#1e3a8a", fontWeight: "700", marginBottom: "4px",
          }}>
            {searchQuery
              ? `Results for "${searchQuery}"`
              : selectedTopic === "All" ? "Top Headlines" : `${selectedTopic} News`}
          </h2>
          <p style={{ color: "#93c5fd", fontSize: "13px" }}>
            AI summaries · credibility scores · bias labels
            {user.language !== "English" && ` · ${user.language}`}
          </p>
        </div>

        {/* Initial loading spinner */}
        {loading && news.length === 0 && (
          <div style={{ textAlign: "center", padding: "100px 0" }}>
            <div style={{
              width: "36px", height: "36px",
              border: "3px solid #dbeafe",
              borderTopColor: "#2563eb",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              margin: "0 auto 20px",
            }} />
            <p style={{ fontFamily: "monospace", fontSize: "12px", letterSpacing: "2px", color: "#2563eb" }}>
              {searchQuery ? `SEARCHING FOR "${searchQuery.toUpperCase()}"...` : "FETCHING & ANALYZING NEWS..."}
            </p>
          </div>
        )}

        {/* No results */}
        {!loading && news.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#93c5fd" }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔍</div>
            <p style={{ fontFamily: "monospace", fontSize: "13px", letterSpacing: "1px" }}>
              No articles found. Try a different search.
            </p>
          </div>
        )}

        {/* Cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))",
          gap: "18px",
        }}>
          {news.map((article, i) => (
            <NewsCard key={i} article={article} index={i} />
          ))}
        </div>

        {/* Loading next article */}
        {loading && news.length > 0 && (
          <div style={{
            textAlign: "center", padding: "24px",
            color: "#2563eb", fontFamily: "monospace",
            fontSize: "11px", letterSpacing: "2px",
          }}>
            ANALYZING NEXT ARTICLE...
          </div>
        )}
      </div>
    </div>
  );
}