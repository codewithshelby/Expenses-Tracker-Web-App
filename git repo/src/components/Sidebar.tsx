import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import {
  LayoutDashboard, CreditCard, TrendingUp, Target,
  BarChart2, User, ChevronLeft, ChevronRight, LogOut,
  Wallet, Settings
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/expenses', icon: CreditCard, label: 'Expenses' },
  { to: '/income', icon: TrendingUp, label: 'Income' },
  { to: '/budget', icon: Target, label: 'Budgets' },
  { to: '/reports', icon: BarChart2, label: 'Reports' },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout, isDark } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const sidebarBg = isDark ? '#0d0d20' : '#ffffff';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const hoverBg = isDark ? 'rgba(99,102,241,0.1)' : 'rgba(99,102,241,0.06)';

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'US';

  return (
    <aside
      style={{
        background: sidebarBg,
        borderRight: `1px solid ${borderColor}`,
        width: collapsed ? '72px' : '240px',
        transition: 'width 0.25s ease',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 0' : '20px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        borderBottom: `1px solid ${borderColor}`,
        justifyContent: collapsed ? 'center' : 'space-between',
        minHeight: '64px',
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px', height: '34px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Wallet size={18} color="white" />
            </div>
            <span style={{
              fontSize: '17px',
              fontWeight: 700,
              color: isDark ? '#f1f5f9' : '#0f172a',
              letterSpacing: '-0.3px',
            }}>
              Spendly
            </span>
          </div>
        )}
        {collapsed && (
          <div style={{
            width: '34px', height: '34px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Wallet size={18} color="white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            width: '26px', height: '26px',
            borderRadius: '6px',
            border: `1px solid ${borderColor}`,
            background: 'transparent',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: textColor,
            flexShrink: 0,
          }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {!collapsed && (
          <p style={{ fontSize: '11px', color: textColor, padding: '0 8px 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Main Menu
          </p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: collapsed ? '10px' : '10px 12px',
                borderRadius: '10px',
                textDecoration: 'none',
                color: isActive ? '#6366f1' : textColor,
                background: isActive
                  ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)')
                  : 'transparent',
                fontWeight: isActive ? 600 : 400,
                fontSize: '14px',
                transition: 'all 0.15s ease',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
              })}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!collapsed && label}
            </NavLink>
          ))}
        </div>

        {!collapsed && (
          <p style={{ fontSize: '11px', color: textColor, padding: '16px 8px 8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Account
          </p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <NavLink
            to="/profile"
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: collapsed ? '10px' : '10px 12px',
              borderRadius: '10px',
              textDecoration: 'none',
              color: isActive ? '#6366f1' : textColor,
              background: isActive ? (isDark ? 'rgba(99,102,241,0.15)' : 'rgba(99,102,241,0.08)') : 'transparent',
              fontWeight: isActive ? 600 : 400,
              fontSize: '14px',
              transition: 'all 0.15s ease',
              justifyContent: collapsed ? 'center' : 'flex-start',
              borderLeft: isActive ? '3px solid #6366f1' : '3px solid transparent',
            })}
            title={collapsed ? 'Profile' : undefined}
          >
            <Settings size={18} style={{ flexShrink: 0 }} />
            {!collapsed && 'Settings'}
          </NavLink>
        </div>
      </nav>

      {/* User area */}
      <div style={{
        padding: '12px 10px',
        borderTop: `1px solid ${borderColor}`,
      }}>
        {collapsed ? (
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex', justifyContent: 'center',
              padding: '10px',
              borderRadius: '10px',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#f43f5e',
            }}
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', marginBottom: '4px' }}>
              <div style={{
                width: '34px', height: '34px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6366f1, #ec4899)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontSize: '13px', fontWeight: 700,
                flexShrink: 0,
              }}>
                {initials}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: isDark ? '#f1f5f9' : '#0f172a', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name || 'User'}
                </p>
                <p style={{ fontSize: '11px', color: textColor, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email || ''}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: '#f43f5e',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              <LogOut size={15} />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
