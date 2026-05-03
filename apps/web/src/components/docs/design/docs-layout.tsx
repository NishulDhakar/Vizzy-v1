'use client';
import React, { useState } from 'react';
import { Inter } from 'next/font/google';
import { DocsHeader } from './docs-header';
import { DocsSidebar } from './docs-sidebar';
import { DocsToc, TocItem } from './docs-toc';

// Initialize the font
const inter = Inter({ subsets: ['latin'] });

interface DocsLayoutProps {
  children: React.ReactNode;
  tocItems: TocItem[];
}

export function DocsLayout({ children, tocItems }: DocsLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={`min-h-screen bg-[#0A0A0A] text-neutral-300 ${inter.className} selection:bg-white/20 selection:text-white flex flex-col`}>
      <DocsHeader onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)} isOpen={isMobileMenuOpen} />
      <div className="max-w-[90rem] mx-auto px-6 flex gap-12 items-start justify-center w-full flex-1">
        <DocsSidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
        <main className="flex-1 max-w-3xl min-w-0 py-8">
          {children}
        </main>
        <DocsToc tocItems={tocItems} />
      </div>
    </div>
  );
}
