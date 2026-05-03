import React from 'react';
import { H1, P, Code, Breadcrumb } from '../../design/mdx-components';

export default function CombineFeature() {
  return (
    <article className="pb-16 pt-2">
      <Breadcrumb items={['Documentation', 'Core Features', 'Reference Search']} />
      <H1 id="combine">Reference Search (Combine)</H1>
      <P>
        A feature where the LLM understands intent and intelligently decides whether to generate a new image or fetch references based on the context.
      </P>
      <br />
      <Code>
        User Prompt → LLM (intent detection) → Tool call: image_search(query) → Return structured response
      </Code>
    </article>
  );
}
