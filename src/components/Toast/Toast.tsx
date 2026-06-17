import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// ─── Toast context & provider ──────────────────────────────────────────────────

export interface ToastItem {
  id: string
  message: string
  title?: string
  variant?: 'info' | 'success' | 'warning' | 'error'
  duration?: number
}

interface ToastContextValue {
  toast: (item: Omit<ToastItem, 'id'>) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = React.useCallback((item: Omit<ToastItem, 'id'>) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { ...item, id }])
    const duration = item.duration ?? 4000
    if (duration > 0) setTimeout(() => dismiss(id), duration)
  }, [dismiss])

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}

// ─── Individual Toast ──────────────────────────────────────────────────────────

const toastVariants = cva(
  [
    'flex items-start gap-3 w-full max-w-sm rounded-[10px] border px-4 py-3',
    'shadow-[0_4px_16px_rgba(0,0,0,0.12)] bg-white',
    'animate-in slide-in-from-right-4 fade-in duration-200',
  ],
  {
    variants: {
      variant: {
        info:    'border-[#c5d8f8]',
        success: 'border-[#b2d9be]',
        warning: 'border-[#f5d0b8]',
        error:   'border-[#f5c2c2]',
      },
    },
    defaultVariants: { variant: 'info' },
  }
)

const accentColors: Record<string, string> = {
  info:    'text-[#1a56b0]',
  success: 'text-[#1a6b3a]',
  warning: 'text-[#c4663f]',
  error:   'text-[#9b2c2c]',
}

const icons: Record<string, React.ReactNode> = {
  info: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 7v4M8 5.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  success: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 8l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2L14.5 13H1.5L8 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M8 6v3M8 10.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
}

interface ToastCardProps extends VariantProps<typeof toastVariants> {
  item: ToastItem
  onDismiss: (id: string) => void
}

function ToastCard({ item, onDismiss }: ToastCardProps) {
  return (
    <div role="status" aria-live={item.variant === 'error' ? 'assertive' : 'polite'} aria-atomic="true">
      <div className={toastVariants({ variant: item.variant })}>
        <span className={cn('shrink-0 mt-0.5', accentColors[item.variant ?? 'info'])}>
          {icons[item.variant ?? 'info']}
        </span>
        <div className="flex-1 min-w-0">
          {item.title && (
            <p className="text-[13px] font-semibold text-[#1a1a1a] leading-snug">{item.title}</p>
          )}
          <p className="text-[13px] text-[#4a4a4a] leading-[1.55]">{item.message}</p>
        </div>
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={() => onDismiss(item.id)}
          className={cn(
            'shrink-0 flex items-center justify-center w-5 h-5 rounded',
            'text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1'
          )}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─── Viewport ──────────────────────────────────────────────────────────────────

function ToastViewport({ toasts, onDismiss }: { toasts: ToastItem[]; onDismiss: (id: string) => void }) {
  if (toasts.length === 0) return null
  return (
    <div
      aria-label="Notifications"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm"
    >
      {toasts.map((t) => (
        <ToastCard key={t.id} item={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}
