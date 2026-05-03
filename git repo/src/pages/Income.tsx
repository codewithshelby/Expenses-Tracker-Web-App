import { useState, useMemo } from 'react';
import { Plus, X, Trash2, Edit3, TrendingUp, DollarSign, Calendar, RefreshCw } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { useApp, formatCurrency, INCOME_CATEGORIES } from '../context/AppContext';
import type { Income } from '../context/AppContext';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const CATEGORY_COLORS_INCOME: Record<string, string> = {
  'Salary': '#6366f1', 'Freelance': '#22c55e', 'Business': '#f59e0b',
  'Investment': '#06b6d4', 'Rental': '#ec4899', 'Gift': '#a855f7', 'Other': '#94a3b8',
};

const EMPTY: Omit<Income, 'id'> = {
  title: '', amount: 0, category: 'Salary',
  date: new Date().toISOString().split('T')[0],
  description: '', isRecurring: false,
};

export default function IncomePage() {
  const { income, addIncome, updateIncome, deleteIncome, isDark, user } = useApp();
  const currency = user?.currency || 'USD';

  const [showForm, setShowForm] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [formData, setFormData] = useState<Omit<Income, 'id'>>(EMPTY);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [filterMonth, setFilterMonth] = useState('All');

  const cardBg = isDark ? '#161628' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#64748b' : '#94a3b8';
  const textSecondary = isDark ? '#94a3b8' : '#64748b';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const chartGrid = isDark ? '#1e1e3a' : '#f1f5f9';

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const months = useMemo(() => {
    const s = new Set(income.map(i => i.date.slice(0, 7)));
    return ['All', ...Array.from(s).sort().reverse()];
  }, [income]);

  const filtered = useMemo(() => {
    if (filterMonth === 'All') return [...income].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return income.filter(i => i.date.startsWith(filterMonth)).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [income, filterMonth]);

  const totalIncome = filtered.reduce((s, i) => s + i.amount, 0);

  const thisMonthIncome = income.filter(i => {
    const d = new Date(i.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  }).reduce((s, i) => s + i.amount, 0);

  const lastMonthIncome = income.filter(i => {
    const lm = currentMonth === 0 ? 11 : currentMonth - 1;
    const ly = currentMonth === 0 ? currentYear - 1 : currentYear;
    const d = new Date(i.date);
    return d.getMonth() === lm && d.getFullYear() === ly;
  }).reduce((s, i) => s + i.amount, 0);

  const change = lastMonthIncome ? ((thisMonthIncome - lastMonthIncome) / lastMonthIncome) * 100 : 0;

  // Monthly chart data
  const monthlyData = useMemo(() => {
    return Array.from({ length: 6 }, (_, idx) => {
      const mIdx = (currentMonth - 5 + idx + 12) % 12;
      const yr = mIdx > currentMonth ? currentYear - 1 : currentYear;
      const total = income.filter(i => {
        const d = new Date(i.date);
        return d.getMonth() === mIdx && d.getFullYear() === yr;
      }).reduce((s, i) => s + i.amount, 0);
      return { month: MONTHS[mIdx], amount: Math.round(total) };
    });
  }, [income, currentMonth, currentYear]);

  // Category breakdown
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    income.filter(i => {
      const d = new Date(i.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).forEach(i => {
      map[i.category] = (map[i.category] || 0) + i.amount;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  }, [income, currentMonth, currentYear]);

  const openAdd = () => {
    setEditingIncome(null);
    setFormData(EMPTY);
    setShowForm(true);
  };

  const openEdit = (i: Income) => {
    setEditingIncome(i);
    setFormData({ title: i.title, amount: i.amount, category: i.category, date: i.date, description: i.description || '', isRecurring: i.isRecurring });
    setShowForm(true);
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!formData.title || !formData.amount) return;
    if (editingIncome) {
      updateIncome({ ...formData, id: editingIncome.id });
    } else {
      addIncome(formData);
    }
    setShowForm(false);
    setEditingIncome(null);
    setFormData(EMPTY);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: '9px',
    border: `1px solid ${inputBorder}`, background: inputBg,
    color: textPrimary, fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: isDark ? '#1e1e38' : '#fff', border: `1px solid ${cardBorder}`, borderRadius: '10px', padding: '10px 14px' }}>
        <p style={{ fontSize: '12px', color: textMuted, margin: '0 0 4px' }}>{label}</p>
        <p style={{ fontSize: '14px', fontWeight: 700, color: '#22c55e', margin: 0 }}>{formatCurrency(payload[0].value, currency)}</p>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: textPrimary, margin: 0 }}>Income</h2>
          <p style={{ fontSize: '14px', color: textSecondary, margin: '4px 0 0' }}>
            Track and manage your income sources
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '10px 18px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #22c55e, #16a34a)',
            border: 'none', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
          }}
        >
          <Plus size={15} /> Add Income
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[
          { label: 'This Month', value: formatCurrency(thisMonthIncome, currency), change: `${change >= 0 ? '+' : ''}${change.toFixed(1)}% vs last month`, color: '#22c55e', icon: TrendingUp },
          { label: 'Last Month', value: formatCurrency(lastMonthIncome, currency), change: 'Previous period', color: '#6366f1', icon: Calendar },
          { label: 'Total (Filtered)', value: formatCurrency(totalIncome, currency), change: `${filtered.length} entries`, color: '#f59e0b', icon: DollarSign },
          { label: 'Recurring Income', value: formatCurrency(income.filter(i => i.isRecurring).reduce((s, x) => s + x.amount, 0), currency), change: 'Monthly recurring', color: '#06b6d4', icon: RefreshCw },
        ].map(card => (
          <div key={card.label} style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', color: textMuted }}>{card.label}</span>
              <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: `${card.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <card.icon size={16} color={card.color} />
              </div>
            </div>
            <p style={{ fontSize: '24px', fontWeight: 800, color: textPrimary, margin: '0 0 4px', letterSpacing: '-0.5px' }}>{card.value}</p>
            <span style={{ fontSize: '12px', color: card.color, fontWeight: 500 }}>{card.change}</span>
          </div>
        ))}
      </div>

      {/* Chart + Category */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '16px' }}>
        <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '22px' }}>
          <p style={{ fontSize: '15px', fontWeight: 700, color: textPrimary, margin: '0 0 4px' }}>Monthly Income</p>
          <p style={{ fontSize: '12px', color: textMuted, margin: '0 0 20px' }}>Last 6 months overview</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <CartesianGrid stroke={chartGrid} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} width={55} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                {monthlyData.map((entry, i) => (
                  <Cell key={i} fill={i === monthlyData.length - 1 ? '#22c55e' : 'rgba(34,197,94,0.4)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '22px' }}>
          <p style={{ fontSize: '15px', fontWeight: 700, color: textPrimary, margin: '0 0 4px' }}>By Source</p>
          <p style={{ fontSize: '12px', color: textMuted, margin: '0 0 18px' }}>This month breakdown</p>
          {categoryData.length === 0 ? (
            <p style={{ color: textMuted, fontSize: '13px' }}>No income this month</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {categoryData.map(c => {
                const color = CATEGORY_COLORS_INCOME[c.name] || '#94a3b8';
                const pct = (c.value / (categoryData.reduce((s, x) => s + x.value, 0))) * 100;
                return (
                  <div key={c.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', color: textSecondary, fontWeight: 500 }}>{c.name}</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: textPrimary }}>{formatCurrency(c.value, currency)}</span>
                    </div>
                    <div style={{ height: '6px', background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '100px', transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Filter + List */}
      <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: `1px solid ${cardBorder}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: textPrimary, margin: 0 }}>Income History</p>
          <select
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
            style={{ padding: '7px 12px', borderRadius: '9px', border: `1px solid ${inputBorder}`, background: inputBg, color: textPrimary, fontSize: '13px', outline: 'none' }}
          >
            {months.map(m => (
              <option key={m} value={m}>
                {m === 'All' ? 'All Time' : new Date(m + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', color: textMuted }}>
            <TrendingUp size={36} style={{ opacity: 0.3, marginBottom: '12px' }} />
            <p style={{ fontSize: '14px', color: textSecondary, margin: 0 }}>No income records found</p>
          </div>
        ) : (
          filtered.map((item, idx) => {
            const color = CATEGORY_COLORS_INCOME[item.category] || '#94a3b8';
            return (
              <div
                key={item.id}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 20px',
                  borderBottom: idx < filtered.length - 1 ? `1px solid ${cardBorder}` : 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <TrendingUp size={18} color={color} />
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, margin: 0 }}>{item.title}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                      <span style={{ fontSize: '11px', padding: '1px 7px', borderRadius: '100px', background: `${color}15`, color, fontWeight: 600 }}>{item.category}</span>
                      <span style={{ fontSize: '11px', color: textMuted }}>{new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      {item.isRecurring && (
                        <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '100px', background: 'rgba(99,102,241,0.12)', color: '#818cf8', display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <RefreshCw size={9} /> Recurring
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#22c55e' }}>
                    +{formatCurrency(item.amount, currency)}
                  </span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => openEdit(item)} style={{ width: '28px', height: '28px', borderRadius: '7px', border: `1px solid ${inputBorder}`, background: inputBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textMuted }}>
                      <Edit3 size={12} />
                    </button>
                    {deleteConfirm === item.id ? (
                      <button onClick={() => { deleteIncome(item.id); setDeleteConfirm(null); }} style={{ padding: '0 8px', height: '28px', borderRadius: '7px', border: '1px solid #f43f5e', background: 'rgba(244,63,94,0.12)', cursor: 'pointer', fontSize: '11px', color: '#f43f5e', fontWeight: 600 }}>Sure?</button>
                    ) : (
                      <button onClick={() => setDeleteConfirm(item.id)} style={{ width: '28px', height: '28px', borderRadius: '7px', border: `1px solid ${inputBorder}`, background: inputBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textMuted }}>
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: isDark ? '#131326' : '#ffffff', border: `1px solid ${cardBorder}`, borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 40px 80px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: textPrimary, margin: 0 }}>{editingIncome ? 'Edit Income' : 'Add Income'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: textMuted }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}>Title *</label>
                <input placeholder="e.g. Monthly Salary" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} required style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}>Amount *</label>
                  <input type="number" step="0.01" min="0" placeholder="0.00" value={formData.amount || ''} onChange={e => setFormData(p => ({ ...p, amount: parseFloat(e.target.value) || 0 }))} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}>Date *</label>
                  <input type="date" value={formData.date} onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} required style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}>Category</label>
                <select value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} style={inputStyle}>
                  {INCOME_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}>Description</label>
                <textarea placeholder="Optional notes..." value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={formData.isRecurring} onChange={e => setFormData(p => ({ ...p, isRecurring: e.target.checked }))} style={{ width: '16px', height: '16px', accentColor: '#22c55e' }} />
                <span style={{ fontSize: '13px', color: textSecondary }}>Recurring income</span>
              </label>
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '11px', borderRadius: '10px', border: `1px solid ${cardBorder}`, background: 'transparent', color: textSecondary, cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '11px', borderRadius: '10px', background: 'linear-gradient(135deg, #22c55e, #16a34a)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}>
                  {editingIncome ? 'Save Changes' : 'Add Income'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
