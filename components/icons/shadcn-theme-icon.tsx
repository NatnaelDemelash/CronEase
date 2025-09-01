// components/icons/shadcn-theme-icon.tsx
import * as React from 'react';

export function ShadcnThemeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {/* circle */}
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      {/* center vertical */}
      <path d="M12 3v18" />
      {/* diagonal hatch lines */}
      <path d="M12 9l4.65-4.65" />
      <path d="M12 14.3l7.37-7.37" />
      <path d="M12 19.6l8.85-8.85" />
    </svg>
  );
}
