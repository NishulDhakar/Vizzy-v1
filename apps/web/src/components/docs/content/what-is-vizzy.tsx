import React from 'react';
import { H1, P, Breadcrumb } from '../design/mdx-components';

export default function WhatIsVizzy() {
  return (
    <article className="pb-16 pt-2">
      <Breadcrumb items={['Documentation', 'Get started', 'What is Vizzy?']} />
      <H1 id="what-is-vizzy">What is Vizzy Chat?</H1>
      <P>
        A conversational AI creative assistant. Users type or speak what they want to create — the system understands intent, routes to the right AI pipeline, and returns visual, textual, or experiential content directly in the chat interface.
      </P>
      <P>
        Think ChatGPT UI but the AI can generate images, search the web, remember your preferences, and accept voice input — all in one conversation thread.
      </P>
    </article>
  );
}
