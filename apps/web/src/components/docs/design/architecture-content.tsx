import React from 'react';
import { H1, H2, H3, P, A, Ul, Li, Code, Alert, Breadcrumb } from './mdx-components';

export function ArchitectureContent() {
  return (
    <article className="pb-16 pt-2">
      <Breadcrumb items={['Documentation', 'Overview']} />

      <H1>What is Vizzy Chat?</H1>
      <div id="what-is-vizzy" className="absolute -mt-32" />

      <P>
        A conversational AI creative assistant. Users type or speak what they want to create — the system understands intent, routes to the right AI pipeline, and returns visual, textual, or experiential content directly in the chat interface.
      </P>

      <P>
        Think ChatGPT UI but the AI can generate images, search the web, remember your preferences, and accept voice input — all in one conversation thread.
      </P>

      <H2 id="who-is-it-for">Who is it for?</H2>

      <Ul>
        <Li>
          <strong>Home Users:</strong> People who want to create personal artwork, vision boards, story visuals, quote posters, photo transformations, emotional landscapes, moodboards — conversationally, without needing design skills.
        </Li>
        <Li>
          <strong>Business Users:</strong> Restaurant owners, shop managers, small business operators who need marketing visuals, product photography, seasonal signage, campaign posters, menu visuals — without hiring a designer.
        </Li>
      </Ul>

      <div className="mt-16 border-t border-white/10 pt-8" />
      <H2 id="core-features">Core Features (MVP)</H2>

      <H3 id="chat">1. Conversational Chat</H3>
      <Ul>
        <Li>ChatGPT-style UI</Li>
        <Li>User types or speaks a prompt</Li>
        <Li>AI responds with text + generated content</Li>
        <Li>Full back-and-forth conversation thread</Li>
        <Li>Iterative refinement ("make it darker", "try a different style")</Li>
      </Ul>

      <H3 id="image-gen">2. Image Generation</H3>
      <Ul>
        <Li>Text prompt → generated image(s)</Li>
        <Li>Returns 2-4 image options in chat</Li>
        <Li>User can regenerate, refine, or download</Li>
        <Li>Photo upload → transformation (style transfer, reimagination)</Li>
        <Li>Styles: artistic, realistic, abstract, renaissance, dreamlike, etc.</Li>
      </Ul>

      <H3 id="voice">3. Voice Input</H3>
      <Ul>
        <Li>User clicks mic → speaks prompt</Li>
        <Li>Whisper API converts speech to text</Li>
        <Li>Text enters chat as normal prompt</Li>
        <Li>Full pipeline runs as usual</Li>
      </Ul>

      <H3 id="search">4. Web Search + RAG</H3>
      <Ul>
        <Li>When user asks something current or factual, Tavily searches the web.</Li>
        <Li>Results are chunked, embedded, retrieved</Li>
        <Li>LLM answers grounded in real data</Li>
        <Li>Example: "What are trending visual styles for restaurants in 2025?"</Li>
      </Ul>

      <H3 id="memory">5. Memory</H3>
      <Ul>
        <Li>Supabase pgvector stores user preferences</Li>
        <Li>Remembers past prompts, styles, outputs</Li>
        <Li>Over time personalizes responses</Li>
        <Li>Example: if user always picks dark moody images, system learns that</Li>
      </Ul>

      <H3 id="combine">6. Reference Search (Combine)</H3>
      <P>
        A new feature where the LLM understands intent and decides whether to generate an image or fetch references.
      </P>
      <Code>
        User Prompt → LLM (intent detection) → Tool call: image_search(query) → Return structured response
      </Code>

      <Alert>
        <strong>Not in MVP:</strong> Video generation, multi-user collaboration, mobile apps, brand asset management systems, and direct social platform exports are excluded from the current scope.
      </Alert>

      <div className="mt-16 border-t border-white/10 pt-8" />
      <H2 id="architecture">Architecture</H2>

      <H3 id="tech-stack">Tech Stack</H3>
      <Ul>
        <Li><strong>Frontend:</strong> Next.js, TypeScript</Li>
        <Li><strong>Backend:</strong> Python, LangGraph for agent orchestration</Li>
        <Li><strong>AI / Models:</strong> Groq Llama 3.3 70B (Chat), Gemini (Embeddings), Pollinations (Image Gen), Whisper (Speech-to-Text)</Li>
        <Li><strong>Database:</strong> Supabase (auth and memory storage)</Li>
      </Ul>

      <H3 id="langgraph">LangGraph Flow</H3>
      <P>The backend leverages LangGraph to intelligently route intents to specific nodes.</P>
      
      <pre className="bg-white/5 p-4 rounded-md text-sm font-mono text-neutral-300 border border-white/10 overflow-x-auto mb-6">
{`User (Frontend)
   ↓
FastAPI Backend
   ↓
LangGraph Graph
   ↓
Intent Router Node
↙      ↓        ↘        ↘
Image   Search    Chat     Voice
Node    Node      Node     Node
   ↓
Memory Node (Supabase pgvector)
   ↓
Response → Frontend`}
      </pre>

      <H3 id="api">API Endpoints</H3>
      <Ul>
        <Li><Code>POST /chat</Code> — main chat endpoint</Li>
        <Li><Code>POST /voice</Code> — audio file → transcribed text</Li>
        <Li><Code>POST /image</Code> — text prompt → image URLs</Li>
        <Li><Code>GET /history</Code> — fetch past conversations</Li>
      </Ul>

    </article>
  );
}
