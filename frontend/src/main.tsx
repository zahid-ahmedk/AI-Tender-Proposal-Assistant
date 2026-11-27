import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { LoginScreen } from './components/LoginScreen.tsx';

function RootGate() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const injectSidebarSignOut = () => {
      if (document.getElementById('tenderiq-sidebar-signout')) return;

      const teamBtn = Array.from(document.querySelectorAll('aside button, nav button')).find(
        (el) => el.textContent?.includes('Team & Rules')
      );
      if (!teamBtn || !teamBtn.parentElement) return;

      const btn = document.createElement('button');
      btn.id = 'tenderiq-sidebar-signout';
      btn.type = 'button';
      btn.title = 'Sign Out';
      btn.className =
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-rose-300 hover:bg-slate-800/60 transition cursor-pointer mt-1';
      btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4 shrink-0">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" x2="9" y1="12" y2="12"/>
        </svg>
        <span class="truncate">Sign Out</span>
      `;
      btn.onclick = () => setIsAuthenticated(false);

      teamBtn.parentElement.appendChild(btn);
    };

    injectSidebarSignOut();
    const observer = new MutationObserver(injectSidebarSignOut);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      document.getElementById('tenderiq-sidebar-signout')?.remove();
    };
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginScreen onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootGate />
  </StrictMode>
);
