backend/
├── main.py              # FastAPI app entry point
├── .env                 # API keys
├── requirements.txt
│
├── graph/
│   ├── graph.py         # LangGraph graph definition
│   ├── nodes.py         # All nodes (chat, image, search, memory)
│   └── state.py         # Graph state schema
│
├── services/
│   ├── llm.py           # Claude/Gemini setup
│   ├── image.py         # Replicate image gen
│   ├── search.py        # Tavily web search
│   ├── memory.py        # Supabase pgvector
│   └── voice.py         # Whisper voice to text
│
└── api/
    └── routes.py        # FastAPI endpoints (/chat, /image, /voice)