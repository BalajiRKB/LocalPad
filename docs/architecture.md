# LocalPad — Architecture

## Overview

LocalPad follows a simple client-server architecture with a local-only database. No external services or cloud dependencies are required.

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (localhost:5173)              │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ Sidebar  │  │  Chat    │  │  Notes Panel         │  │
│  │ Spaces   │  │  Panel   │  │  + Memory Cards      │  │
│  │ Convs    │  │  + Ctx   │  │                      │  │
│  └──────────┘  └──────────┘  └──────────────────────┘  │
│                React + Vite + TypeScript + Zustand       │
└─────────────────────────────────────────────────────────┘
                           │
                     HTTP (proxy)
                           │
┌─────────────────────────────────────────────────────────┐
│                FastAPI Backend (localhost:8000)          │
│                                                         │
│  /api/spaces     /api/conversations  /api/messages      │
│  /api/notes      /api/memory                            │
│                                                         │
│  context_builder.py  →  injects memory into prompts     │
│  ollama_client.py    →  talks to Ollama API             │
└─────────────────────────────────────────────────────────┘
         │                         │
    SQLite DB               Ollama (localhost:11434)
    localpad.db             any local model
```

## Key Modules

### context_builder.py
Assembles active memory cards for the current space and prepends them as a system prompt before every chat message. This is the core differentiator of LocalPad.

### ollama_client.py
A thin async wrapper around the Ollama `/api/chat` and `/api/tags` endpoints.

### Zustand Stores (Frontend)
- `spaceStore.ts` — manages spaces and active space selection
- `chatStore.ts` — manages conversations, messages, model list, and send flow

## Data Flow: Sending a Message

1. User types a message in `ChatPanel`
2. `chatStore.send()` calls `POST /api/messages/send`
3. Backend calls `context_builder.build_context(space_id)` → fetches active memory cards
4. Assembles: `[system: context] + [history messages] + [new user message]`
5. Sends to Ollama `/api/chat`
6. Saves assistant reply to SQLite
7. Returns reply to frontend
8. `ChatPanel` appends reply to the messages list

## Database Schema

```
spaces          → id, name, created_at
conversations   → id, space_id, title, model, created_at
messages        → id, conversation_id, role, content, created_at
notes           → id, space_id, title, content, created_at, updated_at
memory_cards    → id, space_id, title, content, is_active, created_at
```

## Design Decisions

| Decision | Why |
|---|---|
| SQLite over Postgres | Zero config, local-first, single file |
| FastAPI over Express | Async, clean DX, familiar Python ecosystem for AI tools |
| Zustand over Redux | Lightweight, minimal boilerplate |
| Ollama-first | Best local model runtime; OpenAI-compatible for drop-in |
| No auth | Single-user tool — auth adds complexity with zero value here |
