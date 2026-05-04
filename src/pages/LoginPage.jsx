import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, loginError, setLoginError } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 400)); // small UX delay
    login(username.trim(), password);
    setLoading(false);
  };

  // Demo credentials helper
  const fill = (u, p) => { setUsername(u); setPassword(p); setLoginError(''); };

  return (
    <div style={{
      minHeight: '100dvh',
      display: 'flex',
      background: '#f0f2f8',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Left panel — branding */}
      <div style={{
        width: '45%',
        background: 'linear-gradient(145deg, #12172b 0%, #1e1457 60%, #2d1b69 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
      }}>
        {/* Background decorative circles */}
        <div style={{ position:'absolute', top:'-60px', right:'-60px', width:300, height:300, borderRadius:'50%', background:'rgba(108,99,255,0.15)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'80px', left:'-80px', width:250, height:250, borderRadius:'50%', background:'rgba(108,99,255,0.1)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-40px', right:'80px', width:180, height:180, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:'12px', position:'relative', zIndex:1 }}>
          <div style={{
            width:44, height:44,
            background:'#6c63ff',
            borderRadius:'10px',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c3 3 9 3 12 0v-5"/>
            </svg>
          </div>
          <div>
            <div style={{ color:'white', fontWeight:800, fontSize:'1.2rem', letterSpacing:'-0.3px' }}>SmartTT</div>
            <div style={{ color:'rgba(255,255,255,0.5)', fontSize:'0.7rem', fontWeight:500 }}>School Timetable System</div>
          </div>
        </div>

        {/* Middle content */}
        <div style={{ position:'relative', zIndex:1 }}>
          <h1 style={{ color:'white', fontSize:'2.2rem', fontWeight:800, lineHeight:1.2, marginBottom:'16px' }}>
            Smart School<br />Management<br />
            <span style={{ color:'#a78bfa' }}>Made Simple.</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.55)', fontSize:'0.9rem', lineHeight:1.7, maxWidth:340 }}>
            Manage timetables for 5 classes and 10 teachers. Automated leave substitution. Real-time visibility for all staff.
          </p>

          {/* Feature list */}
          <div style={{ marginTop:'32px', display:'flex', flexDirection:'column', gap:'12px' }}>
            {[
              { icon:'📅', text:'Weekly timetables for Std I – V' },
              { icon:'⚡', text:'Auto-assign substitutes instantly' },
              { icon:'👤', text:'Personal dashboards for each teacher' },
            ].map((f, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <span style={{ fontSize:'1rem' }}>{f.icon}</span>
                <span style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.82rem', fontWeight:500 }}>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ color:'rgba(255,255,255,0.3)', fontSize:'0.72rem', position:'relative', zIndex:1 }}>
          © 2026 SmartTT — School Management System
        </div>
      </div>

      {/* Right panel — login form */}
      <div style={{
        flex:1,
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        padding:'40px 24px',
      }}>
        <div style={{ width:'100%', maxWidth:'400px' }}>

          <div style={{ marginBottom:'32px' }}>
            <h2 style={{ fontSize:'1.75rem', fontWeight:800, color:'#1a1d2e', marginBottom:'6px' }}>
              Welcome back 👋
            </h2>
            <p style={{ color:'#64748b', fontSize:'0.875rem' }}>
              Sign in with your school credentials to continue.
            </p>
          </div>

          {/* Error */}
          {loginError && (
            <div style={{
              background:'#fee2e2', color:'#991b1b', border:'1px solid #fca5a5',
              borderRadius:'8px', padding:'12px 14px', fontSize:'0.82rem',
              marginBottom:'20px', display:'flex', alignItems:'center', gap:'8px',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {loginError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:'16px' }}>
              <label style={{ display:'block', fontSize:'0.78rem', fontWeight:600, color:'#475569', marginBottom:'6px' }}>
                Username
              </label>
              <input
                id="login-username"
                type="text"
                value={username}
                onChange={e => { setUsername(e.target.value); setLoginError(''); }}
                placeholder="e.g. priya.sharma or admin"
                autoComplete="username"
                required
                style={{
                  width:'100%', padding:'11px 14px',
                  border:'1.5px solid #e2e8f0', borderRadius:'8px',
                  fontSize:'0.9rem', color:'#1a1d2e', background:'white',
                  outline:'none', transition:'border-color 0.2s',
                  boxSizing:'border-box',
                }}
                onFocus={e => e.target.style.borderColor='#6c63ff'}
                onBlur={e => e.target.style.borderColor='#e2e8f0'}
              />
            </div>

            <div style={{ marginBottom:'24px' }}>
              <label style={{ display:'block', fontSize:'0.78rem', fontWeight:600, color:'#475569', marginBottom:'6px' }}>
                Password
              </label>
              <div style={{ position:'relative' }}>
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setLoginError(''); }}
                  placeholder="Your password"
                  autoComplete="current-password"
                  required
                  style={{
                    width:'100%', padding:'11px 44px 11px 14px',
                    border:'1.5px solid #e2e8f0', borderRadius:'8px',
                    fontSize:'0.9rem', color:'#1a1d2e', background:'white',
                    outline:'none', transition:'border-color 0.2s',
                    boxSizing:'border-box',
                  }}
                  onFocus={e => e.target.style.borderColor='#6c63ff'}
                  onBlur={e => e.target.style.borderColor='#e2e8f0'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  style={{
                    position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)',
                    background:'none', border:'none', cursor:'pointer', color:'#94a3b8',
                    padding:'2px',
                  }}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              id="btn-login-submit"
              type="submit"
              disabled={loading}
              style={{
                width:'100%', padding:'12px',
                background: loading ? '#a5b4fc' : '#6c63ff',
                color:'white', border:'none', borderRadius:'8px',
                fontSize:'0.92rem', fontWeight:700, cursor: loading ? 'not-allowed' : 'pointer',
                transition:'background 0.2s, transform 0.15s',
                display:'flex', alignItems:'center', justifyContent:'center', gap:'8px',
              }}
              onMouseEnter={e => { if (!loading) e.target.style.background='#4f46e5'; }}
              onMouseLeave={e => { if (!loading) e.target.style.background='#6c63ff'; }}
            >
              {loading ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation:'spin 0.8s linear infinite' }}>
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.3"/><path d="M12 2a10 10 0 0110 10"/>
                  </svg>
                  Signing in…
                </>
              ) : 'Sign In →'}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{
            marginTop:'28px', padding:'16px',
            background:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'10px',
          }}>
            <div style={{ fontSize:'0.72rem', fontWeight:700, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:'10px' }}>
              🔑 Demo Credentials
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'6px' }}>
              {[
                { label:'Admin / Principal', u:'admin', p:'admin@123', color:'#6c63ff' },
                { label:'Mrs. Priya Sharma', u:'priya.sharma', p:'priya123', color:'#1d4ed8' },
                { label:'Mr. Arjun Mehta',   u:'arjun.mehta',  p:'arjun123', color:'#166534' },
                { label:'Mrs. Sunita Rao',   u:'sunita.rao',   p:'sunita123', color:'#be185d' },
              ].map(c => (
                <button
                  key={c.u}
                  onClick={() => fill(c.u, c.p)}
                  style={{
                    display:'flex', alignItems:'center', justifyContent:'space-between',
                    padding:'7px 10px', background:'white',
                    border:'1px solid #e2e8f0', borderRadius:'6px',
                    cursor:'pointer', fontSize:'0.75rem', fontWeight:500, color:'#475569',
                    transition:'border-color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor=c.color}
                  onMouseLeave={e => e.currentTarget.style.borderColor='#e2e8f0'}
                >
                  <span>{c.label}</span>
                  <span style={{ fontFamily:'monospace', color:c.color, fontSize:'0.7rem', fontWeight:600 }}>{c.u}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
