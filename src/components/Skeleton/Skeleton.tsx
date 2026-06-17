import * as React from 'react'
import { cn } from '@/lib/cn'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Shape of the skeleton */
  shape?: 'line' | 'circle' | 'rect'
  /** Width — defaults to 100% for line/rect, fixed for circle */
  width?: string | number
  /** Height */
  height?: string | number
  /** Disable animation */
  static?: boolean
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ shape = 'line', width, height, static: noAnim, className, style, ...props }, ref) => (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        'bg-[#e8e4de]',
        !noAnim && 'animate-pulse',
        shape === 'circle' && 'rounded-full',
        shape === 'line'   && 'rounded-md',
        shape === 'rect'   && 'rounded-lg',
        className
      )}
      style={{
        width:  width  ?? (shape === 'circle' ? 40  : '100%'),
        height: height ?? (shape === 'circle' ? 40  : shape === 'line' ? 16 : 80),
        ...style,
      }}
      {...props}
    />
  )
)
Skeleton.displayName = 'Skeleton'

// ─── Pre-built skeleton layouts ────────────────────────────────────────────────

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-[10px] border border-[#e0ddd6] p-5 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Skeleton shape="circle" width={40} height={40} />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton height={14} width="60%" />
          <Skeleton height={12} width="40%" />
        </div>
      </div>
      <Skeleton height={12} />
      <Skeleton height={12} width="80%" />
      <Skeleton height={12} width="90%" />
    </div>
  )
}

export function SkeletonTable({ rows = 4, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-[10px] border border-[#e0ddd6] overflow-hidden">
      <div className="bg-[#f0ede8] px-4 py-2.5 flex gap-4">
        {Array.from({ length: cols }, (_, i) => (
          <Skeleton key={i} height={11} width={`${60 + (i % 3) * 15}px`} />
        ))}
      </div>
      {Array.from({ length: rows }, (_, r) => (
        <div key={r} className="px-4 py-3 border-t border-[#e0ddd6] flex gap-4">
          {Array.from({ length: cols }, (_, c) => (
            <Skeleton key={c} height={14} width={`${50 + ((r + c) % 4) * 20}px`} />
          ))}
        </div>
      ))}
    </div>
  )
}
