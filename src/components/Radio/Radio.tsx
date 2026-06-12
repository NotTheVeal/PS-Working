import * as React from 'react'
import { cn } from '@/lib/cn'

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text rendered to the right of the radio */
  label?: string
  /** Helper text rendered below the label */
  hint?: string
  /** Error message */
  error?: string
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ label, hint, error, id, disabled, required, className, ...props }, ref) => {
    const radioId    = id ?? React.useId()
    const hintId     = `${radioId}-hint`
    const errorId    = `${radioId}-error`
    const describedBy = [error ? errorId : null, !error && hint ? hintId : null]
      .filter(Boolean).join(' ') || undefined

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-start gap-2.5">
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              ref={ref}
              type="radio"
              id={radioId}
              disabled={disabled}
              required={required}
              aria-required={required || undefined}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy}
              className={cn(
                'peer appearance-none w-4 h-4 rounded-full border border-[#d0cdc5] bg-white shrink-0',
                'transition-colors duration-150 cursor-pointer',
                'checked:border-[#1a56b0] checked:bg-white',
                'hover:border-[#1a56b0]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                error && 'border-[#e53e3e]',
                className
              )}
              {...props}
            />
            {/* inner dot */}
            <div
              className="pointer-events-none absolute w-2 h-2 rounded-full bg-[#1a56b0] scale-0 peer-checked:scale-100 transition-transform duration-150"
              aria-hidden="true"
            />
          </div>

          {label && (
            <label
              htmlFor={radioId}
              className={cn(
                'text-[14px] text-[#1a1a1a] leading-[1.4] cursor-pointer select-none',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {label}
            </label>
          )}
        </div>

        {hint && !error && (
          <p id={hintId} className="ml-6 text-[12px] text-[#6b6b6b] leading-[1.4]">{hint}</p>
        )}
        {error && (
          <p id={errorId} className="ml-6 text-[12px] text-[#e53e3e] leading-[1.4]" role="alert">{error}</p>
        )}
      </div>
    )
  }
)
Radio.displayName = 'Radio'

// ─── RadioGroup ────────────────────────────────────────────────────────────────

export interface RadioGroupProps extends React.HTMLAttributes<HTMLFieldSetElement> {
  /** Legend / group label */
  legend: string
  /** Hide the legend visually while keeping it accessible */
  hideLegend?: boolean
  /** Error message for the whole group */
  error?: string
}

export const RadioGroup = React.forwardRef<HTMLFieldSetElement, RadioGroupProps>(
  ({ legend, hideLegend, error, className, children, ...props }, ref) => {
    const errorId = React.useId()
    return (
      <fieldset
        ref={ref}
        aria-describedby={error ? errorId : undefined}
        className={cn('flex flex-col gap-2 border-0 p-0 m-0', className)}
        {...props}
      >
        <legend className={cn('text-[13px] font-semibold text-[#1a1a1a] mb-1', hideLegend && 'sr-only')}>
          {legend}
        </legend>
        {children}
        {error && (
          <p id={errorId} className="text-[12px] text-[#e53e3e] leading-[1.4]" role="alert">{error}</p>
        )}
      </fieldset>
    )
  }
)
RadioGroup.displayName = 'RadioGroup'
