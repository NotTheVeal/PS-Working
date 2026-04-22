import React, { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import { api, demo } from './api/client';

// When built as a standalone file (SINGLE_FILE=1), auto-start in demo mode.
if (import.meta.env.VITE_DEMO_ONLY === 'true') {
  demo.enable();
}

export default function App() {
  const [username, setUsername] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    api.authStatus()
      .then((s) => { if (s.loggedIn && s.username) setUsername(s.username); })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, []);

  if (checking) return <LoadingScreen />;

  if (!username) {
    return <LoginForm onLogin={setUsername} />;
  }

  return (
    <div style={styles.app}>
      <Header username={username} onLogout={() => setUsername(null)} />
      <main style={styles.main}>
        <ChatInterface username={username} />
      </main>
    </div>
  );
}

function LoadingScreen() {
  return (
    <div style={styles.loading}>
      <span style={{ fontSize: 32 }}>⚙️</span>
      <p style={{ color: 'var(--text-muted)', marginTop: 12 }}>Starting PartsSource AI…</p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
  },
  main: {
    flex: 1,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    background: 'var(--bg)',
  },
};
