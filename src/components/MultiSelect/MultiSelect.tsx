import * as React from 'react'
import { cn } from '@/lib/cn'

export interface MultiSelectOption {
  value: string
  label: string
  disabled?: boolean
}

export interface MultiSelectProps {
  options: MultiSelectOption[]
  value?: string[]
  defaultValue?: string[]
  onChange?: (value: string[]) => void
  placeholder?: string
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  maxItems?: number
  id?: string
  className?: string
}

export const MultiSelect = React.forwardRef<HTMLDivElement, MultiSelectProps>(
  (
    {
      options,
      value: controlledValue,
      defaultValue = [],
      onChange,
      placeholder = 'Select options…',
      label,
      hint,
      error,
      disabled = false,
      maxItems,
      id,
      className,
    },
    ref
  ) => {
    const generatedId = React.useId()
    const componentId = id ?? generatedId
    const listboxId = `${componentId}-listbox`
    const hintId = `${componentId}-hint`
    const errorId = `${componentId}-error`
    const labelId = `${componentId}-label`

    const isControlled = controlledValue !== undefined
    const [internalValue, setInternalValue] = React.useState<string[]>(defaultValue)
    const selected = isControlled ? controlledValue : internalValue

    const [query, setQuery] = React.useState('')
    const [open, setOpen] = React.useState(false)
    const [activeIndex, setActiveIndex] = React.useState<number>(-1)

    const inputRef = React.useRef<HTMLInputElement>(null)
    const containerRef = React.useRef<HTMLDivElement>(null)

    const atMax = maxItems !== undefined && selected.length >= maxItems

    const filteredOptions = options.filter((opt) =>
      opt.label.toLowerCase().includes(query.toLowerCase())
    )

    function updateSelected(next: string[]) {
      if (!isControlled) setInternalValue(next)
      onChange?.(next)
    }

    function toggleOption(optValue: string) {
      if (disabled) return
      const opt = options.find((o) => o.value === optValue)
      if (opt?.disabled) return

      if (selected.includes(optValue)) {
        updateSelected(selected.filter((v) => v !== optValue))
      } else {
        if (atMax) return
        updateSelected([...selected, optValue])
      }
    }

    function removeTag(optValue: string) {
      updateSelected(selected.filter((v) => v !== optValue))
      inputRef.current?.focus()
    }

    function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setOpen(true)
        setActiveIndex((i) => Math.min(i + 1, filteredOptions.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (open && activeIndex >= 0 && filteredOptions[activeIndex]) {
          toggleOption(filteredOptions[activeIndex].value)
        }
      } else if (e.key === 'Escape') {
        setOpen(false)
        setActiveIndex(-1)
      } else if (e.key === 'Backspace' && query === '' && selected.length > 0) {
        removeTag(selected[selected.length - 1])
      } else {
        setOpen(true)
      }
    }

    // Close dropdown when clicking outside
    React.useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false)
          setActiveIndex(-1)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const descId = error ? errorId : hint ? hintId : undefined
    const activeOptionId =
      open && activeIndex >= 0 && filteredOptions[activeIndex]
        ? `${listboxId}-opt-${filteredOptions[activeIndex].value}`
        : undefined

    return (
      <div ref={ref} className={cn('flex flex-col gap-1.5 w-full', className)}>
        {label && (
          <label
            id={labelId}
            htmlFor={`${componentId}-input`}
            className="text-[13px] font-semibold text-[#1a1a1a] leading-none"
          >
            {label}
          </label>
        )}

        <div ref={containerRef} className="relative">
          {/* Input container */}
          <div
            className={cn(
              'flex flex-wrap gap-1 min-h-[2.25rem] items-center',
              'border rounded-lg px-2 py-1.5 bg-white transition-colors duration-150',
              'cursor-text',
              error
                ? 'border-[#e53e3e] focus-within:ring-2 focus-within:ring-[#e53e3e] focus-within:ring-offset-0'
                : 'border-[#e0ddd6] focus-within:ring-2 focus-within:ring-[#1a56b0] focus-within:ring-offset-0 focus-within:border-[#1a56b0]',
              disabled && 'opacity-50 cursor-not-allowed bg-[#f5f5f5]'
            )}
            onClick={() => {
              if (!disabled) inputRef.current?.focus()
            }}
          >
            {/* Selected tags */}
            {selected.map((v) => {
              const opt = options.find((o) => o.value === v)
              if (!opt) return null
              return (
                <span
                  key={v}
                  className="inline-flex items-center gap-1 bg-[#f0ede8] text-[#1a1a1a] text-sm px-2 py-0.5 rounded-md max-w-[180px]"
                >
                  <span className="truncate">{opt.label}</span>
                  {!disabled && (
                    <button
                      type="button"
                      aria-label={`Remove ${opt.label}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        removeTag(v)
                      }}
                      className={cn(
                        'flex-shrink-0 ml-0.5 text-[#6b6b6b] hover:text-[#1a1a1a]',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1 rounded-sm'
                      )}
                      tabIndex={0}
                    >
                      ×
                    </button>
                  )}
                </span>
              )
            })}

            {/* Text input */}
            <input
              ref={inputRef}
              id={`${componentId}-input`}
              type="text"
              role="combobox"
              aria-expanded={open}
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-activedescendant={activeOptionId}
              aria-invalid={error ? true : undefined}
              aria-describedby={descId}
              aria-labelledby={label ? labelId : undefined}
              aria-label={!label ? 'Select options' : undefined}
              autoComplete="off"
              disabled={disabled}
              value={query}
              placeholder={selected.length === 0 ? placeholder : ''}
              onChange={(e) => {
                setQuery(e.target.value)
                setOpen(true)
                setActiveIndex(-1)
              }}
              onKeyDown={handleInputKeyDown}
              onFocus={() => setOpen(true)}
              className={cn(
                'flex-1 min-w-[8rem] text-[14px] text-[#1a1a1a] bg-transparent outline-none',
                'placeholder:text-[#aaaaaa]',
                disabled && 'cursor-not-allowed'
              )}
            />
          </div>

          {/* maxItems reached hint */}
          {atMax && !error && (
            <p className="text-[12px] text-[#6b6b6b] mt-1">
              Maximum of {maxItems} item{maxItems !== 1 ? 's' : ''} selected.
            </p>
          )}

          {/* Dropdown listbox */}
          {open && filteredOptions.length > 0 && (
            <ul
              id={listboxId}
              role="listbox"
              aria-multiselectable="true"
              aria-label={label ?? 'Options'}
              className={cn(
                'absolute z-50 mt-1 w-full max-h-60 overflow-y-auto',
                'bg-white border border-[#e0ddd6] rounded-lg shadow-md',
                'py-1'
              )}
            >
              {filteredOptions.map((opt, idx) => {
                const isSelected = selected.includes(opt.value)
                const isActive = idx === activeIndex
                const isDisabledOpt = opt.disabled || (atMax && !isSelected)

                return (
                  <li
                    key={opt.value}
                    id={`${listboxId}-opt-${opt.value}`}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={isDisabledOpt || undefined}
                    onMouseDown={(e) => {
                      // Prevent input blur before toggle
                      e.preventDefault()
                      if (!isDisabledOpt) toggleOption(opt.value)
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 text-[14px] cursor-pointer select-none',
                      isActive && 'bg-[#f0ede8]',
                      isSelected && 'text-[#1a56b0] font-medium',
                      !isSelected && !isActive && 'text-[#1a1a1a]',
                      isDisabledOpt && 'opacity-40 cursor-not-allowed'
                    )}
                  >
                    <span className="w-4 flex-shrink-0 text-[#1a56b0]" aria-hidden="true">
                      {isSelected ? '✓' : ''}
                    </span>
                    {opt.label}
                  </li>
                )
              })}
            </ul>
          )}

          {open && filteredOptions.length === 0 && (
            <div
              className={cn(
                'absolute z-50 mt-1 w-full bg-white border border-[#e0ddd6] rounded-lg shadow-md',
                'px-3 py-2 text-[14px] text-[#6b6b6b]'
              )}
            >
              No options found.
            </div>
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
MultiSelect.displayName = 'MultiSelect'
