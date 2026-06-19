import * as React from 'react'
import { cn } from '@/lib/cn'

export interface TagInputProps {
  value?: string[]
  defaultValue?: string[]
  onChange?: (tags: string[]) => void
  placeholder?: string
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  maxTags?: number
  delimiter?: string[]
  validate?: (tag: string) => boolean | string
  id?: string
}

interface TagChipProps {
  tag: string
  onRemove: () => void
  disabled?: boolean
  invalid?: boolean
}

function TagChip({ tag, onRemove, disabled, invalid }: TagChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 bg-[#f0ede8] text-sm px-2 py-0.5 rounded-md text-[#1a1a1a]',
        invalid && 'ring-2 ring-red-500'
      )}
    >
      <span>{tag}</span>
      <button
        type="button"
        aria-label={`Remove ${tag}`}
        onClick={onRemove}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center w-4 h-4 rounded-full text-gray-400 hover:text-[#1a1a1a] hover:bg-[#e0ddd6] transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" className="w-3 h-3">
          <path
            d="M2 2l8 8M10 2l-8 8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </span>
  )
}

export const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      placeholder,
      label,
      hint,
      error,
      disabled = false,
      maxTags,
      delimiter = [',', 'Enter'],
      validate,
      id: idProp,
    },
    ref
  ) => {
    const generatedId = React.useId()
    const id = idProp ?? generatedId
    const hintId = `${id}-hint`
    const errorId = `${id}-error`

    // Controlled vs uncontrolled
    const isControlled = value !== undefined
    const [internalTags, setInternalTags] = React.useState<string[]>(defaultValue ?? [])
    const tags = isControlled ? value : internalTags

    const [inputValue, setInputValue] = React.useState('')
    const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({})
    const containerRef = React.useRef<HTMLDivElement>(null)
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Merge external ref with internal
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement)

    const maxReached = maxTags !== undefined && tags.length >= maxTags

    function updateTags(next: string[]) {
      if (!isControlled) setInternalTags(next)
      onChange?.(next)
    }

    function addTag(raw: string) {
      const trimmed = raw.trim()
      if (!trimmed) return
      if (tags.includes(trimmed)) return
      if (maxReached) return

      if (validate) {
        const result = validate(trimmed)
        if (result !== true) {
          const msg = typeof result === 'string' ? result : 'Invalid tag'
          setValidationErrors((prev) => ({ ...prev, [trimmed]: msg }))
          updateTags([...tags, trimmed])
          setInputValue('')
          return
        }
      }

      updateTags([...tags, trimmed])
      setInputValue('')
    }

    function removeTag(index: number) {
      const next = tags.filter((_, i) => i !== index)
      // Also remove any validation error for the removed tag
      const removed = tags[index]
      setValidationErrors((prev) => {
        const copy = { ...prev }
        delete copy[removed]
        return copy
      })
      updateTags(next)
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
      if (delimiter.includes(e.key)) {
        if (e.key !== 'Enter' || inputValue.trim()) {
          e.preventDefault()
          addTag(inputValue)
        }
        return
      }

      if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
        removeTag(tags.length - 1)
      }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const val = e.target.value
      // Handle comma delimiter inline
      if (delimiter.includes(',') && val.includes(',')) {
        const parts = val.split(',')
        parts.slice(0, -1).forEach((p) => addTag(p))
        setInputValue(parts[parts.length - 1])
        return
      }
      setInputValue(val)
    }

    function handleContainerClick() {
      if (!disabled) inputRef.current?.focus()
    }

    const hasError = Boolean(error) || Object.keys(validationErrors).length > 0
    const describedBy = [
      hint ? hintId : null,
      hasError ? errorId : null,
    ]
      .filter(Boolean)
      .join(' ') || undefined

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-[#1a1a1a]"
          >
            {label}
          </label>
        )}

        {/* Tag container */}
        <div
          ref={containerRef}
          onClick={handleContainerClick}
          className={cn(
            'border border-[#e0ddd6] rounded-lg px-2 py-1.5 flex flex-wrap gap-1 cursor-text bg-white min-h-[40px]',
            'transition-colors',
            'focus-within:ring-2 focus-within:ring-[#1a56b0] focus-within:ring-offset-1 focus-within:border-[#1a56b0]',
            hasError && 'border-red-500',
            disabled && 'opacity-50 cursor-not-allowed bg-[#f0ede8]'
          )}
        >
          {tags.map((tag, i) => (
            <TagChip
              key={`${tag}-${i}`}
              tag={tag}
              onRemove={() => removeTag(i)}
              disabled={disabled}
              invalid={Boolean(validationErrors[tag])}
            />
          ))}

          <input
            ref={inputRef}
            id={id}
            type="text"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder={maxReached ? `Max ${maxTags} tags reached` : placeholder}
            disabled={disabled || maxReached}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            className={cn(
              'flex-1 min-w-[80px] bg-transparent text-sm text-[#1a1a1a] placeholder:text-gray-400',
              'outline-none border-none py-0.5 px-1',
              'disabled:cursor-not-allowed'
            )}
          />
        </div>

        {/* Hint */}
        {hint && !error && (
          <p id={hintId} className="text-xs text-gray-500">
            {hint}
          </p>
        )}

        {/* Field-level error */}
        {error && (
          <p id={errorId} className="text-xs text-red-600" role="alert">
            {error}
          </p>
        )}

        {/* Validation errors from validate() */}
        {Object.entries(validationErrors).length > 0 && (
          <div id={errorId} role="alert" className="flex flex-col gap-0.5">
            {Object.entries(validationErrors).map(([tag, msg]) => (
              <p key={tag} className="text-xs text-red-600">
                &ldquo;{tag}&rdquo;: {msg}
              </p>
            ))}
          </div>
        )}
      </div>
    )
  }
)

TagInput.displayName = 'TagInput'
