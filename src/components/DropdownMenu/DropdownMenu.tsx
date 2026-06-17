import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

export interface DropdownMenuItemProps {
  label: string
  onClick?: () => void
  disabled?: boolean
  icon?: React.ReactNode
  destructive?: boolean
  separator?: boolean
}

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode
  items: DropdownMenuItemProps[]
  align?: 'left' | 'right'
  disabled?: boolean
}

const menuItemVariants = cva(
  [
    'flex w-full items-center gap-2 px-3 py-2 text-sm text-left',
    'transition-colors duration-100 cursor-pointer select-none',
    'focus:outline-none focus:bg-[#f0ede8]',
  ],
  {
    variants: {
      destructive: {
        true: 'text-red-600 hover:bg-red-50 focus:bg-red-50',
        false: 'text-[#1a1a1a] hover:bg-[#f0ede8]',
      },
      disabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
        false: '',
      },
    },
    defaultVariants: {
      destructive: false,
      disabled: false,
    },
  }
)

export const DropdownMenu = React.forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ trigger, items, align = 'left', disabled, className, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)
    const [focusedIndex, setFocusedIndex] = React.useState<number>(-1)

    const containerRef = React.useRef<HTMLDivElement>(null)
    const menuRef = React.useRef<HTMLDivElement>(null)
    const triggerId = React.useId()
    const menuId = React.useId()

    const interactableItems = React.useMemo(
      () =>
        items
          .map((item, index) => ({ item, index }))
          .filter(({ item }) => !item.separator && !item.disabled),
      [items]
    )

    const close = React.useCallback(() => {
      setOpen(false)
      setFocusedIndex(-1)
    }, [])

    // Close on outside click
    React.useEffect(() => {
      if (!open) return
      const handler = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          close()
        }
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [open, close])

    // Focus first non-disabled item when menu opens
    React.useEffect(() => {
      if (open && interactableItems.length > 0) {
        setFocusedIndex(interactableItems[0].index)
      }
    }, [open, interactableItems])

    // Focus the focused item element
    React.useEffect(() => {
      if (!open || focusedIndex < 0) return
      const el = menuRef.current?.querySelector<HTMLElement>(
        `[data-index="${focusedIndex}"]`
      )
      el?.focus()
    }, [focusedIndex, open])

    const handleTriggerClick = () => {
      if (disabled) return
      setOpen((prev) => !prev)
    }

    const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        if (!disabled) setOpen((prev) => !prev)
      }
      if (e.key === 'Escape') close()
    }

    const handleMenuKeyDown = (e: React.KeyboardEvent) => {
      const indices = interactableItems.map((i) => i.index)
      const currentPos = indices.indexOf(focusedIndex)

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const next = indices[(currentPos + 1) % indices.length]
        setFocusedIndex(next)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const prev = indices[(currentPos - 1 + indices.length) % indices.length]
        setFocusedIndex(prev)
      } else if (e.key === 'Escape') {
        e.preventDefault()
        close()
      }
    }

    const handleItemActivate = (item: DropdownMenuItemProps) => {
      if (item.disabled || item.separator) return
      item.onClick?.()
      close()
    }

    const handleItemKeyDown = (
      e: React.KeyboardEvent,
      item: DropdownMenuItemProps
    ) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleItemActivate(item)
      }
    }

    return (
      <div
        ref={(node) => {
          // Merge refs
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
          ;(containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        className={cn('relative inline-block', className)}
        {...props}
      >
        {/* Trigger */}
        <div
          id={triggerId}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-controls={menuId}
          aria-disabled={disabled}
          onClick={handleTriggerClick}
          onKeyDown={handleTriggerKeyDown}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg border px-3 py-2',
            'text-sm font-medium text-[#1a56b0] border-[#1a56b0] bg-white',
            'transition-colors duration-150 cursor-pointer select-none',
            'hover:bg-[#f0ede8]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
            disabled && 'opacity-50 cursor-not-allowed pointer-events-none'
          )}
        >
          {trigger}
          <svg
            className={cn(
              'h-4 w-4 transition-transform duration-150',
              open && 'rotate-180'
            )}
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Menu */}
        {open && (
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-labelledby={triggerId}
            onKeyDown={handleMenuKeyDown}
            className={cn(
              'absolute z-50 mt-1 min-w-[160px] rounded-lg border border-[#e0ddd6]',
              'bg-white shadow-lg py-1',
              align === 'right' ? 'right-0' : 'left-0'
            )}
          >
            {items.map((item, index) => {
              if (item.separator) {
                return (
                  <hr
                    key={index}
                    role="separator"
                    className="my-1 border-[#e0ddd6]"
                  />
                )
              }

              return (
                <button
                  key={index}
                  role="menuitem"
                  data-index={index}
                  tabIndex={focusedIndex === index ? 0 : -1}
                  aria-disabled={item.disabled}
                  disabled={item.disabled}
                  onClick={() => handleItemActivate(item)}
                  onKeyDown={(e) => handleItemKeyDown(e, item)}
                  className={cn(
                    menuItemVariants({
                      destructive: item.destructive ?? false,
                      disabled: item.disabled ?? false,
                    })
                  )}
                >
                  {item.icon && (
                    <span className="flex h-4 w-4 items-center justify-center" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  {item.label}
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }
)

DropdownMenu.displayName = 'DropdownMenu'
