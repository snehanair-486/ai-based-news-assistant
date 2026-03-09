import { useState } from "react";
import { LANGUAGES } from "../constants";

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "", language: "English" });
  const [error, setError] = useState("");

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = () => {
    if (!form.email || !form.password) { setError("Please fill in all fields."); return; }
    if (mode === "signup" && !form.name) { setError("Please enter your name."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setError("");

    const user = {
      name: form.name || form.email.split("@")[0],
      email: form.email,
      language: form.language,
    };
    localStorage.setItem("ni_user", JSON.stringify(user));
    onLogin(user);
  };

  const switchMode = () => {
    setMode(m => m === "login" ? "signup" : "login");
    setError("");
  };

  return (
    <div style={{
      minHeight: "100vh",
      width: "100%",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
    }}>
      {/* ── Left Panel ── */}
      <div style={{
        background: "linear-gradient(145deg, #1e3a8a 0%, #1d4ed8 50%, #2563eb 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "64px 56px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", bottom: "-40px", left: "-40px", width: "200px", height: "200px", borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
        <div style={{ position: "absolute", top: "40%", right: "10%", width: "120px", height: "120px", borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

        <div style={{ animation: "fadeUp 0.7s ease forwards", position: "relative", zIndex: 1 }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "48px" }}>
            <div style={{ width: "36px", height: "36px", background: "rgba(255,255,255,0.15)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>📰</div>
            <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: "600", fontSize: "15px" }}>News Intelligence</span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(32px, 3.5vw, 52px)",
            fontWeight: "800",
            color: "#fff",
            lineHeight: 1.15,
            marginBottom: "20px",
            letterSpacing: "-0.5px",
          }}>
            Stay informed.<br />Stay ahead.
          </h1>

          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "15px", lineHeight: 1.7, maxWidth: "340px" }}>
            AI-powered news personalized for you — with summaries, credibility scores, and bias analysis on every article.
          </p>

          <div style={{ marginTop: "48px", display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              "✦  AI-generated summaries",
              "✦  Credibility scoring",
              "✦  Bias detection",
              "✦  Personalized topics",
            ].map(f => (
              <div key={f} style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px" }}>{f}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div style={{
        background: "#f8faff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 56px",
      }}>
        <div style={{ width: "100%", maxWidth: "400px", animation: "fadeUp 0.7s ease 0.1s both" }}>

          {/* Tab Toggle */}
          <div style={{ display: "flex", background: "#e8f0fe", borderRadius: "10px", padding: "4px", marginBottom: "36px" }}>
            {["login", "signup"].map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }} style={{
                flex: 1, padding: "10px",
                background: mode === m ? "#fff" : "transparent",
                border: "none", borderRadius: "8px",
                fontSize: "14px",
                fontWeight: mode === m ? "600" : "400",
                color: mode === m ? "#1e3a8a" : "#93c5fd",
                cursor: "pointer", transition: "all 0.2s",
                fontFamily: "'DM Sans', sans-serif",
                boxShadow: mode === m ? "0 1px 4px rgba(37,99,235,0.12)" : "none",
              }}>
                {m === "login" ? "Log In" : "Sign Up"}
              </button>
            ))}
          </div>

          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: "26px", fontWeight: "700", color: "#1e3a8a", marginBottom: "6px" }}>
            {mode === "login" ? "Welcome back" : "Create account"}
          </h2>
          <p style={{ color: "#93c5fd", fontSize: "13px", marginBottom: "28px" }}>
            {mode === "login" ? "Log in to your personalized feed" : "Set up your profile to get started"}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {mode === "signup" && (
              <div>
                <label style={{ fontSize: "12px", color: "#2563eb", fontWeight: "600", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>YOUR NAME</label>
                <input className="auth-input" placeholder="Jane Smith" value={form.name} onChange={e => update("name", e.target.value)} />
              </div>
            )}

            <div>
              <label style={{ fontSize: "12px", color: "#2563eb", fontWeight: "600", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>EMAIL</label>
              <input className="auth-input" type="email" placeholder="you@email.com" value={form.email} onChange={e => update("email", e.target.value)} />
            </div>

            <div>
              <label style={{ fontSize: "12px", color: "#2563eb", fontWeight: "600", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>PASSWORD</label>
              <input className="auth-input" type="password" placeholder="••••••••" value={form.password} onChange={e => update("password", e.target.value)} />
            </div>

            {mode === "signup" && (
              <div>
                <label style={{ fontSize: "12px", color: "#2563eb", fontWeight: "600", letterSpacing: "0.5px", display: "block", marginBottom: "6px" }}>PREFERRED LANGUAGE</label>
                <select className="auth-input" value={form.language} onChange={e => update("language", e.target.value)}>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            )}

            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 14px", color: "#dc2626", fontSize: "13px" }}>
                {error}
              </div>
            )}

            <button className="auth-btn" onClick={handleSubmit} style={{ marginTop: "6px" }}>
              {mode === "login" ? "Log In →" : "Create Account →"}
            </button>
          </div>

          <p style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: "#93c5fd" }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <span onClick={switchMode} style={{ color: "#2563eb", fontWeight: "600", cursor: "pointer" }}>
              {mode === "login" ? "Sign up" : "Log in"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}