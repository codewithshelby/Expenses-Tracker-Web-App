import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft, Wallet, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

type AuthMode = 'login' | 'signup' | 'forgot' | 'otp';

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<AuthMode>(searchParams.get('mode') === 'signup' ? 'signup' : 'login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    forgotEmail: '',
  });

  const { login, user } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 900));
    login({ name: formData.email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, c => c.toUpperCase()), email: formData.email });
    navigate('/dashboard');
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    login({ name: formData.name, email: formData.email });
    navigate('/dashboard');
    setLoading(false);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.forgotEmail) {
      setError('Please enter your email.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setSuccess(`Recovery link sent to ${formData.forgotEmail}`);
    setTimeout(() => { setMode('otp'); setSuccess(''); }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const next = [...otpValues];
    next[index] = value;
    setOtpValues(next);
    if (value && index < 5) {
      (document.getElementById(`otp-${index + 1}`) as HTMLInputElement)?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpValues.join('');
    if (code.length < 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setSuccess('Password reset successfully!');
    setTimeout(() => { setMode('login'); setSuccess(''); }, 1500);
  };

  const handleSocialLogin = async (provider: string) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    login({ name: "Shelby", email: `Shelby@${provider.toLowerCase()}.com` });
    navigate('/dashboard');
    setLoading(false);
  };

  const inputStyle = (focused = false) => ({
    width: '100%',
    padding: '11px 14px 11px 42px',
    borderRadius: '10px',
    border: `1px solid ${focused ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
    background: 'rgba(255,255,255,0.04)',
    color: '#f1f5f9',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'border-color 0.15s',
  });

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080814',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background glows */}
      <div style={{
        position: 'absolute', top: '-100px', left: '-100px',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-100px', right: '-100px',
        width: '400px', height: '400px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        background: '#0d0d20',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '24px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        position: 'relative',
        zIndex: 1,
        boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            width: '50px', height: '50px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            borderRadius: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 12px',
          }}>
            <Wallet size={26} color="white" />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#f1f5f9', margin: 0, letterSpacing: '-0.3px' }}>
            {mode === 'login' ? 'Welcome back' : mode === 'signup' ? 'Create account' : mode === 'forgot' ? 'Reset password' : 'Check your email'}
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '6px 0 0' }}>
            {mode === 'login' ? 'Sign in to your Spendly account' : mode === 'signup' ? 'Start tracking your finances today' : mode === 'forgot' ? "We'll send you a reset link" : `We sent a code to ${formData.forgotEmail}`}
          </p>
        </div>

        {/* Error / Success */}
        {error && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)',
            borderRadius: '10px', padding: '10px 14px',
            marginBottom: '16px', color: '#fca5a5', fontSize: '13px',
          }}>
            <AlertCircle size={15} color="#f43f5e" />
            {error}
          </div>
        )}
        {success && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: '10px', padding: '10px 14px',
            marginBottom: '16px', color: '#86efac', fontSize: '13px',
          }}>
            <CheckCircle size={15} color="#22c55e" />
            {success}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <>
            {/* Social Logins */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              {[
                { name: 'Google', icon: '🔵' },
                { name: 'Apple', icon: '🍎' },
              ].map(provider => (
                <button
                  key={provider.name}
                  onClick={() => handleSocialLogin(provider.name)}
                  disabled={loading}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.04)',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 500,
                  }}
                >
                  <span>{provider.icon}</span>
                  {provider.name}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize: '12px', color: '#475569' }}>or continue with email</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#475569" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  name="email"
                  type="email"
                  placeholder="shelby@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  style={inputStyle()}
                  autoComplete="email"
                />
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#475569" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  style={{ ...inputStyle(), paddingRight: '42px' }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: '#475569' }}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div style={{ textAlign: 'right' }}>
                <button
                  type="button"
                  onClick={() => { setMode('forgot'); setError(''); }}
                  style={{ background: 'transparent', border: 'none', color: '#6366f1', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none',
                  color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 700,
                  marginTop: '4px',
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', marginTop: '20px' }}>
              Don't have an account?{' '}
              <button
                onClick={() => { setMode('signup'); setError(''); }}
                style={{ background: 'transparent', border: 'none', color: '#6366f1', cursor: 'pointer', fontWeight: 600 }}
              >
                Sign up
              </button>
            </p>
          </>
        )}

        {/* SIGNUP FORM */}
        {mode === 'signup' && (
          <>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              {[{ name: 'Google', icon: '🔵' }, { name: 'Apple', icon: '🍎' }].map(provider => (
                <button
                  key={provider.name}
                  onClick={() => handleSocialLogin(provider.name)}
                  disabled={loading}
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    padding: '10px', borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.04)',
                    color: '#94a3b8', cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                  }}
                >
                  <span>{provider.icon}</span>{provider.name}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize: '12px', color: '#475569' }}>or with email</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
            </div>

            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#475569" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)' }} />
                <input name="name" type="text" placeholder="Full name" value={formData.name} onChange={handleChange} style={inputStyle()} />
              </div>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#475569" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)' }} />
                <input name="email" type="email" placeholder="Email address" value={formData.email} onChange={handleChange} style={inputStyle()} />
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#475569" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)' }} />
                <input name="password" type={showPass ? 'text' : 'password'} placeholder="Password (min 8 chars)" value={formData.password} onChange={handleChange} style={{ ...inputStyle(), paddingRight: '42px' }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '13px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: '#475569' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#475569" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)' }} />
                <input name="confirmPassword" type="password" placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} style={inputStyle()} />
              </div>

              <p style={{ fontSize: '12px', color: '#475569', margin: '0' }}>
                By signing up, you agree to our{' '}
                <a href="#" style={{ color: '#6366f1' }}>Terms</a> and{' '}
                <a href="#" style={{ color: '#6366f1' }}>Privacy Policy</a>.
              </p>

              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px', borderRadius: '10px',
                  background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none', color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px', fontWeight: 700,
                }}
              >
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p style={{ textAlign: 'center', fontSize: '14px', color: '#64748b', marginTop: '20px' }}>
              Already have an account?{' '}
              <button onClick={() => { setMode('login'); setError(''); }} style={{ background: 'transparent', border: 'none', color: '#6366f1', cursor: 'pointer', fontWeight: 600 }}>
                Sign in
              </button>
            </p>
          </>
        )}

        {/* FORGOT PASSWORD */}
        {mode === 'forgot' && (
          <>
            <button
              onClick={() => { setMode('login'); setError(''); setSuccess(''); }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px', marginBottom: '20px', padding: 0 }}
            >
              <ArrowLeft size={14} /> Back to login
            </button>
            <form onSubmit={handleForgot} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#475569" style={{ position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  name="forgotEmail"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.forgotEmail}
                  onChange={handleChange}
                  style={inputStyle()}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px', borderRadius: '10px',
                  background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none', color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px', fontWeight: 700,
                }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        )}

        {/* OTP VERIFICATION */}
        {mode === 'otp' && (
          <>
            <button
              onClick={() => { setMode('forgot'); setError(''); setSuccess(''); }}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '13px', marginBottom: '20px', padding: 0 }}
            >
              <ArrowLeft size={14} /> Back
            </button>
            <form onSubmit={handleOtpSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                {otpValues.map((v, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={v}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Backspace' && !v && i > 0) {
                        (document.getElementById(`otp-${i - 1}`) as HTMLInputElement)?.focus();
                      }
                    }}
                    style={{
                      width: '48px', height: '52px',
                      textAlign: 'center',
                      fontSize: '20px', fontWeight: 700,
                      borderRadius: '12px',
                      border: `2px solid ${v ? '#6366f1' : 'rgba(255,255,255,0.1)'}`,
                      background: v ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.04)',
                      color: '#f1f5f9',
                      outline: 'none',
                    }}
                  />
                ))}
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px', borderRadius: '10px',
                  background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  border: 'none', color: 'white',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px', fontWeight: 700,
                }}
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
              <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', margin: 0 }}>
                Didn't receive it?{' '}
                <button type="button" onClick={handleForgot as any} style={{ background: 'transparent', border: 'none', color: '#6366f1', cursor: 'pointer', fontWeight: 600 }}>
                  Resend
                </button>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
