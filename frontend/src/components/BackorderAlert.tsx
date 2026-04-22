import React, { useState } from 'react';

interface BackorderData {
  partNumber: string;
  description: string;
  manufacturer: string;
  availability: string;
  isBackordered: boolean;
  riskScore: number;
  riskReason: string;
  riskEmoji: string;
  url: string;
}

interface Props {
  data: BackorderData;
}

export default function BackorderAlert({ data }: Props) {
  const [expanded, setExpanded] = useState(true);

  const riskColor =
    data.riskScore >= 86 ? '#ef4444' :
    data.riskScore >= 61 ? '#f97316' :
    data.riskScore >= 31 ? '#f59e0b' :
    '#22c55e';

  const bgColor =
    data.riskScore >= 86 ? 'rgba(239,68,68,0.08)' :
    data.riskScore >= 61 ? 'rgba(249,115,22,0.08)' :
    data.riskScore >= 31 ? 'rgba(245,158,11,0.08)' :
    'rgba(34,197,94,0.08)';

  const label = data.isBackordered ? 'BACKORDERED' :
    data.riskScore >= 86 ? 'CRITICAL RISK' :
    data.riskScore >= 61 ? 'HIGH RISK' :
    data.riskScore >= 31 ? 'MODERATE RISK' : 'LOW RISK';

  return (
    <div style={{ ...styles.card, borderColor: riskColor, background: bgColor }}>
      <div style={styles.header} onClick={() => setExpanded(!expanded)}>
        <div style={styles.headerLeft}>
          <span style={{ fontSize: 18 }}>{data.riskEmoji || (data.isBackordered ? '🔴' : '🟠')}</span>
          <div>
            <span style={{ ...styles.badge, background: riskColor }}>{label}</span>
            <span style={styles.partTitle}>
              {data.description || `Part #${data.partNumber}`}
            </span>
          </div>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.riskMeter}>
            <div style={styles.riskBar}>
              <div style={{ ...styles.riskFill, width: `${data.riskScore}%`, background: riskColor }} />
            </div>
            <span style={{ ...styles.riskScore, color: riskColor }}>{data.riskScore}/100</span>
          </div>
          <span style={styles.chevron}>{expanded ? '▲' : '▼'}</span>
        </div>
      </div>

      {expanded && (
        <div style={styles.body}>
          <div style={styles.grid}>
            <DetailRow label="Part Number" value={data.partNumber || 'N/A'} mono />
            <DetailRow label="Manufacturer" value={data.manufacturer || 'N/A'} />
            <DetailRow label="Availability" value={data.availability || 'Unknown'} />
            <DetailRow label="Risk Reason" value={data.riskReason} highlight={riskColor} />
          </div>
          {data.url && (
            <a href={data.url} target="_blank" rel="noopener noreferrer" style={styles.link}>
              View on PartsSource →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value, mono, highlight }: { label: string; value: string; mono?: boolean; highlight?: string }) {
  return (
    <div style={styles.detailRow}>
      <span style={styles.detailLabel}>{label}</span>
      <span style={{ ...styles.detailValue, fontFamily: mono ? 'monospace' : 'inherit', color: highlight ?? 'var(--text)' }}>
        {value}
      </span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    border: '1px solid',
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
    gap: 12,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexShrink: 0,
  },
  badge: {
    display: 'inline-block',
    padding: '2px 6px',
    borderRadius: 4,
    fontSize: 10,
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '0.05em',
    marginRight: 6,
  },
  partTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    maxWidth: 280,
  },
  riskMeter: { display: 'flex', alignItems: 'center', gap: 8 },
  riskBar: {
    width: 80,
    height: 6,
    background: 'var(--surface2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  riskFill: { height: '100%', borderRadius: 3, transition: 'width 0.4s' },
  riskScore: { fontSize: 12, fontWeight: 700, minWidth: 40 },
  chevron: { fontSize: 10, color: 'var(--text-muted)' },
  body: { padding: '0 14px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 16px', paddingTop: 10 },
  detailRow: { display: 'flex', flexDirection: 'column', gap: 2 },
  detailLabel: { fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' },
  detailValue: { fontSize: 13 },
  link: { display: 'inline-block', marginTop: 10, fontSize: 12, color: 'var(--accent)' },
};
