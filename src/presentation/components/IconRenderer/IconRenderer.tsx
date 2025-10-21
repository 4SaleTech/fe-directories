import React from 'react';
import Image from 'next/image';

interface IconRendererProps {
  value: string;
  size?: number;
  className?: string;
}

/**
 * Renders an icon based on its value:
 * - If starts with "http://" or "https://" -> render as image
 * - Otherwise -> treat as emoji/text
 */
export default function IconRenderer({ value, size = 24, className = '' }: IconRendererProps) {
  if (!value) {
    return null;
  }

  // Check if it's a URL
  if (value.startsWith('http://') || value.startsWith('https://')) {
    return (
      <Image
        src={value}
        alt="Icon"
        width={size}
        height={size}
        className={className}
        style={{ objectFit: 'contain' }}
      />
    );
  }

  // Treat as emoji or text
  return (
    <span className={className} style={{ fontSize: size }}>
      {value}
    </span>
  );
}
