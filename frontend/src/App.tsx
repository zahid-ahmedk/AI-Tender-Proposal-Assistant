import { Route, Routes } from "react-router-dom";
import { SCREEN_ROUTES } from "@/config/routes";
import { AppShell } from "@/components/layout/AppShell";
import { PlaceholderPage } from "@/pages/PlaceholderPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import ComponentShowcase from "@/pages/dev/ComponentShowcase";

/** Real page components replace <PlaceholderPage> as each screen is ported (Steps 4-7). */
export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        {SCREEN_ROUTES.map((r) => (
          <Route key={r.path} path={r.path} element={<PlaceholderPage route={r} />} />
        ))}
        {import.meta.env.DEV && <Route path="/dev/components" element={<ComponentShowcase />} />}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
