# ai-news-assistant

An AI-powered news assistant that provides personalized news with summaries, credibility scores, bias detection, and fact-checking.

## Features
- AI-generated summaries using Groq LLM
- Credibility scoring and bias detection
- RAG-based fact checking across live news sources
- Topic filtering and search
- User login and language preferences

# AI-Based News Assistant

An AI-powered news app that delivers personalized summaries, credibility scores, and bias analysis — tailored to your persona.

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

---

The app will be running at `http://localhost:5173` and the backend at `http://localhost:5000`.

## Tech Stack
- Frontend: React + Vite
- Backend: Node.js + Express
- AI: Groq LLM (llama-3.1-8b-instant)
- News: NewsAPI
- Fact-checking: RAG pipeline with live news sources
