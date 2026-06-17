import * as React from 'react'
import { cn } from '@/lib/cn'

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ComboboxProps {
  options: ComboboxOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  id?: string
}

export const Combobox = React.forwardRef<HTMLInputElement, ComboboxProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = 'Search…',
      label,
      hint,
      error,
      disabled,
      id,
    },
    ref
  ) => {
    const inputId = id ?? React.useId()
    const listboxId = `${inputId}-listbox`
    const hintId = `${inputId}-hint`
    const errorId = `${inputId}-error`

    const [inputValue, setInputValue] = React.useState<string>(() => {
      if (value == null) return ''
      return options.find((o) => o.value === value)?.label ?? ''
    })
    const [open, setOpen] = React.useState(false)
    const [activeIndex, setActiveIndex] = React.useState<number>(-1)

    const containerRef = React.useRef<HTMLDivElement>(null)

    const filtered = React.useMemo(() => {
      const q = inputValue.trim().toLowerCase()
      if (!q) return options
      return options.filter((o) => o.label.toLowerCase().includes(q))
    }, [inputValue, options])

    // Sync external value prop into inputValue
    React.useEffect(() => {
      if (value == null) return
      const label = options.find((o) => o.value === value)?.label ?? ''
      setInputValue(label)
    }, [value, options])

    // Close on outside click
    React.useEffect(() => {
      if (!open) return
      const handler = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setOpen(false)
        }
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [open])

    const selectOption = (option: ComboboxOption) => {
      if (option.disabled) return
      setInputValue(option.label)
      onChange?.(option.value)
      setOpen(false)
      setActiveIndex(-1)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value)
      setOpen(true)
      setActiveIndex(-1)
    }

    const handleInputFocus = () => {
      setOpen(true)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const enabledIndices = filtered
        .map((_, i) => i)
        .filter((i) => !filtered[i].disabled)

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setOpen(true)
        if (enabledIndices.length === 0) return
        const currentPos = enabledIndices.indexOf(activeIndex)
        const next = enabledIndices[(currentPos + 1) % enabledIndices.length]
        setActiveIndex(next)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setOpen(true)
        if (enabledIndices.length === 0) return
        const currentPos = enabledIndices.indexOf(activeIndex)
        const prev =
          enabledIndices[
            (currentPos - 1 + enabledIndices.length) % enabledIndices.length
          ]
        setActiveIndex(prev)
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (activeIndex >= 0 && filtered[activeIndex]) {
          selectOption(filtered[activeIndex])
        }
      } else if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
        setActiveIndex(-1)
        setInputValue('')
        onChange?.('')
      }
    }

    const activeOptionId =
      activeIndex >= 0 && filtered[activeIndex]
        ? `${listboxId}-option-${activeIndex}`
        : undefined

    const describedBy = [
      error ? errorId : null,
      !error && hint ? hintId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined

    return (
      <div ref={containerRef} className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[13px] font-semibold text-[#1a1a1a] leading-none"
          >
            {label}
          </label>
        )}

        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={listboxId}
            aria-activedescendant={activeOptionId}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            autoComplete="off"
            disabled={disabled}
            value={inputValue}
            placeholder={placeholder}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            className={cn(
              'w-full rounded-lg border bg-white text-[14px] text-[#1a1a1a] leading-[1.6]',
              'h-9 px-3 py-0 pr-9',
              'placeholder:text-[#aaaaaa]',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
              'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#f5f5f5]',
              error
                ? 'border-[#e53e3e] focus-visible:ring-[#e53e3e]'
                : 'border-[#e0ddd6] hover:border-[#d0cdc5]'
            )}
          />
          {/* Chevron icon */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6b6b]"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </span>

          {/* Listbox */}
          {open && (
            <ul
              id={listboxId}
              role="listbox"
              className={cn(
                'absolute z-50 mt-1 w-full rounded-lg border border-[#e0ddd6]',
                'bg-white shadow-lg py-1 max-h-60 overflow-auto'
              )}
            >
              {filtered.length === 0 ? (
                <li
                  className="px-3 py-2 text-sm text-[#6b6b6b]"
                  aria-live="polite"
                >
                  No results
                </li>
              ) : (
                filtered.map((option, index) => {
                  const isActive = index === activeIndex
                  const isSelected =
                    option.label === inputValue && value === option.value
                  return (
                    <li
                      key={option.value}
                      id={`${listboxId}-option-${index}`}
                      role="option"
                      aria-selected={isSelected}
                      aria-disabled={option.disabled}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        selectOption(option)
                      }}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={cn(
                        'flex items-center justify-between px-3 py-2 text-sm cursor-pointer',
                        option.disabled
                          ? 'opacity-50 cursor-not-allowed text-[#1a1a1a]'
                          : 'text-[#1a1a1a]',
                        isActive && !option.disabled && 'bg-[#f0ede8]',
                        isSelected && 'font-medium'
                      )}
                    >
                      {option.label}
                      {isSelected && (
                        <svg
                          className="h-4 w-4 text-[#1a56b0]"
                          aria-hidden="true"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </li>
                  )
                })
              )}
            </ul>
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

Combobox.displayName = 'Combobox'
