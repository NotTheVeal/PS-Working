import React from 'react';
import styles from './StatCard.module.css';

type Trend = 'up' | 'down' | 'flat';

type Props = {
  label: string;
  value: string | number;
  unit?: string;
  delta?: string;
  trend?: Trend;
  sublabel?: string;
};

const trendIcon: Record<Trend, string> = { up: '↑', down: '↓', flat: '→' };
const trendColor: Record<Trend, string> = {
  up:   'var(--ps-prim-status-successFg, #0E7C55)',
  down: 'var(--ps-prim-status-errorFg,   #E00000)',
  flat: 'var(--ps-prim-gray-500)',
};

export default function StatCard({ label, value, unit, delta, trend = 'flat', sublabel }: Props) {
  return (
    <div className={styles.card}>
      <span className={styles.label}>{label}</span>
      <div className={styles.valueRow}>
        <span className={styles.value}>{value}</span>
        {unit && <span className={styles.unit}>{unit}</span>}
      </div>
      {delta && trend && (
        <span className={styles.delta} style={{ color: trendColor[trend] }}>
          {trendIcon[trend]} {delta}
        </span>
      )}
      {sublabel && <span className={styles.sublabel}>{sublabel}</span>}
    </div>
  );
}
