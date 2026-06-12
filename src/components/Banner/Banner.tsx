import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const bannerVariants = cva(
  'flex items-start gap-3 rounded-[10px] border p-4 text-[14px] leading-[1.6]',
  {
    variants: {
      variant: {
        info:    'bg-[#e8f0fe] border-[#c5d8f8] text-[#1a56b0]',
        success: 'bg-[#d4edda] border-[#b2d9be] text-[#1a6b3a]',
        warning: 'bg-[#fef0e8] border-[#f5d0b8] text-[#c4663f]',
        error:   'bg-[#fde8e8] border-[#f5c2c2] text-[#9b2c2c]',
        neutral: 'bg-[#f0ede8] border-[#e0ddd6] text-[#4a4a4a]',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
)

export interface BannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerVariants> {
  title?: string
  /** Dismiss callback — renders a close button when provided */
  onDismiss?: () => void
  /** Custom icon — defaults to a variant-appropriate icon */
  icon?: React.ReactNode
  /** Action button or link */
  action?: React.ReactNode
}

const defaultIcons: Record<string, React.ReactNode> = {
  info: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  success: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2L14.5 13H1.5L8 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 6v3M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  neutral: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
}

export const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  ({ variant = 'info', title, onDismiss, icon, action, className, children, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
      className={cn(bannerVariants({ variant }), className)}
      {...props}
    >
      <span className="shrink-0 mt-0.5">
        {icon ?? defaultIcons[variant!]}
      </span>

      <div className="flex-1 min-w-0">
        {title && (
          <p className="font-semibold text-[13px] leading-snug mb-0.5">{title}</p>
        )}
        {children && (
          <div className="text-[13px] leading-[1.55]">{children}</div>
        )}
        {action && <div className="mt-2">{action}</div>}
      </div>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className={cn(
            'shrink-0 flex items-center justify-center w-5 h-5 rounded',
            'opacity-60 hover:opacity-100 transition-opacity',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-1'
          )}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  )
)
Banner.displayName = 'Banner'
