import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import styles from './Charts.module.css';

// PS Blue token palette — hex equivalents of CSS custom properties:
// --ps-prim-blue-500, --ps-prim-blue-300, --ps-prim-blue-700,
// --ps-prim-blue-200, --ps-prim-blue-400
const PS_BLUE_PALETTE = [
  '#005BA6', // --ps-prim-blue-500
  '#6AC7FC', // --ps-prim-blue-300
  '#003763', // --ps-prim-blue-700
  '#B0C6D3', // --ps-prim-blue-200
  '#009CF4', // --ps-prim-blue-400
];

export interface BarDef {
  dataKey: string;
  label: string;
  color?: string;
}

interface ChartProps {
  data: Record<string, unknown>[];
  bars: BarDef[];
  title?: string;
}

// Shared axis / grid styling derived from Figma design
const AXIS_TICK_STYLE = {
  fontSize: 10,
  fontFamily: "'Source Sans Pro', sans-serif",
  fill: '#777777',
};

const Y_AXIS_TICK_STYLE = {
  fontSize: 9,
  fontFamily: "'Source Sans Pro', sans-serif",
  fill: '#000000',
};

const GRID_STROKE = '#dcdcdc';
const TOOLTIP_STYLE: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid #dcdcdc',
  borderRadius: 8,
  fontSize: 12,
  fontFamily: "'Source Sans Pro', sans-serif",
  color: '#4a4a4a',
};

const LEGEND_STYLE: React.CSSProperties = {
  fontSize: 12,
  fontFamily: "'Source Sans Pro', sans-serif",
  color: '#4a4a4a',
};

function resolveColor(bar: BarDef, index: number): string {
  return bar.color ?? PS_BLUE_PALETTE[index % PS_BLUE_PALETTE.length];
}

export function PSVerticalBarChart({ data, bars, title }: ChartProps) {
  return (
    <div className={styles.chartWrapper}>
      {title && <p className={styles.chartTitle}>{title}</p>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid vertical={false} stroke={GRID_STROKE} strokeDasharray="" />
          <XAxis
            dataKey="name"
            tick={AXIS_TICK_STYLE}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={Y_AXIS_TICK_STYLE}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(0,91,166,0.06)' }} />
          <Legend wrapperStyle={LEGEND_STYLE} iconType="square" iconSize={14} />
          {bars.map((bar, i) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.label}
              fill={resolveColor(bar, i)}
              radius={0}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PSHorizontalBarChart({ data, bars, title }: ChartProps) {
  return (
    <div className={styles.chartWrapper}>
      {title && <p className={styles.chartTitle}>{title}</p>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          layout="vertical"
          data={data}
          margin={{ top: 8, right: 16, left: 0, bottom: 4 }}
        >
          <CartesianGrid horizontal={false} stroke={GRID_STROKE} />
          <XAxis
            type="number"
            tick={Y_AXIS_TICK_STYLE}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={AXIS_TICK_STYLE}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(0,91,166,0.06)' }} />
          <Legend wrapperStyle={LEGEND_STYLE} iconType="square" iconSize={14} />
          {bars.map((bar, i) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.label}
              fill={resolveColor(bar, i)}
              radius={0}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PSStackedBarChart({ data, bars, title }: ChartProps) {
  return (
    <div className={styles.chartWrapper}>
      {title && <p className={styles.chartTitle}>{title}</p>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid vertical={false} stroke={GRID_STROKE} strokeDasharray="" />
          <XAxis
            dataKey="name"
            tick={AXIS_TICK_STYLE}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={Y_AXIS_TICK_STYLE}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(0,91,166,0.06)' }} />
          <Legend wrapperStyle={LEGEND_STYLE} iconType="square" iconSize={14} />
          {bars.map((bar, i) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.label}
              fill={resolveColor(bar, i)}
              stackId="stack"
              radius={0}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function PSGroupedBarChart({ data, bars, title }: ChartProps) {
  return (
    <div className={styles.chartWrapper}>
      {title && <p className={styles.chartTitle}>{title}</p>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          barCategoryGap="20%"
          barGap={4}
          margin={{ top: 8, right: 16, left: 0, bottom: 4 }}
        >
          <CartesianGrid vertical={false} stroke={GRID_STROKE} strokeDasharray="" />
          <XAxis
            dataKey="name"
            tick={AXIS_TICK_STYLE}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={Y_AXIS_TICK_STYLE}
            axisLine={false}
            tickLine={false}
            width={32}
          />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(0,91,166,0.06)' }} />
          <Legend wrapperStyle={LEGEND_STYLE} iconType="square" iconSize={14} />
          {bars.map((bar, i) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.label}
              fill={resolveColor(bar, i)}
              radius={0}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
