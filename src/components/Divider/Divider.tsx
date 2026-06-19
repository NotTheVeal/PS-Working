import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// Border variant logic applies to the divider line(s)
const lineVariants = cva('border-[#e0ddd6]', {
  variants: {
    variant: {
      solid: 'border-solid',
      dashed: 'border-dashed',
      dotted: 'border-dotted',
    },
  },
  defaultVariants: {
    variant: 'solid',
  },
})

export interface DividerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof lineVariants> {
  orientation?: 'horizontal' | 'vertical'
  label?: string
  labelPosition?: 'start' | 'center' | 'end'
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  (
    {
      orientation = 'horizontal',
      label,
      labelPosition = 'center',
      variant = 'solid',
      className,
      ...props
    },
    ref
  ) => {
    const lineClass = lineVariants({ variant })

    // -----------------------------------------------------------------------
    // Vertical
    // -----------------------------------------------------------------------
    if (orientation === 'vertical') {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="vertical"
          className={cn('w-px self-stretch bg-[#e0ddd6]', className)}
          {...props}
        />
      )
    }

    // -----------------------------------------------------------------------
    // Horizontal — no label
    // -----------------------------------------------------------------------
    if (!label) {
      return (
        <div
          ref={ref}
          role="separator"
          aria-orientation="horizontal"
          className={cn('w-full border-t', lineClass, className)}
          {...props}
        />
      )
    }

    // -----------------------------------------------------------------------
    // Horizontal — with label
    // -----------------------------------------------------------------------
    // labelPosition controls the flex proportions of the two lines
    const leftFlex =
      labelPosition === 'start' ? 'flex-[0_0_1rem]' : labelPosition === 'end' ? 'flex-1' : 'flex-1'
    const rightFlex =
      labelPosition === 'end' ? 'flex-[0_0_1rem]' : labelPosition === 'start' ? 'flex-1' : 'flex-1'

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="horizontal"
        aria-label={label}
        className={cn('flex w-full items-center', className)}
        {...props}
      >
        <div className={cn('border-t', lineClass, leftFlex)} />
        <span className="px-3 text-sm text-gray-400 whitespace-nowrap">{label}</span>
        <div className={cn('border-t', lineClass, rightFlex)} />
      </div>
    )
  }
)

Divider.displayName = 'Divider'
