import type { ScreenRoute } from "@/config/routes";

/** Temporary stand-in; each is replaced by the real ported screen in its build step. */
export function PlaceholderPage({ route }: { route: ScreenRoute }) {
  return (
    <div className="w-full px-margin py-space-lg">
      <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-sm">
        <span className="font-label-sm text-label-sm uppercase text-primary tracking-wider">
          Screen port pending · Step {route.step}
        </span>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">{route.title}</h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Source design: <code>design-reference/{route.source}</code>
        </p>
      </div>
    </div>
  );
}
