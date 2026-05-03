import React from 'react';
import { Search, Moon, Hexagon, Menu, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface DocsHeaderProps {
  onMenuToggle?: () => void;
  isOpen?: boolean;
}

export function DocsHeader({ onMenuToggle, isOpen }: DocsHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0A0A0A]/80 backdrop-blur-md">
      <div className="flex h-16 items-center px-4 md:px-6 gap-3 md:gap-6">
        {onMenuToggle && (
          <button 
            onClick={onMenuToggle}
            className="md:hidden p-1.5 -ml-1.5 text-neutral-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}
        
        <Link href="/" className="flex items-center gap-2 text-white font-medium shrink-0">
          <Image src="/logo.png" alt="Logo" width={24} height={24} className="w-5 h-5 md:w-6 md:h-6" />
          <span className="font-bold text-lg md:text-xl hidden sm:inline-block">Vizzy</span>
          <span className="text-neutral-400 text-sm md:text-base hidden sm:inline-block">documentation</span>
        </Link>
        
        <div className="flex-1 flex justify-end md:justify-center max-w-xl mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-white/5 border border-white/10 rounded-md py-1.5 pl-9 pr-12 text-sm text-neutral-300 focus:outline-none focus:ring-1 focus:ring-white/20 transition-all placeholder:text-neutral-500"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="hidden sm:inline-block rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-neutral-400 border border-white/10">⌘</kbd>
              <kbd className="hidden sm:inline-block rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-neutral-400 border border-white/10">K</kbd>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6 text-sm text-neutral-400 font-medium shrink-0 ml-4">
          {/* <Link href="/blog" className="hidden sm:inline-block hover:text-white transition-colors">Blog</Link> */}
          <Link href="https://github.com/NishulDhakar/Vizzy-v1" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-block hover:text-white transition-colors">GitHub</Link>
          {/* <button className="hover:text-white transition-colors text-neutral-400 p-1 rounded-md hover:bg-white/10">
            <Moon className="w-4 h-4" />
          </button> */}
        </div>
      </div>
      <div className="flex items-center px-6 gap-6 text-sm text-neutral-400 overflow-x-auto border-t border-white/5">
        <Link href="/docs" className="text-white border-b-2 border-white py-3 px-1 transition-colors whitespace-nowrap font-medium">Documentation</Link>
        {/* <Link href="/extensions" className="hover:text-white py-3 px-1 transition-colors whitespace-nowrap">Extensions</Link>
        <Link href="/specification" className="hover:text-white py-3 px-1 transition-colors whitespace-nowrap">Specification</Link>
        <Link href="/registry" className="hover:text-white py-3 px-1 transition-colors whitespace-nowrap">Registry</Link>
        <Link href="/seps" className="hover:text-white py-3 px-1 transition-colors whitespace-nowrap">SEPs</Link>
        <Link href="/community" className="hover:text-white py-3 px-1 transition-colors whitespace-nowrap">Community</Link> */}
      </div>
    </header>
  );
}
