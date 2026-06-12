import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const spinnerVariants = cva('animate-spin shrink-0', {
  variants: {
    size: {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6',
      xl: 'w-8 h-8',
    },
    variant: {
      current: 'text-current',
      blue:    'text-[#1a56b0]',
      white:   'text-white',
      muted:   'text-[#6b6b6b]',
    },
  },
  defaultVariants: {
    size:    'md',
    variant: 'current',
  },
})

export interface SpinnerProps
  extends React.SVGAttributes<SVGSVGElement>,
    VariantProps<typeof spinnerVariants> {
  /** Screen-reader label — defaults to "Loading" */
  label?: string
}

export const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ size, variant, label = 'Loading', className, ...props }, ref) => (
    <svg
      ref={ref}
      role="status"
      aria-label={label}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      className={cn(spinnerVariants({ size, variant }), className)}
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12" cy="12" r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  )
)
Spinner.displayName = 'Spinner'
