import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Target, Plus, ArrowUpRight, ArrowDownRight, AlertTriangle } from 'lucide-react';
import { useApp, formatCurrency, CATEGORY_COLORS } from '../context/AppContext';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Dashboard() {
  const { expenses, income, budgets, user, isDark } = useApp();
  const navigate = useNavigate();
  const currency = user?.currency || 'USD';

  const cardBg = isDark ? '#161628' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textMuted = isDark ? '#64748b' : '#94a3b8';
  const textSecondary = isDark ? '#94a3b8' : '#64748b';
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const chartGrid = isDark ? '#1e1e3a' : '#f1f5f9';

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // This month's data
  const thisMonthExpenses = useMemo(() =>
    expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }), [expenses, currentMonth, currentYear]);

  const lastMonthExpenses = useMemo(() => {
    const lm = currentMonth === 0 ? 11 : currentMonth - 1;
    const ly = currentMonth === 0 ? currentYear - 1 : currentYear;
    return expenses.filter(e => {
      const d = new Date(e.date);
      return d.getMonth() === lm && d.getFullYear() === ly;
    });
  }, [expenses, currentMonth, currentYear]);

  const thisMonthIncome = useMemo(() =>
    income.filter(i => {
      const d = new Date(i.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }), [income, currentMonth, currentYear]);

  const totalExpenses = thisMonthExpenses.reduce((s, e) => s + e.amount, 0);
  const lastMonthTotal = lastMonthExpenses.reduce((s, e) => s + e.amount, 0);
  const totalIncome = thisMonthIncome.reduce((s, i) => s + i.amount, 0);
  const netSavings = totalIncome - totalExpenses;
  const expenseChange = lastMonthTotal ? ((totalExpenses - lastMonthTotal) / lastMonthTotal) * 100 : 0;

  // Monthly chart data (last 6 months)
  const monthlyData = useMemo(() => {
    return Array.from({ length: 6 }, (_, idx) => {
      const mIdx = (currentMonth - 5 + idx + 12) % 12;
      const yr = mIdx > currentMonth ? currentYear - 1 : currentYear;
      const exp = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === mIdx && d.getFullYear() === yr;
      }).reduce((s, e) => s + e.amount, 0);
      const inc = income.filter(i => {
        const d = new Date(i.date);
        return d.getMonth() === mIdx && d.getFullYear() === yr;
      }).reduce((s, i) => s + i.amount, 0);
      return { month: MONTHS[mIdx], expenses: Math.round(exp), income: Math.round(inc) };
    });
  }, [expenses, income, currentMonth, currentYear]);

  // Category breakdown for this month
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    thisMonthExpenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: Math.round(value), color: CATEGORY_COLORS[name] || '#94a3b8' }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [thisMonthExpenses]);

  // Budget alerts
  const budgetAlerts = useMemo(() => {
    return budgets.map(b => {
      const spent = thisMonthExpenses.filter(e => e.category === b.category).reduce((s, e) => s + e.amount, 0);
      const pct = (spent / b.limit) * 100;
      return { ...b, spent, pct: Math.min(pct, 100) };
    }).filter(b => b.pct >= b.alertAt);
  }, [budgets, thisMonthExpenses]);

  // Recent transactions
  const recentTransactions = useMemo(() =>
    [...expenses].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6),
    [expenses]);

  const summaryCards = [
    {
      label: 'Total Expenses',
      value: formatCurrency(totalExpenses, currency),
      change: `${expenseChange >= 0 ? '+' : ''}${expenseChange.toFixed(1)}% vs last month`,
      icon: TrendingDown,
      iconColor: '#f43f5e',
      iconBg: 'rgba(244,63,94,0.12)',
      changeColor: expenseChange > 0 ? '#f43f5e' : '#22c55e',
      trend: expenseChange > 0 ? 'up' : 'down',
    },
    {
      label: 'Total Income',
      value: formatCurrency(totalIncome, currency),
      change: 'This month',
      icon: TrendingUp,
      iconColor: '#22c55e',
      iconBg: 'rgba(34,197,94,0.12)',
      changeColor: '#22c55e',
      trend: 'up',
    },
    {
      label: 'Net Savings',
      value: formatCurrency(netSavings, currency),
      change: `${totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(0) : 0}% of income saved`,
      icon: Wallet,
      iconColor: '#6366f1',
      iconBg: 'rgba(99,102,241,0.12)',
      changeColor: netSavings >= 0 ? '#6366f1' : '#f43f5e',
      trend: 'up',
    },
    {
      label: 'Active Budgets',
      value: `${budgets.length}`,
      change: `${budgetAlerts.length} alert${budgetAlerts.length !== 1 ? 's' : ''} active`,
      icon: Target,
      iconColor: '#f59e0b',
      iconBg: 'rgba(245,158,11,0.12)',
      changeColor: budgetAlerts.length > 0 ? '#f59e0b' : '#22c55e',
      trend: 'neutral',
    },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background: isDark ? '#1e1e38' : '#ffffff',
        border: `1px solid ${cardBorder}`,
        borderRadius: '10px',
        padding: '10px 14px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
      }}>
        <p style={{ fontSize: '12px', color: textMuted, margin: '0 0 6px' }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ fontSize: '13px', color: p.color, margin: '2px 0', fontWeight: 600 }}>
            {p.name}: {formatCurrency(p.value, currency)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Welcome */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: textPrimary, margin: 0, letterSpacing: '-0.3px' }}>
            Good morning, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p style={{ fontSize: '14px', color: textSecondary, margin: '4px 0 0' }}>
            Here's what's happening with your finances this month.
          </p>
        </div>
        <button
          onClick={() => navigate('/expenses')}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            border: 'none', color: 'white', cursor: 'pointer',
            fontSize: '13px', fontWeight: 600,
          }}
        >
          <Plus size={15} /> Add Expense
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {summaryCards.map(card => (
          <div key={card.label} style={{
            background: cardBg,
            border: `1px solid ${cardBorder}`,
            borderRadius: '16px',
            padding: '20px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <p style={{ fontSize: '13px', color: textMuted, margin: 0 }}>{card.label}</p>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: card.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <card.icon size={18} color={card.iconColor} />
              </div>
            </div>
            <p style={{ fontSize: '26px', fontWeight: 800, color: textPrimary, margin: '0 0 6px', letterSpacing: '-0.5px' }}>
              {card.value}
            </p>
            <span style={{ fontSize: '12px', color: card.changeColor, fontWeight: 500 }}>
              {card.trend === 'up' && card.changeColor === '#22c55e' ? '↑ ' : card.trend === 'up' ? '↑ ' : '↓ '}
              {card.change}
            </span>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '16px' }}>
        {/* Area Chart */}
        <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <p style={{ fontSize: '15px', fontWeight: 700, color: textPrimary, margin: 0 }}>Cash Flow</p>
              <p style={{ fontSize: '12px', color: textMuted, margin: '3px 0 0' }}>Income vs Expenses — last 6 months</p>
            </div>
            <div style={{ display: 'flex', gap: '14px' }}>
              {[{ color: '#6366f1', label: 'Income' }, { color: '#f43f5e', label: 'Expenses' }].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color }} />
                  <span style={{ fontSize: '12px', color: textMuted }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={chartGrid} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} width={55} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={2.5} fill="url(#incomeGrad)" name="Income" />
              <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2.5} fill="url(#expGrad)" name="Expenses" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '22px' }}>
          <p style={{ fontSize: '15px', fontWeight: 700, color: textPrimary, margin: '0 0 4px' }}>By Category</p>
          <p style={{ fontSize: '12px', color: textMuted, margin: '0 0 16px' }}>This month's spending</p>
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatCurrency(v, currency)} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                {categoryData.slice(0, 4).map(c => (
                  <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: c.color, flexShrink: 0 }} />
                      <span style={{ fontSize: '12px', color: textMuted }}>{c.name}</span>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: textPrimary }}>{formatCurrency(c.value, currency)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: textMuted, fontSize: '14px' }}>
              No expenses this month
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px' }}>
        {/* Recent Transactions */}
        <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <p style={{ fontSize: '15px', fontWeight: 700, color: textPrimary, margin: 0 }}>Recent Transactions</p>
            <button
              onClick={() => navigate('/expenses')}
              style={{ fontSize: '13px', color: '#6366f1', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 500 }}
            >
              View all →
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {recentTransactions.map(tx => (
              <div key={tx.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 12px', borderRadius: '10px',
                transition: 'background 0.15s',
              }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '38px', height: '38px',
                    borderRadius: '10px',
                    background: `${CATEGORY_COLORS[tx.category] || '#94a3b8'}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontSize: '16px' }}>
                      {tx.category === 'Food & Dining' ? '🍔' : tx.category === 'Transport' ? '🚗' : tx.category === 'Shopping' ? '🛍️' : tx.category === 'Entertainment' ? '🎬' : tx.category === 'Bills & Utilities' ? '📋' : tx.category === 'Health & Fitness' ? '💪' : tx.category === 'Travel' ? '✈️' : tx.category === 'Education' ? '📚' : '💰'}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: textPrimary, margin: 0 }}>{tx.title}</p>
                    <p style={{ fontSize: '11px', color: textMuted, margin: 0 }}>
                      {tx.category} • {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#f43f5e' }}>
                  -{formatCurrency(tx.amount, currency)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Alerts + Quick Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {budgetAlerts.length > 0 && (
            <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '16px', padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <AlertTriangle size={16} color="#f59e0b" />
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#f59e0b', margin: 0 }}>Budget Alerts</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {budgetAlerts.slice(0, 3).map(b => (
                  <div key={b.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', color: textSecondary }}>{b.category}</span>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: b.pct >= 100 ? '#f43f5e' : '#f59e0b' }}>
                        {b.pct.toFixed(0)}%
                      </span>
                    </div>
                    <div style={{ height: '5px', background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)', borderRadius: '100px', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${b.pct}%`,
                        background: b.pct >= 100 ? '#f43f5e' : '#f59e0b',
                        borderRadius: '100px',
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                    <p style={{ fontSize: '11px', color: textMuted, margin: '3px 0 0' }}>
                      {formatCurrency(b.spent, currency)} of {formatCurrency(b.limit, currency)}
                    </p>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/budget')} style={{ marginTop: '12px', fontSize: '12px', color: '#f59e0b', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}>
                Manage budgets →
              </button>
            </div>
          )}

          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '18px' }}>
            <p style={{ fontSize: '14px', fontWeight: 700, color: textPrimary, margin: '0 0 14px' }}>Quick Stats</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { label: 'Avg daily spend', value: formatCurrency(totalExpenses / new Date(currentYear, currentMonth + 1, 0).getDate(), currency), color: '#f43f5e' },
                { label: 'Largest expense', value: formatCurrency(Math.max(...(thisMonthExpenses.map(e => e.amount) || [0])), currency), color: '#f59e0b' },
                { label: 'Transactions', value: `${thisMonthExpenses.length} this month`, color: '#6366f1' },
                { label: 'Recurring costs', value: formatCurrency(thisMonthExpenses.filter(e => e.isRecurring).reduce((s, e) => s + e.amount, 0), currency), color: '#22c55e' },
              ].map(stat => (
                <div key={stat.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: textMuted }}>{stat.label}</span>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: stat.color }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
