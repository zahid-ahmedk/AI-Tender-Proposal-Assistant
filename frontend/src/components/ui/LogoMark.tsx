import { Icon } from "./Icon";

/** Local stand-in for the hosted TenderIQ logo image in the original header. */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="TenderIQ Logo"
      className={`h-8 w-8 rounded-sm bg-on-secondary-fixed flex items-center justify-center shrink-0 ${className}`.trim()}
    >
      <Icon name="analytics" className="text-primary-container text-[18px]" />
    </div>
  );
}
