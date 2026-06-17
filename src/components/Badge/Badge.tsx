import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const badgeVariants = cva(
  'inline-flex items-center gap-1 font-semibold uppercase tracking-[0.06em] select-none',
  {
    variants: {
      variant: {
        default:  'bg-[#f0ede8] text-[#4a4a4a] border border-[#e0ddd6]',
        blue:     'bg-[#e8f0fe] text-[#1a56b0] border border-[#c5d8f8]',
        green:    'bg-[#d4edda] text-[#1a6b3a] border border-[#b2d9be]',
        red:      'bg-[#fde8e8] text-[#9b2c2c] border border-[#f5c2c2]',
        orange:   'bg-[#fef0e8] text-[#c4663f] border border-[#f5d0b8]',
        purple:   'bg-[#f0e8fe] text-[#6b3ab0] border border-[#d8c2f8]',
        neutral:  'bg-[#f5f5f5] text-[#6b6b6b] border border-[#e0e0e0]',
      },
      size: {
        sm: 'text-[10px] px-1.5 py-0.5 rounded',
        md: 'text-[11px] px-2 py-0.5 rounded',
        lg: 'text-[12px] px-2.5 py-1 rounded-md',
      },
      pill: {
        true:  'rounded-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size:    'md',
      pill:    false,
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  /** Icon shown before the label */
  icon?: React.ReactNode
  /** Dot indicator instead of text */
  dot?: boolean
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant, size, pill, icon, dot, className, children, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size, pill }), className)}
      {...props}
    >
      {dot && (
        <span
          className="inline-block w-1.5 h-1.5 rounded-full bg-current shrink-0"
          aria-hidden="true"
        />
      )}
      {!dot && icon && (
        <span className="shrink-0 flex items-center" aria-hidden="true">
          {icon}
        </span>
      )}
      {children}
    </span>
  )
)
Badge.displayName = 'Badge'
