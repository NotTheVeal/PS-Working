import * as React from 'react'
import { cn } from '@/lib/cn'

type Placement = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  /** The element that triggers the tooltip */
  children: React.ReactElement
  /** Tooltip content */
  content: React.ReactNode
  /** Placement relative to the trigger */
  placement?: Placement
  /** Delay before showing (ms) */
  delay?: number
  /** Max width of the tooltip bubble */
  maxWidth?: number
}

const placementClasses: Record<Placement, string> = {
  top:    'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
  left:   'right-full top-1/2 -translate-y-1/2 mr-1.5',
  right:  'left-full top-1/2 -translate-y-1/2 ml-1.5',
}

const arrowClasses: Record<Placement, string> = {
  top:    'top-full left-1/2 -translate-x-1/2 border-t-[#1a1a1a] border-x-transparent border-b-transparent',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[#1a1a1a] border-x-transparent border-t-transparent',
  left:   'left-full top-1/2 -translate-y-1/2 border-l-[#1a1a1a] border-y-transparent border-r-transparent',
  right:  'right-full top-1/2 -translate-y-1/2 border-r-[#1a1a1a] border-y-transparent border-l-transparent',
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  placement = 'top',
  delay = 300,
  maxWidth = 240,
}) => {
  const [visible, setVisible] = React.useState(false)
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const tooltipId = React.useId()

  function show() {
    timerRef.current = setTimeout(() => setVisible(true), delay)
  }
  function hide() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setVisible(false)
  }

  // Clone child to inject aria-describedby and event handlers
  const trigger = React.cloneElement(children, {
    'aria-describedby': visible ? tooltipId : undefined,
    onMouseEnter: (e: React.MouseEvent) => { show(); children.props.onMouseEnter?.(e) },
    onMouseLeave: (e: React.MouseEvent) => { hide(); children.props.onMouseLeave?.(e) },
    onFocus:      (e: React.FocusEvent) => { show(); children.props.onFocus?.(e) },
    onBlur:       (e: React.FocusEvent) => { hide(); children.props.onBlur?.(e) },
  })

  return (
    <span className="relative inline-flex">
      {trigger}
      {visible && (
        <span
          id={tooltipId}
          role="tooltip"
          style={{ maxWidth }}
          className={cn(
            'pointer-events-none absolute z-50',
            'bg-[#1a1a1a] text-white text-[12px] leading-[1.4] rounded-md px-2 py-1',
            'whitespace-normal break-words',
            placementClasses[placement]
          )}
        >
          {content}
          <span
            className={cn('absolute w-0 h-0 border-4', arrowClasses[placement])}
            aria-hidden="true"
          />
        </span>
      )}
    </span>
  )
}
Tooltip.displayName = 'Tooltip'
