import * as React from 'react'
import { cn } from '@/lib/cn'

export interface RangeSliderProps {
  min?: number
  max?: number
  step?: number
  value?: [number, number]
  defaultValue?: [number, number]
  onChange?: (value: [number, number]) => void
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  showValues?: boolean
  id?: string
  className?: string
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), hi)
}

function toPercent(v: number, min: number, max: number) {
  return ((v - min) / (max - min)) * 100
}

export const RangeSlider = React.forwardRef<HTMLDivElement, RangeSliderProps>(
  (
    {
      min = 0,
      max = 100,
      step = 1,
      value: controlledValue,
      defaultValue = [0, 100],
      onChange,
      label,
      hint,
      error,
      disabled = false,
      showValues = false,
      id,
      className,
    },
    ref
  ) => {
    const generatedId = React.useId()
    const sliderId = id ?? generatedId
    const hintId = `${sliderId}-hint`
    const errorId = `${sliderId}-error`
    const labelId = `${sliderId}-label`

    const isControlled = controlledValue !== undefined
    const [internalValue, setInternalValue] = React.useState<[number, number]>(defaultValue)
    const value = isControlled ? controlledValue : internalValue

    // Which thumb is on top (higher z-index) — the one most recently dragged
    const [activeThumb, setActiveThumb] = React.useState<'min' | 'max'>('max')

    const descId = error ? errorId : hint ? hintId : undefined

    function handleMinChange(e: React.ChangeEvent<HTMLInputElement>) {
      const raw = Number(e.target.value)
      const next: [number, number] = [clamp(raw, min, value[1]), value[1]]
      setActiveThumb('min')
      if (!isControlled) setInternalValue(next)
      onChange?.(next)
    }

    function handleMaxChange(e: React.ChangeEvent<HTMLInputElement>) {
      const raw = Number(e.target.value)
      const next: [number, number] = [value[0], clamp(raw, value[0], max)]
      setActiveThumb('max')
      if (!isControlled) setInternalValue(next)
      onChange?.(next)
    }

    const minPercent = toPercent(value[0], min, max)
    const maxPercent = toPercent(value[1], min, max)

    const thumbBase = cn(
      'absolute w-full h-full appearance-none bg-transparent pointer-events-none',
      '[&::-webkit-slider-thumb]:appearance-none',
      '[&::-webkit-slider-thumb]:pointer-events-auto',
      '[&::-webkit-slider-thumb]:w-4',
      '[&::-webkit-slider-thumb]:h-4',
      '[&::-webkit-slider-thumb]:rounded-full',
      '[&::-webkit-slider-thumb]:bg-white',
      '[&::-webkit-slider-thumb]:border-2',
      '[&::-webkit-slider-thumb]:border-[#1a56b0]',
      '[&::-webkit-slider-thumb]:cursor-pointer',
      '[&::-moz-range-thumb]:w-4',
      '[&::-moz-range-thumb]:h-4',
      '[&::-moz-range-thumb]:rounded-full',
      '[&::-moz-range-thumb]:bg-white',
      '[&::-moz-range-thumb]:border-2',
      '[&::-moz-range-thumb]:border-[#1a56b0]',
      '[&::-moz-range-thumb]:cursor-pointer',
      '[&::-moz-range-thumb]:pointer-events-auto',
      'focus-visible:outline-none',
      '[&:focus-visible::-webkit-slider-thumb]:ring-2',
      '[&:focus-visible::-webkit-slider-thumb]:ring-[#1a56b0]',
      '[&:focus-visible::-webkit-slider-thumb]:ring-offset-1',
      disabled && 'disabled:opacity-50 disabled:cursor-not-allowed'
    )

    return (
      <div ref={ref} className={cn('flex flex-col gap-1.5 w-full', className)}>
        {label && (
          <label
            id={labelId}
            htmlFor={`${sliderId}-min`}
            className="text-[13px] font-semibold text-[#1a1a1a] leading-none"
          >
            {label}
          </label>
        )}

        {/* Value labels above handles */}
        {showValues && (
          <div className="relative h-5 select-none">
            <span
              className="absolute -translate-x-1/2 text-[12px] text-[#1a1a1a] font-medium tabular-nums"
              style={{ left: `${minPercent}%` }}
              aria-hidden="true"
            >
              {value[0]}
            </span>
            <span
              className="absolute -translate-x-1/2 text-[12px] text-[#1a1a1a] font-medium tabular-nums"
              style={{ left: `${maxPercent}%` }}
              aria-hidden="true"
            >
              {value[1]}
            </span>
          </div>
        )}

        {/* Track + thumb area */}
        <div className="relative h-4 flex items-center">
          {/* Track background */}
          <div className="absolute w-full h-1.5 bg-[#e0ddd6] rounded-full" />

          {/* Track fill */}
          <div
            className="absolute h-1.5 bg-[#1a56b0] rounded-full"
            style={{
              left: `${minPercent}%`,
              width: `${maxPercent - minPercent}%`,
            }}
            aria-hidden="true"
          />

          {/* Min thumb */}
          <input
            type="range"
            id={`${sliderId}-min`}
            min={min}
            max={max}
            step={step}
            value={value[0]}
            disabled={disabled}
            onChange={handleMinChange}
            onMouseDown={() => setActiveThumb('min')}
            onTouchStart={() => setActiveThumb('min')}
            onFocus={() => setActiveThumb('min')}
            aria-label="Minimum value"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value[0]}
            aria-describedby={descId}
            className={cn(thumbBase, activeThumb === 'min' ? 'z-20' : 'z-10')}
            style={{ position: 'absolute', inset: 0 }}
          />

          {/* Max thumb */}
          <input
            type="range"
            id={`${sliderId}-max`}
            min={min}
            max={max}
            step={step}
            value={value[1]}
            disabled={disabled}
            onChange={handleMaxChange}
            onMouseDown={() => setActiveThumb('max')}
            onTouchStart={() => setActiveThumb('max')}
            onFocus={() => setActiveThumb('max')}
            aria-label="Maximum value"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value[1]}
            aria-describedby={descId}
            className={cn(thumbBase, activeThumb === 'max' ? 'z-20' : 'z-10')}
            style={{ position: 'absolute', inset: 0 }}
          />
        </div>

        {/* Min / max scale labels */}
        <div className="flex justify-between">
          <span className="text-[11px] text-[#6b6b6b] tabular-nums">{min}</span>
          <span className="text-[11px] text-[#6b6b6b] tabular-nums">{max}</span>
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
RangeSlider.displayName = 'RangeSlider'
