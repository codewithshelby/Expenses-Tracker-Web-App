import { useState } from 'react';
import {
  User, Mail, Phone, Briefcase, Globe, Clock, Bell, Lock,
  Eye, EyeOff, CheckCircle, Camera, Shield, Trash2
} from 'lucide-react';
import { useApp, CURRENCIES, TIMEZONES } from '../context/AppContext';

export default function Profile() {
  const { user, updateProfile, logout, isDark } = useApp();

  const [activeTab, setActiveTab] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Shelby',
    email: user?.email || '',
    phone: user?.phone || '',
    jobTitle: user?.jobTitle || '',
    currency: user?.currency || 'USD',
    timezone: user?.timezone || 'America/New_York',
  });

  const [passwordData, setPasswordData] = useState({
    current: '',
    newPass: '',
    confirm: '',
  });

  const [notifications, setNotifications] = useState({
    budgetAlerts: user?.notifications?.budgetAlerts ?? true,
    weeklyReports: user?.notifications?.weeklyReports ?? true,
    monthlyReports: user?.notifications?.monthlyReports ?? true,
    expenseReminders: user?.notifications?.expenseReminders ?? false,
  });

  const cardBg = isDark ? '#161628' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#64748b' : '#94a3b8';
  const textSecondary = isDark ? '#94a3b8' : '#64748b';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : 'US';

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileData.name,
      email: profileData.email,
      phone: profileData.phone,
      jobTitle: profileData.jobTitle,
      currency: profileData.currency,
      timezone: profileData.timezone,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleSaveNotifications = () => {
    updateProfile({ notifications });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPass !== passwordData.confirm) {
      alert('Passwords do not match.');
      return;
    }
    if (passwordData.newPass.length < 8) {
      alert('Password must be at least 8 characters.');
      return;
    }
    setPasswordData({ current: '', newPass: '', confirm: '' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 13px', borderRadius: '10px',
    border: `1px solid ${inputBorder}`, background: inputBg,
    color: textPrimary, fontSize: '14px', outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '820px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: textPrimary, margin: 0 }}>Profile & Settings</h2>
        <p style={{ fontSize: '14px', color: textSecondary, margin: '4px 0 0' }}>
          Manage your account and preferences
        </p>
      </div>

      {/* Profile Card */}
      <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1, #ec4899)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', fontWeight: 800, color: 'white',
            }}>
              {initials}
            </div>
            <button
              onClick={() => alert('Avatar upload: click to upload a profile photo!')}
              style={{
                position: 'absolute', bottom: 0, right: 0,
                width: '24px', height: '24px', borderRadius: '50%',
                background: '#6366f1', border: '2px solid',
                borderColor: isDark ? '#0a0a14' : '#f1f5f9',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Camera size={12} color="white" />
            </button>
          </div>
          <div>
            <p style={{ fontSize: '18px', fontWeight: 800, color: textPrimary, margin: 0 }}>{user?.name}</p>
            <p style={{ fontSize: '14px', color: textMuted, margin: '2px 0 0' }}>{user?.email}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '100px', background: 'rgba(99,102,241,0.12)', color: '#818cf8', fontWeight: 600 }}>
                Pro Plan
              </span>
              <span style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '100px', background: 'rgba(34,197,94,0.12)', color: '#4ade80', fontWeight: 600 }}>
                ✓ Verified
              </span>
            </div>
          </div>
          {saved && (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px', color: '#22c55e', fontSize: '13px', fontWeight: 600 }}>
              <CheckCircle size={16} /> Saved!
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '12px', padding: '4px' }}>
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
              padding: '9px', borderRadius: '9px',
              background: activeTab === id ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
              border: 'none', color: activeTab === id ? 'white' : textMuted,
              cursor: 'pointer', fontSize: '13px', fontWeight: activeTab === id ? 700 : 500,
              transition: 'all 0.15s',
            }}
          >
            <Icon size={15} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '28px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: textPrimary, margin: '0 0 20px' }}>Personal Information</h3>
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}> Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={15} color={textMuted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input value={profileData.name} onChange={e => setProfileData(p => ({ ...p, name: e.target.value }))} style={{ ...inputStyle, paddingLeft: '36px' }} placeholder="Shelby" />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} color={textMuted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="email" value={profileData.email} onChange={e => setProfileData(p => ({ ...p, email: e.target.value }))} style={{ ...inputStyle, paddingLeft: '36px' }} placeholder="Shelby@proton.me" />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={15} color={textMuted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input value={profileData.phone} onChange={e => setProfileData(p => ({ ...p, phone: e.target.value }))} style={{ ...inputStyle, paddingLeft: '36px' }} placeholder="+27 620" />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}>Job Title</label>
                <div style={{ position: 'relative' }}>
                  <Briefcase size={15} color={textMuted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input value={profileData.jobTitle} onChange={e => setProfileData(p => ({ ...p, jobTitle: e.target.value }))} style={{ ...inputStyle, paddingLeft: '36px' }} placeholder="e.g. Software Engineer" />
                </div>
              </div>
            </div>

            <button type="submit" style={{ alignSelf: 'flex-start', padding: '10px 24px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}>
              Save Profile
            </button> 
          </form>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '28px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: textPrimary, margin: '0 0 20px' }}>Regional Preferences</h3>
          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                <Globe size={13} style={{ display: 'inline', marginRight: '5px' }} />
                Default Currency
              </label>
              <select value={profileData.currency} onChange={e => setProfileData(p => ({ ...p, currency: e.target.value }))} style={inputStyle}>
                {CURRENCIES.map(c => (
                  <option key={c.code} value={c.code}>{c.symbol} {c.code} — {c.name}</option>
                ))}
              </select>
              <p style={{ fontSize: '12px', color: textMuted, margin: '6px 0 0' }}>
                All amounts will be displayed in your selected currency
              </p>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                <Clock size={13} style={{ display: 'inline', marginRight: '5px' }} />
                Timezone
              </label>
              <select value={profileData.timezone} onChange={e => setProfileData(p => ({ ...p, timezone: e.target.value }))} style={inputStyle}>
                {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', borderRadius: '12px', padding: '16px 18px' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: textSecondary, margin: 0 }}>Display Options</p>
              {[
                { key: 'darkMode', label: 'Dark Mode', sub: 'Use dark theme throughout the app' },
                { key: 'compactView', label: 'Compact View', sub: 'Show more data with less spacing' },
                { key: 'showCents', label: 'Show Cents', sub: 'Display decimal places in amounts' },
              ].map(opt => (
                <label key={opt.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                  <div>
                    <p style={{ fontSize: '13px', color: textPrimary, margin: 0, fontWeight: 500 }}>{opt.label}</p>
                    <p style={{ fontSize: '11px', color: textMuted, margin: 0 }}>{opt.sub}</p>
                  </div>
                  <div
                    style={{
                      width: '42px', height: '24px', borderRadius: '12px',
                      background: opt.key === 'darkMode' ? '#6366f1' : isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
                      position: 'relative', cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div style={{
                      position: 'absolute', top: '3px',
                      left: opt.key === 'darkMode' ? '21px' : '3px',
                      width: '18px', height: '18px', borderRadius: '50%',
                      background: 'white', transition: 'left 0.2s',
                    }} />
                  </div>
                </label>
              ))}
            </div>

            <button type="submit" style={{ alignSelf: 'flex-start', padding: '10px 24px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}>
              Save Preferences
            </button>
          </form>
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '28px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: textPrimary, margin: '0 0 6px' }}>Notification Settings</h3>
          <p style={{ fontSize: '13px', color: textMuted, margin: '0 0 24px' }}>Choose what you want to be notified about</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {[
              { key: 'budgetAlerts', label: 'Budget Alerts', sub: 'Get notified when you\'re approaching or over your budget limits', icon: '🚨' },
              { key: 'weeklyReports', label: 'Weekly Reports', sub: 'Receive a weekly summary of your spending every Monday', icon: '📊' },
              { key: 'monthlyReports', label: 'Monthly Reports', sub: 'Get a detailed monthly financial report via email', icon: '📈' },
              { key: 'expenseReminders', label: 'Expense Reminders', sub: 'Daily reminders to log your expenses', icon: '⏰' },
            ].map((notif, idx) => (
              <div key={notif.key} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '16px 0',
                borderBottom: idx < 3 ? `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}` : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontSize: '22px' }}>{notif.icon}</span>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: textPrimary, margin: 0 }}>{notif.label}</p>
                    <p style={{ fontSize: '12px', color: textMuted, margin: '2px 0 0' }}>{notif.sub}</p>
                  </div>
                </div>
                <button
                  onClick={() => setNotifications(p => ({ ...p, [notif.key]: !p[notif.key as keyof typeof p] }))}
                  style={{
                    width: '46px', height: '26px', borderRadius: '13px',
                    background: notifications[notif.key as keyof typeof notifications] ? '#6366f1' : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'),
                    border: 'none', cursor: 'pointer', position: 'relative', flexShrink: 0,
                    transition: 'background 0.2s',
                  }}
                >
                  <div style={{
                    position: 'absolute', top: '4px',
                    left: notifications[notif.key as keyof typeof notifications] ? '23px' : '4px',
                    width: '18px', height: '18px', borderRadius: '50%', background: 'white',
                    transition: 'left 0.2s',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                  }} />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveNotifications}
            style={{ marginTop: '20px', padding: '10px 24px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}
          >
            Save Notifications
          </button>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <Shield size={18} color="#6366f1" />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: textPrimary, margin: 0 }}>Change Password</h3>
            </div>
            <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}>Current Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} color={textMuted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type={showCurrentPass ? 'text' : 'password'} value={passwordData.current} onChange={e => setPasswordData(p => ({ ...p, current: e.target.value }))} style={{ ...inputStyle, paddingLeft: '36px', paddingRight: '42px' }} placeholder="Enter current password" />
                  <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: textMuted }}>
                    {showCurrentPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} color={textMuted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type={showNewPass ? 'text' : 'password'} value={passwordData.newPass} onChange={e => setPasswordData(p => ({ ...p, newPass: e.target.value }))} style={{ ...inputStyle, paddingLeft: '36px', paddingRight: '42px' }} placeholder="At least 8 characters" />
                  <button type="button" onClick={() => setShowNewPass(!showNewPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: textMuted }}>
                    {showNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {passwordData.newPass && (
                  <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{
                        flex: 1, height: '3px', borderRadius: '100px',
                        background: passwordData.newPass.length >= i * 2
                          ? (passwordData.newPass.length < 6 ? '#f43f5e' : passwordData.newPass.length < 10 ? '#f59e0b' : '#22c55e')
                          : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)'),
                      }} />
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}>Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} color={textMuted} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input type="password" value={passwordData.confirm} onChange={e => setPasswordData(p => ({ ...p, confirm: e.target.value }))} style={{ ...inputStyle, paddingLeft: '36px' }} placeholder="Repeat new password" />
                  {passwordData.confirm && passwordData.newPass === passwordData.confirm && (
                    <CheckCircle size={15} color="#22c55e" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  )}
                </div>
              </div>
              <button type="submit" style={{ alignSelf: 'flex-start', padding: '10px 24px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}>
                Update Password
              </button>
            </form>
          </div>

          {/* Danger Zone */}
          <div style={{ background: 'rgba(244,63,94,0.06)', border: '1px solid rgba(244,63,94,0.2)', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Trash2 size={16} color="#f43f5e" />
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#f43f5e', margin: 0 }}>Danger Zone</h3>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, margin: 0 }}>Delete Account</p>
                <p style={{ fontSize: '12px', color: textMuted, margin: '3px 0 0' }}>
                  Permanently delete your account and all associated data. This cannot be undone.
                </p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                    logout();
                  }
                }}
                style={{
                  padding: '9px 18px', borderRadius: '10px',
                  background: 'rgba(244,63,94,0.12)',
                  border: '1px solid rgba(244,63,94,0.3)',
                  color: '#f43f5e', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
