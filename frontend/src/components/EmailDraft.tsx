import React, { useState } from 'react';

interface Props {
  subject: string;
  body: string;
  to: string;
}

export default function EmailDraft({ subject, body, to }: Props) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleMailto = () => {
    const encoded = encodeURIComponent(body);
    const sub = encodeURIComponent(subject);
    window.open(`mailto:${to}?subject=${sub}&body=${encoded}`, '_blank');
  };

  const handleDownload = async () => {
    try {
      const res = await fetch('/api/email/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ subject, body }),
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${subject.replace(/[^a-z0-9 ]/gi, '').trim().replace(/\s+/g, '_')}.eml`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // fallback to copy
      handleCopy();
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header} onClick={() => setExpanded(!expanded)}>
        <div style={styles.headerLeft}>
          <span style={{ fontSize: 16 }}>✉️</span>
          <div>
            <span style={styles.badge}>EMAIL DRAFT</span>
            <span style={styles.subject}>{subject}</span>
          </div>
        </div>
        <span style={styles.chevron}>{expanded ? '▲' : '▼'}</span>
      </div>

      {expanded && (
        <>
          <div style={styles.meta}>
            <span style={styles.metaLabel}>To:</span>
            <span style={styles.metaValue}>{to || 'recipient@company.com'}</span>
          </div>

          <div style={styles.body}>
            <pre style={styles.bodyText}>{body}</pre>
          </div>

          <div style={styles.actions}>
            <button style={styles.btnPrimary} onClick={handleMailto}>
              Open in Mail App
            </button>
            <button style={styles.btnSecondary} onClick={handleCopy}>
              {copied ? '✓ Copied!' : 'Copy Text'}
            </button>
            <button style={styles.btnSecondary} onClick={handleDownload}>
              Download .eml
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 14px',
    cursor: 'pointer',
    gap: 10,
  },
  headerLeft: { display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 },
  badge: {
    display: 'inline-block',
    padding: '2px 6px',
    background: 'rgba(59,130,246,0.25)',
    color: 'var(--accent)',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: '0.05em',
    marginRight: 6,
  },
  subject: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: 380,
  },
  chevron: { fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '6px 14px',
    background: 'rgba(0,0,0,0.2)',
    borderTop: '1px solid var(--border)',
  },
  metaLabel: { fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 },
  metaValue: { fontSize: 12, color: 'var(--text)' },
  body: {
    maxHeight: 320,
    overflowY: 'auto',
    padding: '12px 14px',
    borderTop: '1px solid var(--border)',
  },
  bodyText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: 'var(--text)',
    whiteSpace: 'pre-wrap',
    lineHeight: 1.6,
    margin: 0,
  },
  actions: {
    display: 'flex',
    gap: 8,
    padding: '10px 14px',
    borderTop: '1px solid var(--border)',
    flexWrap: 'wrap',
  },
  btnPrimary: {
    padding: '7px 14px',
    background: 'var(--accent)',
    color: '#fff',
    borderRadius: 'var(--radius)',
    fontWeight: 600,
    fontSize: 12,
    border: 'none',
  },
  btnSecondary: {
    padding: '7px 14px',
    background: 'transparent',
    color: 'var(--text-muted)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    fontSize: 12,
  },
};
