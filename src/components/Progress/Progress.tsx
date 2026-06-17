import * as React from 'react'
import { cn } from '@/lib/cn'

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Value 0–100 */
  value: number
  /** Max value (default 100) */
  max?: number
  /** Visual size */
  size?: 'sm' | 'md' | 'lg'
  /** Color variant */
  variant?: 'default' | 'success' | 'warning' | 'error'
  /** Show percentage label */
  showLabel?: boolean
  /** Accessible label */
  label?: string
  /** Indeterminate / loading state */
  indeterminate?: boolean
}

const trackHeight: Record<string, string> = { sm: 'h-1', md: 'h-2', lg: 'h-3' }

const fillColor: Record<string, string> = {
  default: 'bg-[#1a56b0]',
  success: 'bg-[#1a6b3a]',
  warning: 'bg-[#d97757]',
  error:   'bg-[#e53e3e]',
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, max = 100, size = 'md', variant = 'default', showLabel, label, indeterminate, className, ...props }, ref) => {
    const pct = Math.min(100, Math.max(0, (value / max) * 100))

    return (
      <div ref={ref} className={cn('flex flex-col gap-1.5 w-full', className)} {...props}>
        {(label || showLabel) && (
          <div className="flex items-center justify-between gap-2">
            {label && <span className="text-[13px] font-medium text-[#1a1a1a]">{label}</span>}
            {showLabel && <span className="text-[12px] text-[#6b6b6b] tabular-nums">{Math.round(pct)}%</span>}
          </div>
        )}
        <div
          role="progressbar"
          aria-valuenow={indeterminate ? undefined : value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label ?? `${Math.round(pct)}% complete`}
          aria-valuetext={indeterminate ? 'Loading…' : `${Math.round(pct)}%`}
          className={cn('w-full bg-[#e0ddd6] rounded-full overflow-hidden', trackHeight[size])}
        >
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-out',
              fillColor[variant],
              indeterminate && 'w-1/3 animate-[progress-slide_1.4s_ease-in-out_infinite]'
            )}
            style={indeterminate ? undefined : { width: `${pct}%` }}
          />
        </div>
      </div>
    )
  }
)
Progress.displayName = 'Progress'
