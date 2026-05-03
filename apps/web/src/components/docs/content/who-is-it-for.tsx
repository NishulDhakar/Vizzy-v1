import React from 'react';
import { H1, H2, P, Ul, Li, Breadcrumb } from '../design/mdx-components';

export default function WhoIsItFor() {
  return (
    <article className="pb-16 pt-2">
      <Breadcrumb items={['Documentation', 'Get started', 'Who is it for?']} />
      
      <H1>Who is it for?</H1>
      <P>
        Vizzy Chat is designed to be accessible for everyday users while remaining powerful enough for business applications.
      </P>

      <H2 id="home-users">Home Users</H2>
      <P>
        People who want to create visually stunning and personal assets conversationally, without needing any prior design skills. 
      </P>
      <Ul>
        <Li><strong>Personal artwork</strong> and creative exploration</Li>
        <Li><strong>Vision boards</strong> and goal visualization</Li>
        <Li><strong>Story visuals</strong> and character concept art</Li>
        <Li><strong>Quote posters</strong> and typography</Li>
        <Li><strong>Photo transformations</strong> (style transfer, reimagination)</Li>
        <Li><strong>Emotional landscapes</strong> and moodboards</Li>
      </Ul>

      <div className="mt-12 border-t border-white/10 pt-8" />

      <H2 id="business-users">Business Users</H2>
      <P>
        Restaurant owners, shop managers, and small business operators who need professional marketing visuals quickly, without the overhead of hiring a dedicated designer.
      </P>
      <Ul>
        <Li><strong>Marketing visuals</strong> for social media</Li>
        <Li><strong>Product photography</strong> mockups</Li>
        <Li><strong>Seasonal signage</strong> and window displays</Li>
        <Li><strong>Campaign posters</strong> and promotional materials</Li>
        <Li><strong>Menu visuals</strong> and food photography styling</Li>
      </Ul>
    </article>
  );
}
