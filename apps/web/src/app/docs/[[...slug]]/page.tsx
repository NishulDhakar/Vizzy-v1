import React from 'react';
import { DocsLayout } from '../../../components/docs/design/docs-layout';
import { ArchitectureContent } from '../../../components/docs/design/architecture-content';
import { H1, P, Breadcrumb } from '../../../components/docs/design/mdx-components';
import { TocItem } from '../../../components/docs/design/docs-toc';

const defaultToc: TocItem[] = [
  { name: 'What is Vizzy Chat?', href: '#what-is-vizzy', level: 1 },
  { name: 'Who is it for?', href: '#who-is-it-for', level: 2 },
  { name: 'Core Features', href: '#core-features', level: 1 },
  { name: 'Conversational Chat', href: '#chat', level: 2 },
  { name: 'Image Generation', href: '#image-gen', level: 2 },
  { name: 'Voice Input', href: '#voice', level: 2 },
  { name: 'Web Search + RAG', href: '#search', level: 2 },
  { name: 'Memory', href: '#memory', level: 2 },
  { name: 'Reference Search (Combine)', href: '#combine', level: 2 },
  { name: 'Architecture', href: '#architecture', level: 1 },
  { name: 'Tech Stack', href: '#tech-stack', level: 2 },
  { name: 'LangGraph Flow', href: '#langgraph', level: 2 },
  { name: 'API Endpoints', href: '#api', level: 2 },
];



import WhatIsVizzy from '../../../components/docs/content/what-is-vizzy';
import WhoIsItFor from '../../../components/docs/content/who-is-it-for';
import ArchitectureOverview from '../../../components/docs/content/architecture';
import ChatFeature from '../../../components/docs/content/features/chat';
import ImageGenFeature from '../../../components/docs/content/features/image-gen';
import VoiceFeature from '../../../components/docs/content/features/voice';
import SearchFeature from '../../../components/docs/content/features/search';
import MemoryFeature from '../../../components/docs/content/features/memory';
import CombineFeature from '../../../components/docs/content/features/combine';
import LangGraphFlow from '../../../components/docs/content/langgraph-flow';
import TechStack from '../../../components/docs/content/tech-stack';
import FileStructure from '../../../components/docs/content/file-structure';
import ApiEndpoints from '../../../components/docs/content/api-endpoints';

export default async function DocsPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = await params;
  const slugPath = resolvedParams.slug ? resolvedParams.slug.join('/') : '';

  let content;
  let tocItems: TocItem[] = [];

  switch (slugPath) {
    case '':
    case 'what-is-vizzy':
      content = <WhatIsVizzy />;
      tocItems = [{ name: 'What is Vizzy Chat?', href: '#what-is-vizzy', level: 1 }];
      break;
    case 'who-is-it-for':
      content = <WhoIsItFor />;
      tocItems = [
        { name: 'Who is it for?', href: '#', level: 1 },
        { name: 'Home Users', href: '#home-users', level: 2 },
        { name: 'Business Users', href: '#business-users', level: 2 },
      ];
      break;
    case 'architecture':
      content = <ArchitectureOverview />;
      tocItems = [
        { name: 'System Overview', href: '#overview', level: 1 },
        { name: 'Frontend Architecture', href: '#frontend', level: 2 },
        { name: 'Backend Architecture', href: '#backend', level: 2 },
      ];
      break;
    case 'features/chat':
      content = <ChatFeature />;
      tocItems = [{ name: 'Conversational Chat', href: '#chat', level: 1 }];
      break;
    case 'features/image-gen':
      content = <ImageGenFeature />;
      tocItems = [{ name: 'Image Generation', href: '#image-gen', level: 1 }];
      break;
    case 'features/voice':
      content = <VoiceFeature />;
      tocItems = [{ name: 'Voice Input', href: '#voice', level: 1 }];
      break;
    case 'features/search':
      content = <SearchFeature />;
      tocItems = [{ name: 'Web Search + RAG', href: '#search', level: 1 }];
      break;
    case 'features/memory':
      content = <MemoryFeature />;
      tocItems = [{ name: 'Memory', href: '#memory', level: 1 }];
      break;
    case 'features/combine':
      content = <CombineFeature />;
      tocItems = [{ name: 'Reference Search', href: '#combine', level: 1 }];
      break;
    case 'langgraph-flow':
      content = <LangGraphFlow />;
      tocItems = [
        { name: 'LangGraph Flow', href: '#flow', level: 1 },
        { name: 'Visual Flow', href: '#visual-flow', level: 2 },
        { name: 'State', href: '#state', level: 2 },
        { name: 'Nodes', href: '#nodes', level: 2 },
      ];
      break;
    case 'tech-stack':
      content = <TechStack />;
      tocItems = [
        { name: 'Tech Stack', href: '#tech-stack', level: 1 },
        { name: 'Frontend', href: '#frontend', level: 2 },
        { name: 'Backend', href: '#backend', level: 2 },
        { name: 'AI Models & APIs', href: '#ai-apis', level: 2 },
        { name: 'Database / Infrastructure', href: '#database', level: 2 },
      ];
      break;
    case 'file-structure':
      content = <FileStructure />;
      tocItems = [
        { name: 'File Structure', href: '#file-structure', level: 1 },
        { name: 'Backend File Structure', href: '#backend', level: 2 },
        { name: 'Frontend File Structure', href: '#frontend', level: 2 },
      ];
      break;
    case 'api-endpoints':
      content = <ApiEndpoints />;
      tocItems = [{ name: 'API Endpoints', href: '#api-endpoints', level: 1 }];
      break;
    default:
      // Fallback to the full overview content for any unmapped routes
      content = <ArchitectureContent />;
      tocItems = defaultToc;
      break;
  }

  return (
    <DocsLayout tocItems={tocItems}>
      {content}
    </DocsLayout>
  );
}
