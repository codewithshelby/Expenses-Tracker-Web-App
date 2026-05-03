import { useNavigate } from 'react-router';
import {
  BarChart3, Shield, Zap, Globe, TrendingUp, PieChart,
  Bell, Download, ChevronRight, Star, Check, ArrowRight,
  CreditCard, Target, Wallet
} from 'lucide-react';

const features = [
  { icon: TrendingUp, title: 'Smart Expense Tracking', desc: 'Automatically categorize and track your spending with intelligent tagging. Import via CSV or manual entry.', color: '#6366f1' },
  { icon: PieChart, title: 'Visual Analytics', desc: 'Beautiful charts and graphs that make your financial data easy to understand at a glance.', color: '#22c55e' },
  { icon: Bell, title: 'Budget Alerts', desc: 'Get notified before you overspend. Set custom thresholds per category and stay on track.', color: '#f59e0b' },
  { icon: Globe, title: 'Multi-Currency', desc: 'Track expenses in any currency. Supports 150+ currencies with live conversion rates.', color: '#06b6d4' },
  { icon: Download, title: 'Export Reports', desc: 'Generate detailed PDF and Excel reports. Schedule automatic email summaries.', color: '#ec4899' },
  { icon: Shield, title: 'Bank-Level Security', desc: 'Your financial data is encrypted end-to-end. We never sell or share your data.', color: '#f43f5e' },
];

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['Up to 50 transactions/mo', 'Basic charts', '2 budget categories', 'CSV export'],
    cta: 'Get Started Free',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$9',
    period: 'per month',
    features: ['Unlimited transactions', 'Advanced analytics', 'Unlimited budgets', 'PDF & Excel export', 'Multi-currency', 'Email summaries'],
    cta: 'Start Pro Trial',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$24',
    period: 'per month',
    features: ['Everything in Pro', 'Up to 5 members', 'Shared budgets', 'Admin controls', 'Priority support', 'Custom categories'],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const testimonials = [
  {
    name: 'Neeraj Mandarwal',
    role: 'Freelance Designer',
    text: 'Spendly completely changed how I manage my finances. The category charts make it so easy to see where my money is going each month.',
    stars: 5,
    initials: 'NM',
    color: '#6366f1',
  },
  {
    name: 'Himanshu Singh',
    role: 'Software Engineer',
    text: "I've tried every finance app out there. Spendly is the first one that actually stuck because it's simple but powerful enough for my needs.",
    stars: 5,
    initials: 'HS',
    color: '#22c55e',
  },
  {
    name: 'Manyata Negii',
    role: 'Marketing Manager',
    text: 'The budget alerts saved me from overspending on dining three months in a row. Now I actually hit my savings goals!',
    stars: 5,
    initials: 'MN',
    color: '#ec4899',
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#080814', color: '#e2e8f0', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 5%', height: '68px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(8,8,20,0.9)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Wallet size={20} color="white" />
          </div>
          <span style={{ fontSize: '20px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px' }}>
            Spendly
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => navigate('/auth')}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/auth?mode=signup')}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '80px 5% 100px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Bg blobs */}
        <div style={{
          position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '600px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: 'rgba(99,102,241,0.12)',
          border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: '100px',
          padding: '5px 14px',
          marginBottom: '24px',
          fontSize: '13px',
          color: '#818cf8',
          fontWeight: 500,
        }}>
          <Zap size={13} fill="#818cf8" />
          Smart personal finance tracking
        </div>

        <h1 style={{
          fontSize: 'clamp(36px, 6vw, 72px)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-1.5px',
          margin: '0 auto 20px',
          maxWidth: '800px',
          color: '#f1f5f9',
        }}>
          Take control of your{' '}
          <span style={{
            background: 'linear-gradient(135deg, #6366f1, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            finances
          </span>
          {' '}with clarity
        </h1>

        <p style={{
          fontSize: '18px',
          color: '#94a3b8',
          maxWidth: '520px',
          margin: '0 auto 36px',
          lineHeight: 1.7,
        }}>
          Track expenses, manage budgets, and gain insights into your spending habits  all in one beautiful dashboard.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/auth?mode=signup')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '13px 28px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 600,
              boxShadow: '0 8px 32px rgba(99,102,241,0.35)',
            }}
          >
            Start for free
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => navigate('/auth')}
            style={{
              padding: '13px 28px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#e2e8f0',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            View demo →
          </button>
        </div>

        <p style={{ marginTop: '16px', fontSize: '13px', color: '#475569' }}>
          No credit card required • Free forever plan available
        </p>

        {/* Hero Stats */}
        <div style={{
          display: 'flex', justifyContent: 'center', gap: '40px',
          marginTop: '60px', flexWrap: 'wrap',
        }}>
          {[
            { value: '50K+', label: 'Active Users' },
            { value: '$2.4M', label: 'Expenses Tracked' },
            { value: '4.9★', label: 'App Rating' },
            { value: '99.9%', label: 'Uptime' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.5px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '2px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Dashboard Preview */}
      <section style={{ padding: '0 5% 80px', position: 'relative' }}>
        <div style={{
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
          background: '#0d0d20',
          maxWidth: '960px',
          margin: '0 auto',
        }}>
          {/* Fake browser chrome */}
          <div style={{
            background: '#161630',
            padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: '8px',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
          }}>
            {['#f43f5e', '#f59e0b', '#22c55e'].map(c => (
              <div key={c} style={{ width: '12px', height: '12px', borderRadius: '50%', background: c }} />
            ))}
            <div style={{
              marginLeft: '8px', flex: 1,
              background: 'rgba(255,255,255,0.04)',
              borderRadius: '6px',
              padding: '4px 12px',
              fontSize: '12px', color: '#475569',
            }}>
              app.spendly.io/dashboard
            </div>
          </div>

          {/* Fake dashboard content */}
          <div style={{ padding: '24px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            {[
              { label: 'Total Spent', value: '$2,847.21', change: '+4.2%', color: '#ef4444' },
              { label: 'Total Income', value: '$6,345.50', change: '+12.1%', color: '#22c55e' },
              { label: 'Net Savings', value: '$3,498.29', change: '+8.6%', color: '#6366f1' },
              { label: 'Budget Used', value: '67%', change: '-3.1%', color: '#f59e0b' },
            ].map(card => (
              <div key={card.label} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '14px',
                padding: '16px 20px',
                flex: '1 1 160px',
                minWidth: '0',
              }}>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 4px' }}>{card.label}</p>
                <p style={{ fontSize: '22px', fontWeight: 700, color: '#f1f5f9', margin: '0 0 4px' }}>{card.value}</p>
                <span style={{ fontSize: '12px', color: card.color }}>{card.change} this month</span>
              </div>
            ))}
          </div>

          {/* Fake chart area */}
          <div style={{ padding: '0 24px 24px' }}>
            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '14px',
              padding: '20px',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#e2e8f0' }}>Spending Overview</span>
                <span style={{ fontSize: '12px', color: '#475569' }}>Last 6 months</span>
              </div>
              {/* Fake bars */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', height: '80px' }}>
                {[55, 72, 48, 85, 68, 75].map((h, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                    <div style={{
                      width: '100%',
                      height: `${h}%`,
                      borderRadius: '6px 6px 0 0',
                      background: i === 5
                        ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                        : 'rgba(99,102,241,0.25)',
                    }} />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                {['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'].map(m => (
                  <div key={m} style={{ flex: 1, textAlign: 'center', fontSize: '11px', color: '#475569' }}>{m}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: '100px',
            padding: '4px 14px',
            fontSize: '12px', color: '#818cf8', fontWeight: 600,
            marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            Features
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#f1f5f9', margin: '0 0 14px', letterSpacing: '-0.5px' }}>
            Everything you need to manage money
          </h2>
          <p style={{ fontSize: '16px', color: '#64748b', maxWidth: '480px', margin: '0 auto' }}>
            Built for people who want clarity, not complexity, in their personal finances.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          maxWidth: '1100px', margin: '0 auto',
        }}>
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div key={title} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
              padding: '28px',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = `${color}40`;
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: '44px', height: '44px',
                borderRadius: '12px',
                background: `${color}20`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <Icon size={22} color={color} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#f1f5f9', margin: '0 0 8px' }}>
                {title}
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.65, margin: 0 }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '60px 5%', background: 'rgba(255,255,255,0.01)' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
            Simple, honest pricing
          </h2>
          <p style={{ fontSize: '16px', color: '#64748b' }}>
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div style={{
          display: 'flex', gap: '20px', justifyContent: 'center',
          flexWrap: 'wrap', maxWidth: '900px', margin: '0 auto',
        }}>
          {plans.map(plan => (
            <div key={plan.name} style={{
              flex: '1 1 260px',
              maxWidth: '300px',
              background: plan.highlighted ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))' : 'rgba(255,255,255,0.03)',
              border: plan.highlighted ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.06)',
              borderRadius: '20px',
              padding: '32px',
              position: 'relative',
            }}>
              {plan.highlighted && (
                <div style={{
                  position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  borderRadius: '100px',
                  padding: '3px 14px',
                  fontSize: '11px', fontWeight: 700, color: 'white',
                  whiteSpace: 'nowrap',
                }}>
                  Most Popular
                </div>
              )}
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#94a3b8', margin: '0 0 8px' }}>{plan.name}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                <span style={{ fontSize: '40px', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-1px' }}>{plan.price}</span>
                <span style={{ fontSize: '14px', color: '#64748b' }}>/{plan.period}</span>
              </div>
              <div style={{ margin: '24px 0', height: '1px', background: 'rgba(255,255,255,0.06)' }} />
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {plan.features.map(f => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#94a3b8' }}>
                    <Check size={15} color="#22c55e" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/auth?mode=signup')}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '10px',
                  border: plan.highlighted ? 'none' : '1px solid rgba(255,255,255,0.12)',
                  background: plan.highlighted ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '60px 5%' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, color: '#f1f5f9', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
            Loved by thousands of users
          </h2>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px', maxWidth: '960px', margin: '0 auto',
        }}>
          {testimonials.map(t => (
            <div key={t.name} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: '16px',
              padding: '28px',
            }}>
              <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: 1.7, margin: '0 0 20px', fontStyle: 'italic' }}>
                "{t.text}"
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px',
                  borderRadius: '50%',
                  background: t.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '12px', fontWeight: 700,
                }}>
                  {t.initials}
                </div>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#f1f5f9', margin: 0 }}>{t.name}</p>
                  <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 5% 80px', textAlign: 'center' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.1))',
          border: '1px solid rgba(99,102,241,0.25)',
          borderRadius: '24px',
          padding: '56px 40px',
          maxWidth: '700px',
          margin: '0 auto',
        }}>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, color: '#f1f5f9', margin: '0 0 14px', letterSpacing: '-0.5px' }}>
            Ready to take control?
          </h2>
          <p style={{ fontSize: '16px', color: '#94a3b8', margin: '0 0 32px' }}>
            Join over 50,000 people who track their finances with Spendly.
          </p>
          <button
            onClick={() => navigate('/auth?mode=signup')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '14px 32px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '15px',
              fontWeight: 700,
              boxShadow: '0 8px 32px rgba(99,102,241,0.4)',
            }}
          >
            Get started for free
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '28px 5%',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px', height: '28px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Wallet size={14} color="white" />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#94a3b8' }}>Spendly</span>
        </div>
        <p style={{ fontSize: '13px', color: '#334155', margin: 0 }}>
          © {new Date().getFullYear()} Spendly. Built with care for financial clarity.Shelby
        </p>
        <div style={{ display: 'flex', gap: '16px' }}>
          {['Privacy', 'Terms', 'Support'].map(l => (
            <a key={l} href="#" style={{ fontSize: '13px', color: '#475569', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
