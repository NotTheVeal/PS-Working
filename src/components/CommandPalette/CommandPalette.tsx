import * as React from 'react'
import { cn } from '@/lib/cn'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CommandItem {
  id: string
  label: string
  description?: string
  icon?: React.ReactNode
  group?: string
  onSelect: () => void
  keywords?: string[]
}

export interface CommandPaletteProps {
  open: boolean
  onClose: () => void
  items: CommandItem[]
  placeholder?: string
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function filterItems(items: CommandItem[], query: string): CommandItem[] {
  if (!query.trim()) return items
  const q = query.toLowerCase()
  return items.filter(
    (item) =>
      item.label.toLowerCase().includes(q) ||
      item.description?.toLowerCase().includes(q) ||
      item.keywords?.some((kw) => kw.toLowerCase().includes(q))
  )
}

function groupItems(items: CommandItem[]): Map<string, CommandItem[]> {
  const map = new Map<string, CommandItem[]>()
  for (const item of items) {
    const group = item.group ?? ''
    const existing = map.get(group)
    if (existing) {
      existing.push(item)
    } else {
      map.set(group, [item])
    }
  }
  return map
}

// ---------------------------------------------------------------------------
// SearchIcon
// ---------------------------------------------------------------------------

const SearchIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="shrink-0"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
)

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const CommandPalette = React.forwardRef<HTMLDivElement, CommandPaletteProps>(
  ({ open, onClose, items, placeholder = 'Search commands…' }, ref) => {
    const [query, setQuery] = React.useState('')
    const [activeIndex, setActiveIndex] = React.useState(0)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const listboxRef = React.useRef<HTMLUListElement>(null)
    const panelRef = React.useRef<HTMLDivElement>(null)

    const filtered = React.useMemo(() => filterItems(items, query), [items, query])
    const grouped = React.useMemo(() => groupItems(filtered), [filtered])

    // Flat ordered list for keyboard navigation
    const flatFiltered = React.useMemo(() => filtered, [filtered])

    // Reset state when opened
    React.useEffect(() => {
      if (open) {
        setQuery('')
        setActiveIndex(0)
        requestAnimationFrame(() => inputRef.current?.focus())
      }
    }, [open])

    // Clamp active index when filtered list changes
    React.useEffect(() => {
      setActiveIndex((prev) => Math.min(prev, Math.max(0, flatFiltered.length - 1)))
    }, [flatFiltered.length])

    // Scroll active item into view
    React.useEffect(() => {
      const list = listboxRef.current
      if (!list) return
      const activeEl = list.querySelector('[aria-selected="true"]')
      if (activeEl && typeof (activeEl as Element & { scrollIntoView?: unknown }).scrollIntoView === 'function') {
        ;(activeEl as Element).scrollIntoView({ block: 'nearest' })
      }
    }, [activeIndex])

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        switch (e.key) {
          case 'ArrowDown': {
            e.preventDefault()
            setActiveIndex((prev) => (flatFiltered.length ? (prev + 1) % flatFiltered.length : 0))
            break
          }
          case 'ArrowUp': {
            e.preventDefault()
            setActiveIndex((prev) =>
              flatFiltered.length ? (prev - 1 + flatFiltered.length) % flatFiltered.length : 0
            )
            break
          }
          case 'Enter': {
            e.preventDefault()
            const item = flatFiltered[activeIndex]
            if (item) {
              item.onSelect()
              onClose()
            }
            break
          }
          case 'Escape': {
            e.preventDefault()
            onClose()
            break
          }
          case 'Tab': {
            // Focus trap: cycle within panel
            const focusableEls = panelRef.current?.querySelectorAll<HTMLElement>(
              'input, button, [tabindex]:not([tabindex="-1"])'
            )
            if (!focusableEls || focusableEls.length === 0) return
            const first = focusableEls[0]
            const last = focusableEls[focusableEls.length - 1]
            if (e.shiftKey) {
              if (document.activeElement === first) {
                e.preventDefault()
                last.focus()
              }
            } else {
              if (document.activeElement === last) {
                e.preventDefault()
                first.focus()
              }
            }
            break
          }
        }
      },
      [flatFiltered, activeIndex, onClose]
    )

    if (!open) return null

    const activeItem = flatFiltered[activeIndex]

    // Build group entries in insertion order
    const groupEntries = Array.from(grouped.entries())

    let flatIndex = 0

    return (
      // Backdrop
      <div
        className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] bg-black/50"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
        aria-hidden="false"
      >
        {/* Panel */}
        <div
          ref={(node) => {
            // Merge forwarded ref + local ref
            panelRef.current = node
            if (typeof ref === 'function') ref(node)
            else if (ref) ref.current = node
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          className="max-w-lg w-full bg-white rounded-xl shadow-2xl overflow-hidden mx-4"
          onKeyDown={handleKeyDown}
        >
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e0ddd6] text-[#1a1a1a]/50">
            <SearchIcon />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded="true"
              aria-controls="command-palette-listbox"
              aria-activedescendant={activeItem ? `cmd-item-${activeItem.id}` : undefined}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setActiveIndex(0)
              }}
              placeholder={placeholder}
              className="flex-1 bg-transparent text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 text-[15px] outline-none"
            />
          </div>

          {/* Results */}
          <ul
            ref={listboxRef}
            id="command-palette-listbox"
            role="listbox"
            aria-label="Commands"
            className="max-h-[360px] overflow-y-auto py-2"
          >
            {filtered.length === 0 && (
              <li
                role="option"
                aria-selected="false"
                className="px-4 py-8 text-center text-[#1a1a1a]/40 text-sm select-none"
              >
                No results found
              </li>
            )}

            {groupEntries.map(([group, groupItems], groupIdx) => {
              const groupContent = (
                <React.Fragment key={group || '__default'}>
                  {/* Group separator (not for first ungrouped block) */}
                  {groupIdx > 0 && (
                    <li role="separator" className="my-1 border-t border-[#e0ddd6]" aria-hidden="true" />
                  )}

                  {/* Group label */}
                  {group && (
                    <li
                      role="presentation"
                      className="px-4 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-[#1a1a1a]/40 select-none"
                    >
                      {group}
                    </li>
                  )}

                  {/* Group items as a named group */}
                  <li role="group" aria-label={group || undefined}>
                    <ul>
                      {groupItems.map((item) => {
                        const itemIndex = flatIndex++
                        const isActive = activeItem?.id === item.id

                        return (
                          <li
                            key={item.id}
                            id={`cmd-item-${item.id}`}
                            role="option"
                            aria-selected={isActive}
                            className={cn(
                              'flex items-center gap-3 px-4 py-2.5 cursor-pointer select-none transition-colors duration-75',
                              isActive
                                ? 'bg-[#1a56b0] text-white'
                                : 'text-[#1a1a1a] hover:bg-[#f0ede8]'
                            )}
                            onMouseEnter={() => setActiveIndex(itemIndex)}
                            onClick={() => {
                              item.onSelect()
                              onClose()
                            }}
                          >
                            {item.icon && (
                              <span
                                aria-hidden="true"
                                className={cn(
                                  'shrink-0 flex items-center justify-center w-7 h-7 rounded-lg text-sm',
                                  isActive ? 'bg-white/20 text-white' : 'bg-[#f0ede8] text-[#1a1a1a]/60'
                                )}
                              >
                                {item.icon}
                              </span>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-[13px] font-medium truncate">{item.label}</div>
                              {item.description && (
                                <div
                                  className={cn(
                                    'text-[11px] truncate mt-0.5',
                                    isActive ? 'text-white/70' : 'text-[#1a1a1a]/50'
                                  )}
                                >
                                  {item.description}
                                </div>
                              )}
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                </React.Fragment>
              )

              return groupContent
            })}
          </ul>

          {/* Footer hint */}
          <div className="flex items-center gap-4 px-4 py-2 border-t border-[#e0ddd6] bg-[#f0ede8]/50 text-[10px] text-[#1a1a1a]/40 select-none">
            <span><kbd className="font-mono">↑↓</kbd> navigate</span>
            <span><kbd className="font-mono">↵</kbd> select</span>
            <span><kbd className="font-mono">esc</kbd> close</span>
          </div>
        </div>
      </div>
    )
  }
)

CommandPalette.displayName = 'CommandPalette'
