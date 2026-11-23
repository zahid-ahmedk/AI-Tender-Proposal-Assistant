import { Outlet, useLocation } from "react-router-dom";
import { FALLBACK_META, PAGE_META } from "@/config/pageMeta";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

/** Layout route: fixed sidebar + fixed header + scrollable main, as in all 13 designs. */
export function AppShell() {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] ?? FALLBACK_META;
  return (
    <>
      <Sidebar />
      <div className="pl-64">
        <Header meta={meta} />
        <main className="relative w-full pt-16 min-h-screen bg-surface">
          <Outlet />
        </main>
      </div>
    </>
  );
}
