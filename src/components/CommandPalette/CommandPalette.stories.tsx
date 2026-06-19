import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { CommandPalette, type CommandItem } from './CommandPalette'

// ---------------------------------------------------------------------------
// Sample icons
// ---------------------------------------------------------------------------

const HomeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
)

const SettingsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
)

const UserIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

// ---------------------------------------------------------------------------
// Sample data
// ---------------------------------------------------------------------------

const sampleItems: CommandItem[] = [
  {
    id: 'home',
    label: 'Go to Dashboard',
    description: 'Navigate to the main dashboard',
    icon: <HomeIcon />,
    group: 'Navigation',
    onSelect: () => alert('Dashboard'),
    keywords: ['home', 'main', 'overview'],
  },
  {
    id: 'profile',
    label: 'View Profile',
    description: 'Open your user profile',
    icon: <UserIcon />,
    group: 'Navigation',
    onSelect: () => alert('Profile'),
    keywords: ['account', 'me'],
  },
  {
    id: 'settings',
    label: 'Open Settings',
    description: 'Manage application settings',
    icon: <SettingsIcon />,
    group: 'Navigation',
    onSelect: () => alert('Settings'),
    keywords: ['preferences', 'config'],
  },
  {
    id: 'new-order',
    label: 'Create New Order',
    description: 'Start a new purchase order',
    group: 'Actions',
    onSelect: () => alert('New order'),
    keywords: ['order', 'purchase', 'buy'],
  },
  {
    id: 'export',
    label: 'Export Data',
    description: 'Download a CSV export',
    group: 'Actions',
    onSelect: () => alert('Export'),
    keywords: ['csv', 'download', 'report'],
  },
  {
    id: 'help',
    label: 'Open Help Center',
    group: 'Support',
    onSelect: () => alert('Help'),
    keywords: ['docs', 'support', 'faq'],
  },
]

// ---------------------------------------------------------------------------
// Wrapper for interactive stories
// ---------------------------------------------------------------------------

function CommandPaletteDemo({ items = sampleItems }: { items?: CommandItem[] }) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="p-8 bg-[#f0ede8] min-h-[300px] flex flex-col items-center justify-center gap-4">
      <p className="text-sm text-[#1a1a1a]/60">Press <kbd className="font-mono text-xs bg-white border border-[#e0ddd6] rounded px-1 py-0.5">⌘K</kbd> or click the button</p>
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-[#1a56b0] text-white rounded-lg text-sm font-medium hover:bg-[#1446a0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1"
      >
        Open Command Palette
      </button>
      <CommandPalette open={open} onClose={() => setOpen(false)} items={items} />
    </div>
  )
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: 'PS Design Library/Overlay/CommandPalette',
  component: CommandPalette,
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs'],
  argTypes: {
    open:        { control: 'boolean' },
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof CommandPalette>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Interactive: Story = {
  render: () => <CommandPaletteDemo />,
}

export const OpenByDefault: Story = {
  args: {
    open: true,
    items: sampleItems,
    onClose: () => {},
  },
}

export const CustomPlaceholder: Story = {
  args: {
    open: true,
    items: sampleItems,
    placeholder: 'Type a command or search…',
    onClose: () => {},
  },
}

export const EmptyState: Story = {
  args: {
    open: true,
    items: [],
    onClose: () => {},
  },
}

export const NoGroups: Story = {
  args: {
    open: true,
    items: sampleItems.map(({ group: _group, ...item }) => item),
    onClose: () => {},
  },
}
