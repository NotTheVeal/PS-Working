import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const buttonVariants = cva(
  [
    'inline-flex items-center justify-center gap-2 rounded-lg font-semibold',
    'transition-colors duration-150 select-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        primary:   'bg-[#1a56b0] text-white hover:bg-[#1446a0] active:bg-[#0e3a8a]',
        secondary: 'bg-white text-[#1a1a1a] border border-[#e0ddd6] hover:bg-[#f0ede8] active:bg-[#e8e4de]',
        ghost:     'bg-transparent text-[#1a56b0] hover:bg-[#e8f0fe] active:bg-[#d5e5fc]',
        danger:    'bg-[#9b2c2c] text-white hover:bg-[#822626] active:bg-[#6b1f1f]',
        brand:     'bg-[#d97757] text-white hover:bg-[#c4663f] active:bg-[#b05838]',
      },
      size: {
        sm: 'h-7 px-3 text-[12px]',
        md: 'h-9 px-4 text-[13px]',
        lg: 'h-11 px-5 text-[14px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size:    'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  icon?: React.ReactNode
  trailingIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, loading, icon, trailingIcon, disabled, className, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4 shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      ) : (
        icon && <span className="shrink-0 h-4 w-4 flex items-center justify-center" aria-hidden="true">{icon}</span>
      )}
      {children}
      {trailingIcon && !loading && (
        <span className="shrink-0 h-4 w-4 flex items-center justify-center" aria-hidden="true">{trailingIcon}</span>
      )}
    </button>
  )
)
Button.displayName = 'Button'
