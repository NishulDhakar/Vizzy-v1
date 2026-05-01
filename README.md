# Vizzy Chat

An AI creative assistant that chats, generates images, and remembers you — built with a FastAPI backend and Next.js frontend.

## What it does

- **Conversational AI** — chat with a Llama 3.3 70B model via Groq, with per-user semantic memory across sessions
- **Image generation** — describe an image in natural language, get a grid of results via Pollinations (Flux model)
- **Voice input** — transcribe speech to text using Groq Whisper
- **Persistent memory** — stores facts about users in Supabase pgvector, recalled automatically in future chats
- **Google auth** — sign in with Google via Supabase Auth

## Monorepo structure

```
vizzy-chat/
├── apps/
│   ├── api/          FastAPI + LangGraph backend  (port 8001)
│   └── web/          Next.js 16 frontend           (port 3000)
├── Makefile          dev / install / build commands
├── docker-compose.yml
└── .env.example      template for all required env vars
```

### `apps/api`

```
api/
├── main.py              FastAPI entry point
├── requirements.txt
├── graph/
│   ├── graph.py         LangGraph pipeline definition
│   ├── nodes.py         Intent, chat, and image nodes
│   └── state.py         Typed graph state schema
├── services/
│   ├── llm.py           Groq (OpenAI-compatible) client
│   ├── embeddings.py    Google Generative embeddings
│   ├── image.py         Pollinations image generation
│   ├── voice.py         Groq Whisper transcription
│   ├── db.py            Supabase CRUD + retry logic
│   └── supabase_client.py
└── api/
    └── routes.py        REST endpoints
```

### `apps/web`

```
web/src/
├── app/
│   ├── page.tsx         Home — mounts ChatApp
│   ├── layout.tsx       Root layout + AuthProvider
│   ├── c/[id]/          Conversation deep-link
│   └── api/             Next.js proxy routes → FastAPI
├── components/
│   ├── chat/            ChatApp, Messages, ImageGrid, Onboarding
│   └── ui/              Sidebar, Composer, Bubble, Icons …
├── context/
│   └── AuthContext.tsx  Supabase Google OAuth session
└── lib/
    ├── api.ts           Typed fetch wrappers
    └── supabase.ts      Client + server Supabase instances
```

## Getting started

### Prerequisites

- Node 20+
- Python 3.12+
- A [Supabase](https://supabase.com) project with Google OAuth enabled

### 1. Clone and install

```bash
git clone <repo-url>
cd vizzy-chat
make install
```

### 2. Configure environment variables

```bash
cp .env.example apps/api/.env
cp .env.example apps/web/.env.local
```

Fill in the values — see `.env.example` for the full list. At minimum you need:

| Variable | Where to get it |
|---|---|
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) |
| `GOOGLE_API_KEY` | Google AI Studio |
| `SUPABASE_URL` + `SUPABASE_KEY` | Supabase project settings |
| `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` | same project, anon key |

### 3. Run locally

```bash
make dev          # starts both api (8001) and web (3000) in parallel
```

Or run each separately:

```bash
make dev-api      # FastAPI with hot reload
make dev-web      # Next.js dev server
```

### Docker

```bash
docker compose up
```

## API endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/chat` | Send a message, returns AI response or image URLs |
| `GET` | `/conversations/{user_id}` | List user's conversations |
| `GET` | `/history/{conversation_id}` | Fetch message history |
| `DELETE` | `/history/{conversation_id}` | Delete a conversation |
| `GET` | `/memories/{user_id}` | List semantic memories |
| `POST` | `/memories` | Add a memory |
| `DELETE` | `/memories/{memory_id}` | Remove a memory |
| `POST` | `/voice` | Transcribe audio → text |

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind v4, shadcn/ui |
| Backend | Python, FastAPI, LangGraph, Pydantic v2 |
| AI | Groq (Llama 3.3 70B + Whisper), Google Generative AI (embeddings) |
| Images | Pollinations API (Flux) |
| Database | Supabase (Postgres + pgvector) |
| Auth | Supabase Auth (Google OAuth) |
