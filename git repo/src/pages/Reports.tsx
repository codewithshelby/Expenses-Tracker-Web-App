import { useState, useMemo } from 'react';
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Download, FileText, Mail, TrendingUp, TrendingDown, BarChart2, PieChart as PieIcon } from 'lucide-react';
import { useApp, formatCurrency, CATEGORY_COLORS } from '../context/AppContext';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

type ChartView = 'bar' | 'area' | 'pie';

export default function Reports() {
  const { expenses, income, isDark, user } = useApp();
  const currency = user?.currency || 'USD';

  const [chartView, setChartView] = useState<ChartView>('bar');
  const [dateRange, setDateRange] = useState('6');
  const [exportLoading, setExportLoading] = useState('');

  const cardBg = isDark ? '#161628' : '#ffffff';
  const cardBorder = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.06)';
  const textPrimary = isDark ? '#f1f5f9' : '#0f172a';
  const textMuted = isDark ? '#64748b' : '#94a3b8';
  const textSecondary = isDark ? '#94a3b8' : '#64748b';
  const chartGrid = isDark ? '#1e1e3a' : '#f1f5f9';

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const months = parseInt(dateRange);

  // Monthly data
  const monthlyData = useMemo(() => {
    return Array.from({ length: months }, (_, idx) => {
      const mIdx = (currentMonth - months + 1 + idx + 12) % 12;
      const yr = mIdx > currentMonth ? currentYear - 1 : currentYear;
      const exp = expenses.filter(e => {
        const d = new Date(e.date);
        return d.getMonth() === mIdx && d.getFullYear() === yr;
      }).reduce((s, e) => s + e.amount, 0);
      const inc = income.filter(i => {
        const d = new Date(i.date);
        return d.getMonth() === mIdx && d.getFullYear() === yr;
      }).reduce((s, i) => s + i.amount, 0);
      return {
        month: MONTHS[mIdx],
        expenses: Math.round(exp),
        income: Math.round(inc),
        savings: Math.round(inc - exp),
      };
    });
  }, [expenses, income, months, currentMonth, currentYear]);

  // Category data (all time or filtered)
  const categoryData = useMemo(() => {
    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - months);
    const filtered = expenses.filter(e => new Date(e.date) >= cutoff);
    const map: Record<string, number> = {};
    filtered.forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: Math.round(value), color: CATEGORY_COLORS[name] || '#94a3b8' }))
      .sort((a, b) => b.value - a.value);
  }, [expenses, months]);

  // Summary stats
  const totalExpenses = monthlyData.reduce((s, m) => s + m.expenses, 0);
  const totalIncome = monthlyData.reduce((s, m) => s + m.income, 0);
  const totalSavings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((totalSavings / totalIncome) * 100).toFixed(1) : '0';
  const avgMonthlyExpense = Math.round(totalExpenses / months);
  const avgMonthlyIncome = Math.round(totalIncome / months);

  const handleExport = async (type: string) => {
    setExportLoading(type);
    await new Promise(r => setTimeout(r, 1200));
    setExportLoading('');
    alert(`${type.toUpperCase()} export generated! In a real app, this would download your financial report.`);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: isDark ? '#1e1e38' : '#fff', border: `1px solid ${cardBorder}`, borderRadius: '10px', padding: '12px 16px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
        <p style={{ fontSize: '13px', fontWeight: 700, color: textPrimary, margin: '0 0 8px' }}>{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} style={{ fontSize: '13px', color: p.color, margin: '3px 0', fontWeight: 600 }}>
            {p.name}: {formatCurrency(p.value, currency)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 800, color: textPrimary, margin: 0 }}>Reports & Analytics</h2>
          <p style={{ fontSize: '14px', color: textSecondary, margin: '4px 0 0' }}>
            Insights into your financial habits
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleExport('pdf')}
            disabled={exportLoading === 'pdf'}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '9px 16px', borderRadius: '10px',
              border: `1px solid ${cardBorder}`, background: cardBg,
              color: textSecondary, cursor: 'pointer', fontSize: '13px', fontWeight: 500,
            }}
          >
            <FileText size={15} color="#f43f5e" />
            {exportLoading === 'pdf' ? 'Generating...' : 'Export PDF'}
          </button>
          <button
            onClick={() => handleExport('excel')}
            disabled={exportLoading === 'excel'}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '9px 16px', borderRadius: '10px',
              border: `1px solid ${cardBorder}`, background: cardBg,
              color: textSecondary, cursor: 'pointer', fontSize: '13px', fontWeight: 500,
            }}
          >
            <Download size={15} color="#22c55e" />
            {exportLoading === 'excel' ? 'Generating...' : 'Export Excel'}
          </button>
          <button
            onClick={() => alert('Email report feature: enter your email to receive a monthly financial summary!')}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '9px 16px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
            }}
          >
            <Mail size={15} /> Email Report
          </button>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '4px', background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '12px', padding: '4px' }}>
          {[{ v: '3', l: '3 Months' }, { v: '6', l: '6 Months' }, { v: '12', l: '1 Year' }].map(opt => (
            <button key={opt.v} onClick={() => setDateRange(opt.v)} style={{
              padding: '7px 14px', borderRadius: '9px',
              background: dateRange === opt.v ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'transparent',
              border: 'none', color: dateRange === opt.v ? 'white' : textMuted,
              cursor: 'pointer', fontSize: '13px', fontWeight: dateRange === opt.v ? 700 : 500,
            }}>{opt.l}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '4px', background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '12px', padding: '4px', marginLeft: 'auto' }}>
          {([
            { v: 'bar', icon: BarChart2 },
            { v: 'area', icon: TrendingUp },
            { v: 'pie', icon: PieIcon },
          ] as { v: ChartView; icon: React.ElementType }[]).map(({ v, icon: Icon }) => (
            <button key={v} onClick={() => setChartView(v)} style={{
              width: '36px', height: '36px', borderRadius: '9px',
              background: chartView === v ? 'rgba(99,102,241,0.15)' : 'transparent',
              border: chartView === v ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
              color: chartView === v ? '#6366f1' : textMuted,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
        {[
          { label: 'Total Income', value: formatCurrency(totalIncome, currency), color: '#22c55e', icon: TrendingUp, sub: `Avg ${formatCurrency(avgMonthlyIncome, currency)}/mo` },
          { label: 'Total Expenses', value: formatCurrency(totalExpenses, currency), color: '#f43f5e', icon: TrendingDown, sub: `Avg ${formatCurrency(avgMonthlyExpense, currency)}/mo` },
          { label: 'Net Savings', value: formatCurrency(totalSavings, currency), color: '#6366f1', icon: TrendingUp, sub: `${savingsRate}% savings rate` },
          { label: 'Top Category', value: categoryData[0]?.name || '-', color: '#f59e0b', icon: BarChart2, sub: categoryData[0] ? formatCurrency(categoryData[0].value, currency) : '' },
        ].map(card => (
          <div key={card.label} style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '14px', padding: '16px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: textMuted }}>{card.label}</span>
              <card.icon size={14} color={card.color} />
            </div>
            <p style={{ fontSize: '18px', fontWeight: 800, color: textPrimary, margin: '0 0 3px', letterSpacing: '-0.3px' }}>{card.value}</p>
            <span style={{ fontSize: '11px', color: card.color }}>{card.sub}</span>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 700, color: textPrimary, margin: 0 }}>
              {chartView === 'pie' ? 'Spending by Category' : 'Income vs Expenses'}
            </p>
            <p style={{ fontSize: '12px', color: textMuted, margin: '3px 0 0' }}>
              {chartView === 'pie' ? `Last ${months} months total` : `Monthly breakdown — last ${months} months`}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '14px' }}>
            {chartView !== 'pie' && [{ color: '#6366f1', label: 'Income' }, { color: '#f43f5e', label: 'Expenses' }, { color: '#22c55e', label: 'Savings' }].map(l => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: l.color }} />
                <span style={{ fontSize: '12px', color: textMuted }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          {chartView === 'bar' ? (
            <BarChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <CartesianGrid stroke={chartGrid} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} width={55} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="income" fill="#6366f1" radius={[4, 4, 0, 0]} name="Income" />
              <Bar dataKey="expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expenses" />
              <Bar dataKey="savings" fill="#22c55e" radius={[4, 4, 0, 0]} name="Savings" />
            </BarChart>
          ) : chartView === 'area' ? (
            <AreaChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <defs>
                <linearGradient id="incG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expG" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={chartGrid} strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: textMuted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: textMuted }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} width={55} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income" stroke="#6366f1" strokeWidth={2.5} fill="url(#incG)" name="Income" />
              <Area type="monotone" dataKey="expenses" stroke="#f43f5e" strokeWidth={2.5} fill="url(#expG)" name="Expenses" />
            </AreaChart>
          ) : (
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={70} outerRadius={120} paddingAngle={3} dataKey="value" nameKey="name">
                {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: number) => formatCurrency(v, currency)} />
              <Legend formatter={(v) => <span style={{ fontSize: '12px', color: textSecondary }}>{v}</span>} />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Category Breakdown Table */}
      <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${cardBorder}` }}>
          <p style={{ fontSize: '15px', fontWeight: 700, color: textPrimary, margin: 0 }}>Category Breakdown</p>
          <p style={{ fontSize: '12px', color: textMuted, margin: '3px 0 0' }}>Last {months} months spending by category</p>
        </div>
        <div style={{ padding: '8px 0' }}>
          {categoryData.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '30px', color: textMuted, fontSize: '14px' }}>No data for selected period</p>
          ) : (
            categoryData.map((cat, idx) => {
              const pct = (cat.value / totalExpenses) * 100;
              return (
                <div key={cat.name} style={{
                  display: 'flex', alignItems: 'center', gap: '14px',
                  padding: '12px 22px',
                  borderBottom: idx < categoryData.length - 1 ? `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}` : 'none',
                }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '13px', color: textSecondary, flex: '1' }}>{cat.name}</span>
                  <div style={{ flex: '2', height: '6px', background: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)', borderRadius: '100px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: cat.color, borderRadius: '100px', transition: 'width 0.4s ease' }} />
                  </div>
                  <span style={{ fontSize: '12px', color: textMuted, width: '40px', textAlign: 'right' }}>{pct.toFixed(1)}%</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: textPrimary, width: '100px', textAlign: 'right' }}>
                    {formatCurrency(cat.value, currency)}
                  </span>
                </div>
              );
            })
          )}
        </div>
        {categoryData.length > 0 && (
          <div style={{ padding: '14px 22px', borderTop: `1px solid ${cardBorder}`, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', fontWeight: 700, color: textPrimary }}>Total</span>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#f43f5e' }}>{formatCurrency(totalExpenses, currency)}</span>
          </div>
        )}
      </div>

      {/* Monthly Summary Table */}
      <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${cardBorder}` }}>
          <p style={{ fontSize: '15px', fontWeight: 700, color: textPrimary, margin: 0 }}>Monthly Summary</p>
        </div>
        <div>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', padding: '10px 22px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: textMuted, fontWeight: 600, borderBottom: `1px solid ${cardBorder}` }}>
            <span>Month</span>
            <span style={{ textAlign: 'right' }}>Income</span>
            <span style={{ textAlign: 'right' }}>Expenses</span>
            <span style={{ textAlign: 'right' }}>Savings</span>
          </div>
          {[...monthlyData].reverse().map((m, idx) => (
            <div key={m.month} style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr',
              padding: '13px 22px',
              borderBottom: idx < monthlyData.length - 1 ? `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}` : 'none',
              transition: 'background 0.15s',
            }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'transparent'}
            >
              <span style={{ fontSize: '13px', fontWeight: 600, color: textPrimary }}>{m.month}</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#22c55e', textAlign: 'right' }}>{formatCurrency(m.income, currency)}</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#f43f5e', textAlign: 'right' }}>{formatCurrency(m.expenses, currency)}</span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: m.savings >= 0 ? '#6366f1' : '#f43f5e', textAlign: 'right' }}>
                {m.savings >= 0 ? '+' : ''}{formatCurrency(m.savings, currency)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
