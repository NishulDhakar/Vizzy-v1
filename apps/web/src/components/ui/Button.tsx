import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const base = "inline-flex items-center gap-2 px-4 py-2 rounded-[10px] cursor-pointer text-[13px] font-medium font-[var(--vz-font-body)] transition-all";

  const variants = {
    primary: "bg-gradient-to-b from-[oklch(0.70_0.20_295)] to-[oklch(0.55_0.18_295)] border border-[oklch(0.78_0.20_295/0.6)] text-white shadow-[var(--vz-shadow-glow)] hover:opacity-90",
    secondary: "bg-[var(--vz-bg-2)] border border-[var(--vz-line-strong)] text-[var(--vz-fg-0)] hover:bg-[var(--vz-bg-3)]",
    ghost: "bg-transparent border-none text-[var(--vz-fg-1)] hover:text-[var(--vz-fg-0)] hover:bg-[var(--vz-bg-2)]",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
