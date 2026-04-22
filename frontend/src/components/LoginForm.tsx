import React, { useState } from 'react';
import { api, demo } from '../api/client';

interface Props {
  onLogin: (username: string) => void;
}

export default function LoginForm({ onLogin }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.login(username, password);
      onLogin(res.username);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = () => {
    demo.enable();
    onLogin('Earl G.');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoIconWrap}>⚙️</div>
          <h1 style={styles.title}>PartsSource AI</h1>
          <p style={styles.subtitle}>AI-powered industrial parts procurement</p>
        </div>

        {/* Demo CTA */}
        <button onClick={handleDemo} style={styles.demoBtn}>
          <span style={styles.demoBtnIcon}>▶</span>
          Try Demo — no login required
        </button>

        <div style={styles.divider}>
          <span style={styles.dividerLine} />
          <span style={styles.dividerText}>or sign in with your account</span>
          <span style={styles.dividerLine} />
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email / Username
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your@email.com"
              required
              style={styles.input}
              autoComplete="username"
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={styles.input}
              autoComplete="current-password"
            />
          </label>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Signing in…' : 'Sign in to PartsSource'}
          </button>
        </form>

        <div style={styles.demoFeatures}>
          <p style={styles.demoFeatTitle}>Demo includes:</p>
          <div style={styles.demoFeatGrid}>
            {['🔍 Part search + risk scores', '🔴 Live backorder alerts', '🟡 Grainger & MSC alternatives', '✉️ Auto-generated email drafts', '🛒 Cart & order history', '🚨 Stryker probe backorder scenario'].map((f) => (
              <span key={f} style={styles.demoFeat}>{f}</span>
            ))}
          </div>
        </div>

        <p style={styles.note}>
          Credentials are used only to automate your PartsSource.com session and are never stored.
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', padding: '24px', background: 'var(--bg)',
  },
  card: {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 14, padding: '40px 36px', width: '100%', maxWidth: 440,
  },
  logo: { textAlign: 'center', marginBottom: 28 },
  logoIconWrap: { fontSize: 40 },
  title: { fontSize: 24, fontWeight: 700, marginTop: 8, color: 'var(--text)' },
  subtitle: { color: 'var(--text-muted)', marginTop: 6, fontSize: 13 },

  demoBtn: {
    width: '100%', padding: '13px 16px',
    background: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)',
    color: '#fff', border: 'none', borderRadius: 'var(--radius)',
    fontWeight: 700, fontSize: 15, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
    boxShadow: '0 4px 16px rgba(29,78,216,0.35)',
    transition: 'opacity 0.15s, transform 0.1s',
    marginBottom: 4,
  },
  demoBtnIcon: { fontSize: 12, opacity: 0.9 },

  divider: {
    display: 'flex', alignItems: 'center', gap: 12,
    margin: '20px 0 18px',
  },
  dividerLine: {
    flex: 1, height: 1, background: 'var(--border)', display: 'block',
  },
  dividerText: { fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' },

  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  label: {
    display: 'flex', flexDirection: 'column', gap: 6,
    fontWeight: 500, color: 'var(--text-muted)', fontSize: 13,
  },
  input: {
    padding: '10px 12px', background: 'var(--surface2)',
    border: '1px solid var(--border)', borderRadius: 'var(--radius)',
    color: 'var(--text)', outline: 'none', fontSize: 14,
  },
  button: {
    marginTop: 6, padding: '11px',
    background: 'var(--accent)', color: '#fff',
    borderRadius: 'var(--radius)', fontWeight: 600, fontSize: 14, border: 'none',
  },
  error: {
    padding: '10px 12px', background: 'rgba(239,68,68,0.12)',
    border: '1px solid var(--error)', borderRadius: 'var(--radius)',
    color: 'var(--error)', fontSize: 13,
  },

  demoFeatures: {
    marginTop: 24, padding: '14px 16px',
    background: 'rgba(29,78,216,0.08)',
    border: '1px solid rgba(29,78,216,0.2)',
    borderRadius: 'var(--radius)',
  },
  demoFeatTitle: { fontSize: 11, fontWeight: 700, color: '#60a5fa', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.05em' },
  demoFeatGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px' },
  demoFeat: { fontSize: 12, color: 'var(--text-muted)' },

  note: {
    marginTop: 16, fontSize: 11, color: 'var(--text-muted)',
    textAlign: 'center', lineHeight: 1.6,
  },
};
