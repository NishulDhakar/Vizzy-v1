import React from 'react';
import { H1, Ul, Li, Breadcrumb } from '../../design/mdx-components';

export default function VoiceFeature() {
  return (
    <article className="pb-16 pt-2">
      <Breadcrumb items={['Documentation', 'Core Features', 'Voice Input']} />
      <H1 id="voice">Voice Input</H1>
      <Ul>
        <Li>User clicks mic → speaks prompt</Li>
        <Li>Whisper API converts speech to text</Li>
        <Li>Text enters chat as normal prompt</Li>
        <Li>Full pipeline runs as usual</Li>
      </Ul>
    </article>
  );
}
