import * as React from 'react'
import { cn } from '@/lib/cn'

export interface TreeNode {
  id: string
  label: string
  children?: TreeNode[]
  disabled?: boolean
  icon?: React.ReactNode
  defaultExpanded?: boolean
}

export interface TreeViewProps extends React.HTMLAttributes<HTMLUListElement> {
  nodes: TreeNode[]
  selected?: string
  onSelect?: (id: string) => void
  onExpand?: (id: string, expanded: boolean) => void
}

interface TreeItemProps {
  node: TreeNode
  selected?: string
  onSelect?: (id: string) => void
  onExpand?: (id: string, expanded: boolean) => void
  level: number
  allVisibleIds: React.MutableRefObject<string[]>
  focusedId: string | null
  setFocusedId: (id: string | null) => void
  registerRef: (id: string, el: HTMLLIElement | null) => void
  expandedIds: Set<string>
  toggleExpanded: (id: string) => void
}

function collectVisibleIds(
  nodes: TreeNode[],
  expandedIds: Set<string>,
  result: string[] = []
): string[] {
  for (const node of nodes) {
    if (!node.disabled) result.push(node.id)
    if (node.children && expandedIds.has(node.id)) {
      collectVisibleIds(node.children, expandedIds, result)
    }
  }
  return result
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        'w-4 h-4 shrink-0 text-gray-400 transition-transform duration-150',
        expanded && 'rotate-90'
      )}
    >
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function TreeItem({
  node,
  selected,
  onSelect,
  level,
  allVisibleIds,
  focusedId,
  setFocusedId,
  registerRef,
  expandedIds,
  toggleExpanded,
  onExpand,
}: TreeItemProps) {
  const isExpanded = expandedIds.has(node.id)
  const hasChildren = Boolean(node.children && node.children.length > 0)
  const isSelected = selected === node.id
  const isDisabled = node.disabled === true
  const isFocused = focusedId === node.id

  const itemRef = React.useCallback(
    (el: HTMLLIElement | null) => registerRef(node.id, el),
    [node.id, registerRef]
  )

  function handleKeyDown(e: React.KeyboardEvent<HTMLLIElement>) {
    if (isDisabled) return

    const visibleIds = allVisibleIds.current
    const currentIndex = visibleIds.indexOf(node.id)

    switch (e.key) {
      case 'ArrowRight': {
        e.preventDefault()
        if (hasChildren && !isExpanded) {
          toggleExpanded(node.id)
          onExpand?.(node.id, true)
        } else if (hasChildren && isExpanded && node.children) {
          const firstChild = node.children.find((c) => !c.disabled)
          if (firstChild) setFocusedId(firstChild.id)
        }
        break
      }
      case 'ArrowLeft': {
        e.preventDefault()
        if (hasChildren && isExpanded) {
          toggleExpanded(node.id)
          onExpand?.(node.id, false)
        } else {
          // Move to parent — find via DOM traversal up through group roles
          const el = e.currentTarget
          const parentGroup = el.closest('[role="group"]')
          if (parentGroup) {
            const parentItem = parentGroup.closest('[role="treeitem"]') as HTMLLIElement | null
            if (parentItem) {
              const parentId = parentItem.getAttribute('data-nodeid')
              if (parentId) setFocusedId(parentId)
            }
          }
        }
        break
      }
      case 'ArrowDown': {
        e.preventDefault()
        const next = visibleIds[currentIndex + 1]
        if (next) setFocusedId(next)
        break
      }
      case 'ArrowUp': {
        e.preventDefault()
        const prev = visibleIds[currentIndex - 1]
        if (prev) setFocusedId(prev)
        break
      }
      case 'Enter':
      case ' ': {
        e.preventDefault()
        onSelect?.(node.id)
        break
      }
    }
  }

  function handleClick(e: React.MouseEvent) {
    if (isDisabled) return
    e.stopPropagation()
    onSelect?.(node.id)
    setFocusedId(node.id)
  }

  function handleChevronClick(e: React.MouseEvent) {
    if (isDisabled) return
    e.stopPropagation()
    const next = !isExpanded
    toggleExpanded(node.id)
    onExpand?.(node.id, next)
    setFocusedId(node.id)
  }

  return (
    <li
      ref={itemRef}
      role="treeitem"
      aria-expanded={hasChildren ? isExpanded : undefined}
      aria-selected={isSelected}
      aria-disabled={isDisabled || undefined}
      data-nodeid={node.id}
      tabIndex={isFocused ? 0 : -1}
      onKeyDown={handleKeyDown}
      onClick={handleClick}
      className={cn(
        'outline-none list-none',
        isDisabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <div
        className={cn(
          'flex items-center gap-1 rounded-md px-2 py-1 cursor-pointer select-none text-sm text-[#1a1a1a]',
          'focus-visible:outline-none',
          isSelected && 'bg-[#f0ede8] text-[#1a56b0] font-medium',
          !isSelected && !isDisabled && 'hover:bg-[#f0ede8]/60',
          isFocused && 'ring-2 ring-[#1a56b0] ring-offset-1'
        )}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {hasChildren ? (
          <button
            type="button"
            aria-label={isExpanded ? `Collapse ${node.label}` : `Expand ${node.label}`}
            onClick={handleChevronClick}
            tabIndex={-1}
            className="shrink-0 flex items-center justify-center w-4 h-4 rounded focus:outline-none"
          >
            <ChevronIcon expanded={isExpanded} />
          </button>
        ) : (
          <span className="w-4 shrink-0" aria-hidden="true" />
        )}
        {node.icon && (
          <span className="shrink-0 flex items-center" aria-hidden="true">
            {node.icon}
          </span>
        )}
        <span className="truncate">{node.label}</span>
      </div>

      {hasChildren && isExpanded && node.children && (
        <ul role="group" className="list-none p-0 m-0">
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              selected={selected}
              onSelect={onSelect}
              onExpand={onExpand}
              level={level + 1}
              allVisibleIds={allVisibleIds}
              focusedId={focusedId}
              setFocusedId={setFocusedId}
              registerRef={registerRef}
              expandedIds={expandedIds}
              toggleExpanded={toggleExpanded}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

function buildDefaultExpanded(nodes: TreeNode[], acc: Set<string> = new Set()): Set<string> {
  for (const node of nodes) {
    if (node.defaultExpanded) acc.add(node.id)
    if (node.children) buildDefaultExpanded(node.children, acc)
  }
  return acc
}

export const TreeView = React.forwardRef<HTMLUListElement, TreeViewProps>(
  ({ nodes, selected, onSelect, onExpand, className, ...props }, ref) => {
    const [expandedIds, setExpandedIds] = React.useState<Set<string>>(() =>
      buildDefaultExpanded(nodes)
    )
    const [focusedId, setFocusedId] = React.useState<string | null>(null)

    const allVisibleIds = React.useRef<string[]>([])
    const itemRefs = React.useRef<Map<string, HTMLLIElement>>(new Map())

    allVisibleIds.current = collectVisibleIds(nodes, expandedIds)

    // Keep focus in sync with focusedId
    React.useEffect(() => {
      if (focusedId) {
        const el = itemRefs.current.get(focusedId)
        el?.focus()
      }
    }, [focusedId])

    const toggleExpanded = React.useCallback((id: string) => {
      setExpandedIds((prev) => {
        const next = new Set(prev)
        if (next.has(id)) next.delete(id)
        else next.add(id)
        return next
      })
    }, [])

    const registerRef = React.useCallback((id: string, el: HTMLLIElement | null) => {
      if (el) itemRefs.current.set(id, el)
      else itemRefs.current.delete(id)
    }, [])

    // Set initial focused id to first node
    const handleFocus = () => {
      if (!focusedId && allVisibleIds.current.length > 0) {
        setFocusedId(allVisibleIds.current[0])
      }
    }

    return (
      <ul
        ref={ref}
        role="tree"
        aria-multiselectable={false}
        onFocus={handleFocus}
        className={cn('list-none p-0 m-0', className)}
        {...props}
      >
        {nodes.map((node) => (
          <TreeItem
            key={node.id}
            node={node}
            selected={selected}
            onSelect={onSelect}
            onExpand={onExpand}
            level={0}
            allVisibleIds={allVisibleIds}
            focusedId={focusedId}
            setFocusedId={setFocusedId}
            registerRef={registerRef}
            expandedIds={expandedIds}
            toggleExpanded={toggleExpanded}
          />
        ))}
      </ul>
    )
  }
)

TreeView.displayName = 'TreeView'
