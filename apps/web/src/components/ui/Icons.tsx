import React, { SVGProps } from 'react';

export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
  stroke?: string;
  fill?: string;
  strokeWidth?: number | string;
  d?: string;
}

export const Icon = ({ d, size = 18, stroke = "currentColor", fill = "none", strokeWidth = 1.6, children, style, ...props }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke}
       strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style} {...props}>
    {d ? <path d={d} /> : children}
  </svg>
);

export const IconSparkle = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3 L13.6 9.4 L20 11 L13.6 12.6 L12 19 L10.4 12.6 L4 11 L10.4 9.4 Z" />
    <path d="M19 4 L19.6 6 L21.5 6.5 L19.6 7 L19 9 L18.4 7 L16.5 6.5 L18.4 6 Z" />
  </Icon>
);

export const IconSend = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 12 L19 12" />
    <path d="M13 6 L19 12 L13 18" />
  </Icon>
);

export const IconMic = (p: IconProps) => (
  <Icon {...p}>
    <rect x="9" y="3" width="6" height="12" rx="3" />
    <path d="M5 11 a7 7 0 0 0 14 0" />
    <path d="M12 18 L12 21" />
  </Icon>
);

export const IconImage = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
    <circle cx="9" cy="10" r="1.6" />
    <path d="M4 17 L9 12 L14 17 L17 14 L20 17" />
  </Icon>
);

export const IconPlus = (p: IconProps) => <Icon {...p} d="M12 5 L12 19 M5 12 L19 12" />;

export const IconSearch = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="M16 16 L20 20" />
  </Icon>
);

export const IconSidebar = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
    <path d="M9.5 4.5 L9.5 19.5" />
  </Icon>
);

export const IconSettings = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19 12 a7 7 0 0 0 -.1 -1.2 l2 -1.5 l-2 -3.4 l-2.3 .9 a7 7 0 0 0 -2 -1.2 l-.4 -2.4 h-4 l-.4 2.4 a7 7 0 0 0 -2 1.2 l-2.3 -.9 l-2 3.4 l2 1.5 a7 7 0 0 0 0 2.4 l-2 1.5 l2 3.4 l2.3 -.9 a7 7 0 0 0 2 1.2 l.4 2.4 h4 l.4 -2.4 a7 7 0 0 0 2 -1.2 l2.3 .9 l2 -3.4 l-2 -1.5 a7 7 0 0 0 .1 -1.2 z" />
  </Icon>
);

export const IconDownload = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 4 L12 15" />
    <path d="M7 11 L12 16 L17 11" />
    <path d="M5 19 L19 19" />
  </Icon>
);

export const IconRefresh = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 12 a8 8 0 0 1 14 -5 L20 9" />
    <path d="M20 4 L20 9 L15 9" />
    <path d="M20 12 a8 8 0 0 1 -14 5 L4 15" />
    <path d="M4 20 L4 15 L9 15" />
  </Icon>
);

export const IconWand = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 19 L15 9" />
    <path d="M14 4 L15 6 L17 7 L15 8 L14 10 L13 8 L11 7 L13 6 Z" />
    <path d="M19 13 L19.5 14.5 L21 15 L19.5 15.5 L19 17 L18.5 15.5 L17 15 L18.5 14.5 Z" />
  </Icon>
);

export const IconExpand = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 9 L4 4 L9 4" />
    <path d="M20 9 L20 4 L15 4" />
    <path d="M4 15 L4 20 L9 20" />
    <path d="M20 15 L20 20 L15 20" />
  </Icon>
);

export const IconClose = (p: IconProps) => <Icon {...p} d="M6 6 L18 18 M18 6 L6 18" />;
export const IconCheck = (p: IconProps) => <Icon {...p} d="M5 12 L10 17 L19 7" />;
export const IconArrowUp = (p: IconProps) => <Icon {...p} d="M12 19 L12 5 M5 12 L12 5 L19 12" />;
export const IconChevronDown = (p: IconProps) => <Icon {...p} d="M6 9 L12 15 L18 9" />;

export const IconHome = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 11 L12 4 L20 11 L20 20 L14 20 L14 14 L10 14 L10 20 L4 20 Z" />
  </Icon>
);

export const IconBriefcase = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3.5" y="7.5" width="17" height="12" rx="2" />
    <path d="M9 7.5 L9 5.5 a1.5 1.5 0 0 1 1.5 -1.5 h3 a1.5 1.5 0 0 1 1.5 1.5 L15 7.5" />
    <path d="M3.5 12 L20.5 12" />
  </Icon>
);

export const IconDots = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="6" cy="12" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    <circle cx="18" cy="12" r="1.2" fill="currentColor" stroke="none" />
  </Icon>
);

export const IconPaperclip = (p: IconProps) => (
  <Icon {...p}>
    <path d="M20 11 L11.5 19.5 a4.5 4.5 0 0 1 -6.4 -6.4 L13 5.2 a3 3 0 0 1 4.3 4.3 L9.7 17.1 a1.5 1.5 0 0 1 -2.1 -2.1 L14 8.5" />
  </Icon>
);
