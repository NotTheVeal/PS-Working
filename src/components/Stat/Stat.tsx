import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// CVA variants
// ---------------------------------------------------------------------------

const statVariants = cva('flex flex-col gap-3', {
  variants: {
    variant: {
      default:  '',
      outlined: 'border border-[#e0ddd6] rounded-xl p-4',
      filled:   'bg-[#f0ede8] rounded-xl p-4',
    },
    size: {
      sm: '',
      md: '',
      lg: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size:    'md',
  },
})

const statValueVariants = cva('font-bold text-[#1a1a1a] leading-none', {
  variants: {
    size: {
      sm: 'text-xl',
      md: 'text-3xl',
      lg: 'text-5xl',
    },
  },
  defaultVariants: { size: 'md' },
})

const statLabelVariants = cva('font-medium text-[#1a1a1a]/60 uppercase tracking-wide', {
  variants: {
    size: {
      sm: 'text-[10px]',
      md: 'text-[11px]',
      lg: 'text-[13px]',
    },
  },
  defaultVariants: { size: 'md' },
})

const statTrendVariants = cva('inline-flex items-center gap-1 font-medium rounded-full px-2 py-0.5', {
  variants: {
    size: {
      sm: 'text-[10px]',
      md: 'text-[11px]',
      lg: 'text-[12px]',
    },
  },
  defaultVariants: { size: 'md' },
})

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StatProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statVariants> {
  label: string
  value: string | number
  previousValue?: string | number
  trend?: 'up' | 'down' | 'neutral'
  trendLabel?: string
  icon?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outlined' | 'filled'
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const trendConfig = {
  up:      { arrow: '▲', colorClass: 'text-[#1a6b3a] bg-[#1a6b3a]/10' },
  down:    { arrow: '▼', colorClass: 'text-red-600 bg-red-50' },
  neutral: { arrow: '→', colorClass: 'text-[#1a1a1a]/50 bg-[#1a1a1a]/5' },
} as const

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const Stat = React.forwardRef<HTMLDivElement, StatProps>(
  (
    {
      label,
      value,
      previousValue,
      trend,
      trendLabel,
      icon,
      size = 'md',
      variant = 'default',
      className,
      ...props
    },
    ref
  ) => {
    const trendInfo = trend ? trendConfig[trend] : undefined

    return (
      <div
        ref={ref}
        aria-label={`${label}: ${value}`}
        className={cn(statVariants({ variant, size }), className)}
        {...props}
      >
        {/* Header row: icon + label */}
        <div className="flex items-start justify-between gap-2">
          <span className={cn(statLabelVariants({ size }))}>{label}</span>
          {icon && (
            <span
              aria-hidden="true"
              className="shrink-0 flex items-center justify-center rounded-lg bg-[#f0ede8] p-2"
            >
              {icon}
            </span>
          )}
        </div>

        {/* Value */}
        <span className={cn(statValueVariants({ size }))}>{value}</span>

        {/* Trend */}
        {(trendInfo || trendLabel) && (
          <div className="flex items-center gap-2 flex-wrap">
            {trendInfo && (
              <span
                aria-label={trend === 'up' ? 'Trending up' : trend === 'down' ? 'Trending down' : 'No change'}
                className={cn(statTrendVariants({ size }), trendInfo.colorClass)}
              >
                <span aria-hidden="true">{trendInfo.arrow}</span>
                {trendLabel && <span>{trendLabel}</span>}
              </span>
            )}
            {previousValue !== undefined && !trendLabel && (
              <span className="text-[#1a1a1a]/40 text-[11px]">vs {previousValue}</span>
            )}
          </div>
        )}
      </div>
    )
  }
)

Stat.displayName = 'Stat'
