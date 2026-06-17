import * as React from 'react'
import { cn } from '@/lib/cn'

// ─── Table ─────────────────────────────────────────────────────────────────────

export const Table = React.forwardRef<HTMLTableElement, React.TableHTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-x-auto rounded-[10px] border border-[#e0ddd6]">
      <table
        ref={ref}
        className={cn('w-full text-[14px] text-[#1a1a1a] border-collapse', className)}
        {...props}
      />
    </div>
  )
)
Table.displayName = 'Table'

export const TableHead = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn('bg-[#f0ede8] border-b border-[#e0ddd6]', className)}
      {...props}
    />
  )
)
TableHead.displayName = 'TableHead'

export const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
)
TableBody.displayName = 'TableBody'

export const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn('bg-[#f0ede8] border-t border-[#e0ddd6] font-semibold', className)}
      {...props}
    />
  )
)
TableFooter.displayName = 'TableFooter'

export const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b border-[#e0ddd6] transition-colors',
        'hover:bg-[#faf9f7]',
        className
      )}
      {...props}
    />
  )
)
TableRow.displayName = 'TableRow'

export interface TableHeaderProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean
  sorted?: 'asc' | 'desc' | false
}

export const TableHeader = React.forwardRef<HTMLTableCellElement, TableHeaderProps>(
  ({ sortable, sorted, className, children, onClick, ...props }, ref) => (
    <th
      ref={ref}
      scope="col"
      aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined}
      onClick={sortable ? onClick : undefined}
      className={cn(
        'px-4 py-2.5 text-left text-[11px] font-semibold text-[#6b6b6b] uppercase tracking-[0.06em]',
        'whitespace-nowrap',
        sortable && 'cursor-pointer select-none hover:text-[#1a1a1a] transition-colors',
        className
      )}
      {...props}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sortable && (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true"
            className={cn('transition-transform', sorted === 'asc' && 'rotate-180')}
          >
            <path d="M2 3.5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
    </th>
  )
)
TableHeader.displayName = 'TableHeader'

export const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td
      ref={ref}
      className={cn('px-4 py-3 text-[14px] leading-[1.5] align-middle', className)}
      {...props}
    />
  )
)
TableCell.displayName = 'TableCell'

export const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(
  ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn('py-3 text-[12px] text-[#6b6b6b] text-left px-4', className)}
      {...props}
    />
  )
)
TableCaption.displayName = 'TableCaption'
