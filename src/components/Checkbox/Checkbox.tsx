import * as React from 'react'
import { cn } from '@/lib/cn'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Label text rendered to the right of the checkbox */
  label?: string
  /** Helper text rendered below the label */
  hint?: string
  /** Error message */
  error?: string
  /** Indeterminate state — visually a dash, aria-checked="mixed" */
  indeterminate?: boolean
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, hint, error, indeterminate, id, disabled, required, className, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const combinedRef = (node: HTMLInputElement | null) => {
      ;(inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
    }

    const checkboxId = id ?? React.useId()
    const hintId     = `${checkboxId}-hint`
    const errorId    = `${checkboxId}-error`
    const describedBy = [error ? errorId : null, !error && hint ? hintId : null]
      .filter(Boolean).join(' ') || undefined

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = !!indeterminate
      }
    }, [indeterminate])

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-start gap-2.5">
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              ref={combinedRef}
              type="checkbox"
              id={checkboxId}
              disabled={disabled}
              required={required}
              aria-required={required || undefined}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy}
              aria-checked={indeterminate ? 'mixed' : undefined}
              className={cn(
                'peer appearance-none w-4 h-4 rounded border border-[#d0cdc5] bg-white shrink-0',
                'transition-colors duration-150 cursor-pointer',
                'checked:bg-[#1a56b0] checked:border-[#1a56b0]',
                'indeterminate:bg-[#1a56b0] indeterminate:border-[#1a56b0]',
                'hover:border-[#1a56b0]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                error && 'border-[#e53e3e]',
                className
              )}
              {...props}
            />
            {/* checkmark */}
            <svg
              className="pointer-events-none absolute opacity-0 peer-checked:opacity-100 peer-indeterminate:opacity-0 text-white"
              width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"
            >
              <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {/* dash for indeterminate */}
            <svg
              className="pointer-events-none absolute opacity-0 peer-indeterminate:opacity-100 text-white"
              width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"
            >
              <path d="M2 5h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                'text-[14px] text-[#1a1a1a] leading-[1.4] cursor-pointer select-none',
                disabled && 'opacity-50 cursor-not-allowed',
                required && "after:content-['*'] after:ml-0.5 after:text-[#e53e3e]"
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
Checkbox.displayName = 'Checkbox'
