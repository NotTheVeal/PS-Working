import * as React from 'react'
import { cn } from '@/lib/cn'

export interface AccordionItemData {
  id: string
  trigger: React.ReactNode
  content: React.ReactNode
  disabled?: boolean
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items: AccordionItemData[]
  /** Allow multiple panels open at once */
  multiple?: boolean
  /** Default open panel ids */
  defaultOpen?: string[]
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ items, multiple = false, defaultOpen = [], className, ...props }, ref) => {
    const [open, setOpen] = React.useState<Set<string>>(new Set(defaultOpen))

    function toggle(id: string) {
      setOpen(prev => {
        const next = new Set(prev)
        if (next.has(id)) {
          next.delete(id)
        } else {
          if (!multiple) next.clear()
          next.add(id)
        }
        return next
      })
    }

    return (
      <div
        ref={ref}
        className={cn('divide-y divide-[#e0ddd6] border border-[#e0ddd6] rounded-[10px] overflow-hidden', className)}
        {...props}
      >
        {items.map((item) => {
          const isOpen = open.has(item.id)
          const triggerId = `accordion-trigger-${item.id}`
          const panelId   = `accordion-panel-${item.id}`

          return (
            <div key={item.id}>
              <h3>
                <button
                  type="button"
                  id={triggerId}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  disabled={item.disabled}
                  onClick={() => !item.disabled && toggle(item.id)}
                  className={cn(
                    'w-full flex items-center justify-between gap-3 px-4 py-3.5',
                    'text-left text-[14px] font-medium text-[#1a1a1a] bg-white',
                    'transition-colors duration-150',
                    !item.disabled && 'hover:bg-[#f0ede8]',
                    item.disabled && 'opacity-50 cursor-not-allowed',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1a56b0]'
                  )}
                >
                  <span>{item.trigger}</span>
                  <svg
                    width="14" height="14" viewBox="0 0 14 14" fill="none"
                    aria-hidden="true"
                    className={cn('shrink-0 transition-transform duration-200', isOpen && 'rotate-180')}
                  >
                    <path d="M2 5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </h3>

              <div
                id={panelId}
                role="region"
                aria-labelledby={triggerId}
                hidden={!isOpen}
                className="bg-white"
              >
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-[14px] text-[#4a4a4a] leading-[1.6]">
                    {item.content}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
)
Accordion.displayName = 'Accordion'
