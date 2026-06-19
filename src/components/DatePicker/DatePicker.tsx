import * as React from 'react'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function clamp(date: Date, min?: Date, max?: Date): Date {
  if (min && date < min) return min
  if (max && date > max) return max
  return date
}

const WEEK_DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] as const
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
] as const

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DatePickerProps {
  value?: Date
  defaultValue?: Date
  onChange?: (date: Date) => void
  min?: Date
  max?: Date
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  placeholder?: string
  id?: string
}

// ---------------------------------------------------------------------------
// CalendarPopup (internal)
// ---------------------------------------------------------------------------

interface CalendarPopupProps {
  selectedDate: Date | undefined
  viewMonth: Date
  today: Date
  min?: Date
  max?: Date
  onSelectDay: (date: Date) => void
  onPrevMonth: () => void
  onNextMonth: () => void
  onClose: () => void
  anchorRef: React.RefObject<HTMLDivElement | null>
}

function CalendarPopup({
  selectedDate,
  viewMonth,
  today,
  min,
  max,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
  onClose,
  anchorRef,
}: CalendarPopupProps) {
  const popupRef = React.useRef<HTMLDivElement>(null)
  const prevBtnRef = React.useRef<HTMLButtonElement>(null)

  // Focus first focusable element on mount
  React.useEffect(() => {
    prevBtnRef.current?.focus()
  }, [])

  // Close on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [onClose, anchorRef])

  const year = viewMonth.getFullYear()
  const month = viewMonth.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfWeek = startOfMonth(viewMonth).getDay()

  // Build calendar grid: leading empty cells + days of month
  const cells: Array<Date | null> = []
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))

  function isDayDisabled(date: Date): boolean {
    if (min && date < new Date(min.getFullYear(), min.getMonth(), min.getDate())) return true
    if (max && date > new Date(max.getFullYear(), max.getMonth(), max.getDate())) return true
    return false
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Escape') {
      e.preventDefault()
      onClose()
    }
  }

  return (
    <div
      ref={popupRef}
      role="dialog"
      aria-modal="true"
      aria-label="Date picker calendar"
      onKeyDown={handleKeyDown}
      className="absolute z-50 mt-1 bg-white border border-[#e0ddd6] rounded-xl shadow-lg p-3 w-72"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          ref={prevBtnRef}
          type="button"
          aria-label="Previous month"
          onClick={onPrevMonth}
          className={cn(
            'p-1 rounded-lg text-[#1a1a1a] hover:bg-[#f0ede8] transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
          )}
        >
          &#8249;
        </button>
        <span className="text-sm font-semibold text-[#1a1a1a]" aria-live="polite">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          type="button"
          aria-label="Next month"
          onClick={onNextMonth}
          className={cn(
            'p-1 rounded-lg text-[#1a1a1a] hover:bg-[#f0ede8] transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
          )}
        >
          &#8250;
        </button>
      </div>

      {/* Day-of-week headers */}
      <div
        role="grid"
        aria-label={`${MONTH_NAMES[month]} ${year}`}
        className="grid grid-cols-7 gap-0"
      >
        <div role="row" className="contents">
          {WEEK_DAYS.map((day) => (
            <div
              key={day}
              role="columnheader"
              aria-label={day}
              className="text-center text-xs font-medium text-[#1a1a1a] opacity-60 py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div role="row" className="contents">
          {cells.map((date, idx) => {
            if (!date) {
              return <div key={`empty-${idx}`} role="gridcell" aria-hidden="true" />
            }
            const isToday = isSameDay(date, today)
            const isSelected = selectedDate ? isSameDay(date, selectedDate) : false
            const isOutsideMonth = !isSameMonth(date, viewMonth)
            const disabled = isDayDisabled(date)

            return (
              <div key={date.toISOString()} role="gridcell">
                <button
                  type="button"
                  aria-label={date.toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                  aria-current={isToday ? 'date' : undefined}
                  aria-pressed={isSelected}
                  disabled={disabled}
                  onClick={() => !disabled && onSelectDay(date)}
                  className={cn(
                    'w-8 h-8 mx-auto flex items-center justify-center text-sm rounded-full transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
                    isSelected && 'bg-[#1a56b0] text-white',
                    !isSelected && isToday && 'font-bold underline text-[#1a1a1a]',
                    !isSelected && !isToday && 'text-[#1a1a1a]',
                    isOutsideMonth && 'opacity-40',
                    disabled && 'opacity-40 pointer-events-none',
                    !isSelected && !disabled && 'hover:bg-[#f0ede8]',
                  )}
                >
                  {date.getDate()}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Close button */}
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className={cn(
            'text-xs px-3 py-1 rounded-lg text-[#1a1a1a] hover:bg-[#f0ede8] transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
          )}
        >
          Close
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// DatePicker
// ---------------------------------------------------------------------------

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  function DatePicker(
    {
      value,
      defaultValue,
      onChange,
      min,
      max,
      label,
      hint,
      error,
      disabled = false,
      placeholder = 'Pick a date',
      id,
    },
    ref,
  ) {
    const generatedId = React.useId()
    const inputId = id ?? generatedId
    const hintId = `${inputId}-hint`
    const errorId = `${inputId}-error`

    const [internalDate, setInternalDate] = React.useState<Date | undefined>(defaultValue)
    const [isOpen, setIsOpen] = React.useState(false)
    const [viewMonth, setViewMonth] = React.useState<Date>(
      value ?? defaultValue ?? new Date(),
    )

    const today = React.useMemo(() => {
      const d = new Date()
      return new Date(d.getFullYear(), d.getMonth(), d.getDate())
    }, [])

    const selectedDate = value ?? internalDate
    const displayValue = selectedDate ? formatDate(selectedDate) : ''

    const anchorRef = React.useRef<HTMLDivElement>(null)

    function handleOpen() {
      if (disabled) return
      if (selectedDate) setViewMonth(selectedDate)
      setIsOpen(true)
    }

    function handleClose() {
      setIsOpen(false)
    }

    function handleSelectDay(date: Date) {
      const clamped = clamp(date, min, max)
      setInternalDate(clamped)
      onChange?.(clamped)
      setIsOpen(false)
    }

    function handlePrevMonth() {
      setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
    }

    function handleNextMonth() {
      setViewMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
    }

    function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleOpen()
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    const describedBy = [hint ? hintId : '', error ? errorId : '']
      .filter(Boolean)
      .join(' ') || undefined

    return (
      <div className="flex flex-col gap-1 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#1a1a1a]"
          >
            {label}
          </label>
        )}

        <div ref={anchorRef} className="relative">
          {/* Text display input */}
          <input
            id={inputId}
            ref={ref}
            type="text"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            aria-invalid={error ? 'true' : undefined}
            aria-describedby={describedBy}
            readOnly
            disabled={disabled}
            placeholder={placeholder}
            value={displayValue}
            onKeyDown={handleInputKeyDown}
            onClick={handleOpen}
            className={cn(
              'w-full pr-10 pl-3 py-2 text-sm rounded-lg border bg-white text-[#1a1a1a] placeholder:text-[#1a1a1a]/40',
              'transition-colors cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
              error
                ? 'border-red-500'
                : 'border-[#e0ddd6] hover:border-[#1a56b0]',
              disabled && 'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          />

          {/* Calendar icon button */}
          <button
            type="button"
            aria-label="Open date picker"
            aria-expanded={isOpen}
            aria-haspopup="dialog"
            disabled={disabled}
            onClick={handleOpen}
            tabIndex={-1}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-[#1a1a1a]/60',
              'hover:text-[#1a56b0] transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
              disabled && 'disabled:opacity-50 disabled:cursor-not-allowed',
            )}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </button>

          {/* Calendar popup */}
          {isOpen && (
            <CalendarPopup
              selectedDate={selectedDate}
              viewMonth={viewMonth}
              today={today}
              min={min}
              max={max}
              onSelectDay={handleSelectDay}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              onClose={handleClose}
              anchorRef={anchorRef}
            />
          )}
        </div>

        {hint && !error && (
          <p id={hintId} className="text-xs text-[#1a1a1a]/60">
            {hint}
          </p>
        )}
        {error && (
          <p id={errorId} role="alert" className="text-xs text-red-600">
            {error}
          </p>
        )}
      </div>
    )
  },
)

DatePicker.displayName = 'DatePicker'
