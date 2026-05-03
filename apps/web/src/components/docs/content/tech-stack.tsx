import React from 'react';
import { H1, H2, Ul, Li, Breadcrumb, P } from '../design/mdx-components';

export default function TechStack() {
  return (
    <article className="pb-16 pt-2">
      <Breadcrumb items={['Documentation', 'Architecture', 'Tech Stack']} />
      
      <H1>Tech Stack</H1>

      <H2 id="frontend">Frontend</H2>
      <Ul>
        <Li><strong>Next.js</strong></Li>
        <Li><strong>TypeScript</strong></Li>
      </Ul>

      <H2 id="backend">Backend</H2>
      <Ul>
        <Li><strong>Python</strong></Li>
        <Li><strong>LangGraph</strong> for agent orchestration</Li>
      </Ul>

      <H2 id="ai-apis">AI Models & APIs</H2>
      <Ul>
        <Li><strong>Chat</strong> — Groq Llama 3.3 70B</Li>
        <Li><strong>Embeddings</strong> — Gemini</Li>
        <Li><strong>Image Generation</strong> — Pollinations</Li>
        <Li><strong>Speech-to-Text</strong> — Whisper</Li>
      </Ul>

      <H2 id="database">Database / Infrastructure</H2>
      <Ul>
        <Li><strong>Supabase</strong> — Authentication and memory storage</Li>
      </Ul>
    </article>
  );
}
