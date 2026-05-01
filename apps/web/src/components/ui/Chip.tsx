import React from 'react';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'solid' | 'outline';
}

export const Chip: React.FC<ChipProps> = ({ children, variant = 'solid', className = '', ...props }) => {
  const variants = {
    solid: "bg-[var(--vz-bg-3)] border border-[var(--vz-line-strong)] text-[var(--vz-fg-0)] font-medium",
    outline: "bg-transparent border border-[var(--vz-line)] text-[var(--vz-fg-1)] font-mono",
  };
  return (
    <span className={`px-3 py-1.5 rounded-full text-[12px] ${variants[variant]} ${className}`} {...props}>
      {children}
    </span>
  );
};
