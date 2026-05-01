import React from 'react';

export interface BubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  role?: 'user' | 'ai';
}

export const Bubble: React.FC<BubbleProps> = ({ children, role = 'ai', className = '', ...props }) => {
  const variants = {
    user: "self-end bg-[var(--vz-user-bubble)] border border-[rgba(255,255,255,0.08)] rounded-2xl px-3 py-2",
    ai: "self-start",
  };
  return (
    <div className={`max-w-[80%] text-[12.5px] text-[var(--vz-fg-0)] ${variants[role]} ${className}`} {...props}>
      {children}
    </div>
  );
};
