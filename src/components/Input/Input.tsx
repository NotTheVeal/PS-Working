import * as React from 'react'
import { cn } from '@/lib/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Label text — rendered above the input */
  label?: string
  /** Helper text — rendered below the input */
  hint?: string
  /** Error message — replaces hint, applies error styles */
  error?: string
  /** Leading icon or element inside the input */
  leadingIcon?: React.ReactNode
  /** Trailing icon or element inside the input */
  trailingIcon?: React.ReactNode
  /** Visually hide the label (still present for screen readers) */
  hideLabel?: boolean
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      hint,
      error,
      leadingIcon,
      trailingIcon,
      hideLabel,
      id,
      className,
      disabled,
      required,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const inputId    = id ?? React.useId()
    const hintId     = `${inputId}-hint`
    const errorId    = `${inputId}-error`
    const describedBy = [
      ariaDescribedBy,
      error   ? errorId : null,
      !error && hint ? hintId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
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

        <div className="relative flex items-center">
          {leadingIcon && (
            <span
              className="absolute left-3 flex items-center text-[#6b6b6b] pointer-events-none"
              aria-hidden="true"
            >
              {leadingIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            required={required}
            aria-required={required || undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              'w-full rounded-lg border bg-white text-[14px] text-[#1a1a1a] leading-[1.6]',
              'placeholder:text-[#aaaaaa]',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-0 focus-visible:border-[#1a56b0]',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#f5f5f5]',
              // size — standard height
              'h-9 px-3 py-0',
              // border
              error
                ? 'border-[#e53e3e] focus-visible:ring-[#e53e3e]'
                : 'border-[#e0ddd6] hover:border-[#d0cdc5]',
              // leading/trailing padding
              leadingIcon  && 'pl-9',
              trailingIcon && 'pr-9',
              className
            )}
            {...props}
          />

          {trailingIcon && (
            <span
              className="absolute right-3 flex items-center text-[#6b6b6b] pointer-events-none"
              aria-hidden="true"
            >
              {trailingIcon}
            </span>
          )}
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
Input.displayName = 'Input'
