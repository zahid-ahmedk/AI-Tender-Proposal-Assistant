import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="w-full px-margin py-space-lg flex flex-col gap-space-sm">
      <h1 className="font-headline-lg text-headline-lg text-on-surface">Page not found</h1>
      <Link to="/" className="font-label-lg text-label-lg text-primary hover:underline">
        Back to Overview
      </Link>
    </div>
  );
}
