import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// CVA variants
// ---------------------------------------------------------------------------

const toggleButtonVariants = cva(
  [
    'inline-flex items-center justify-center font-semibold rounded-lg select-none',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        default: '',
        outline: 'border',
      },
      size: {
        sm: 'h-7 px-2.5 text-[11px] gap-1',
        md: 'h-9 px-3.5 text-[13px] gap-1.5',
        lg: 'h-11 px-5  text-[14px] gap-2',
      },
      pressed: {
        true:  '',
        false: '',
      },
    },
    compoundVariants: [
      // default variant — pressed
      {
        variant: 'default',
        pressed: true,
        className: 'bg-[#1a56b0] text-white hover:bg-[#1446a0] active:bg-[#0e3a8a]',
      },
      // default variant — unpressed
      {
        variant: 'default',
        pressed: false,
        className:
          'bg-[#f0ede8] text-[#1a1a1a] hover:bg-[#e8e4de] active:bg-[#e0dbd4]',
      },
      // outline variant — pressed
      {
        variant: 'outline',
        pressed: true,
        className:
          'border-[#1a56b0] text-[#1a56b0] bg-blue-50 hover:bg-blue-100 active:bg-blue-200',
      },
      // outline variant — unpressed
      {
        variant: 'outline',
        pressed: false,
        className:
          'border-[#e0ddd6] text-[#1a1a1a] bg-white hover:bg-[#f0ede8] active:bg-[#e8e4de]',
      },
    ],
    defaultVariants: {
      variant: 'default',
      size:    'md',
      pressed: false,
    },
  }
)

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ToggleButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'>,
    Omit<VariantProps<typeof toggleButtonVariants>, 'pressed'> {
  pressed?: boolean
  defaultPressed?: boolean
  onChange?: (pressed: boolean) => void
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline'
  children: React.ReactNode
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
  (
    {
      pressed: pressedProp,
      defaultPressed = false,
      onChange,
      size = 'md',
      variant = 'default',
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    // Uncontrolled internal state — only used when pressedProp is undefined
    const [internalPressed, setInternalPressed] = React.useState(defaultPressed)

    const isControlled = pressedProp !== undefined
    const pressed = isControlled ? pressedProp : internalPressed

    const handleClick = React.useCallback(() => {
      const next = !pressed
      if (!isControlled) {
        setInternalPressed(next)
      }
      onChange?.(next)
    }, [pressed, isControlled, onChange])

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        aria-pressed={pressed}
        onClick={handleClick}
        className={cn(
          toggleButtonVariants({ variant, size, pressed }),
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

ToggleButton.displayName = 'ToggleButton'
