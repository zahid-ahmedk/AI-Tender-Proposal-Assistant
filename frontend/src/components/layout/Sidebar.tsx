import { NavLink } from "react-router-dom";
import { NAV_ITEMS, NAV_SECTIONS } from "@/config/navigation";
import { Icon } from "@/components/ui/Icon";

const BASE = "flex items-center gap-space-sm px-space-sm py-space-sm rounded-lg transition-colors";
const ACTIVE = "bg-primary-container text-on-primary-container font-semibold";
const INACTIVE =
  "font-label-lg text-label-lg text-secondary-fixed-dim hover:bg-on-secondary-fixed-variant hover:text-on-primary";

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-on-secondary-fixed text-inverse-on-surface z-50 flex flex-col justify-between py-space-lg">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="px-space-lg mb-space-lg flex items-center gap-space-sm">
          <Icon name="analytics" className="text-primary-container" />
          <span className="font-headline-sm text-headline-sm text-on-primary tracking-tight">TenderIQ</span>
        </div>
        <nav aria-label="Primary" className="flex-1 px-space-sm space-y-space-xs">
          {NAV_SECTIONS.map((section, i) => (
            <div key={section} className="space-y-space-xs">
              <div
                className={`px-space-sm ${i === 0 ? "pt-space-xs" : "pt-space-md"} pb-space-xs font-label-sm text-label-sm uppercase text-secondary-fixed-dim`}
              >
                {section}
              </div>
              {NAV_ITEMS.filter((n) => n.section === section).map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) => `${BASE} ${isActive ? ACTIVE : INACTIVE}`}
                >
                  <Icon name={item.icon} className="text-[18px]" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}
