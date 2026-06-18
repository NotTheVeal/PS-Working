import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const drawerPanelVariants = cva(
  [
    'fixed top-0 bottom-0 z-50 flex flex-col bg-white shadow-xl',
    'transition-transform duration-300 ease-in-out',
  ],
  {
    variants: {
      side: {
        left:  'left-0',
        right: 'right-0',
      },
      size: {
        sm:   'w-[320px]',
        md:   'w-[480px]',
        lg:   'w-[640px]',
        full: 'w-full',
      },
    },
    defaultVariants: {
      side: 'right',
      size: 'md',
    },
  }
)

export interface DrawerProps extends VariantProps<typeof drawerPanelVariants> {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  footer?: React.ReactNode
  persistent?: boolean
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => !el.hasAttribute('disabled'))
}

export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  ({ open, onClose, side = 'right', size = 'md', title, children, footer, persistent = false }, ref) => {
    const panelRef = React.useRef<HTMLDivElement>(null)
    const titleId = React.useId()

    // Body scroll lock
    React.useEffect(() => {
      if (open) {
        const original = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = original }
      }
    }, [open])

    // Focus trap + initial focus
    React.useEffect(() => {
      if (!open) return
      const panel = panelRef.current
      if (!panel) return

      const focusables = getFocusableElements(panel)
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      first?.focus()

      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return
        if (focusables.length === 0) { e.preventDefault(); return }
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last?.focus() }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first?.focus() }
        }
      }

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !persistent) onClose()
      }

      document.addEventListener('keydown', handleTab)
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('keydown', handleTab)
        document.removeEventListener('keydown', handleEscape)
      }
    }, [open, persistent, onClose])

    const slideClass =
      side === 'right'
        ? open ? 'translate-x-0' : 'translate-x-full'
        : open ? 'translate-x-0' : '-translate-x-full'

    return (
      <>
        {/* Backdrop */}
        <div
          aria-hidden="true"
          onClick={persistent ? undefined : onClose}
          className={cn(
            'fixed inset-0 z-40 bg-black/50 transition-opacity duration-300',
            open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          )}
        />
        {/* Panel */}
        <div
          ref={(node) => {
            panelRef.current = node
            if (typeof ref === 'function') ref(node)
            else if (ref) ref.current = node
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={title ? titleId : undefined}
          aria-hidden={!open}
          className={cn(drawerPanelVariants({ side, size }), slideClass)}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#e0ddd6] px-5 py-4 shrink-0">
            {title ? (
              <h2 id={titleId} className="text-base font-semibold text-[#1a1a1a]">
                {title}
              </h2>
            ) : (
              <div />
            )}
            <button
              type="button"
              aria-label="Close drawer"
              onClick={onClose}
              className={cn(
                'rounded p-1 text-[#1a1a1a]/60 transition-colors hover:bg-[#f0ede8] hover:text-[#1a1a1a]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1'
              )}
            >
              <CloseIcon />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="shrink-0 border-t border-[#e0ddd6] px-5 py-4">
              {footer}
            </div>
          )}
        </div>
      </>
    )
  }
)
Drawer.displayName = 'Drawer'
