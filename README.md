# 🧠 LocalPad

> Minimal local-first AI notebook with chat, notes, memory cards, and context builder — powered by Ollama.

![LocalPad Banner](docs/assets/banner.png)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Status](https://img.shields.io/badge/Status-MVP_in_progress-orange)](#)

---

## ✨ What is LocalPad?

LocalPad is a **lightweight, local-first AI notebook** that lets you:

- 💬 **Chat** with any Ollama local model
- 📝 **Take notes** alongside your conversations
- 🧩 **Create memory cards** — reusable context injected into every prompt
- 🗂️ **Organize with Spaces** — separate contexts for projects, study, or work
- ⚡ **Preview injected context** before every prompt via the Context Builder

No cloud. No auth. No accounts. Runs entirely on your machine.

---

## 🚀 Core Features (MVP)

| Feature | Description |
|---|---|
| **Chat Panel** | Multi-conversation chat with any Ollama-running model |
| **Notes Panel** | Markdown notes per Space, searchable and sendable to chat |
| **Memory Cards** | Short reusable snippets auto-injected into prompts |
| **Spaces** | Separate workspaces with their own chats, notes, and memory |
| **Context Builder** | See and edit exactly what context is sent with your prompt |

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite + TypeScript |
| State | Zustand |
| Styling | Tailwind CSS v4 |
| Backend | FastAPI (Python) |
| Database | SQLite (via SQLAlchemy) |
| Model runtime | [Ollama](https://ollama.com) |

---

## 📦 Getting Started

> Prerequisites: [Node.js 20+](https://nodejs.org), [Python 3.11+](https://python.org), [Ollama](https://ollama.com)

```bash
# Clone the repo
git clone https://github.com/BalajiRKB/LocalPad.git
cd LocalPad

# Start backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Start frontend (new terminal)
cd frontend
npm install
npm run dev
```

Then open `http://localhost:5173` and make sure Ollama is running locally.

---

## 📁 Project Structure

```
LocalPad/
├── frontend/        # React + Vite + TypeScript
├── backend/         # FastAPI + SQLite
├── docs/            # Architecture, contributing guides
└── .github/         # Issue templates, workflows
```

---

## 🗺️ Roadmap

- [x] Project setup & README
- [ ] Backend: FastAPI + SQLite + Spaces + Memory CRUD
- [ ] Frontend: Chat panel with Ollama integration
- [ ] Notes panel
- [ ] Memory cards with toggle system
- [ ] Context builder with preview
- [ ] Dark/light mode
- [ ] Demo video + docs site

---

## 🤝 Contributing

LocalPad is open-source and contributor-friendly. Check out [CONTRIBUTING.md](.github/CONTRIBUTING.md) to get started.

Looking for a place to start? Find issues labelled [`good first issue`](https://github.com/BalajiRKB/LocalPad/issues?q=label%3A%22good+first+issue%22).

---

## 📄 License

[MIT](LICENSE) — built by [Balaji R](https://github.com/BalajiRKB)
