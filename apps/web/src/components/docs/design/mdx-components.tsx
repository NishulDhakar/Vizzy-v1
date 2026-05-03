import React from 'react';
import { Copy, Info } from 'lucide-react';
import Link from 'next/link';

export const H1 = ({ children, id, className }: { children: React.ReactNode, id?: string, className?: string }) => (
  <div className="flex items-center justify-between mb-8">
    <h1 id={id} className={`text-3xl font-bold tracking-tight text-white ${className || ''}`}>{children}</h1>
    {/* <button className="flex items-center gap-2 text-xs font-medium text-neutral-400 bg-white/5 border border-white/10 rounded-md px-3 py-1.5 hover:bg-white/10 transition-colors">
      <Copy className="w-3.5 h-3.5" />
      Copy page
    </button> */}
  </div>
);

export const H2 = ({ children, id }: { children: React.ReactNode, id?: string }) => (
  <h2 id={id} className="text-2xl font-semibold tracking-tight text-white mt-12 mb-4 scroll-m-20">
    {children}
  </h2>
);

export const H3 = ({ children, id }: { children: React.ReactNode, id?: string }) => (
  <h3 id={id} className="text-xl font-semibold tracking-tight text-white mt-8 mb-4 scroll-m-20">
    {children}
  </h3>
);

export const P = ({ children }: { children: React.ReactNode }) => (
  <p className="leading-7 text-neutral-300 mb-6">
    {children}
  </p>
);

export const A = ({ href, children }: { href: string, children: React.ReactNode }) => (
  <Link href={href} className="font-medium text-white underline underline-offset-4 decoration-white/30 hover:decoration-white transition-colors">
    {children}
  </Link>
);

export const Ul = ({ children }: { children: React.ReactNode }) => (
  <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-neutral-300">
    {children}
  </ul>
);

export const Li = ({ children }: { children: React.ReactNode }) => (
  <li>{children}</li>
);

export const Code = ({ children }: { children: React.ReactNode }) => (
<code className="block w-full overflow-x-auto rounded-xl border border-white/10 bg-zinc-900/80 px-5 py-4 font-mono text-[14px] leading-7 text-zinc-200 shadow-sm">
  {children}
</code>
);

export const Alert = ({ children }: { children: React.ReactNode }) => (
  <div className="my-6 flex items-start gap-3 rounded-lg border border-[#1e3a8a] bg-[#172554]/30 p-4 text-sm text-blue-200">
    <Info className="w-5 h-5 flex-shrink-0 text-blue-400 mt-0.5" />
    <div>{children}</div>
  </div>
);

export const Breadcrumb = ({ items }: { items: string[] }) => (
  <div className="flex items-center gap-2 text-sm text-neutral-400 mb-2 font-medium">
    {items.map((item, index) => (
      <React.Fragment key={index}>
        <span>{item}</span>
        {index < items.length - 1 && <span className="opacity-50">/</span>}
      </React.Fragment>
    ))}
  </div>
);
