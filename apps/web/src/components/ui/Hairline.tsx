import React from 'react';

export interface HairlineProps extends React.HTMLAttributes<HTMLDivElement> {
  strong?: boolean;
}

export const Hairline: React.FC<HairlineProps> = ({ strong = false, className = '', ...props }) => (
  <div
    className={`h-px w-full ${strong ? 'bg-[var(--vz-line-strong)]' : 'bg-[var(--vz-line)]'} ${className}`}
    {...props}
  />
);
