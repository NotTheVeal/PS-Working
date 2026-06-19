import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const starSizeVariants = cva('', {
  variants: {
    size: {
      sm: 'text-lg leading-none',
      md: 'text-2xl leading-none',
      lg: 'text-3xl leading-none',
    },
  },
  defaultVariants: { size: 'md' },
})

export interface RatingProps extends VariantProps<typeof starSizeVariants> {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  max?: number
  readOnly?: boolean
  label?: string
  hint?: string
  id?: string
  className?: string
}

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value: controlledValue,
      defaultValue = 0,
      onChange,
      max = 5,
      size = 'md',
      readOnly = false,
      label,
      hint,
      id,
      className,
    },
    ref
  ) => {
    const generatedId = React.useId()
    const groupId = id ?? generatedId
    const hintId = `${groupId}-hint`
    const labelId = `${groupId}-label`

    const isControlled = controlledValue !== undefined
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const value = isControlled ? controlledValue : internalValue

    const [hoverValue, setHoverValue] = React.useState(0)

    // Roving tabindex: only the currently selected star (or first if none) is tabbable
    const activeStar = value > 0 ? value : 1

    function select(star: number) {
      if (readOnly) return
      if (!isControlled) setInternalValue(star)
      onChange?.(star)
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLSpanElement>, star: number) {
      if (readOnly) return
      if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        e.preventDefault()
        const next = Math.min(star + 1, max)
        select(next)
        // Move focus to next star
        const el = document.getElementById(`${groupId}-star-${next}`)
        el?.focus()
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        e.preventDefault()
        const prev = Math.max(star - 1, 1)
        select(prev)
        const el = document.getElementById(`${groupId}-star-${prev}`)
        el?.focus()
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        select(star)
      }
    }

    const displayValue = hoverValue > 0 ? hoverValue : value

    return (
      <div ref={ref} className={cn('flex flex-col gap-1.5', className)}>
        {label && (
          <span id={labelId} className="text-[13px] font-semibold text-[#1a1a1a] leading-none">
            {label}
          </span>
        )}

        <div
          role="radiogroup"
          aria-labelledby={label ? labelId : undefined}
          aria-label={!label ? 'Rating' : undefined}
          className="flex items-center gap-0.5"
          onMouseLeave={() => !readOnly && setHoverValue(0)}
        >
          {Array.from({ length: max }, (_, i) => {
            const star = i + 1
            const filled = star <= displayValue
            const isTabTarget = !readOnly && star === activeStar

            return (
              <span
                key={star}
                id={`${groupId}-star-${star}`}
                role="radio"
                aria-checked={star === value}
                aria-label={`${star} star${star !== 1 ? 's' : ''}`}
                tabIndex={readOnly ? -1 : isTabTarget ? 0 : -1}
                onClick={() => select(star)}
                onKeyDown={(e) => handleKeyDown(e, star)}
                onMouseEnter={() => !readOnly && setHoverValue(star)}
                className={cn(
                  starSizeVariants({ size }),
                  'cursor-pointer select-none transition-colors duration-100',
                  filled ? 'text-[#d97757]' : 'text-[#e0ddd6]',
                  readOnly && 'cursor-default',
                  !readOnly &&
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1 rounded-sm'
                )}
              >
                {filled ? '★' : '☆'}
              </span>
            )
          })}
        </div>

        {hint && (
          <p id={hintId} className="text-[12px] text-[#6b6b6b] leading-[1.4]">
            {hint}
          </p>
        )}
      </div>
    )
  }
)
Rating.displayName = 'Rating'
