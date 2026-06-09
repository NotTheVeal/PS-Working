import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

// TEMPLATE: Component with cva variants
// Replace: componentNameVariants, ComponentName, Props fields, JSX
// Fill in: variant keys, class strings

const componentNameVariants = cva(
  // Base classes applied to every variant — layout, font, transition
  'inline-flex items-center justify-center transition-colors duration-150',
  {
    variants: {
      // Primary variant axis — map from Figma "Variant" property
      variant: {
        primary:   '',  // fill from token table
        secondary: '',
        ghost:     '',
      },
      // Size axis — map from Figma "Size" property
      size: {
        sm: '',
        md: '',
        lg: '',
      },
    },
    // compoundVariants: handle cases where two variants together change styles
    compoundVariants: [
      // { variant: 'primary', size: 'sm', class: '...' },
    ],
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface ComponentNameProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentNameVariants> {
  // Add extra props beyond variants here
  disabled?: boolean
  children?: React.ReactNode
}

export const ComponentName = React.forwardRef<HTMLElement, ComponentNameProps>(
  ({ variant, size, disabled, className, children, ...props }, ref) => (
    <div
      ref={ref}
      role="group"
      aria-disabled={disabled}
      data-disabled={disabled || undefined}
      className={componentNameVariants({ variant, size, className })}
      {...props}
    >
      {children}
    </div>
  )
)
ComponentName.displayName = 'ComponentName'
