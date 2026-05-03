import React from 'react';
import { H1, Ul, Li, Breadcrumb } from '../../design/mdx-components';

export default function MemoryFeature() {
  return (
    <article className="pb-16 pt-2">
      <Breadcrumb items={['Documentation', 'Core Features', 'Memory']} />
      <H1 id="memory">Memory</H1>
      <Ul>
        <Li>Supabase pgvector stores user preferences</Li>
        <Li>Remembers past prompts, styles, outputs</Li>
        <Li>Over time personalizes responses</Li>
        <Li>Example: if user always picks dark moody images, system learns that</Li>
      </Ul>
    </article>
  );
}
