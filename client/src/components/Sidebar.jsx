import { useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useAuth } from '../context/AuthContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { usePrefersReducedMotion, gsapDuration } from '../hooks/usePrefersReducedMotion';
import ThemeToggle from './ThemeToggle';
import LogoutButton from './LogoutButton';

const LOGO_URL =
  'https://static.wixstatic.com/media/ea57c6_57502bc1502149e3a0cb7dabab3572f0~mv2.png/v1/fill/w_180,h_180,lg_1/ea57c6_57502bc1502149e3a0cb7dabab3572f0~mv2.png';

const STORAGE_KEY = 'paparica_sidebar_collapsed';

const NAV_ITEMS = [
  {
    key: 'overview',
    path: '/',
    label: 'Visão Geral',
    icon: (
      <svg viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="9" rx="1"></rect>
        <rect x="14" y="3" width="7" height="5" rx="1"></rect>
        <rect x="14" y="12" width="7" height="9" rx="1"></rect>
        <rect x="3" y="16" width="7" height="5" rx="1"></rect>
      </svg>
    ),
  },
  {
    key: 'units',
    path: '/units',
    label: 'Unidades',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
        <line x1="12" y1="22.08" x2="12" y2="12"></line>
      </svg>
    ),
  },
  {
    key: 'editor',
    path: '/editor',
    label: 'Editor de Dados',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4z"></path>
      </svg>
    ),
  },
  {
    key: 'importer',
    path: '/importer',
    label: 'Importar Planilha',
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
      </svg>
    ),
  },
];

const ADMIN_ITEM = {
  key: 'admin',
  path: '/admin',
  label: 'Administração',
  icon: (
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  ),
};

export default function Sidebar() {
  const { currentUser } = useAuth();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const reducedMotion = usePrefersReducedMotion();
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem(STORAGE_KEY) === '1');
  const sidebarRef = useRef(null);
  const mainRef = useRef(null);

  useGSAP(
    () => {
      if (isMobile) {
        // Below the breakpoint the CSS media query rail takes over — but GSAP
        // may have left an inline width/opacity from a desktop-size toggle,
        // and inline styles outrank the media query's stylesheet rule, so it
        // must be explicitly cleared or the sidebar stays visually wide.
        gsap.set(sidebarRef.current, { clearProps: 'width' });
        gsap.set('.sidebar .label-text', { clearProps: 'opacity' });
        return;
      }
      const width = collapsed ? 70 : 260;
      gsap.to(sidebarRef.current, {
        width,
        duration: gsapDuration(0.3, reducedMotion),
        ease: 'power2.out',
      });
      gsap.to('.sidebar .label-text', {
        opacity: collapsed ? 0 : 1,
        duration: gsapDuration(0.2, reducedMotion),
      });
    },
    { dependencies: [collapsed, isMobile, reducedMotion] }
  );

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
      return next;
    });
  }

  if (!currentUser) return null;

  const visibleItems = NAV_ITEMS.filter(
    (item) => currentUser.is_admin || currentUser.views.includes(item.key)
  );

  return (
    <aside className={`sidebar${collapsed && !isMobile ? ' collapsed' : ''}`} ref={sidebarRef} id="app-sidebar">
      <div className="brand-section">
        <img src={LOGO_URL} alt="Papa Rica Logo" className="brand-logo" />
        <span className="brand-name label-text">Papa Rica</span>
      </div>

      {!isMobile && (
        <button
          className="sidebar-toggle-btn"
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
          aria-expanded={!collapsed}
          aria-controls="app-sidebar"
        >
          <svg viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
      )}

      <nav>
        <ul className="menu-list">
          {visibleItems.map((item) => (
            <li key={item.key}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => `menu-item${isActive ? ' active' : ''}`}
              >
                {item.icon}
                <span className="label-text">{item.label}</span>
              </NavLink>
            </li>
          ))}
          {currentUser.is_admin && (
            <li>
              <NavLink to={ADMIN_ITEM.path} className={({ isActive }) => `menu-item${isActive ? ' active' : ''}`}>
                {ADMIN_ITEM.icon}
                <span className="label-text">{ADMIN_ITEM.label}</span>
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <ThemeToggle />
        <LogoutButton />
      </div>
    </aside>
  );
}
