import React from 'react';
import { H1, Ul, Li, Breadcrumb } from '../../design/mdx-components';

export default function SearchFeature() {
  return (
    <article className="pb-16 pt-2">
      <Breadcrumb items={['Documentation', 'Core Features', 'Web Search + RAG']} />
      <H1 id="search">Web Search + RAG</H1>
      <Ul>
        <Li>When user asks something current or factual, Tavily searches the web.</Li>
        <Li>Results are chunked, embedded, retrieved</Li>
        <Li>LLM answers grounded in real data</Li>
        <Li>Example: "What are trending visual styles for restaurants in 2025?"</Li>
      </Ul>
    </article>
  );
}
