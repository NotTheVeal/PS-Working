import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import styles from './PieCharts.module.css';

// PS design token hex values for the blue ramp used in data viz
const PS_COLORS = [
  '#005BA6', // Blue 500
  '#6AC7FC', // Blue 300
  '#009CF4', // Blue 400
  '#003763', // Blue 700
  '#B0C6D3', // Blue 200
  '#DCDCDC', // Gray 300
  '#E6E6E6', // Gray 200
];

// ── Shared types ──────────────────────────────────────────────────────────────

export type PieSlice = {
  name: string;
  value: number;
  color?: string;
};

// ── PSPieChart ────────────────────────────────────────────────────────────────

type PSPieChartProps = {
  data: PieSlice[];
  title?: string;
};

export function PSPieChart({ data, title }: PSPieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className={styles.card}>
      {title && <p className={styles.chartLabel}>PIE CHART</p>}
      {title && <h3 className={styles.chartTitle}>{title}</h3>}
      <div className={styles.body}>
        <ResponsiveContainer width="50%" height={220}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              cx="50%"
              cy="50%"
              outerRadius={90}
              strokeWidth={2}
              stroke="#fff"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color ?? PS_COLORS[index % PS_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [
                `${value} (${Math.round((value / total) * 100)}%)`,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className={styles.legend}>
          {data.map((entry, index) => {
            const pct = Math.round((entry.value / total) * 100);
            const color = entry.color ?? PS_COLORS[index % PS_COLORS.length];
            return (
              <div key={entry.name} className={styles.legendRow}>
                <span
                  className={styles.legendSwatch}
                  style={{ background: color }}
                />
                <span className={styles.legendText}>
                  {entry.name} — {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── PSDonutChart ──────────────────────────────────────────────────────────────

type PSDonutChartProps = {
  data: PieSlice[];
  title?: string;
  centerLabel?: {
    value: string | number;
    subtitle?: string;
  };
};

export function PSDonutChart({ data, title, centerLabel }: PSDonutChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className={styles.card}>
      {title && <p className={styles.chartLabel}>DONUT CHART</p>}
      {title && <h3 className={styles.chartTitle}>{title}</h3>}
      <div className={styles.body}>
        {/* Chart column */}
        <div className={styles.donutWrapper}>
          <ResponsiveContainer width={220} height={220}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                strokeWidth={2}
                stroke="#fff"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color ?? PS_COLORS[index % PS_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                  `${value} (${Math.round((value / total) * 100)}%)`,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>

          {centerLabel && (
            <div className={styles.donutCenter} aria-label={String(centerLabel.value)}>
              <span className={styles.donutCenterValue}>{centerLabel.value}</span>
              {centerLabel.subtitle && (
                <span className={styles.donutCenterSub}>{centerLabel.subtitle}</span>
              )}
            </div>
          )}
        </div>

        {/* Legend column */}
        <div className={styles.legend}>
          {data.map((entry, index) => {
            const pct = Math.round((entry.value / total) * 100);
            const color = entry.color ?? PS_COLORS[index % PS_COLORS.length];
            return (
              <div key={entry.name} className={styles.legendRow}>
                <span
                  className={styles.legendSwatch}
                  style={{ background: color }}
                />
                <span className={styles.legendText}>
                  {entry.name} — {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── PSGaugeChart ──────────────────────────────────────────────────────────────

type PSGaugeChartProps = {
  value: number;
  max: number;
  label?: string;
  title?: string;
};

export function PSGaugeChart({ value, max, label, title }: PSGaugeChartProps) {
  const pct = Math.round((value / max) * 100);

  // RadialBarChart expects data with a fill field
  const gaugeData = [
    { name: label ?? 'Value', value: pct, fill: '#005BA6' },
  ];

  return (
    <div className={styles.card}>
      {title && <p className={styles.chartLabel}>GAUGE CHART</p>}
      {title && <h3 className={styles.chartTitle}>{title}</h3>}
      <div className={styles.gaugeWrapper}>
        <ResponsiveContainer width={220} height={220}>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            barSize={30}
            startAngle={180}
            endAngle={0}
            data={gaugeData}
          >
            {/* Background track */}
            <RadialBar
              dataKey="value"
              cornerRadius={4}
              background={{ fill: '#E6E6E6' }}
            />
          </RadialBarChart>
        </ResponsiveContainer>

        <div className={styles.gaugeCenter}>
          <span className={styles.donutCenterValue}>{pct}%</span>
          {label && <span className={styles.donutCenterSub}>{label}</span>}
        </div>
      </div>
    </div>
  );
}

// ── PSWaffleChart ─────────────────────────────────────────────────────────────
// Recharts has no native waffle chart; approximated with a CSS 10×10 grid.
// TODO: no react-kit match — approximated with a CSS grid of colored squares

type PSWaffleChartProps = {
  value: number;
  max: number;
  label?: string;
  title?: string;
};

export function PSWaffleChart({ value, max, label, title }: PSWaffleChartProps) {
  const filledCount = Math.round((value / max) * 100);
  const cells = Array.from({ length: 100 }, (_, i) => i < filledCount);

  return (
    <div className={styles.card}>
      {title && <p className={styles.chartLabel}>WAFFLE CHART</p>}
      {title && <h3 className={styles.chartTitle}>{title}</h3>}
      <div className={styles.waffleWrapper}>
        <div className={styles.waffleGrid} aria-label={`${filledCount}% filled`}>
          {cells.map((filled, i) => (
            <div
              key={i}
              className={styles.waffleCell}
              style={{ background: filled ? '#005BA6' : '#E6E6E6' }}
            />
          ))}
        </div>
        <div className={styles.waffleMeta}>
          <span className={styles.donutCenterValue}>{Math.round((value / max) * 100)}%</span>
          {label && <span className={styles.donutCenterSub}>{label}</span>}
        </div>
      </div>
    </div>
  );
}
