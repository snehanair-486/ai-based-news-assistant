import { useState } from "react";
import TopicFilter from "./TopicFilter";

export default function Header({ user, onLogout, selectedTopic, onTopicChange, loadingTopic, onSearch }) {
  return (
    <div style={{
      background: "#fff",
      borderBottom: "1.5px solid #dbeafe",
      padding: "0 48px",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 2px 16px rgba(37,99,235,0.07)",
    }}>
      {/* ── Top row: logo + user ── */}
      <div style={{
        maxWidth: "1100px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "68px",
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "32px", height: "32px",
            background: "#1e3a8a", borderRadius: "8px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "16px",
          }}>📰</div>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "20px", fontWeight: "700", color: "#1e3a8a",
          }}>
            News Intelligence
          </span>
        </div>

        {/* User + logout */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "13px", color: "#93c5fd" }}>
            Hello, <strong style={{ color: "#2563eb" }}>{user.name}</strong>
          </span>
          <button onClick={onLogout} style={{
            padding: "7px 16px", borderRadius: "8px",
            border: "1.5px solid #dbeafe", background: "transparent",
            color: "#2563eb", fontSize: "13px", cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif", fontWeight: "500",
            transition: "all 0.2s",
          }}>
            Log out
          </button>
        </div>
      </div>

      {/* ── Search bar ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", paddingBottom: "14px" }}>
        <SearchBar onSearch={onSearch} disabled={loadingTopic} />
      </div>

      {/* ── Topic filter ── */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", paddingBottom: "14px" }}>
        <TopicFilter
          selectedTopic={selectedTopic}
          onTopicChange={onTopicChange}
          disabled={loadingTopic}
        />
      </div>
    </div>
  );
}

function SearchBar({ onSearch, disabled }) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (query.trim()) onSearch(query.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center", maxWidth: "540px" }}>
      <div style={{ position: "relative", flex: 1 }}>
        <span style={{
          position: "absolute", left: "14px", top: "50%",
          transform: "translateY(-50%)", fontSize: "14px",
          color: "#93c5fd", pointerEvents: "none",
        }}>🔍</span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search news... (press Enter)"
          disabled={disabled}
          style={{
            width: "100%",
            padding: "10px 14px 10px 38px",
            border: "1.5px solid #dbeafe",
            borderRadius: "10px",
            fontSize: "13px",
            fontFamily: "'DM Sans', sans-serif",
            color: "#1e3a8a",
            background: "#f8faff",
            outline: "none",
            transition: "border-color 0.2s, box-shadow 0.2s",
            opacity: disabled ? 0.5 : 1,
          }}
          onFocus={e => {
            e.target.style.borderColor = "#2563eb";
            e.target.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)";
          }}
          onBlur={e => {
            e.target.style.borderColor = "#dbeafe";
            e.target.style.boxShadow = "none";
          }}
        />
      </div>
      <button
        onClick={handleSearch}
        disabled={disabled || !query.trim()}
        style={{
          padding: "10px 20px",
          background: "#1e3a8a",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontSize: "13px",
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: "600",
          cursor: disabled || !query.trim() ? "not-allowed" : "pointer",
          opacity: disabled || !query.trim() ? 0.5 : 1,
          transition: "background 0.2s",
          whiteSpace: "nowrap",
        }}
      >
        Search
      </button>
    </div>
  );
}