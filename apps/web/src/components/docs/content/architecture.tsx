import React from 'react';
import { H1, H2, Ul, Li, P, Breadcrumb } from '../design/mdx-components';

export default function ArchitectureOverview() {
  return (
    <article className="pb-16 pt-2">
      <Breadcrumb items={['Documentation', 'About Vizzy', 'Architecture']} />
      <H1 id="overview">System Overview</H1>
      <P>
        Vizzy Chat uses a modern architecture built on Next.js, FastAPI, and LangGraph.
      </P>
      <H2 id="frontend">Frontend Architecture</H2>
      <Ul>
        <Li><strong>Framework:</strong> Next.js (App Router)</Li>
        <Li><strong>Styling:</strong> Tailwind CSS and shadcn/ui</Li>
        <Li><strong>Language:</strong> TypeScript</Li>
      </Ul>
      <H2 id="backend">Backend Architecture</H2>
      <Ul>
        <Li><strong>Framework:</strong> FastAPI (Python)</Li>
        <Li><strong>Orchestration:</strong> LangGraph for agent routing</Li>
      </Ul>
    </article>
  );
}
