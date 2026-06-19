import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const kbdVariants = cva(
  [
    'inline-flex items-center justify-center',
    'font-mono',
    'border border-[#e0ddd6] border-b-2',
    'bg-[#f0ede8] text-[#1a1a1a]',
    'rounded-md',
    'select-none',
  ],
  {
    variants: {
      size: {
        sm: 'px-1.5 py-0.5 text-xs',
        md: 'px-2 py-1 text-sm',
        lg: 'px-2.5 py-1.5 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {
  children: React.ReactNode
}

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ children, size, className, ...props }, ref) => (
    <kbd
      ref={ref}
      className={cn(kbdVariants({ size }), className)}
      {...props}
    >
      {children}
    </kbd>
  )
)

Kbd.displayName = 'Kbd'

// ---------------------------------------------------------------------------
// Shortcut — renders multiple Kbd keys separated by "+" spans
// ---------------------------------------------------------------------------

export interface ShortcutProps {
  keys: string[]
  size?: 'sm' | 'md' | 'lg'
}

export const Shortcut: React.FC<ShortcutProps> = ({ keys, size = 'md' }) => {
  const separatorClasses = cn(
    'text-gray-400 font-sans select-none',
    size === 'sm' && 'text-xs mx-0.5',
    size === 'md' && 'text-sm mx-1',
    size === 'lg' && 'text-base mx-1.5'
  )

  return (
    <span className="inline-flex items-center" aria-label={keys.join(' + ')}>
      {keys.map((key, i) => (
        <React.Fragment key={`${key}-${i}`}>
          <Kbd size={size}>{key}</Kbd>
          {i < keys.length - 1 && (
            <span aria-hidden="true" className={separatorClasses}>
              +
            </span>
          )}
        </React.Fragment>
      ))}
    </span>
  )
}

Shortcut.displayName = 'Shortcut'
