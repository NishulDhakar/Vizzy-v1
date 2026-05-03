import React from 'react';
import { H1, Ul, Li, Code, Breadcrumb } from '../design/mdx-components';

export default function ApiEndpoints() {
  return (
    <article className="pb-16 pt-2">
      <Breadcrumb items={['Documentation', 'API Reference', 'Endpoints']} />
      
      <H1>API Endpoints</H1>

      <Ul>
        <Li><Code>POST /chat</Code> — Main chat endpoint handling the core LangGraph flow</Li>
        <Li><Code>POST /voice</Code> — Accepts an audio file payload and returns transcribed text via Whisper</Li>
        <Li><Code>POST /image</Code> — Accepts a text prompt and returns generated image URLs from Replicate</Li>
        <Li><Code>GET /history</Code> — Fetches past conversations and context for the current user</Li>
      </Ul>
    </article>
  );
}
