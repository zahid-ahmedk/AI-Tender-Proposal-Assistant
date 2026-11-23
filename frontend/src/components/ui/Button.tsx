import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { Icon } from "./Icon";

export type ButtonVariant = "primary" | "secondary" | "tonal" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

const VARIANT: Record<ButtonVariant, string> = {
  primary: "bg-primary-container text-on-primary hover:bg-primary",
  secondary: "bg-surface-container-lowest text-on-surface shadow-sm hover:bg-surface-container-low",
  tonal: "bg-surface-container-low text-on-surface hover:bg-surface-container",
  ghost: "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
  danger: "bg-error text-on-error hover:opacity-90",
};

const SIZE: Record<ButtonSize, string> = {
  sm: "h-8 px-2.5 rounded font-label-sm text-label-sm",
  md: "h-9 px-space-md rounded-lg font-label-lg text-label-lg",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Material Symbols name shown before the label */
  icon?: string;
  /** Material Symbols name shown after the label */
  iconRight?: string;
  loading?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconRight,
  loading,
  disabled,
  className,
  children,
  type = "button",
  ...rest
}: ButtonProps) {
  const iconSize = size === "sm" ? "text-[16px]" : "text-[18px]";
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        "inline-flex items-center justify-center gap-space-xs transition-colors whitespace-nowrap",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container focus-visible:ring-offset-1",
        "disabled:opacity-50 disabled:pointer-events-none",
        VARIANT[variant],
        SIZE[size],
        className,
      )}
      {...rest}
    >
      {loading ? <Icon name="refresh" className={cn(iconSize, "animate-spin")} /> : icon && <Icon name={icon} className={iconSize} />}
      {children && <span>{children}</span>}
      {iconRight && !loading && <Icon name={iconRight} className={iconSize} />}
    </button>
  );
}

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  icon: string;
  /** Required: icon-only buttons need an accessible name */
  "aria-label": string;
  iconClassName?: string;
}

/** Compact icon-only button (row actions, close buttons, toolbars). */
export function IconButton({ icon, iconClassName = "text-[20px]", className, type = "button", ...rest }: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "p-1 rounded text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container",
        "disabled:opacity-50 disabled:pointer-events-none",
        className,
      )}
      {...rest}
    >
      <Icon name={icon} className={iconClassName} />
    </button>
  );
}
