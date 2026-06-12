import * as React from 'react'
import { cn } from '@/lib/cn'

// ─── Focus trap utility ────────────────────────────────────────────────────────

const FOCUSABLE = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'select:not([disabled])', 'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

function useFocusTrap(ref: React.RefObject<HTMLDivElement>, active: boolean) {
  React.useEffect(() => {
    if (!active || !ref.current) return
    const el = ref.current
    const focusable = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE))
    const first = focusable[0]
    const last  = focusable[focusable.length - 1]
    const prev  = document.activeElement as HTMLElement | null

    first?.focus()

    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      if (focusable.length === 0) { e.preventDefault(); return }
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first?.focus() }
      }
    }

    el.addEventListener('keydown', onKeyDown)
    return () => {
      el.removeEventListener('keydown', onKeyDown)
      prev?.focus()
    }
  }, [active, ref])
}

// ─── Modal ─────────────────────────────────────────────────────────────────────

export interface ModalProps {
  open: boolean
  onClose: () => void
  /** Dialog title — required for accessibility (used as aria-labelledby) */
  title: string
  /** Subtitle / description */
  description?: string
  /** Width of the dialog panel */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Prevent closing when clicking the backdrop */
  persistent?: boolean
  children?: React.ReactNode
  /** Footer slot — typically action buttons */
  footer?: React.ReactNode
  className?: string
}

const sizeClasses: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  title,
  description,
  size = 'md',
  persistent,
  children,
  footer,
  className,
}) => {
  const panelRef = React.useRef<HTMLDivElement>(null)
  const titleId  = React.useId()
  const descId   = React.useId()

  useFocusTrap(panelRef, open)

  // Close on Escape
  React.useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && !persistent) onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, persistent, onClose])

  // Prevent body scroll while open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-hidden="true"
        onClick={persistent ? undefined : onClose}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className={cn(
          'relative z-10 w-full bg-white rounded-[10px] shadow-[0_8px_32px_rgba(0,0,0,0.16)]',
          'flex flex-col max-h-[90vh]',
          sizeClasses[size],
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-5 pt-5 pb-4 border-b border-[#e0ddd6] shrink-0">
          <div>
            <h2 id={titleId} className="text-[16px] font-semibold text-[#1a1a1a] leading-snug">
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-0.5 text-[13px] text-[#6b6b6b] leading-[1.55]">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="Close dialog"
            onClick={onClose}
            className={cn(
              'shrink-0 flex items-center justify-center w-7 h-7 rounded-lg',
              'text-[#6b6b6b] hover:text-[#1a1a1a] hover:bg-[#f0ede8]',
              'transition-colors duration-150',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1'
            )}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Body */}
        {children && (
          <div className="flex-1 overflow-y-auto px-5 py-4 text-[14px] text-[#1a1a1a] leading-[1.6]">
            {children}
          </div>
        )}

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-2 px-5 pb-5 pt-4 border-t border-[#e0ddd6] shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
Modal.displayName = 'Modal'
