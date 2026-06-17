import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const avatarVariants = cva(
  'relative inline-flex items-center justify-center shrink-0 rounded-full font-semibold select-none overflow-hidden',
  {
    variants: {
      size: {
        xs: 'w-6 h-6 text-[10px]',
        sm: 'w-8 h-8 text-[11px]',
        md: 'w-10 h-10 text-[13px]',
        lg: 'w-12 h-12 text-[15px]',
        xl: 'w-16 h-16 text-[18px]',
      },
      color: {
        blue:   'bg-[#e8f0fe] text-[#1a56b0]',
        green:  'bg-[#d4edda] text-[#1a6b3a]',
        orange: 'bg-[#fef0e8] text-[#c4663f]',
        red:    'bg-[#fde8e8] text-[#9b2c2c]',
        purple: 'bg-[#f0e8fe] text-[#6b3ab0]',
        gray:   'bg-[#f0ede8] text-[#4a4a4a]',
      },
    },
    defaultVariants: { size: 'md', color: 'blue' },
  }
)

const statusDotSize: Record<string, string> = {
  xs: 'w-1.5 h-1.5 border',
  sm: 'w-2 h-2 border',
  md: 'w-2.5 h-2.5 border-2',
  lg: 'w-3 h-3 border-2',
  xl: 'w-4 h-4 border-2',
}

const statusDotColor: Record<string, string> = {
  online:  'bg-[#1a6b3a]',
  away:    'bg-[#d97757]',
  busy:    'bg-[#9b2c2c]',
  offline: 'bg-[#aaaaaa]',
}

export interface AvatarProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof avatarVariants> {
  /** Image URL — falls back to initials, then icon */
  src?: string
  /** Alt text for the image */
  alt?: string
  /** Display name used to derive initials */
  name?: string
  /** Status indicator */
  status?: 'online' | 'away' | 'busy' | 'offline'
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(p => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ src, alt, name, size = 'md', color, status, className, ...props }, ref) => (
    <span
      ref={ref}
      aria-label={alt ?? name}
      className={cn(avatarVariants({ size, color }), className)}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt ?? name ?? 'Avatar'}
          className="w-full h-full object-cover"
        />
      ) : name ? (
        <span aria-hidden="true">{getInitials(name)}</span>
      ) : (
        // Generic person icon fallback
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-[55%] h-[55%]" aria-hidden="true">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      )}
      {status && (
        <span
          aria-label={status}
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-white',
            statusDotSize[size!],
            statusDotColor[status]
          )}
        />
      )}
    </span>
  )
)
Avatar.displayName = 'Avatar'

// ─── AvatarGroup ───────────────────────────────────────────────────────────────

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  max?: number
  size?: AvatarProps['size']
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ max = 4, size = 'md', className, children, ...props }, ref) => {
    const items = React.Children.toArray(children)
    const shown  = items.slice(0, max)
    const hidden = items.length - max

    return (
      <div
        ref={ref}
        className={cn('flex -space-x-2', className)}
        {...props}
      >
        {shown.map((child, i) =>
          React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<AvatarProps>, {
                key: i,
                size,
                className: cn('ring-2 ring-white', (child as React.ReactElement<AvatarProps>).props.className),
              })
            : child
        )}
        {hidden > 0 && (
          <span
            aria-label={`${hidden} more`}
            className={cn(
              avatarVariants({ size, color: 'gray' }),
              'ring-2 ring-white'
            )}
          >
            <span aria-hidden="true">+{hidden}</span>
          </span>
        )}
      </div>
    )
  }
)
AvatarGroup.displayName = 'AvatarGroup'
