import type { CSSProperties } from "react";

interface IconProps {
  /** Material Symbols Outlined name, e.g. "dashboard" */
  name: string;
  /** Extra Tailwind classes, e.g. "text-[18px] text-primary" */
  className?: string;
  /** Filled variant (font-variation-settings FILL 1) */
  filled?: boolean;
  style?: CSSProperties;
}

/** Wrapper for the Material Symbols font used throughout the original designs. */
export function Icon({ name, className = "", filled = false, style }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined ${className}`.trim()}
      style={filled ? { fontVariationSettings: "'FILL' 1", ...style } : style}
    >
      {name}
    </span>
  );
}
