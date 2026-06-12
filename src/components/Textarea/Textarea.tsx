import * as React from 'react'
import { cn } from '@/lib/cn'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  hint?: string
  error?: string
  /** Show character count — requires maxLength to be set */
  showCount?: boolean
  hideLabel?: boolean
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      hint,
      error,
      showCount,
      hideLabel,
      id,
      disabled,
      required,
      maxLength,
      value,
      defaultValue,
      className,
      onChange,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    const textareaId  = id ?? React.useId()
    const hintId      = `${textareaId}-hint`
    const errorId     = `${textareaId}-error`
    const countId     = `${textareaId}-count`
    const [count, setCount] = React.useState(
      () => String(value ?? defaultValue ?? '').length
    )

    const describedBy = [
      ariaDescribedBy,
      error              ? errorId  : null,
      !error && hint     ? hintId   : null,
      showCount && maxLength ? countId : null,
    ]
      .filter(Boolean).join(' ') || undefined

    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
      setCount(e.target.value.length)
      onChange?.(e)
    }

    const isNearLimit = maxLength && count >= maxLength * 0.9
    const isAtLimit   = maxLength && count >= maxLength

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className={cn(
              'text-[13px] font-semibold text-[#1a1a1a] leading-none',
              hideLabel && 'sr-only'
            )}
          >
            {label}
            {required && <span className="ml-0.5 text-[#e53e3e]" aria-hidden="true">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          disabled={disabled}
          required={required}
          maxLength={maxLength}
          value={value}
          defaultValue={defaultValue}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          onChange={handleChange}
          className={cn(
            'w-full rounded-lg border bg-white px-3 py-2',
            'text-[14px] text-[#1a1a1a] leading-[1.6] placeholder:text-[#aaaaaa]',
            'resize-y min-h-[80px]',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-0 focus-visible:border-[#1a56b0]',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#f5f5f5]',
            error
              ? 'border-[#e53e3e] focus-visible:ring-[#e53e3e]'
              : 'border-[#e0ddd6] hover:border-[#d0cdc5]',
            className
          )}
          {...props}
        />

        <div className="flex items-start justify-between gap-2">
          <div>
            {error && (
              <p id={errorId} className="text-[12px] text-[#e53e3e] leading-[1.4]" role="alert">{error}</p>
            )}
            {!error && hint && (
              <p id={hintId} className="text-[12px] text-[#6b6b6b] leading-[1.4]">{hint}</p>
            )}
          </div>
          {showCount && maxLength && (
            <p
              id={countId}
              aria-live="polite"
              className={cn(
                'text-[12px] leading-[1.4] shrink-0 tabular-nums',
                isAtLimit   ? 'text-[#e53e3e]' :
                isNearLimit ? 'text-[#c4663f]' :
                              'text-[#6b6b6b]'
              )}
            >
              {count}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
