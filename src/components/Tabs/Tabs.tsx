import * as React from 'react'
import { cn } from '@/lib/cn'

// ─── Tabs context ──────────────────────────────────────────────────────────────

interface TabsContextValue {
  activeTab: string
  setActiveTab: (id: string) => void
  orientation: 'horizontal' | 'vertical'
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const ctx = React.useContext(TabsContext)
  if (!ctx) throw new Error('Tabs sub-components must be used inside <Tabs>')
  return ctx
}

// ─── Tabs root ─────────────────────────────────────────────────────────────────

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The tab id that is active by default */
  defaultTab?: string
  /** Controlled active tab */
  activeTab?: string
  onTabChange?: (tabId: string) => void
  orientation?: 'horizontal' | 'vertical'
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ defaultTab, activeTab: controlledTab, onTabChange, orientation = 'horizontal', className, children, ...props }, ref) => {
    const [internalTab, setInternalTab] = React.useState(defaultTab ?? '')

    const active = controlledTab ?? internalTab
    const setActiveTab = React.useCallback((id: string) => {
      if (!controlledTab) setInternalTab(id)
      onTabChange?.(id)
    }, [controlledTab, onTabChange])

    return (
      <TabsContext.Provider value={{ activeTab: active, setActiveTab, orientation }}>
        <div
          ref={ref}
          className={cn(orientation === 'vertical' && 'flex gap-6', className)}
          {...props}
        >
          {children}
        </div>
      </TabsContext.Provider>
    )
  }
)
Tabs.displayName = 'Tabs'

// ─── TabList ───────────────────────────────────────────────────────────────────

export const TabList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const { orientation } = useTabsContext()
    return (
      <div
        ref={ref}
        role="tablist"
        aria-orientation={orientation}
        className={cn(
          orientation === 'horizontal'
            ? 'flex border-b border-[#e0ddd6] gap-0'
            : 'flex flex-col border-r border-[#e0ddd6] gap-0 shrink-0 w-44',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
TabList.displayName = 'TabList'

// ─── Tab trigger ───────────────────────────────────────────────────────────────

export interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Must match the id on the corresponding TabPanel */
  tabId: string
  icon?: React.ReactNode
}

export const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  ({ tabId, icon, className, children, ...props }, ref) => {
    const { activeTab, setActiveTab, orientation } = useTabsContext()
    const isActive = activeTab === tabId

    function handleKeyDown(e: React.KeyboardEvent) {
      const list = (e.currentTarget as HTMLElement).closest('[role="tablist"]')
      const tabs = list ? Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]')) : []
      const idx  = tabs.indexOf(e.currentTarget as HTMLElement)
      const next = orientation === 'horizontal'
        ? { ArrowRight: 1, ArrowLeft: -1 }
        : { ArrowDown: 1, ArrowUp: -1 }
      const delta = (next as Record<string, number>)[e.key]
      if (delta !== undefined) {
        e.preventDefault()
        const target = tabs[(idx + delta + tabs.length) % tabs.length]
        target?.focus()
        target?.click()
      }
    }

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={`tab-${tabId}`}
        aria-selected={isActive}
        aria-controls={`panel-${tabId}`}
        tabIndex={isActive ? 0 : -1}
        onClick={() => setActiveTab(tabId)}
        onKeyDown={handleKeyDown}
        className={cn(
          'inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-inset',
          orientation === 'horizontal'
            ? [
                'px-4 py-2.5 border-b-2 -mb-px',
                isActive
                  ? 'border-[#1a56b0] text-[#1a56b0]'
                  : 'border-transparent text-[#6b6b6b] hover:text-[#1a1a1a] hover:border-[#d0cdc5]',
              ]
            : [
                'px-3 py-2 rounded-lg text-left w-full',
                isActive
                  ? 'bg-[#e8f0fe] text-[#1a56b0]'
                  : 'text-[#6b6b6b] hover:text-[#1a1a1a] hover:bg-[#f0ede8]',
              ],
          className
        )}
        {...props}
      >
        {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
        {children}
      </button>
    )
  }
)
Tab.displayName = 'Tab'

// ─── TabPanels ─────────────────────────────────────────────────────────────────

export const TabPanels = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('flex-1 min-w-0', className)} {...props}>
      {children}
    </div>
  )
)
TabPanels.displayName = 'TabPanels'

// ─── TabPanel ──────────────────────────────────────────────────────────────────

export interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  tabId: string
}

export const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(
  ({ tabId, className, children, ...props }, ref) => {
    const { activeTab } = useTabsContext()
    const isActive = activeTab === tabId
    return (
      <div
        ref={ref}
        id={`panel-${tabId}`}
        role="tabpanel"
        aria-labelledby={`tab-${tabId}`}
        hidden={!isActive}
        tabIndex={0}
        className={cn('focus-visible:outline-none', isActive && 'pt-4', className)}
        {...props}
      >
        {isActive && children}
      </div>
    )
  }
)
TabPanel.displayName = 'TabPanel'
