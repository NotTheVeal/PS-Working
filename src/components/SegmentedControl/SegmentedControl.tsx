import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const segmentVariants = cva(
  [
    'relative inline-flex items-center justify-center gap-1.5 rounded-md font-medium transition-all duration-150 select-none',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
    'disabled:opacity-50 disabled:cursor-not-allowed',
  ],
  {
    variants: {
      size: {
        sm: 'px-2.5 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface SegmentedOption {
  value: string
  label: string
  disabled?: boolean
  icon?: React.ReactNode
}

export interface SegmentedControlProps extends VariantProps<typeof segmentVariants> {
  options: SegmentedOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  fullWidth?: boolean
  disabled?: boolean
  label?: string
}

export const SegmentedControl = React.forwardRef<HTMLDivElement, SegmentedControlProps>(
  (
    {
      options,
      value,
      defaultValue,
      onChange,
      size = 'md',
      fullWidth = false,
      disabled = false,
      label,
    },
    ref
  ) => {
    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = React.useState<string>(
      defaultValue ?? options[0]?.value ?? ''
    )
    const currentValue = isControlled ? value : internalValue

    const select = React.useCallback(
      (optValue: string) => {
        if (!isControlled) setInternalValue(optValue)
        onChange?.(optValue)
      },
      [isControlled, onChange]
    )

    const enabledOptions = options.filter((o) => !o.disabled)

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const currentIndex = enabledOptions.findIndex((o) => o.value === currentValue)
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        const next = enabledOptions[(currentIndex + 1) % enabledOptions.length]
        if (next) select(next.value)
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        const prev = enabledOptions[(currentIndex - 1 + enabledOptions.length) % enabledOptions.length]
        if (prev) select(prev.value)
      }
    }

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label={label}
        aria-disabled={disabled || undefined}
        onKeyDown={handleKeyDown}
        className={cn(
          'inline-flex items-center gap-0.5 rounded-lg bg-[#f0ede8] p-1',
          fullWidth && 'flex w-full'
        )}
      >
        {options.map((option) => {
          const isSelected = option.value === currentValue
          const isDisabled = disabled || option.disabled

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              disabled={isDisabled}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => !isDisabled && select(option.value)}
              className={cn(
                segmentVariants({ size }),
                fullWidth && 'flex-1',
                isSelected
                  ? 'bg-white text-[#1a56b0] shadow-sm'
                  : 'bg-transparent text-[#1a1a1a]/60 hover:bg-[#f0ede8] hover:text-[#1a1a1a]'
              )}
            >
              {option.icon && (
                <span aria-hidden="true" className="shrink-0">
                  {option.icon}
                </span>
              )}
              {option.label}
            </button>
          )
        })}
      </div>
    )
  }
)
SegmentedControl.displayName = 'SegmentedControl'
