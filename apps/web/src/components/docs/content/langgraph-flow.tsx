import React from 'react';
import { H1, H2, H3, P, Ul, Li, Code, Breadcrumb } from '../design/mdx-components';

export default function LangGraphFlow() {
  return (
    <article className="pb-16 pt-2">
      <Breadcrumb items={['Documentation', 'Architecture', 'LangGraph Flow']} />
      
      <H1>LangGraph Flow</H1>
      <P>
        The backend leverages LangGraph to intelligently route intents to specific AI nodes. This creates a predictable, graph-based execution environment for complex queries.
      </P>
      
      <H2 id="visual-flow">Visual Flow</H2>
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

      <H2 id="state">State</H2>
      <P>The LangGraph execution state schema that is passed between nodes during execution:</P>
      <pre className="bg-white/5 p-4 rounded-md text-sm font-mono text-neutral-300 border border-white/10 overflow-x-auto mb-6">
{`{
  "messages": [],        # full conversation history
  "intent": "",          # image / search / chat / voice
  "image_urls": [],      # generated image results
  "search_results": [],  # web search results
  "memory_context": "",  # retrieved user preferences
  "user_id": ""          # for memory lookup
}`}
      </pre>

      <H2 id="nodes">Nodes</H2>
      <Ul>
        <Li><strong>Intent Router</strong> — classifies what the user wants to do and directs the flow</Li>
        <Li><strong>Chat Node</strong> — handles pure conversational LLM responses</Li>
        <Li><strong>Image Node</strong> — calls Replicate APIs and returns image URLs</Li>
        <Li><strong>Search Node</strong> — calls Tavily, feeds factual results back to the LLM</Li>
        <Li><strong>Memory Node</strong> — reads/writes preferences to Supabase pgvector</Li>
        <Li><strong>Voice Node</strong> — receives audio payloads and returns transcribed text</Li>
      </Ul>
    </article>
  );
}
