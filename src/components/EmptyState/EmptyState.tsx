import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const emptyStateVariants = cva(
  'flex flex-col items-center justify-center text-center',
  {
    variants: {
      size: {
        sm: 'gap-2 py-6 px-4',
        md: 'gap-3 py-10 px-6',
        lg: 'gap-4 py-16 px-8',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const iconWrapperVariants = cva(
  'flex items-center justify-center rounded-full bg-[#f0ede8]',
  {
    variants: {
      size: {
        sm: 'h-10 w-10',
        md: 'h-14 w-14',
        lg: 'h-20 w-20',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const titleVariants = cva('font-semibold text-[#1a1a1a]', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

const descriptionVariants = cva('text-gray-500', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-sm',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ icon, title, description, action, size, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="region"
        aria-label={title}
        className={cn(emptyStateVariants({ size }), className)}
        {...props}
      >
        {icon && (
          <div
            className={iconWrapperVariants({ size })}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}

        <div className="flex flex-col items-center gap-1">
          <p className={titleVariants({ size })}>{title}</p>
          {description && (
            <p className={descriptionVariants({ size })}>{description}</p>
          )}
        </div>

        {action && <div>{action}</div>}
      </div>
    )
  }
)

EmptyState.displayName = 'EmptyState'
