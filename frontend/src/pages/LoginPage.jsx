import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const inputStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid #475467',
  borderRadius: '8px',
  padding: '14px 16px',
  fontFamily: "'Inter', sans-serif",
  fontSize: '15px',
  color: '#f7f9fa',
  outline: 'none',
  transition: 'all 0.2s ease',
  marginTop: '6px',
};

const labelStyle = {
  display: 'block',
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.15em',
  color: '#6b6b6b',
  textTransform: 'uppercase',
  marginTop: '20px',
};

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isSignUp) { await signup(email, password); }
      else { await login(email, password); }
      navigate('/upload');
    } catch (err) {
      setError(err.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/upload');
    } catch (err) {
      setError('Failed to sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  const onFocus = (e) => { e.target.style.borderColor = '#af50ff'; e.target.style.boxShadow = '0 0 0 3px rgba(175,80,255,0.12)'; };
  const onBlur = (e) => { e.target.style.borderColor = '#475467'; e.target.style.boxShadow = 'none'; };

  return (
    <div style={{ minHeight: '100vh', background: '#090909', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '600px', background: 'radial-gradient(circle, rgba(108,75,214,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '440px', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '19.2px', padding: '48px 40px' }}>
        <div style={{ textAlign: 'center', fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: 700, letterSpacing: '0.05em', color: '#f7f9fa', marginBottom: '8px' }}>
          RESUMESCAN
        </div>
        <div style={{ textAlign: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.20em', color: '#af50ff', textTransform: 'uppercase', marginBottom: '16px' }}>
          BOARDING PASS
        </div>
        <h1 style={{ textAlign: 'center', fontFamily: "'Inter', sans-serif", fontSize: '32px', fontWeight: 700, letterSpacing: '-0.02em', color: '#f7f9fa', marginBottom: '8px' }}>
          {isSignUp ? 'Create account.' : 'Welcome back.'}
        </h1>
        <p style={{ textAlign: 'center', fontFamily: "'Inter', sans-serif", fontSize: '14px', fontWeight: 400, color: '#6b6b6b', marginBottom: '32px' }}>
          Sign in to save your analyses and track progress.
        </p>

        {error && (
          <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '8px', background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.25)', color: '#ff8080', fontFamily: "'Inter', sans-serif", fontSize: '13px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>EMAIL ADDRESS</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} onFocus={onFocus} onBlur={onBlur} style={inputStyle} placeholder="you@domain.com" />

          <label style={labelStyle}>PASSWORD</label>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} onFocus={onFocus} onBlur={onBlur} style={inputStyle} placeholder="password" />

          <button type="submit" disabled={loading} style={{ width: '100%', background: '#af50ff', color: '#090909', border: 'none', borderRadius: '9999px', padding: '14px', fontFamily: "'Inter', sans-serif", fontSize: '16px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', marginTop: '28px', minHeight: '52px', transition: 'all 0.3s ease', opacity: loading ? 0.6 : 1 }}
            onMouseEnter={(e)=>{ if(!loading){ e.currentTarget.style.filter='brightness(1.1)'; e.currentTarget.style.boxShadow='0 0 24px rgba(175,80,255,0.5)'; } }}
            onMouseLeave={(e)=>{ e.currentTarget.style.filter='none'; e.currentTarget.style.boxShadow='none'; }}>
            {loading ? 'AUTHENTICATING...' : (isSignUp ? 'SIGN UP' : 'LOG IN')}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', color: '#6b6b6b', textTransform: 'uppercase', letterSpacing: '0.10em' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }} />
        </div>

        <button onClick={handleGoogleLogin} disabled={loading} style={{ width: '100%', background: 'transparent', color: '#f7f9fa', border: '1px solid #475467', borderRadius: '9999px', padding: '14px', fontFamily: "'Inter', sans-serif", fontSize: '15px', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', minHeight: '52px', transition: 'all 0.2s ease' }}
          onMouseEnter={(e)=>{ e.currentTarget.style.borderColor='#af50ff'; e.currentTarget.style.background='rgba(175,80,255,0.04)'; }}
          onMouseLeave={(e)=>{ e.currentTarget.style.borderColor='#475467'; e.currentTarget.style.background='transparent'; }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ textAlign: 'center', marginTop: '28px', fontFamily: "'Inter', sans-serif", fontSize: '14px', color: '#6b6b6b' }}>
          {isSignUp ? 'Already have an account?' : "Do not have an account?"}
          <button onClick={() => setIsSignUp(!isSignUp)} style={{ background: 'none', border: 'none', color: '#af50ff', fontWeight: 500, cursor: 'pointer', marginLeft: '6px', fontFamily: "'Inter', sans-serif", fontSize: '14px' }}>
            {isSignUp ? 'Log in' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
