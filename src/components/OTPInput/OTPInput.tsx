import * as React from 'react'
import { cn } from '@/lib/cn'

export interface OTPInputProps {
  /** Number of individual input boxes. Default: 6 */
  length?: number
  /** Controlled value string (e.g. "123456") */
  value?: string
  /** Fires with the joined string on every keystroke */
  onChange?: (value: string) => void
  /** Fires once all boxes are filled */
  onComplete?: (value: string) => void
  /** Disables all inputs */
  disabled?: boolean
  /** Error message rendered below the group */
  error?: string
  /** Label rendered above the group */
  label?: string
  /** Controls inputmode and allowed characters */
  type?: 'numeric' | 'alphanumeric'
  /** id for the wrapping group div */
  id?: string
}

/**
 * OTPInput — a row of single-character input boxes for one-time passwords,
 * verification codes, and PIN entry.
 */
export const OTPInput = React.forwardRef<HTMLDivElement, OTPInputProps>(
  (
    {
      length = 6,
      value,
      onChange,
      onComplete,
      disabled = false,
      error,
      label,
      type = 'alphanumeric',
      id,
    },
    ref
  ) => {
    const generatedId = React.useId()
    const groupId = id ?? generatedId
    const errorId = `${groupId}-error`

    // Internal array of chars — derived from value when controlled
    const [chars, setChars] = React.useState<string[]>(() => {
      if (value !== undefined) {
        return Array.from({ length }, (_, i) => value[i] ?? '')
      }
      return Array.from({ length }, () => '')
    })

    // Sync internal state when controlled value changes
    React.useEffect(() => {
      if (value !== undefined) {
        setChars(Array.from({ length }, (_, i) => value[i] ?? ''))
      }
    }, [value, length])

    // Array of refs to each individual input
    const inputRefs = React.useRef<HTMLInputElement[]>([])

    const focusBox = (index: number) => {
      const el = inputRefs.current[index]
      if (el) {
        el.focus()
        // Place cursor at end
        el.setSelectionRange(el.value.length, el.value.length)
      }
    }

    const commitChars = (next: string[]) => {
      setChars(next)
      const joined = next.join('')
      onChange?.(joined)
      if (next.every((c) => c !== '') && joined.length === length) {
        onComplete?.(joined)
      }
    }

    const handleKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>,
      index: number
    ) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (index > 0) focusBox(index - 1)
        return
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        if (index < length - 1) focusBox(index + 1)
        return
      }
      if (e.key === 'Backspace') {
        e.preventDefault()
        if (chars[index] !== '') {
          // Clear current box
          const next = [...chars]
          next[index] = ''
          commitChars(next)
        } else if (index > 0) {
          // Move back and clear previous box
          const next = [...chars]
          next[index - 1] = ''
          commitChars(next)
          focusBox(index - 1)
        }
      }
    }

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement>,
      index: number
    ) => {
      const raw = e.target.value
      // Take the last character typed (in case browser fills more than 1)
      const char = raw.slice(-1)
      if (!char) return

      // Validate character
      if (type === 'numeric' && !/^\d$/.test(char)) return

      const next = [...chars]
      next[index] = char
      commitChars(next)

      // Advance focus
      if (index < length - 1) {
        focusBox(index + 1)
      }
    }

    const handlePaste = (
      e: React.ClipboardEvent<HTMLInputElement>,
      index: number
    ) => {
      e.preventDefault()
      const pasted = e.clipboardData.getData('text')
      const filtered =
        type === 'numeric' ? pasted.replace(/\D/g, '') : pasted

      if (!filtered) return

      const next = [...chars]
      let lastFilled = index
      for (let i = 0; i < filtered.length; i++) {
        const targetIndex = index + i
        if (targetIndex >= length) break
        next[targetIndex] = filtered[i]
        lastFilled = targetIndex
      }
      commitChars(next)
      focusBox(Math.min(lastFilled, length - 1))
    }

    const isNumeric = type === 'numeric'
    const hasError = Boolean(error)

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <span className="text-[13px] font-semibold text-[#1a1a1a] leading-none">
            {label}
          </span>
        )}

        <div
          ref={ref}
          id={groupId}
          role="group"
          aria-label={label ?? 'One-time password'}
          aria-describedby={hasError ? errorId : undefined}
          className="flex flex-row gap-2"
        >
          {Array.from({ length }, (_, index) => {
            const isFilled = chars[index] !== ''
            return (
              <input
                key={index}
                ref={(el) => {
                  if (el) inputRefs.current[index] = el
                }}
                type={isNumeric ? 'tel' : 'text'}
                inputMode={isNumeric ? 'numeric' : 'text'}
                pattern={isNumeric ? '[0-9]*' : undefined}
                maxLength={2}
                value={chars[index]}
                disabled={disabled}
                aria-label={`Digit ${index + 1} of ${length}`}
                aria-invalid={hasError ? true : undefined}
                autoComplete="one-time-code"
                className={cn(
                  'w-10 h-12 text-center text-lg border rounded-lg bg-white text-[#1a1a1a]',
                  'transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
                  'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-[#f0ede8]',
                  hasError
                    ? 'border-red-500'
                    : isFilled
                    ? 'border-[#1a56b0]'
                    : 'border-[#e0ddd6]'
                )}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={(e) => handlePaste(e, index)}
                onFocus={(e) => e.target.select()}
              />
            )
          })}
        </div>

        {hasError && (
          <p id={errorId} className="text-[12px] text-red-500 leading-[1.4]" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)
OTPInput.displayName = 'OTPInput'
