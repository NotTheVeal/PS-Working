import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// CVA variants
// ---------------------------------------------------------------------------

const copyButtonVariants = cva(
  [
    'inline-flex items-center justify-center gap-1.5 font-semibold rounded-lg select-none',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
  ],
  {
    variants: {
      variant: {
        default: 'bg-[#1a56b0] text-white hover:bg-[#1446a0] active:bg-[#0e3a8a]',
        ghost:   'bg-transparent text-[#1a56b0] hover:bg-[#e8f0fe] active:bg-[#d5e5fc]',
        outline: 'bg-white text-[#1a1a1a] border border-[#e0ddd6] hover:bg-[#f0ede8] active:bg-[#e8e4de]',
      },
      size: {
        sm: 'h-7 px-2.5 text-[11px]',
        md: 'h-9 px-3.5 text-[13px]',
        lg: 'h-11 px-5  text-[14px]',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size:    'md',
    },
  }
)

const iconSizeClass: Record<string, string> = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-[18px] h-[18px]',
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

const CopyIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CopyButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>,
    VariantProps<typeof copyButtonVariants> {
  text: string
  label?: string
  successLabel?: string
  timeout?: number
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'ghost' | 'outline'
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      text,
      label = 'Copy',
      successLabel = 'Copied!',
      timeout = 2000,
      size = 'md',
      variant = 'outline',
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const [copied, setCopied] = React.useState(false)
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    // Clean up timer on unmount
    React.useEffect(() => {
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current)
      }
    }, [])

    const handleClick = React.useCallback(async () => {
      if (copied) return

      try {
        await navigator.clipboard.writeText(text)
      } catch {
        // Fallback for older environments
        try {
          const textarea = document.createElement('textarea')
          textarea.value = text
          textarea.style.position = 'fixed'
          textarea.style.opacity = '0'
          document.body.appendChild(textarea)
          textarea.focus()
          textarea.select()
          document.execCommand('copy')
          document.body.removeChild(textarea)
        } catch {
          // Copy failed silently
          return
        }
      }

      setCopied(true)
      timerRef.current = setTimeout(() => setCopied(false), timeout)
    }, [text, timeout, copied])

    const iconClass = iconSizeClass[size ?? 'md'] ?? iconSizeClass.md

    return (
      <>
        <button
          ref={ref}
          type="button"
          disabled={disabled}
          aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
          onClick={handleClick}
          className={cn(copyButtonVariants({ variant, size }), className)}
          {...props}
        >
          {copied ? (
            <CheckIcon className={cn(iconClass, 'text-[#1a6b3a]')} />
          ) : (
            <CopyIcon className={iconClass} />
          )}
          <span>{copied ? successLabel : label}</span>
        </button>

        {/* Screen reader live region */}
        <span role="status" aria-live="polite" className="sr-only">
          {copied ? successLabel : ''}
        </span>
      </>
    )
  }
)

CopyButton.displayName = 'CopyButton'
