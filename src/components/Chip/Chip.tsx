import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const chipVariants = cva(
  [
    'inline-flex items-center gap-1.5 rounded-full border font-medium',
    'transition-colors duration-150 select-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
  ],
  {
    variants: {
      variant: {
        default:  'bg-white border-[#e0ddd6] text-[#1a1a1a] hover:bg-[#f0ede8]',
        selected: 'bg-[#e8f0fe] border-[#1a56b0] text-[#1a56b0] hover:bg-[#d5e5fc]',
        filter:   'bg-[#f0ede8] border-[#e0ddd6] text-[#4a4a4a] hover:bg-[#e8e4de]',
      },
      size: {
        sm: 'text-[11px] px-2.5 py-0.5',
        md: 'text-[13px] px-3 py-1',
        lg: 'text-[14px] px-4 py-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size:    'md',
    },
  }
)

export interface ChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>,
    VariantProps<typeof chipVariants> {
  /** Whether the chip is selected/active */
  selected?: boolean
  /** Callback when the chip is toggled */
  onToggle?: (selected: boolean) => void
  /** Callback when the remove × button is clicked */
  onRemove?: () => void
  /** Leading icon */
  icon?: React.ReactNode
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      variant,
      size,
      selected = false,
      onToggle,
      onRemove,
      icon,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const resolvedVariant = selected ? 'selected' : variant

    function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        onToggle?.(!selected)
      }
    }

    return (
      <button
        ref={ref}
        type="button"
        role="checkbox"
        aria-checked={selected}
        disabled={disabled}
        onClick={() => onToggle?.(!selected)}
        onKeyDown={handleKeyDown}
        className={cn(
          chipVariants({ variant: resolvedVariant, size }),
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
        {...props}
      >
        {icon && (
          <span className="shrink-0 flex items-center" aria-hidden="true">
            {icon}
          </span>
        )}
        {children}
        {onRemove && (
          <span
            role="button"
            tabIndex={0}
            aria-label={`Remove ${typeof children === 'string' ? children : 'item'}`}
            onClick={(e) => { e.stopPropagation(); onRemove() }}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault()
                e.stopPropagation()
                onRemove()
              }
            }}
            className={cn(
              'shrink-0 flex items-center justify-center w-3.5 h-3.5 rounded-full',
              'opacity-50 hover:opacity-100 transition-opacity',
              'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-current'
            )}
          >
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
              <path d="M1 1l6 6M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
        )}
      </button>
    )
  }
)
Chip.displayName = 'Chip'
