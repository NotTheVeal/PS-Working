import * as React from 'react'
import { cn } from '@/lib/cn'

const dotColorMap = {
  default: 'bg-[#1a56b0] ring-[#1a56b0]/20',
  success: 'bg-[#1a6b3a] ring-[#1a6b3a]/20',
  warning: 'bg-amber-500 ring-amber-500/20',
  error:   'bg-red-600 ring-red-600/20',
} as const

export interface TimelineEvent {
  id: string
  title: string
  description?: string
  timestamp?: string
  icon?: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error'
}

export interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  events: TimelineEvent[]
  orientation?: 'left' | 'alternate'
}

export const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(
  ({ events, orientation = 'left', className, ...props }, ref) => {
    return (
      <ol
        ref={ref}
        role="list"
        className={cn('relative', orientation === 'alternate' && 'flex flex-col', className)}
        {...props}
      >
        {events.map((event, index) => {
          const variant = event.variant ?? 'default'
          const dotColors = dotColorMap[variant]
          const isEven = index % 2 === 0
          const isLast = index === events.length - 1

          if (orientation === 'alternate') {
            return (
              <AlternateItem
                key={event.id}
                event={event}
                dotColors={dotColors}
                isEven={isEven}
                isLast={isLast}
              />
            )
          }

          return (
            <LeftItem
              key={event.id}
              event={event}
              dotColors={dotColors}
              isLast={isLast}
            />
          )
        })}
      </ol>
    )
  }
)
Timeline.displayName = 'Timeline'

// ─── Left orientation item ────────────────────────────────────────────────────

interface LeftItemProps {
  event: TimelineEvent
  dotColors: string
  isLast: boolean
}

function LeftItem({ event, dotColors, isLast }: LeftItemProps) {
  const variant = event.variant ?? 'default'

  return (
    <li role="listitem" className="relative flex gap-4 pb-8 last:pb-0">
      {/* Vertical line */}
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute left-[11px] top-6 bottom-0 w-0.5 bg-[#e0ddd6]"
        />
      )}
      {/* Dot or icon */}
      <span className="relative z-10 shrink-0 mt-1">
        {event.icon ? (
          <span
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full ring-4',
              dotColors
            )}
            aria-hidden="true"
          >
            <span className="text-white text-xs">{event.icon}</span>
          </span>
        ) : (
          <span
            className={cn('block h-6 w-6 rounded-full ring-4', dotColors)}
            aria-hidden="true"
          />
        )}
      </span>
      {/* Content */}
      <EventContent event={event} variant={variant} />
    </li>
  )
}

// ─── Alternate orientation item ───────────────────────────────────────────────

interface AlternateItemProps {
  event: TimelineEvent
  dotColors: string
  isEven: boolean
  isLast: boolean
}

function AlternateItem({ event, dotColors, isEven, isLast }: AlternateItemProps) {
  const variant = event.variant ?? 'default'

  return (
    <li role="listitem" className="relative flex items-start gap-0 pb-8 last:pb-0">
      {/* Left content slot */}
      <div className={cn('w-[calc(50%-24px)]', isEven ? 'pr-6' : '')}>
        {isEven && <EventContent event={event} variant={variant} align="right" />}
      </div>

      {/* Center dot + line */}
      <div className="relative z-10 shrink-0 flex flex-col items-center">
        {event.icon ? (
          <span
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full ring-4',
              dotColors
            )}
            aria-hidden="true"
          >
            <span className="text-white text-xs">{event.icon}</span>
          </span>
        ) : (
          <span
            className={cn('block h-6 w-6 rounded-full ring-4', dotColors)}
            aria-hidden="true"
          />
        )}
        {!isLast && (
          <span
            aria-hidden="true"
            className="w-0.5 flex-1 min-h-[2rem] bg-[#e0ddd6] mt-1"
          />
        )}
      </div>

      {/* Right content slot */}
      <div className={cn('w-[calc(50%-24px)]', !isEven ? 'pl-6' : '')}>
        {!isEven && <EventContent event={event} variant={variant} align="left" />}
      </div>
    </li>
  )
}

// ─── Shared event content ─────────────────────────────────────────────────────

interface EventContentProps {
  event: TimelineEvent
  variant: NonNullable<TimelineEvent['variant']>
  align?: 'left' | 'right'
}

function EventContent({ event, align = 'left' }: EventContentProps) {
  return (
    <div className={cn('flex flex-col gap-0.5', align === 'right' && 'items-end text-right')}>
      <p className="text-sm font-semibold text-[#1a1a1a] leading-5">{event.title}</p>
      {event.description && (
        <p className="text-sm text-[#1a1a1a]/60 leading-5">{event.description}</p>
      )}
      {event.timestamp && (
        <time
          dateTime={event.timestamp}
          className="text-xs text-[#1a1a1a]/40 mt-0.5"
        >
          {event.timestamp}
        </time>
      )}
    </div>
  )
}
