import React from 'react';
import styles from './PillToggle.module.css';

type Option<T extends string> = { value: T; label: string };

type Props<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

export default function PillToggle<T extends string>({ options, value, onChange }: Props<T>) {
  return (
    <div className={styles.track} role="group">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={opt.value === value ? styles.active : styles.pill}
          onClick={() => onChange(opt.value)}
          aria-pressed={opt.value === value}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
