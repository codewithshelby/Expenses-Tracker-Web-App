import { useState, useMemo } from 'react';
import {
  Plus, Search, Filter, Trash2, Edit3, Upload, X, RefreshCw,
  ChevronDown, Calendar, CreditCard
} from 'lucide-react';
import { useApp, formatCurrency, EXPENSE_CATEGORIES, CATEGORY_COLORS, PAYMENT_METHODS } from '../context/AppContext';
import type { Expense } from '../context/AppContext';

const CATEGORY_EMOJIS: Record<string, string> = {
  'Food & Dining': '🍔', 'Transport': '🚗', 'Shopping': '🛍️',
  'Entertainment': '🎬', 'Bills & Utilities': '📋', 'Health & Fitness': '💪',
  'Travel': '✈️', 'Education': '📚', 'Other': '💰',
};

const EMPTY: Omit<Expense, 'id'> = {
  title: '', amount: 0, category: 'Food & Dining', date: new Date().toISOString().split('T')[0],
  description: '', isRecurring: false, paymentMethod: 'Credit Card',
};

export default function Expenses() {
  const { expenses, addExpense, updateExpense, deleteExpense, isDark, user } = useApp();
  const currency = user?.currency || 'USD';

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterMonth, setFilterMonth] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [formData, setFormData] = useState<Omit<Expense, 'id'>>(EMPTY);
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const cardBg = isDark ? '#161628' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#64748b' : '#94a3b8';
  const textSecondary = isDark ? '#94a3b8' : '#64748b';
  const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
  const inputBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const hoverBg = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)';

  const months = useMemo(() => {
    const s = new Set(expenses.map(e => e.date.slice(0, 7)));
    return ['All', ...Array.from(s).sort().reverse()];
  }, [expenses]);

  const filtered = useMemo(() => {
    let result = [...expenses];
    if (search) result = result.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase()));
    if (filterCategory !== 'All') result = result.filter(e => e.category === filterCategory);
    if (filterMonth !== 'All') result = result.filter(e => e.date.startsWith(filterMonth));
    result.sort((a, b) => {
      if (sortBy === 'date') {
        const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
        return sortDir === 'desc' ? diff : -diff;
      } else {
        return sortDir === 'desc' ? b.amount - a.amount : a.amount - b.amount;
      }
    });
    return result;
  }, [expenses, search, filterCategory, filterMonth, sortBy, sortDir]);

  const total = filtered.reduce((s, e) => s + e.amount, 0);

  const openAdd = () => {
    setEditingExpense(null);
    setFormData(EMPTY);
    setShowForm(true);
  };

  const openEdit = (e: Expense) => {
    setEditingExpense(e);
    setFormData({ title: e.title, amount: e.amount, category: e.category, date: e.date, description: e.description || '', isRecurring: e.isRecurring, recurringFrequency: e.recurringFrequency, paymentMethod: e.paymentMethod });
    setShowForm(true);
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!formData.title || !formData.amount) return;
    if (editingExpense) {
      updateExpense({ ...formData, id: editingExpense.id });
    } else {
      addExpense(formData);
    }
    setShowForm(false);
    setEditingExpense(null);
    setFormData(EMPTY);
  };

  const handleDelete = (id: string) => {
    deleteExpense(id);
    setDeleteConfirm(null);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: '9px',
    border: `1px solid ${inputBorder}`, background: inputBg,
    color: textPrimary, fontSize: '14px', outline: 'none',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: textPrimary, margin: 0 }}>Expenses</h2>
          <p style={{ fontSize: '14px', color: textSecondary, margin: '4px 0 0' }}>
            {filtered.length} transactions • Total: <span style={{ color: '#f43f5e', fontWeight: 700 }}>{formatCurrency(total, currency)}</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => alert('CSV import feature: upload your bank statement CSV to auto-import transactions!')}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '9px 16px', borderRadius: '10px',
              border: `1px solid ${cardBorder}`,
              background: cardBg, color: textSecondary,
              cursor: 'pointer', fontSize: '13px', fontWeight: 500,
            }}
          >
            <Upload size={15} /> Import CSV
          </button>
          <button
            onClick={openAdd}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '9px 16px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none', color: 'white',
              cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            }}
          >
            <Plus size={15} /> Add Expense
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{
        background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '14px',
        padding: '16px 20px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center',
      }}>
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '180px' }}>
          <Search size={15} color={textMuted} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            placeholder="Search expenses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ ...inputStyle, paddingLeft: '34px' }}
          />
        </div>

        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          style={{ ...inputStyle, width: 'auto', paddingRight: '28px', flex: '0 0 auto' }}
        >
          <option value="All">All Categories</option>
          {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select
          value={filterMonth}
          onChange={e => setFilterMonth(e.target.value)}
          style={{ ...inputStyle, width: 'auto', flex: '0 0 auto' }}
        >
          {months.map(m => (
            <option key={m} value={m}>
              {m === 'All' ? 'All Time' : new Date(m + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </option>
          ))}
        </select>

        <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto' }}>
          <button
            onClick={() => { setSortBy('date'); setSortDir(d => d === 'desc' ? 'asc' : 'desc'); }}
            style={{
              padding: '7px 12px', borderRadius: '8px',
              border: `1px solid ${sortBy === 'date' ? '#6366f1' : inputBorder}`,
              background: sortBy === 'date' ? 'rgba(99,102,241,0.12)' : inputBg,
              color: sortBy === 'date' ? '#6366f1' : textMuted,
              cursor: 'pointer', fontSize: '12px', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: '4px',
            }}
          >
            <Calendar size={13} /> Date {sortBy === 'date' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
          </button>
          <button
            onClick={() => { setSortBy('amount'); setSortDir(d => d === 'desc' ? 'asc' : 'desc'); }}
            style={{
              padding: '7px 12px', borderRadius: '8px',
              border: `1px solid ${sortBy === 'amount' ? '#6366f1' : inputBorder}`,
              background: sortBy === 'amount' ? 'rgba(99,102,241,0.12)' : inputBg,
              color: sortBy === 'amount' ? '#6366f1' : textMuted,
              cursor: 'pointer', fontSize: '12px', fontWeight: 500,
              display: 'flex', alignItems: 'center', gap: '4px',
            }}
          >
            Amount {sortBy === 'amount' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
          </button>
        </div>
      </div>

      {/* Category chips */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {['All', ...EXPENSE_CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            style={{
              padding: '5px 14px', borderRadius: '100px',
              border: `1px solid ${filterCategory === cat ? '#6366f1' : inputBorder}`,
              background: filterCategory === cat ? 'rgba(99,102,241,0.15)' : inputBg,
              color: filterCategory === cat ? '#6366f1' : textMuted,
              cursor: 'pointer', fontSize: '12px', fontWeight: 500,
              whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            {cat !== 'All' && `${CATEGORY_EMOJIS[cat] || ''} `}{cat}
          </button>
        ))}
      </div>

      {/* Expense List */}
      <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: textMuted }}>
            <CreditCard size={36} color={textMuted} style={{ marginBottom: '12px', opacity: 0.5 }} />
            <p style={{ fontSize: '15px', fontWeight: 600, color: textSecondary, margin: '0 0 6px' }}>No expenses found</p>
            <p style={{ fontSize: '13px', margin: 0 }}>Try adjusting your filters or add a new expense</p>
          </div>
        ) : (
          <div>
            {/* Table header */}
            <div style={{
              display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 100px',
              padding: '12px 20px',
              borderBottom: `1px solid ${cardBorder}`,
              fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em',
              color: textMuted, fontWeight: 600,
            }}>
              <span>Transaction</span>
              <span>Category</span>
              <span>Date</span>
              <span style={{ textAlign: 'right' }}>Amount</span>
              <span style={{ textAlign: 'center' }}>Actions</span>
            </div>

            {filtered.map((expense, idx) => (
              <div
                key={expense.id}
                style={{
                  display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 100px',
                  padding: '13px 20px',
                  borderBottom: idx < filtered.length - 1 ? `1px solid ${cardBorder}` : 'none',
                  alignItems: 'center',
                  transition: 'background 0.15s',
                  cursor: 'default',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = hoverBg}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: `${CATEGORY_COLORS[expense.category] || '#94a3b8'}18`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '16px', flexShrink: 0,
                  }}>
                    {CATEGORY_EMOJIS[expense.category] || '💰'}
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, margin: 0 }}>{expense.title}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                      <span style={{ fontSize: '11px', color: textMuted }}>{expense.paymentMethod}</span>
                      {expense.isRecurring && (
                        <span style={{
                          fontSize: '10px', padding: '1px 6px', borderRadius: '100px',
                          background: 'rgba(99,102,241,0.12)', color: '#818cf8',
                          display: 'flex', alignItems: 'center', gap: '3px',
                        }}>
                          <RefreshCw size={9} /> Recurring
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <span style={{
                    fontSize: '11px', padding: '3px 8px', borderRadius: '100px',
                    background: `${CATEGORY_COLORS[expense.category] || '#94a3b8'}18`,
                    color: CATEGORY_COLORS[expense.category] || '#94a3b8',
                    fontWeight: 600,
                  }}>
                    {expense.category}
                  </span>
                </div>

                <span style={{ fontSize: '13px', color: textSecondary }}>
                  {new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>

                <span style={{ fontSize: '15px', fontWeight: 700, color: '#f43f5e', textAlign: 'right' }}>
                  -{formatCurrency(expense.amount, currency)}
                </span>

                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                  <button
                    onClick={() => openEdit(expense)}
                    style={{
                      width: '30px', height: '30px', borderRadius: '8px',
                      border: `1px solid ${inputBorder}`, background: inputBg,
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: textMuted,
                    }}
                  >
                    <Edit3 size={13} />
                  </button>
                  {deleteConfirm === expense.id ? (
                    <button
                      onClick={() => handleDelete(expense.id)}
                      style={{
                        padding: '0 8px', height: '30px', borderRadius: '8px',
                        border: '1px solid #f43f5e', background: 'rgba(244,63,94,0.12)',
                        cursor: 'pointer', fontSize: '11px', color: '#f43f5e', fontWeight: 600,
                      }}
                    >
                      Sure?
                    </button>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(expense.id)}
                      style={{
                        width: '30px', height: '30px', borderRadius: '8px',
                        border: `1px solid ${inputBorder}`, background: inputBg,
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: textMuted,
                      }}
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px',
        }}>
          <div style={{
            background: isDark ? '#131326' : '#ffffff',
            border: `1px solid ${cardBorder}`,
            borderRadius: '20px', padding: '32px',
            width: '100%', maxWidth: '480px',
            boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: textPrimary, margin: 0 }}>
                {editingExpense ? 'Edit Expense' : 'Add Expense'}
              </h3>
              <button onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: textMuted }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}>Title *</label>
                <input
                  placeholder="e.g. Coffee at Starbucks"
                  value={formData.title}
                  onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}>Amount *</label>
                  <input
                    type="number" step="0.01" min="0"
                    placeholder="0.00"
                    value={formData.amount || ''}
                    onChange={e => setFormData(p => ({ ...p, amount: parseFloat(e.target.value) || 0 }))}
                    required
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}>Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}>Category</label>
                  <select value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} style={inputStyle}>
                    {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}>Payment Method</label>
                  <select value={formData.paymentMethod} onChange={e => setFormData(p => ({ ...p, paymentMethod: e.target.value }))} style={inputStyle}>
                    {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}>Note (optional)</label>
                <textarea
                  placeholder="Any additional notes..."
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  rows={2}
                  style={{ ...inputStyle, resize: 'vertical' }}
                />
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.isRecurring}
                  onChange={e => setFormData(p => ({ ...p, isRecurring: e.target.checked }))}
                  style={{ width: '16px', height: '16px', accentColor: '#6366f1' }}
                />
                <span style={{ fontSize: '13px', color: textSecondary }}>Recurring expense</span>
              </label>

              {formData.isRecurring && (
                <div>
                  <label style={{ fontSize: '12px', color: textMuted, display: 'block', marginBottom: '6px', fontWeight: 600 }}>Frequency</label>
                  <select value={formData.recurringFrequency || 'monthly'} onChange={e => setFormData(p => ({ ...p, recurringFrequency: e.target.value as any }))} style={inputStyle}>
                    {['daily', 'weekly', 'monthly', 'yearly'].map(f => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    flex: 1, padding: '11px', borderRadius: '10px',
                    border: `1px solid ${cardBorder}`,
                    background: 'transparent', color: textSecondary,
                    cursor: 'pointer', fontSize: '14px', fontWeight: 600,
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2, padding: '11px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    border: 'none', color: 'white',
                    cursor: 'pointer', fontSize: '14px', fontWeight: 700,
                  }}
                >
                  {editingExpense ? 'Save Changes' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
