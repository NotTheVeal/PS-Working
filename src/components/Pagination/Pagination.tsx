import * as React from 'react'
import { cn } from '@/lib/cn'

export interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  /** Total number of pages */
  totalPages: number
  /** Current page (1-indexed) */
  currentPage: number
  onPageChange: (page: number) => void
  /** Max page buttons to show before collapsing */
  siblingCount?: number
}

function range(start: number, end: number) {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}

function getPages(current: number, total: number, siblings: number): (number | '...')[] {
  const totalShown = siblings * 2 + 5 // first + last + current + 2×siblings + 2×dots
  if (total <= totalShown) return range(1, total)

  const leftSibling  = Math.max(current - siblings, 2)
  const rightSibling = Math.min(current + siblings, total - 1)
  const showLeft  = leftSibling  > 2
  const showRight = rightSibling < total - 1

  const pages: (number | '...')[] = [1]
  if (showLeft)  pages.push('...')
  pages.push(...range(leftSibling, rightSibling))
  if (showRight) pages.push('...')
  pages.push(total)
  return pages
}

const btnBase = cn(
  'inline-flex items-center justify-center w-8 h-8 rounded-lg text-[13px] font-medium',
  'transition-colors duration-150',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
  'disabled:opacity-40 disabled:cursor-not-allowed'
)

export const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  ({ totalPages, currentPage, onPageChange, siblingCount = 1, className, ...props }, ref) => {
    const pages = getPages(currentPage, totalPages, siblingCount)

    return (
      <nav
        ref={ref}
        aria-label="Pagination"
        className={cn('flex items-center gap-1', className)}
        {...props}
      >
        {/* Previous */}
        <button
          type="button"
          aria-label="Previous page"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className={cn(btnBase, 'text-[#6b6b6b] hover:bg-[#f0ede8] hover:text-[#1a1a1a]')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {pages.map((page, i) =>
          page === '...' ? (
            <span key={`dots-${i}`} className="w-8 text-center text-[13px] text-[#aaaaaa]">•••</span>
          ) : (
            <button
              key={page}
              type="button"
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
              onClick={() => onPageChange(page)}
              className={cn(
                btnBase,
                page === currentPage
                  ? 'bg-[#1a56b0] text-white'
                  : 'text-[#4a4a4a] hover:bg-[#f0ede8] hover:text-[#1a1a1a]'
              )}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          type="button"
          aria-label="Next page"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className={cn(btnBase, 'text-[#6b6b6b] hover:bg-[#f0ede8] hover:text-[#1a1a1a]')}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </nav>
    )
  }
)
Pagination.displayName = 'Pagination'
