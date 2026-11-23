interface AvatarProps {
  initials: string;
  className?: string;
}

/** Local replacement for the hosted profile photo used in the original export. */
export function Avatar({ initials, className = "" }: AvatarProps) {
  return (
    <div
      aria-hidden="true"
      className={`w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 font-label-sm text-label-sm ${className}`.trim()}
    >
      {initials}
    </div>
  );
}
