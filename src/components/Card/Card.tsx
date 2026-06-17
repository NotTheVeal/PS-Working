import * as React from 'react'
import { cn } from '@/lib/cn'

// Card — composable layout component
// Use CardHeader + CardBody + CardFooter inside Card, or just pass children directly.

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Removes default padding — use when you need edge-to-edge content (e.g. images, tables) */
  flush?: boolean
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ flush, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-[10px] border border-[#e0ddd6]',
        'shadow-[0_2px_8px_rgba(0,0,0,0.08),0_1px_3px_rgba(0,0,0,0.05)]',
        !flush && 'p-5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
Card.displayName = 'Card'

// ─── CardHeader ────────────────────────────────────────────────────────────────

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ title, description, action, className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-start justify-between gap-4 mb-4', className)}
      {...props}
    >
      <div className="min-w-0 flex-1">
        {title && (
          <h3 className="text-[16px] font-semibold text-[#1a1a1a] leading-snug truncate">
            {title}
          </h3>
        )}
        {description && (
          <p className="mt-0.5 text-[13px] text-[#6b6b6b] leading-[1.55]">
            {description}
          </p>
        )}
        {children}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
)
CardHeader.displayName = 'CardHeader'

// ─── CardBody ──────────────────────────────────────────────────────────────────

export const CardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-[14px] text-[#1a1a1a] leading-[1.6]', className)}
      {...props}
    >
      {children}
    </div>
  )
)
CardBody.displayName = 'CardBody'

// ─── CardFooter ────────────────────────────────────────────────────────────────

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Align actions to the right (default) or left */
  align?: 'left' | 'right' | 'between'
}

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ align = 'right', className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-2 mt-5 pt-4 border-t border-[#e0ddd6]',
        align === 'right'   && 'justify-end',
        align === 'left'    && 'justify-start',
        align === 'between' && 'justify-between',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
CardFooter.displayName = 'CardFooter'

// ─── CardDivider ───────────────────────────────────────────────────────────────

export const CardDivider = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => (
    <hr
      ref={ref}
      className={cn('border-t border-[#e0ddd6] my-4', className)}
      {...props}
    />
  )
)
CardDivider.displayName = 'CardDivider'
