'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { List } from 'lucide-react';

export type TocItem = {
  name: string;
  href: string;
  level: number;
};

interface DocsTocProps {
  tocItems: TocItem[];
}

export function DocsToc({ tocItems }: DocsTocProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const handleScroll = () => {
      let currentId = '';
      for (const item of tocItems) {
        const id = item.href.substring(1);
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the section is scrolled past the 150px threshold from top
          if (rect.top <= 150) {
            currentId = id;
          }
        }
      }
      if (currentId) {
        setActiveId(currentId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger on mount to highlight initial section
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <aside className="w-56 flex-shrink-0 hidden xl:block py-8">
      <div className="sticky top-32 max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar pl-4 border-l border-white/5">
        <h3 className="font-semibold text-sm text-white mb-4 flex items-center gap-2">
          <List className="w-4 h-4" />
          On this page
        </h3>
        <ul className="flex flex-col gap-2.5 text-[13px]">
          {tocItems.map((item, idx) => {
            const id = item.href.substring(1);
            const isActive = activeId === id;
            
            return (
              <li key={idx} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
                <Link 
                  href={item.href} 
                  className={`block leading-snug transition-all duration-200 border-l-[3px] -ml-[19px] pl-[16px] py-0.5 ${
                    isActive 
                      ? 'text-white font-medium border-white/50' 
                      : 'text-neutral-400 hover:text-white border-transparent'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
