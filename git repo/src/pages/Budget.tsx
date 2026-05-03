import { useState, useMemo } from 'react';
import { Plus, X, Trash2, Edit3, Target, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useApp, formatCurrency, EXPENSE_CATEGORIES, CATEGORY_COLORS } from '../context/AppContext';
import type { Budget } from '../context/AppContext';

const CATEGORY_EMOJIS: Record<string, string> = {
  'Food & Dining': '🍔', 'Transport': '🚗', 'Shopping': '🛍️',
  'Entertainment': '🎬', 'Bills & Utilities': '📋', 'Health & Fitness': '💪',
  'Travel': '✈️', 'Education': '📚', 'Other': '💰',
};

const EMPTY: Omit<Budget, 'id'> = {
  category: 'Food & Dining', limit: 500, period: 'monthly', alertAt: 80,
};

export default function BudgetPage() {
  const { budgets, saveBudget, deleteBudget, expenses, isDark, user } = useApp();
  const currency = user?.currency || 'USD';

  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [formData, setFormData] = useState<Omit<Budget, 'id'>>(EMPTY);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const cardBg = isDark ? '#161628' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#64748b' : '#94a3b8';
  const textSecondary = isDark ? '#94a3b8' : '#64748b';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthExpenses = useMemo(() =>
    expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }), [expenses, currentMonth, currentYear]);

  const budgetData = useMemo(() =>
    budgets.map(b => {
      const spent = thisMonthExpenses.filter(e => e.category === b.category).reduce((s, e) => s + e.amount, 0);
      const pct = Math.min((spent / b.limit) * 100, 100);
      const status = pct >= 100 ? 'over' : pct >= b.alertAt ? 'warning' : 'ok';
      return { ...b, spent, pct, status };
    }).sort((a, b) => b.pct - a.pct),
    [budgets, thisMonthExpenses]);

  const overBudget = budgetData.filter(b => b.status === 'over').length;
  const warningBudget = budgetData.filter(b => b.status === 'warning').length;
  const totalBudget = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgetData.reduce((s, b) => s + b.spent, 0);

  const openAdd = () => {
    setEditingBudget(null);
    setFormData(EMPTY);
    setShowForm(true);
  };

  const openEdit = (b: Budget) => {
    setEditingBudget(b);
    setFormData({ category: b.category, limit: b.limit, period: b.period, alertAt: b.alertAt });
    setShowForm(true);
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!formData.limit) return;
    saveBudget(editingBudget ? { ...formData, id: editingBudget.id } : formData);
    setShowForm(false);
    setEditingBudget(null);
    setFormData(EMPTY);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: '9px',
    border: `1px solid ${inputBorder}`, background: inputBg,
    color: textPrimary, fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  };

  const getStatusColor = (status: string) => {
    if (status === 'over') return '#f43f5e';
    if (status === 'warning') return '#f59e0b';
    return '#22c55e';
  };

  const getBarColor = (status: string, color: string) => {
    if (status === 'over') return '#f43f5e';
    if (status === 'warning') return '#f59e0b';
    return color || '#6366f1';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: textPrimary, margin: 0 }}>Budget Manager</h2>
          <p style={{ fontSize: '14px', color: textSecondary, margin: '4px 0 0' }}>
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} budget overview
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{
            display: 'flex', alignItems: 'center', gap: '7px',
            padding: '10px 18px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
          }}
        >
          <Plus size={15} /> New Budget
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        {[
          { label: 'Total Budget', value: formatCurrency(totalBudget, currency), color: '#6366f1', icon: Target },
          { label: 'Total Spent', value: formatCurrency(totalSpent, currency), color: '#f43f5e', icon: TrendingUp },
          { label: 'Remaining', value: formatCurrency(Math.max(0, totalBudget - totalSpent), currency), color: '#22c55e', icon: CheckCircle },
          { label: 'Alerts Active', value: `${overBudget + warningBudget}`, sub: `${overBudget} over, ${warningBudget} near limit`, color: overBudget > 0 ? '#f43f5e' : '#f59e0b', icon: AlertTriangle },
        ].map(card => (
          <div key={card.label} style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', color: textMuted }}>{card.label}</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '9px', background: `${card.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <card.icon size={15} color={card.color} />
              </div>
            </div>
            <p style={{ fontSize: '22px', fontWeight: 800, color: textPrimary, margin: '0 0 2px', letterSpacing: '-0.5px' }}>{card.value}</p>
            {(card as any).sub && <span style={{ fontSize: '11px', color: card.color }}>{(card as any).sub}</span>}
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      {totalBudget > 0 && (
        <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: textPrimary, margin: 0 }}>Overall Budget Health</p>
              <p style={{ fontSize: '12px', color: textMuted, margin: '3px 0 0' }}>
                {formatCurrency(totalSpent, currency)} of {formatCurrency(totalBudget, currency)} spent
              </p>
            </div>
            <span style={{
              fontSize: '20px', fontWeight: 800,
              color: (totalSpent / totalBudget) > 0.9 ? '#f43f5e' : (totalSpent / totalBudget) > 0.75 ? '#f59e0b' : '#22c55e',
            }}>
              {Math.round((totalSpent / totalBudget) * 100)}%
            </span>
          </div>
          <div style={{ height: '10px', background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)', borderRadius: '100px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%`,
              background: (totalSpent / totalBudget) > 0.9 ? '#f43f5e' : (totalSpent / totalBudget) > 0.75 ? '#f59e0b' : 'linear-gradient(90deg, #6366f1, #22c55e)',
              borderRadius: '100px',
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      )}

      {/* Budget Cards Grid */}
      {budgetData.length === 0 ? (
        <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '60px 20px', textAlign: 'center' }}>
          <Target size={40} color={textMuted} style={{ opacity: 0.4, marginBottom: '14px' }} />
          <p style={{ fontSize: '16px', fontWeight: 700, color: textSecondary, margin: '0 0 8px' }}>No budgets yet</p>
          <p style={{ fontSize: '13px', color: textMuted, margin: '0 0 20px' }}>Set spending limits to keep track of where your money goes</p>
          <button onClick={openAdd} style={{ padding: '10px 20px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>
            Create First Budget
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          {budgetData.map(b => {
            const catColor = CATEGORY_COLORS[b.category] || '#6366f1';
            const barColor = getBarColor(b.status, catColor);
            const statusColor = getStatusColor(b.status);
            return (
              <div key={b.id} style={{
                background: cardBg, borderRadius: '16px', padding: '22px',
                border: `1px solid ${b.status !== 'ok' ? `${statusColor}30` : cardBorder}`,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: `${catColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                      {CATEGORY_EMOJIS[b.category] || '💰'}
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: textPrimary, margin: 0 }}>{b.category}</p>
                      <span style={{ fontSize: '11px', color: textMuted, textTransform: 'capitalize' }}>{b.period}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '11px', padding: '3px 8px', borderRadius: '100px',
                      background: `${statusColor}18`, color: statusColor, fontWeight: 600,
                    }}>
                      {b.status === 'over' ? '🚨 Over budget' : b.status === 'warning' ? '⚠️ Near limit' : '✅ On track'}
                    </span>
                    <button onClick={() => openEdit(b)} style={{ width: '27px', height: '27px', borderRadius: '7px', border: `1px solid ${inputBorder}`, background: inputBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textMuted }}>
                      <Edit3 size={12} />
                    </button>
                    {deleteConfirm === b.id ? (
                      <button onClick={() => { deleteBudget(b.id); setDeleteConfirm(null); }} style={{ padding: '0 8px', height: '27px', borderRadius: '7px', border: '1px solid #f43f5e', background: 'rgba(244,63,94,0.12)', cursor: 'pointer', fontSize: '11px', color: '#f43f5e', fontWeight: 600 }}>Sure?</button>
                    ) : (
                      <button onClick={() => setDeleteConfirm(b.id)} style={{ width: '27px', height: '27px', borderRadius: '7px', border: `1px solid ${inputBorder}`, background: inputBg, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: textMuted }}>
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', color: textMuted }}>
                      {formatCurrency(b.spent, currency)} spent
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: statusColor }}>
                      {b.pct.toFixed(0)}%
                    </span>
                  </div>
                  <div style={{ height: '8px', background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)', borderRadius: '100px', overflow: 'hidden', position: 'relative' }}>
                    <div style={{
                      height: '100%', width: `${b.pct}%`,
                      background: barColor,
                      borderRadius: '100px',
                      transition: 'width 0.5s ease',
                    }} />
                    {/* Alert threshold marker */}
                    <div style={{
                      position: 'absolute', top: 0, bottom: 0,
                      left: `${b.alertAt}%`,
                      width: '2px',
                      background: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                    <span style={{ fontSize: '11px', color: textMuted }}>$0</span>
                    <span style={{ fontSize: '11px', color: textMuted }}>Limit: {formatCurrency(b.limit, currency)}</span>
                  </div>
                </div>

                {/* Remaining */}
                <div style={{
                  background: b.status === 'over' ? 'rgba(244,63,94,0.08)' : b.status === 'warning' ? 'rgba(245,158,11,0.08)' : 'rgba(34,197,94,0.08)',
                  borderRadius: '10px', padding: '10px 12px',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <span style={{ fontSize: '12px', color: textMuted }}>
                    {b.status === 'over' ? 'Over by' : 'Remaining'}
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: statusColor }}>
                    {b.status === 'over'
                      ? formatCurrency(b.spent - b.limit, currency)
                      : formatCurrency(b.limit - b.spent, currency)}
                  </span>
                </div>

                <p style={{ fontSize: '11px', color: textMuted, margin: '8px 0 0' }}>
                  Alert threshold: {b.alertAt}% ({formatCurrency((b.alertAt / 100) * b.limit, currency)})
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: isDark ? '#131326' : '#ffffff', border: `1px solid ${cardBorder}`, borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '440px', boxShadow: '0 40px 80px rgba(0,0,0,0.4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: textPrimary, margin: 0 }}>{editingBudget ? 'Edit Budget' : 'Create Budget'}</h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: textMuted }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}>Category</label>
                <select value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} style={inputStyle}>
                  {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_EMOJIS[c]} {c}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}>Budget Limit ($)</label>
                  <input type="number" step="1" min="1" placeholder="500" value={formData.limit || ''} onChange={e => setFormData(p => ({ ...p, limit: parseFloat(e.target.value) || 0 }))} required style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}>Period</label>
                  <select value={formData.period} onChange={e => setFormData(p => ({ ...p, period: e.target.value as any }))} style={inputStyle}>
                    <option value="monthly">Monthly</option>
                    <option value="weekly">Weekly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                  Alert Threshold: <span style={{ color: '#f59e0b', fontWeight: 700 }}>{formData.alertAt}%</span>
                </label>
                <input
                  type="range" min="50" max="100" step="5"
                  value={formData.alertAt}
                  onChange={e => setFormData(p => ({ ...p, alertAt: parseInt(e.target.value) }))}
                  style={{ width: '100%', accentColor: '#f59e0b' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  <span style={{ fontSize: '11px', color: textMuted }}>50%</span>
                  <span style={{ fontSize: '11px', color: textMuted }}>You'll be alerted at {formatCurrency((formData.alertAt / 100) * formData.limit, currency)}</span>
                  <span style={{ fontSize: '11px', color: textMuted }}>100%</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '11px', borderRadius: '10px', border: `1px solid ${cardBorder}`, background: 'transparent', color: textSecondary, cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>Cancel</button>
                <button type="submit" style={{ flex: 2, padding: '11px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: 'none', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}>
                  {editingBudget ? 'Save Changes' : 'Create Budget'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
