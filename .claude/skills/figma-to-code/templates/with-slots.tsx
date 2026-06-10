import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

// TEMPLATE: Component with named slots (icon, label, trailing element, badge, etc.)
// Replace: ComponentName, slot names, Props fields, JSX

const componentNameVariants = cva(
  'inline-flex items-center gap-2 transition-colors duration-150',
  {
    variants: {
      variant: {
        primary:   '',
        secondary: '',
      },
      size: {
        sm: 'px-2.5 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-5 py-2.5 text-base',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
)

interface ComponentNameProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof componentNameVariants> {
  /** Slot: leading icon rendered before children */
  icon?: React.ReactNode
  /** Slot: trailing element (badge, chevron, close) rendered after children */
  trailing?: React.ReactNode
  /** Slot: loading spinner replaces icon when true */
  loading?: boolean
}

export const ComponentName = React.forwardRef<HTMLButtonElement, ComponentNameProps>(
  (
    {
      variant,
      size,
      icon,
      trailing,
      loading = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      aria-disabled={disabled || loading}
      className={componentNameVariants({ variant, size, className })}
      {...props}
    >
      {/* Leading slot: show spinner during loading, icon otherwise */}
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : (
        icon && (
          <span className="shrink-0" aria-hidden="true">
            {icon}
          </span>
        )
      )}

      {/* Default slot */}
      {children}

      {/* Trailing slot */}
      {trailing && (
        <span className="shrink-0 ml-auto" aria-hidden="true">
          {trailing}
        </span>
      )}
    </button>
  )
)
ComponentName.displayName = 'ComponentName'
