import React from 'react';
import { H1, Ul, Li, Breadcrumb } from '../../design/mdx-components';

export default function ImageGenFeature() {
  return (
    <article className="pb-16 pt-2">
      <Breadcrumb items={['Documentation', 'Core Features', 'Image Generation']} />
      <H1 id="image-gen">Image Generation</H1>
      <Ul>
        <Li>Text prompt → generated image(s)</Li>
        <Li>Returns 2-4 image options in chat</Li>
        <Li>User can regenerate, refine, or download</Li>
        <Li>Photo upload → transformation (style transfer, reimagination)</Li>
        <Li>Styles: artistic, realistic, abstract, renaissance, dreamlike, etc.</Li>
      </Ul>
    </article>
  );
}
