import * as React from 'react'
import { cn } from '@/lib/cn'

export interface NumberInputProps {
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  id?: string
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      defaultValue = 0,
      onChange,
      min,
      max,
      step = 1,
      label,
      hint,
      error,
      disabled = false,
      id: idProp,
    },
    ref
  ) => {
    const isControlled = value !== undefined
    const [internalValue, setInternalValue] = React.useState<number>(defaultValue)
    const currentValue = isControlled ? value : internalValue

    const generatedId = React.useId()
    const id = idProp ?? generatedId
    const hintId = `${id}-hint`
    const errorId = `${id}-error`
    const hasError = Boolean(error)
    const describedBy = [hint && hintId, hasError && errorId].filter(Boolean).join(' ') || undefined

    const clamp = React.useCallback(
      (n: number): number => {
        let result = n
        if (min !== undefined) result = Math.max(min, result)
        if (max !== undefined) result = Math.min(max, result)
        return result
      },
      [min, max]
    )

    const commit = React.useCallback(
      (next: number) => {
        const clamped = clamp(next)
        if (!isControlled) setInternalValue(clamped)
        onChange?.(clamped)
      },
      [clamp, isControlled, onChange]
    )

    const handleDecrement = () => commit(currentValue - step)
    const handleIncrement = () => commit(currentValue + step)

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseFloat(e.target.value)
      if (!isNaN(parsed)) commit(parsed)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        commit(currentValue + step)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        commit(currentValue - step)
      }
    }

    const atMin = min !== undefined && currentValue <= min
    const atMax = max !== undefined && currentValue >= max

    const btnBase = cn(
      'flex h-9 w-9 items-center justify-center rounded border border-[#e0ddd6] bg-white',
      'text-lg font-medium text-[#1a1a1a] transition-colors',
      'hover:bg-[#f0ede8] active:bg-[#e8e4de]',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
      'disabled:opacity-50 disabled:cursor-not-allowed'
    )

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-[#1a1a1a]"
          >
            {label}
          </label>
        )}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Decrement"
            onClick={handleDecrement}
            disabled={disabled || atMin}
            className={btnBase}
          >
            −
          </button>
          <input
            ref={ref}
            id={id}
            type="number"
            role="spinbutton"
            value={currentValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={currentValue}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            className={cn(
              'h-9 w-20 rounded border border-[#e0ddd6] bg-white px-3 text-center text-sm text-[#1a1a1a]',
              'transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              hasError && 'border-red-600 focus-visible:ring-red-600',
              '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
            )}
          />
          <button
            type="button"
            aria-label="Increment"
            onClick={handleIncrement}
            disabled={disabled || atMax}
            className={btnBase}
          >
            +
          </button>
        </div>
        {hint && !hasError && (
          <p id={hintId} className="text-xs text-[#1a1a1a]/60">
            {hint}
          </p>
        )}
        {hasError && (
          <p id={errorId} role="alert" className="text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    )
  }
)
NumberInput.displayName = 'NumberInput'
