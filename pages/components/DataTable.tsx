import React from 'react';
import { StatusBadge } from '@partssource/react-kit';
import styles from './DataTable.module.css';

// TODO: no react-kit DataTable — this is a shared approximation using native <table>

export type ColumnDef<T> = {
  key: keyof T & string;
  header: string;
  /** Optional render override. Return a ReactNode or undefined to fall back to string coercion. */
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};

type StatusBadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'critical' | 'items';

/** Convenience helper: render a cell value as a StatusBadge */
export function badgeCell(tone: StatusBadgeTone) {
  return (value: unknown) => (
    <StatusBadge tone={tone}>{String(value)}</StatusBadge>
  );
}

type Props<T> = {
  columns: ColumnDef<T>[];
  rows: T[];
  rowKey: keyof T & string;
  /** Called when a row is clicked */
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
};

function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  rowKey,
  onRowClick,
  emptyMessage = 'No data',
}: Props<T>) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={styles.th}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>{emptyMessage}</td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr
                key={String(row[rowKey])}
                className={idx % 2 === 0 ? styles.trEven : styles.trOdd}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                style={onRowClick ? { cursor: 'pointer' } : undefined}
              >
                {columns.map((col) => (
                  <td key={col.key} className={styles.td}>
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;
