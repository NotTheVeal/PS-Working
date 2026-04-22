import React from 'react';
import { api, demo } from '../api/client';

interface Props {
  username: string;
  onLogout: () => void;
}

export default function Header({ username, onLogout }: Props) {
  const handleLogout = async () => {
    try { await api.logout(); } catch { /* ignore */ }
    onLogout();
  };

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <span style={styles.icon}>⚙️</span>
        <span style={styles.title}>PartsSource AI</span>
        <span style={styles.badge}>BETA</span>
        {demo.isActive() && <span style={styles.demoBadge}>DEMO</span>}
      </div>
      <div style={styles.right}>
        <span style={styles.user}>
          <span style={styles.dot} />
          {username}
        </span>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </header>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    height: 52,
    background: 'var(--surface)',
    borderBottom: '1px solid var(--border)',
    flexShrink: 0,
  },
  left: { display: 'flex', alignItems: 'center', gap: 8 },
  icon: { fontSize: 18 },
  title: { fontWeight: 700, fontSize: 15, color: 'var(--text)' },
  badge: {
    padding: '2px 6px',
    background: 'rgba(59,130,246,0.2)',
    color: 'var(--accent)',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.05em',
  },
  right: { display: 'flex', alignItems: 'center', gap: 12 },
  user: {
    fontSize: 13,
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: '50%',
    background: 'var(--success)',
    display: 'inline-block',
  },
  demoBadge: {
    padding: '2px 7px',
    background: 'rgba(124,58,237,0.25)',
    color: '#a78bfa',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.05em',
    border: '1px solid rgba(124,58,237,0.35)',
  },
  logoutBtn: {
    padding: '5px 12px',
    background: 'transparent',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    color: 'var(--text-muted)',
    fontSize: 12,
    transition: 'all 0.15s',
  },
};
