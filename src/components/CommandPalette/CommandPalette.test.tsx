import * as React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { CommandPalette, type CommandItem } from './CommandPalette'

const makeItems = (overrides: Partial<CommandItem>[] = []): CommandItem[] => [
  {
    id: 'home',
    label: 'Go to Dashboard',
    description: 'Main overview',
    group: 'Navigation',
    onSelect: vi.fn(),
    keywords: ['main', 'home'],
  },
  {
    id: 'settings',
    label: 'Open Settings',
    description: 'Preferences',
    group: 'Navigation',
    onSelect: vi.fn(),
  },
  {
    id: 'export',
    label: 'Export Data',
    group: 'Actions',
    onSelect: vi.fn(),
    keywords: ['csv', 'download'],
  },
  ...overrides.map((o, i) => ({
    id: `extra-${i}`,
    label: `Extra ${i}`,
    onSelect: vi.fn(),
    ...o,
  })),
]

describe('CommandPalette', () => {
  it('renders nothing when closed', () => {
    render(<CommandPalette open={false} onClose={vi.fn()} items={makeItems()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders dialog when open', () => {
    render(<CommandPalette open={true} onClose={vi.fn()} items={makeItems()} />)
    expect(screen.getByRole('dialog', { name: 'Command palette' })).toBeInTheDocument()
  })

  it('has aria-modal on the dialog', () => {
    render(<CommandPalette open={true} onClose={vi.fn()} items={makeItems()} />)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('renders the search input with combobox role', () => {
    render(<CommandPalette open={true} onClose={vi.fn()} items={makeItems()} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('renders all items in the listbox', () => {
    render(<CommandPalette open={true} onClose={vi.fn()} items={makeItems()} />)
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getAllByRole('option').length).toBe(3) // excludes separator/group header
  })

  it('filters items by label on input', async () => {
    const user = userEvent.setup()
    render(<CommandPalette open={true} onClose={vi.fn()} items={makeItems()} />)
    await user.type(screen.getByRole('combobox'), 'export')
    expect(screen.getAllByRole('option').length).toBe(1)
    expect(screen.getByText('Export Data')).toBeInTheDocument()
  })

  it('filters items by keyword', async () => {
    const user = userEvent.setup()
    render(<CommandPalette open={true} onClose={vi.fn()} items={makeItems()} />)
    await user.type(screen.getByRole('combobox'), 'csv')
    expect(screen.getByText('Export Data')).toBeInTheDocument()
  })

  it('filters items by description', async () => {
    const user = userEvent.setup()
    render(<CommandPalette open={true} onClose={vi.fn()} items={makeItems()} />)
    await user.type(screen.getByRole('combobox'), 'Main overview')
    expect(screen.getByText('Go to Dashboard')).toBeInTheDocument()
    expect(screen.queryByText('Export Data')).not.toBeInTheDocument()
  })

  it('shows no results message when filter returns empty', async () => {
    const user = userEvent.setup()
    render(<CommandPalette open={true} onClose={vi.fn()} items={makeItems()} />)
    await user.type(screen.getByRole('combobox'), 'zzznomatch')
    expect(screen.getByText('No results found')).toBeInTheDocument()
  })

  it('calls onClose when Escape is pressed', async () => {
    const onClose = vi.fn()
    const user = userEvent.setup()
    render(<CommandPalette open={true} onClose={onClose} items={makeItems()} />)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onSelect and onClose when Enter is pressed on active item', async () => {
    const onClose = vi.fn()
    const items = makeItems()
    const user = userEvent.setup()
    render(<CommandPalette open={true} onClose={onClose} items={items} />)
    await user.keyboard('{Enter}')
    expect(items[0].onSelect).toHaveBeenCalledOnce()
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('moves selection down with ArrowDown', async () => {
    const user = userEvent.setup()
    render(<CommandPalette open={true} onClose={vi.fn()} items={makeItems()} />)
    await user.keyboard('{ArrowDown}')
    const options = screen.getAllByRole('option')
    expect(options[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('moves selection up with ArrowUp and wraps', async () => {
    const user = userEvent.setup()
    render(<CommandPalette open={true} onClose={vi.fn()} items={makeItems()} />)
    await user.keyboard('{ArrowUp}')
    const options = screen.getAllByRole('option')
    // wraps to last
    expect(options[options.length - 1]).toHaveAttribute('aria-selected', 'true')
  })

  it('calls onSelect when item is clicked', async () => {
    const items = makeItems()
    const user = userEvent.setup()
    render(<CommandPalette open={true} onClose={vi.fn()} items={items} />)
    await user.click(screen.getByText('Export Data'))
    expect(items[2].onSelect).toHaveBeenCalledOnce()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn()
    render(<CommandPalette open={true} onClose={onClose} items={makeItems()} />)
    // The backdrop is the outermost fixed div
    const backdrop = screen.getByRole('dialog').parentElement!
    fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('renders group labels', () => {
    render(<CommandPalette open={true} onClose={vi.fn()} items={makeItems()} />)
    expect(screen.getByText('Navigation')).toBeInTheDocument()
    expect(screen.getByText('Actions')).toBeInTheDocument()
  })

  it('renders item descriptions', () => {
    render(<CommandPalette open={true} onClose={vi.fn()} items={makeItems()} />)
    expect(screen.getByText('Main overview')).toBeInTheDocument()
  })

  it('uses custom placeholder', () => {
    render(
      <CommandPalette open={true} onClose={vi.fn()} items={makeItems()} placeholder="Type to search…" />
    )
    expect(screen.getByPlaceholderText('Type to search…')).toBeInTheDocument()
  })
})
