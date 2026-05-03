import { Outlet, useNavigate, useLocation } from 'react-router';
import { useEffect } from 'react';
import { Bell, Moon, Sun, Search } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useApp } from '../context/AppContext';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/expenses': 'Expenses',
  '/income': 'Income',
  '/budget': 'Budget',
  '/reports': 'Reports',
  '/profile': 'Profile & Settings',
};

export function Layout() {
  const { user, isDark, toggleTheme } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/auth', { replace: true });
    }
  }, [user, navigate]);

  if (!user) return null;

  const bgColor = isDark ? '#0a0a14' : '#f1f5f9';
  const headerBg = isDark ? '#0d0d20' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const titleColor = isDark ? '#f1f5f9' : '#0f172a';
  const inputBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)';

  const pageTitle = PAGE_TITLES[location.pathname] || 'Shelby';

  return (
    <div style={{ display: 'flex', height: '100vh', background: bgColor, overflow: 'hidden' }}>
      <Sidebar />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top Header */}
        <header style={{
          background: headerBg,
          borderBottom: `1px solid ${borderColor}`,
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 700, color: titleColor, margin: 0 }}>
              {pageTitle}
            </h1>
            <p style={{ fontSize: '12px', color: textColor, margin: 0 }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Search */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: inputBg,
              borderRadius: '10px',
              padding: '7px 12px',
              border: `1px solid ${borderColor}`,
            }}>
              <Search size={15} color={textColor} />
              <input
                placeholder="Search transactions..."
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: isDark ? '#e2e8f0' : '#0f172a',
                  fontSize: '13px',
                  width: '170px',
                }}
              />
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              style={{
                width: '36px', height: '36px',
                borderRadius: '10px',
                border: `1px solid ${borderColor}`,
                background: inputBg,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: textColor,
              }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Notifications */}
            <button
              style={{
                width: '36px', height: '36px',
                borderRadius: '10px',
                border: `1px solid ${borderColor}`,
                background: inputBg,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: textColor,
                position: 'relative',
              }}
            >
              <Bell size={16} />
              <span style={{
                position: 'absolute',
                top: '7px', right: '7px',
                width: '7px', height: '7px',
                background: '#f43f5e',
                borderRadius: '50%',
                border: `2px solid ${headerBg}`,
              }} />
            </button>

            {/* Avatar */}
            <div
              onClick={() => navigate('/profile')}
              style={{
                width: '36px', height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '13px', fontWeight: 700,
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              {user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
