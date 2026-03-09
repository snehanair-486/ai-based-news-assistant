import { useState } from "react";
import { BIAS_COLORS, credibilityColor } from "../constants";

const VERDICT_STYLES = {
  "Verified": { icon: "✅", color: "#16a34a", background: "#f0fdf4", border: "#bbf7d0" },
  "Unverified": { icon: "⚠️", color: "#ca8a04", background: "#fefce8", border: "#fde68a" },
  "Likely False": { icon: "❌", color: "#dc2626", background: "#fef2f2", border: "#fecaca" },
};

export default function NewsCard({ article, index }) {
  const [factCheck, setFactCheck] = useState(null);
  const [checking, setChecking] = useState(false);

  const source = article.title?.split(" - ").pop()?.toUpperCase() || "NEWS";
  const headline = article.title?.split(" - ")[0] || article.title;

  const handleFactCheck = async () => {
    setChecking(true);
    setFactCheck(null);
    try {
      const res = await fetch("http://localhost:5000/factcheck", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: article.title,
          text: article.description || article.title,
        }),
      });
      const data = await res.json();
      setFactCheck(data);
    } catch (err) {
      console.error("Fact-check error:", err);
      setFactCheck({
        verdict: "Unverified",
        explanation: "Could not complete fact-check at this time.",
        claim: "",
        sourceCount: 0,
      });
    } finally {
      setChecking(false);
    }
  };

  const verdictStyle = factCheck
    ? VERDICT_STYLES[factCheck.verdict] || VERDICT_STYLES["Unverified"]
    : null;

  return (
    <div className="news-card" style={{ animationDelay: `${index * 0.08}s` }}>

      {/* ── Source + Badges ── */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "12px",
        flexWrap: "wrap", gap: "8px",
      }}>
        <span style={{ fontSize: "10px", color: "#bfdbfe", fontFamily: "monospace", letterSpacing: "1.5px", fontWeight: "600" }}>
          {source}
        </span>
        <div style={{ display: "flex", gap: "6px" }}>
          {article.bias && (
            <span style={{
              padding: "3px 10px", borderRadius: "100px", fontSize: "11px",
              fontFamily: "monospace", color: BIAS_COLORS[article.bias],
              background: `${BIAS_COLORS[article.bias]}15`,
              border: `1px solid ${BIAS_COLORS[article.bias]}35`,
            }}>
              {article.bias}
            </span>
          )}
          {article.credibilityScore !== undefined && (
            <span style={{
              padding: "3px 10px", borderRadius: "100px", fontSize: "11px",
              fontFamily: "monospace", color: credibilityColor(article.credibilityScore),
              background: `${credibilityColor(article.credibilityScore)}15`,
              border: `1px solid ${credibilityColor(article.credibilityScore)}35`,
            }}>
              ✓ {article.credibilityScore}/100
            </span>
          )}
        </div>
      </div>

      {/* ── Headline ── */}
      <h3 style={{
        fontSize: "17px", fontWeight: "700", color: "#1e3a8a",
        lineHeight: 1.45, marginBottom: "14px",
        fontFamily: "'Playfair Display', serif",
      }}>
        {headline}
      </h3>

      <div style={{ height: "1px", background: "#dbeafe", marginBottom: "14px" }} />

      {/* ── AI Summary ── */}
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", marginBottom: "16px" }}>
        <span style={{
          fontSize: "9px", letterSpacing: "2px", color: "#2563eb",
          fontFamily: "monospace", fontWeight: "700",
          paddingTop: "3px", whiteSpace: "nowrap",
        }}>
          AI SUMMARY
        </span>
        <p style={{ margin: 0, fontSize: "13.5px", lineHeight: 1.75, color: "#475569" }}>
          {article.aiSummary || (
            <span style={{ color: "#bfdbfe", fontStyle: "italic" }}>Analyzing...</span>
          )}
        </p>
      </div>

      {/* ── Fact Check Button ── */}
      {!factCheck && (
        <button
          onClick={handleFactCheck}
          disabled={checking}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "8px 16px",
            background: checking ? "#f0f4ff" : "#eff6ff",
            border: "1.5px solid #dbeafe",
            borderRadius: "8px", color: "#2563eb",
            fontSize: "12px", fontFamily: "'DM Sans', sans-serif",
            fontWeight: "600", cursor: checking ? "not-allowed" : "pointer",
            transition: "all 0.2s", letterSpacing: "0.3px",
          }}
          onMouseEnter={e => { if (!checking) e.currentTarget.style.background = "#dbeafe"; }}
          onMouseLeave={e => { e.currentTarget.style.background = checking ? "#f0f4ff" : "#eff6ff"; }}
        >
          {checking ? (
            <>
              <span style={{
                width: "12px", height: "12px",
                border: "2px solid #dbeafe", borderTopColor: "#2563eb",
                borderRadius: "50%", display: "inline-block",
                animation: "spin 0.8s linear infinite",
              }} />
              Checking across news sources...
            </>
          ) : (
            <>🔎 Fact Check this article</>
          )}
        </button>
      )}

      {/* ── Fact Check Result ── */}
      {factCheck && verdictStyle && (
        <div style={{
          marginTop: "4px",
          background: verdictStyle.background,
          border: `1.5px solid ${verdictStyle.border}`,
          borderRadius: "10px", padding: "14px 16px",
          animation: "fadeUp 0.4s ease forwards",
        }}>
          {/* Verdict header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "16px" }}>{verdictStyle.icon}</span>
              <span style={{ fontSize: "13px", fontWeight: "700", color: verdictStyle.color, fontFamily: "monospace", letterSpacing: "0.5px" }}>
                {factCheck.verdict.toUpperCase()}
              </span>
              {/* Source count badge */}
              {factCheck.sourceCount !== undefined && (
                <span style={{
                  fontSize: "11px", color: "#64748b",
                  background: "#f1f5f9", border: "1px solid #e2e8f0",
                  borderRadius: "100px", padding: "2px 8px",
                  fontFamily: "monospace",
                }}>
                  {factCheck.sourceCount} source{factCheck.sourceCount !== 1 ? "s" : ""} checked
                </span>
              )}
            </div>
            <button onClick={() => setFactCheck(null)} style={{
              background: "transparent", border: "none",
              color: "#93c5fd", fontSize: "11px", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}>
              ✕ dismiss
            </button>
          </div>

          {/* Claim checked */}
          {factCheck.claim && (
            <p style={{ fontSize: "12px", color: "#64748b", fontStyle: "italic", marginBottom: "8px", lineHeight: 1.5 }}>
              Claim: "{factCheck.claim}"
            </p>
          )}

          {/* Explanation */}
          <p style={{ fontSize: "13px", color: "#374151", lineHeight: 1.65, margin: 0 }}>
            {factCheck.explanation}
          </p>

          {/* Source note */}
          <p style={{ fontSize: "11px", color: "#93c5fd", marginTop: "10px", marginBottom: 0, fontFamily: "monospace" }}>
            📰 Cross-referenced against live news sources · Analyzed by Groq LLM
          </p>
        </div>
      )}
    </div>
  );
}