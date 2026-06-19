import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const searchInputVariants = cva(
  [
    'flex items-center w-full rounded-full border bg-white transition-colors duration-150',
    'border-[#e0ddd6] hover:border-[#d0cdc5]',
    'focus-within:outline-none focus-within:ring-2 focus-within:ring-[#1a56b0] focus-within:ring-offset-1 focus-within:border-[#1a56b0]',
  ],
  {
    variants: {
      size: {
        sm: 'h-8 px-3 gap-1.5',
        md: 'h-10 px-4 gap-2',
        lg: 'h-12 px-5 gap-2.5',
      },
    },
    defaultVariants: { size: 'md' },
  }
)

const inputSizeVariants = cva('flex-1 bg-transparent outline-none text-[#1a1a1a] placeholder:text-[#aaaaaa]', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: { size: 'md' },
})

const iconSizeVariants = cva('flex-shrink-0 text-[#6b6b6b]', {
  variants: {
    size: {
      sm: 'w-3.5 h-3.5',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    },
  },
  defaultVariants: { size: 'md' },
})

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'size'>,
    VariantProps<typeof searchInputVariants> {
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onSearch?: (value: string) => void
  onClear?: () => void
  placeholder?: string
  loading?: boolean
  label?: string
  disabled?: boolean
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value: controlledValue,
      defaultValue = '',
      onChange,
      onSearch,
      onClear,
      placeholder = 'Search…',
      loading = false,
      size = 'md',
      label,
      disabled = false,
      className,
      id,
      ...rest
    },
    ref
  ) => {
    const generatedId = React.useId()
    const inputId = id ?? generatedId

    const isControlled = controlledValue !== undefined
    const [internalValue, setInternalValue] = React.useState(defaultValue)
    const currentValue = isControlled ? controlledValue : internalValue

    // Internal ref for imperative focus after clear
    const internalRef = React.useRef<HTMLInputElement>(null)
    const resolvedRef = (ref as React.RefObject<HTMLInputElement>) ?? internalRef

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const v = e.target.value
      if (!isControlled) setInternalValue(v)
      onChange?.(v)
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      if (e.key === 'Enter') {
        onSearch?.(currentValue)
      }
    }

    function handleClear() {
      if (!isControlled) setInternalValue('')
      onChange?.('')
      onClear?.()
      resolvedRef.current?.focus()
    }

    const showClear = !loading && currentValue.length > 0 && !disabled

    return (
      <div
        className={cn(
          searchInputVariants({ size }),
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {/* Search icon */}
        <SearchIcon className={iconSizeVariants({ size })} />

        {/* Input */}
        <input
          ref={resolvedRef}
          id={inputId}
          type="search"
          role="searchbox"
          aria-label={label ?? 'Search'}
          placeholder={placeholder}
          value={currentValue}
          disabled={disabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={cn(
            inputSizeVariants({ size }),
            disabled && 'cursor-not-allowed',
            // Remove the native clear button on search inputs
            '[&::-webkit-search-cancel-button]:appearance-none'
          )}
          {...rest}
        />

        {/* Right slot: spinner or clear */}
        {loading && (
          <Spinner
            className={cn(iconSizeVariants({ size }), 'animate-spin text-[#1a56b0]')}
            aria-label="Loading"
          />
        )}

        {showClear && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={handleClear}
            tabIndex={0}
            className={cn(
              'flex-shrink-0 flex items-center justify-center rounded-full',
              'text-[#6b6b6b] hover:text-[#1a1a1a] hover:bg-[#e0ddd6] transition-colors duration-100',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
              size === 'sm' && 'w-4 h-4 text-xs',
              size === 'md' && 'w-5 h-5 text-sm',
              size === 'lg' && 'w-6 h-6 text-base'
            )}
          >
            ×
          </button>
        )}
      </div>
    )
  }
)
SearchInput.displayName = 'SearchInput'

// ---------------------------------------------------------------------------
// Internal icon components
// ---------------------------------------------------------------------------

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="8.5" cy="8.5" r="5.25" />
      <line x1="12.5" y1="12.5" x2="17" y2="17" />
    </svg>
  )
}

function Spinner({ className, 'aria-label': ariaLabel }: { className?: string; 'aria-label'?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      className={className}
      role="status"
      aria-label={ariaLabel}
    >
      <path d="M12 2a10 10 0 0 1 10 10" opacity="0.9" />
      <path d="M12 2a10 10 0 0 0-10 10" opacity="0.2" />
    </svg>
  )
}
