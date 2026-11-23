import { useId } from "react";
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/utils/cn";
import { Icon } from "./Icon";

const FIELD_BASE =
  "w-full bg-surface-container-low text-on-surface font-body-sm text-body-sm placeholder:text-secondary " +
  "focus:outline-none focus:ring-2 focus:ring-primary-container transition-shadow disabled:opacity-60";

interface FieldProps {
  label: string;
  hint?: ReactNode;
  error?: ReactNode;
  /** Pass the control's id (use useId or your own) so the label is associated with it */
  htmlFor?: string;
  children: ReactNode;
  className?: string;
}

/** Label + control + hint/error wrapper. */
export function Field({ label, hint, error, htmlFor, children, className }: FieldProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <label htmlFor={htmlFor} className="block font-label-md text-label-md text-on-surface font-medium mb-1">
        {label}
      </label>
      {children}
      {error ? (
        <p role="alert" className="mt-1 font-label-sm text-label-sm text-error">{error}</p>
      ) : (
        hint && <p className="mt-1 font-label-sm text-label-sm font-normal text-on-surface-variant">{hint}</p>
      )}
    </div>
  );
}

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Leading Material Symbols icon */
  icon?: string;
}

export function TextInput({ icon, className, ...rest }: TextInputProps) {
  return (
    <div className="relative flex items-center w-full">
      {icon && <Icon name={icon} className="absolute left-3 text-secondary text-[18px] pointer-events-none" />}
      <input className={cn(FIELD_BASE, "h-10 rounded", icon ? "pl-9 pr-3" : "px-3", className)} {...rest} />
    </div>
  );
}

export function Select({ className, children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative w-full">
      <select className={cn(FIELD_BASE, "h-10 px-3 pr-8 rounded appearance-none cursor-pointer", className)} {...rest}>
        {children}
      </select>
      <Icon name="expand_more" className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary text-[18px] pointer-events-none" />
    </div>
  );
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(FIELD_BASE, "p-space-sm rounded-lg resize-y", className)} {...rest} />;
}

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: ReactNode;
}

export function Checkbox({ label, className, id, ...rest }: CheckboxProps) {
  const auto = useId();
  const inputId = id ?? auto;
  return (
    <label htmlFor={inputId} className="inline-flex items-center gap-1.5 cursor-pointer">
      <input
        id={inputId}
        type="checkbox"
        className={cn("w-4 h-4 rounded border-outline-variant accent-primary cursor-pointer", className)}
        {...rest}
      />
      {label && <span className="font-body-sm text-body-sm text-on-surface">{label}</span>}
    </label>
  );
}

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  "aria-label": string;
  disabled?: boolean;
}

/** Switch (Settings screen pattern, 44×24). */
export function Toggle({ checked, onChange, disabled, ...aria }: ToggleProps) {
  return (
    <label className="relative inline-flex items-center cursor-pointer shrink-0">
      <input
        type="checkbox"
        role="switch"
        className="sr-only peer"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        {...aria}
      />
      <div className="w-11 h-6 bg-surface-container-high rounded-full peer peer-focus-visible:ring-2 peer-focus-visible:ring-primary-container peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container peer-disabled:opacity-50" />
    </label>
  );
}
