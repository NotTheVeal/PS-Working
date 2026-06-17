import * as React from 'react'
import { cn } from '@/lib/cn'

const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Label text — rendered above the select */
  label?: string
  /** Helper text — rendered below */
  hint?: string
  /** Error message — replaces hint, applies error styles */
  error?: string
  /** Array of options (alternative to rendering <option> children manually) */
  options?: SelectOption[]
  /** Placeholder option shown when no value is selected */
  placeholder?: string
  /** Visually hide the label (still present for screen readers) */
  hideLabel?: boolean
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      hint,
      error,
      options,
      placeholder,
      hideLabel,
      id,
      disabled,
      required,
      className,
      children,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const selectId = id ?? React.useId()
    const hintId   = `${selectId}-hint`
    const errorId  = `${selectId}-error`
    const describedBy = [
      ariaDescribedBy,
      error        ? errorId : null,
      !error && hint ? hintId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={selectId}
            className={cn(
              'text-[13px] font-semibold text-[#1a1a1a] leading-none',
              hideLabel && 'sr-only'
            )}
          >
            {label}
            {required && (
              <span className="ml-0.5 text-[#e53e3e]" aria-hidden="true">*</span>
            )}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            aria-required={required || undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              'w-full appearance-none rounded-lg border bg-white pr-8',
              'text-[14px] text-[#1a1a1a] leading-[1.6]',
              'h-9 px-3 py-0',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-0 focus-visible:border-[#1a56b0]',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#f5f5f5]',
              error
                ? 'border-[#e53e3e] focus-visible:ring-[#e53e3e]'
                : 'border-[#e0ddd6] hover:border-[#d0cdc5]',
              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b6b]">
            <ChevronIcon />
          </span>
        </div>

        {error && (
          <p id={errorId} className="text-[12px] text-[#e53e3e] leading-[1.4]" role="alert">
            {error}
          </p>
        )}
        {!error && hint && (
          <p id={hintId} className="text-[12px] text-[#6b6b6b] leading-[1.4]">
            {hint}
          </p>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'
