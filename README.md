# AI News Assistant

An AI-powered, persona-aware news experience that goes beyond static feeds. Every article is enriched with an AI summary, credibility score, bias flag, and real-time fact-check, all tailored to who you are.

---

## ✨ Features
- Persona-aware AI generated summaries
- Credibility scoring
- Bias detection
- RAG based fact-checking across live news sources
- Topic filtering and search

---

## 🔄 How it works
 
1. **Fetch** - live articles pulled from NewsAPI by topic or search term
2. **Summarize** - Groq LLM rewrites each article into 3-4 sentences based on your persona
3. **Score** - source reputation and claim quality evaluated to produce a 0-100 credibility score
4. **Detect bias** - model flags political, economic, or editorial bias in the article's framing
5. **Fact-check** - key claims cross-referenced against other live sources, labeled as Verified, Unverified, or Likely False

---

## 🛠 Tech Stack
- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **AI:** Groq LLM (llama-3.1-8b-instant)
- **News:** NewsAPI
- **Fact-checking:** RAG pipeline with live news sources

---

## ⚙️ Setup

### Step 1 — Clone the repo
```bash
git clone https://github.com/snehanair-486/ai-news-assistant.git
```

### Step 2 — Install backend dependencies
```bash
cd ai-news-assistant
cd backend
npm install
```

### Step 3 — Create `.env` file in the backend folder

Create a `.env` file inside the `backend/` folder. You can refer to `backend/.env.example` to see what keys are needed.

Then open `.env` and paste your own API keys:
```
NEWS_API_KEY=your_newsapi_key
GROQ_API_KEY=your_groq_key
```

> Get your NewsAPI key from [newsapi.org](https://newsapi.org) and your Groq key from [console.groq.com](https://console.groq.com)

### Step 4 — Start the backend
```bash
node server.js
```

### Step 5 — Open a new terminal and install frontend dependencies
```bash
cd ai-news-assistant
cd frontend
npm install
```

### Step 6 — Start the frontend
```bash
npm run dev
```

