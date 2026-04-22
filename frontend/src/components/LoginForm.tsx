import React, { useState } from 'react';
import { api } from '../api/client';

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

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>⚙️</span>
          <h1 style={styles.title}>PartsSource AI</h1>
          <p style={styles.subtitle}>AI-powered industrial parts procurement</p>
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

        <p style={styles.note}>
          Your credentials are used only to automate your PartsSource.com session and are never stored permanently.
        </p>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '24px',
    background: 'var(--bg)',
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 12,
    padding: '40px 36px',
    width: '100%',
    maxWidth: 420,
  },
  logo: { textAlign: 'center', marginBottom: 32 },
  logoIcon: { fontSize: 40 },
  title: { fontSize: 24, fontWeight: 700, marginTop: 8, color: 'var(--text)' },
  subtitle: { color: 'var(--text-muted)', marginTop: 6, fontSize: 13 },
  form: { display: 'flex', flexDirection: 'column', gap: 16 },
  label: { display: 'flex', flexDirection: 'column', gap: 6, fontWeight: 500, color: 'var(--text-muted)', fontSize: 13 },
  input: {
    padding: '10px 12px',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text)',
    outline: 'none',
    transition: 'border-color 0.15s',
    fontSize: 14,
  },
  button: {
    marginTop: 8,
    padding: '12px',
    background: 'var(--accent)',
    color: '#fff',
    borderRadius: 'var(--radius)',
    fontWeight: 600,
    fontSize: 14,
    transition: 'background 0.15s',
  },
  error: {
    padding: '10px 12px',
    background: 'rgba(239,68,68,0.12)',
    border: '1px solid var(--error)',
    borderRadius: 'var(--radius)',
    color: 'var(--error)',
    fontSize: 13,
  },
  note: {
    marginTop: 20,
    fontSize: 12,
    color: 'var(--text-muted)',
    textAlign: 'center',
    lineHeight: 1.6,
  },
};
