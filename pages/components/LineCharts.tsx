import React from 'react'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import styles from './LineCharts.module.css'

// PS Design Token hex values
const PS_BLUE_500 = '#005BA6'
const PS_BLUE_400 = '#009CF4'
const PS_BLUE_300 = '#6AC7FC'
const PS_BLUE_700 = '#003763'
const PS_GRAY_300 = '#DCDCDC'

const DEFAULT_LINE_COLORS = [PS_BLUE_500, PS_BLUE_400, PS_BLUE_300, PS_BLUE_700]

export interface SeriesConfig {
  dataKey: string
  label: string
  color?: string
}

export interface LineChartProps {
  data: Record<string, unknown>[]
  lines: SeriesConfig[]
  title?: string
}

export interface AreaChartProps {
  data: Record<string, unknown>[]
  areas: SeriesConfig[]
  title?: string
}

const axisStyle = {
  fontSize: 10,
  fill: '#777777',
  fontFamily: 'Source Sans Pro, sans-serif',
}

export function PSLineChart({ data, lines, title }: LineChartProps) {
  return (
    <div className={styles.chartWrapper}>
      {title && <p className={styles.chartTitle}>{title}</p>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={PS_GRAY_300} vertical={false} />
          <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} />
          <Tooltip
            contentStyle={{
              fontFamily: 'Source Sans Pro, sans-serif',
              fontSize: 12,
              borderColor: PS_GRAY_300,
              borderRadius: 6,
            }}
          />
          <Legend
            wrapperStyle={{ fontFamily: 'Source Sans Pro, sans-serif', fontSize: 12 }}
            iconType="square"
            iconSize={12}
          />
          {lines.map((line, i) => (
            <Line
              key={line.dataKey}
              type="linear"
              dataKey={line.dataKey}
              name={line.label}
              stroke={line.color ?? DEFAULT_LINE_COLORS[i % DEFAULT_LINE_COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function PSMultiLineChart({ data, lines, title }: LineChartProps) {
  return (
    <div className={styles.chartWrapper}>
      {title && <p className={styles.chartTitle}>{title}</p>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={PS_GRAY_300} vertical={false} />
          <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} />
          <Tooltip
            contentStyle={{
              fontFamily: 'Source Sans Pro, sans-serif',
              fontSize: 12,
              borderColor: PS_GRAY_300,
              borderRadius: 6,
            }}
          />
          <Legend
            wrapperStyle={{ fontFamily: 'Source Sans Pro, sans-serif', fontSize: 12 }}
            iconType="square"
            iconSize={12}
          />
          {lines.map((line, i) => (
            <Line
              key={line.dataKey}
              type="linear"
              dataKey={line.dataKey}
              name={line.label}
              stroke={line.color ?? DEFAULT_LINE_COLORS[i % DEFAULT_LINE_COLORS.length]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function PSAreaChart({ data, areas, title }: AreaChartProps) {
  return (
    <div className={styles.chartWrapper}>
      {title && <p className={styles.chartTitle}>{title}</p>}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={PS_GRAY_300} vertical={false} />
          <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} />
          <Tooltip
            contentStyle={{
              fontFamily: 'Source Sans Pro, sans-serif',
              fontSize: 12,
              borderColor: PS_GRAY_300,
              borderRadius: 6,
            }}
          />
          <Legend
            wrapperStyle={{ fontFamily: 'Source Sans Pro, sans-serif', fontSize: 12 }}
            iconType="square"
            iconSize={12}
          />
          {areas.map((area, i) => {
            const color = area.color ?? DEFAULT_LINE_COLORS[i % DEFAULT_LINE_COLORS.length]
            return (
              <Area
                key={area.dataKey}
                type="linear"
                dataKey={area.dataKey}
                name={area.label}
                stroke={color}
                strokeWidth={2}
                fill={color}
                fillOpacity={0.6}
                dot={false}
                activeDot={{ r: 4 }}
              />
            )
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export function PSStackedAreaChart({ data, areas, title }: AreaChartProps) {
  return (
    <div className={styles.chartWrapper}>
      {title && <p className={styles.chartTitle}>{title}</p>}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={PS_GRAY_300} vertical={false} />
          <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} width={40} />
          <Tooltip
            contentStyle={{
              fontFamily: 'Source Sans Pro, sans-serif',
              fontSize: 12,
              borderColor: PS_GRAY_300,
              borderRadius: 6,
            }}
          />
          <Legend
            wrapperStyle={{ fontFamily: 'Source Sans Pro, sans-serif', fontSize: 12 }}
            iconType="square"
            iconSize={12}
          />
          {areas.map((area, i) => {
            const color = area.color ?? DEFAULT_LINE_COLORS[i % DEFAULT_LINE_COLORS.length]
            return (
              <Area
                key={area.dataKey}
                type="linear"
                dataKey={area.dataKey}
                name={area.label}
                stackId="stack"
                stroke={color}
                strokeWidth={2}
                fill={color}
                fillOpacity={0.6}
                dot={false}
                activeDot={{ r: 4 }}
              />
            )
          })}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
