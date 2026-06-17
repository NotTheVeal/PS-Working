import * as React from 'react'
import { cn } from '@/lib/cn'

const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M4 2l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
}

export interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  /** Maximum items to show before collapsing the middle */
  maxItems?: number
}

export const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, maxItems, className, ...props }, ref) => {
    const [expanded, setExpanded] = React.useState(false)

    const shouldCollapse = maxItems && items.length > maxItems && !expanded
    let visible: BreadcrumbItem[]
    if (shouldCollapse) {
      visible = [items[0], { label: '…', onClick: () => setExpanded(true) }, items[items.length - 1]]
    } else {
      visible = items
    }

    return (
      <nav ref={ref} aria-label="Breadcrumb" className={cn('flex', className)} {...props}>
        <ol className="flex items-center flex-wrap gap-1 text-[13px]">
          {visible.map((item, i) => {
            const isLast = i === visible.length - 1
            const isEllipsis = item.label === '…'

            return (
              <li key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronIcon />}
                {isLast && !isEllipsis ? (
                  <span className="font-medium text-[#1a1a1a]" aria-current="page">
                    {item.label}
                  </span>
                ) : isEllipsis ? (
                  <button
                    type="button"
                    aria-label="Show full path"
                    onClick={item.onClick}
                    className={cn(
                      'text-[#6b6b6b] hover:text-[#1a1a1a] transition-colors px-1 rounded',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0]'
                    )}
                  >
                    •••
                  </button>
                ) : item.href ? (
                  <a
                    href={item.href}
                    className={cn(
                      'text-[#6b6b6b] hover:text-[#1a56b0] hover:underline transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] rounded'
                    )}
                  >
                    {item.label}
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={item.onClick}
                    className={cn(
                      'text-[#6b6b6b] hover:text-[#1a56b0] transition-colors',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] rounded'
                    )}
                  >
                    {item.label}
                  </button>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    )
  }
)
Breadcrumb.displayName = 'Breadcrumb'
