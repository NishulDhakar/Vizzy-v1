'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

/* ================= TYPES ================= */

type SidebarItem = {
  name: string;
  href?: string;
  children?: SidebarItem[];
};

type SidebarGroup = {
  title: string;
  items: SidebarItem[];
};

/* ================= DATA ================= */

const sidebarGroups: SidebarGroup[] = [
  {
    title: 'Get started',
    items: [
      { name: 'What is Vizzy?', href: '/docs/what-is-vizzy' },
      { name: 'Who is it for?', href: '/docs/who-is-it-for' },
    ],
  },
  {
    title: 'Core Features',
    items: [
      { name: 'Conversational Chat', href: '/docs/features/chat' },
      { name: 'Image Generation', href: '/docs/features/image-gen' },
      { name: 'Voice Input', href: '/docs/features/voice' },
      { name: 'Web Search + RAG', href: '/docs/features/search' },
      { name: 'Memory', href: '/docs/features/memory' },
      { name: 'Reference Search (Combine)', href: '/docs/features/combine' },
    ],
  },
  {
    title: 'Architecture',
    items: [
      { name: 'System Overview', href: '/docs/architecture' },
      { name: 'Tech Stack', href: '/docs/tech-stack' },
      { name: 'LangGraph Flow', href: '/docs/langgraph-flow' },
      // { name: 'File Structure', href: '/docs/file-structure' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { name: 'Endpoints', href: '/docs/api-endpoints' },
    ],
  },
];

/* ================= HELPERS ================= */

function isItemActive(item: SidebarItem, pathname: string): boolean {
  if (item.href && pathname === item.href) return true;

  if (item.children) {
    return item.children.some((child) => isItemActive(child, pathname));
  }

  return false;
}

/* ================= ITEM COMPONENT ================= */

function SidebarItemComponent({
  item,
  depth = 0,
}: {
  item: SidebarItem;
  depth?: number;
}) {
  const pathname = usePathname();

  const active = isItemActive(item, pathname);
  const isLeaf = !item.children;

  const [open, setOpen] = React.useState(active);

  React.useEffect(() => {
    if (active) setOpen(true);
  }, [active]);

  /* ===== LEAF ITEM ===== */
  if (isLeaf) {
    return (
      <Link
        href={item.href!}
        className={`
          block px-3 py-1.5 text-sm rounded-md transition-colors
          ${active
            ? 'bg-white/10 text-white font-medium'
            : 'text-neutral-400 hover:text-white hover:bg-white/5'}
        `}
        style={{ paddingLeft: 12 + depth * 12 }}
      >
        {item.name}
      </Link>
    );
  }

  /* ===== PARENT ITEM ===== */
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`
          flex items-center justify-between w-full px-3 py-1.5 text-sm rounded-md transition-colors
          ${active
            ? 'text-white'
            : 'text-neutral-400 hover:text-white'}
        `}
        style={{ paddingLeft: 12 + depth * 12 }}
      >
        {item.name}

        <ChevronRight
          className={`
            w-4 h-4 transition-transform duration-200
            ${open ? 'rotate-90' : ''}
          `}
        />
      </button>

      {open && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child, i) => (
            <SidebarItemComponent
              key={i}
              item={child}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= MAIN SIDEBAR ================= */

interface DocsSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function DocsSidebar({ isOpen, onClose }: DocsSidebarProps) {
  return (
    <>
      {/* ===== MOBILE BACKDROP ===== */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden mt-16"
          onClick={onClose}
        />
      )}

      {/* ===== SIDEBAR ===== */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 z-40 w-64 border-r border-white/10 bg-[#0A0A0A]
          pl-6 pr-6 py-6 transition-transform duration-300 ease-in-out overflow-y-auto

          md:sticky md:top-32 md:h-[calc(100vh-8rem)] md:w-64
          md:border-white/5 md:bg-transparent md:px-0 md:py-0 md:pr-6
          md:translate-x-0 md:overflow-visible

          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <nav className="flex flex-col gap-8 md:sticky md:top-0 md:max-h-[calc(100vh-8rem)] md:overflow-y-auto no-scrollbar pb-10">
          {sidebarGroups.map((group, idx) => (
            <div key={idx}>
              <h3 className="font-semibold text-sm text-white mb-3 pl-3">
                {group.title}
              </h3>

              <div className="space-y-1">
                {group.items.map((item, i) => (
                  <SidebarItemComponent key={i} item={item} />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}