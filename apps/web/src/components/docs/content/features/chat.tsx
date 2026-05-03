import React from 'react';
import { H1, Ul, Li, Breadcrumb } from '../../design/mdx-components';

export default function ChatFeature() {
  return (
    <article className="pb-16 pt-2">
      <Breadcrumb items={['Documentation', 'Core Features', 'Conversational Chat']} />
      <H1 id="chat">Conversational Chat</H1>
      <Ul>
        <Li>ChatGPT-style UI</Li>
        <Li>User types or speaks a prompt</Li>
        <Li>AI responds with text + generated content</Li>
        <Li>Full back-and-forth conversation thread</Li>
        <Li>Iterative refinement ("make it darker", "try a different style")</Li>
      </Ul>
    </article>
  );
}
