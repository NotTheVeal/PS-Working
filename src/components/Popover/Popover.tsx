import * as React from 'react'
import { cn } from '@/lib/cn'

export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right'

export interface PopoverProps {
  trigger: React.ReactNode
  children: React.ReactNode
  placement?: PopoverPlacement
  title?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

// ─── Arrow ───────────────────────────────────────────────────────────────────

interface ArrowProps {
  placement: PopoverPlacement
}

function PopoverArrow({ placement }: ArrowProps) {
  const base = 'absolute w-0 h-0'

  const styles: Record<PopoverPlacement, React.CSSProperties> = {
    bottom: {
      top: -6,
      left: '50%',
      transform: 'translateX(-50%)',
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderBottom: '6px solid #e0ddd6',
    },
    top: {
      bottom: -6,
      left: '50%',
      transform: 'translateX(-50%)',
      borderLeft: '6px solid transparent',
      borderRight: '6px solid transparent',
      borderTop: '6px solid #e0ddd6',
    },
    left: {
      right: -6,
      top: '50%',
      transform: 'translateY(-50%)',
      borderTop: '6px solid transparent',
      borderBottom: '6px solid transparent',
      borderLeft: '6px solid #e0ddd6',
    },
    right: {
      left: -6,
      top: '50%',
      transform: 'translateY(-50%)',
      borderTop: '6px solid transparent',
      borderBottom: '6px solid transparent',
      borderRight: '6px solid #e0ddd6',
    },
  }

  // Inner arrow covers the outer one with white to simulate border
  const innerStyles: Record<PopoverPlacement, React.CSSProperties> = {
    bottom: {
      top: 1,
      left: '50%',
      transform: 'translateX(-50%)',
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderBottom: '5px solid white',
    },
    top: {
      bottom: 1,
      left: '50%',
      transform: 'translateX(-50%)',
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderTop: '5px solid white',
    },
    left: {
      right: 1,
      top: '50%',
      transform: 'translateY(-50%)',
      borderTop: '5px solid transparent',
      borderBottom: '5px solid transparent',
      borderLeft: '5px solid white',
    },
    right: {
      left: 1,
      top: '50%',
      transform: 'translateY(-50%)',
      borderTop: '5px solid transparent',
      borderBottom: '5px solid transparent',
      borderRight: '5px solid white',
    },
  }

  return (
    <span aria-hidden="true" className={cn(base, 'pointer-events-none')} style={styles[placement]}>
      <span className={cn('absolute w-0 h-0')} style={innerStyles[placement]} />
    </span>
  )
}

// ─── Panel positioning ────────────────────────────────────────────────────────

function getPanelStyle(placement: PopoverPlacement): React.CSSProperties {
  switch (placement) {
    case 'bottom':
      return { top: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)' }
    case 'top':
      return { bottom: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)' }
    case 'left':
      return { right: 'calc(100% + 10px)', top: '50%', transform: 'translateY(-50%)' }
    case 'right':
      return { left: 'calc(100% + 10px)', top: '50%', transform: 'translateY(-50%)' }
  }
}

// ─── Popover ──────────────────────────────────────────────────────────────────

let titleIdCounter = 0

export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  function Popover(
    {
      trigger,
      children,
      placement = 'bottom',
      title,
      open: controlledOpen,
      defaultOpen = false,
      onOpenChange,
    },
    ref,
  ) {
    const isControlled = controlledOpen !== undefined

    const [internalOpen, setInternalOpen] = React.useState(defaultOpen)
    const open = isControlled ? controlledOpen : internalOpen

    const titleId = React.useRef(`popover-title-${++titleIdCounter}`).current
    const wrapperRef = React.useRef<HTMLDivElement>(null)
    const panelRef = React.useRef<HTMLDivElement>(null)

    // Merge forwarded ref with local panelRef
    const setPanelRef = React.useCallback(
      (node: HTMLDivElement | null) => {
        ;(panelRef as React.MutableRefObject<HTMLDivElement | null>).current = node
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }
      },
      [ref],
    )

    const setOpen = React.useCallback(
      (next: boolean) => {
        if (!isControlled) setInternalOpen(next)
        onOpenChange?.(next)
      },
      [isControlled, onOpenChange],
    )

    // Focus first focusable element when panel opens
    React.useEffect(() => {
      if (!open || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length > 0) {
        focusable[0].focus()
      } else {
        panelRef.current.focus()
      }
    }, [open])

    // Close on Escape
    React.useEffect(() => {
      if (!open) return
      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Escape') setOpen(false)
      }
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [open, setOpen])

    // Close on outside click
    React.useEffect(() => {
      if (!open) return
      function handlePointerDown(e: PointerEvent) {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
          setOpen(false)
        }
      }
      document.addEventListener('pointerdown', handlePointerDown)
      return () => document.removeEventListener('pointerdown', handlePointerDown)
    }, [open, setOpen])

    return (
      <div ref={wrapperRef} className="relative inline-block">
        {/* Trigger wrapper */}
        <span
          aria-haspopup="dialog"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              setOpen(!open)
            }
          }}
          className="inline-flex"
        >
          {trigger}
        </span>

        {/* Floating panel */}
        {open && (
          <div
            ref={setPanelRef}
            role="dialog"
            aria-modal="false"
            aria-labelledby={title ? titleId : undefined}
            tabIndex={-1}
            style={getPanelStyle(placement)}
            className={cn(
              'absolute z-50',
              'bg-white border border-[#e0ddd6] rounded-xl shadow-lg p-4 min-w-[200px]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
            )}
          >
            <PopoverArrow placement={placement} />

            {title && (
              <p
                id={titleId}
                className="text-sm font-semibold text-[#1a1a1a] mb-2 leading-snug"
              >
                {title}
              </p>
            )}

            <div className="text-sm text-[#1a1a1a]">{children}</div>
          </div>
        )}
      </div>
    )
  },
)

Popover.displayName = 'Popover'
