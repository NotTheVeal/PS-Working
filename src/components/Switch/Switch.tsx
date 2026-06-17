import * as React from 'react'
import { cn } from '@/lib/cn'

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  /** Controlled checked state */
  checked?: boolean
  /** Default checked for uncontrolled use */
  defaultChecked?: boolean
  /** Change handler */
  onChange?: (checked: boolean) => void
  /** Label rendered to the right */
  label?: string
  /** Helper text */
  hint?: string
  /** Size */
  size?: 'sm' | 'md'
}

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ checked, defaultChecked, onChange, label, hint, size = 'md', disabled, id, className, ...props }, ref) => {
    const [internal, setInternal] = React.useState(defaultChecked ?? false)
    const isChecked = checked ?? internal
    const switchId  = id ?? React.useId()
    const hintId    = `${switchId}-hint`

    function toggle() {
      if (disabled) return
      const next = !isChecked
      if (checked === undefined) setInternal(next)
      onChange?.(next)
    }

    function handleKeyDown(e: React.KeyboardEvent) {
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle() }
    }

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2.5">
          <button
            ref={ref}
            type="button"
            id={switchId}
            role="switch"
            aria-checked={isChecked}
            aria-describedby={hint ? hintId : undefined}
            disabled={disabled}
            onClick={toggle}
            onKeyDown={handleKeyDown}
            className={cn(
              'relative inline-flex shrink-0 rounded-full border-2 border-transparent',
              'transition-colors duration-200 cursor-pointer',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-2',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              size === 'sm' ? 'w-8 h-5' : 'w-10 h-6',
              isChecked ? 'bg-[#1a56b0]' : 'bg-[#d0cdc5]',
              className
            )}
            {...props}
          >
            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none inline-block rounded-full bg-white shadow transition-transform duration-200',
                size === 'sm'
                  ? ['w-3.5 h-3.5 mt-0.5', isChecked ? 'translate-x-3.5' : 'translate-x-0.5']
                  : ['w-4 h-4 mt-0.5',     isChecked ? 'translate-x-4'   : 'translate-x-0.5']
              )}
            />
          </button>

          {label && (
            <label
              htmlFor={switchId}
              className={cn(
                'text-[14px] text-[#1a1a1a] cursor-pointer select-none',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              {label}
            </label>
          )}
        </div>
        {hint && (
          <p id={hintId} className="ml-[52px] text-[12px] text-[#6b6b6b] leading-[1.4]">{hint}</p>
        )}
      </div>
    )
  }
)
Switch.displayName = 'Switch'
