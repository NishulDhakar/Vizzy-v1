import React from 'react';
import { H1, H2, Breadcrumb } from '../design/mdx-components';

export default function FileStructure() {
  return (
    <article className="pb-16 pt-2">
      <Breadcrumb items={['Documentation', 'Architecture', 'File Structure']} />
      
      <H1>File Structure</H1>

      <H2 id="backend">Backend File Structure</H2>
      <pre className="block w-full overflow-x-auto rounded-xl border border-white/10 bg-zinc-900/80 px-5 py-4 font-mono text-[14px] leading-7 text-zinc-200 shadow-sm mb-6">
{`backend/
├── main.py
├── .env
├── requirements.txt
│
├── graph/
│   ├── graph.py       # LangGraph graph definition
│   ├── nodes.py       # All node logic
│   └── state.py       # State schema
│
├── services/
│   ├── llm.py         # LLM setup
│   ├── image.py       # Replicate
│   ├── search.py      # Tavily
│   ├── memory.py      # Supabase pgvector
│   └── voice.py       # Whisper
│
└── api/
    └── routes.py      # /chat /image /voice endpoints`}
      </pre>

      <H2 id="frontend">Frontend File Structure</H2>
      <pre className="block w-full overflow-x-auto rounded-xl border border-white/10 bg-zinc-900/80 px-5 py-4 font-mono text-[14px] leading-7 text-zinc-200 shadow-sm mb-6">
{`frontend/
├── app/
│   ├── page.tsx           # Main chat page
│   ├── layout.tsx
│   └── api/
│       └── chat/route.ts  # Proxy to FastAPI
│
├── components/
│   ├── ChatWindow.tsx     # Message thread
│   ├── MessageBubble.tsx  # Text + image bubble
│   ├── InputBar.tsx       # Text + mic + attach
│   ├── ImageGrid.tsx      # Generated image results
│   └── Sidebar.tsx        # Chat history
│
└── lib/
    └── api.ts             # API call helpers`}
      </pre>
    </article>
  );
}
