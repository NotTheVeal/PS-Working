import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { DropdownMenu } from './DropdownMenu'

const baseItems = [
  { label: 'Edit', onClick: vi.fn() },
  { label: 'Duplicate', onClick: vi.fn() },
  { separator: true, label: '' },
  { label: 'Delete', destructive: true, onClick: vi.fn() },
]

describe('DropdownMenu', () => {
  it('renders the trigger button', () => {
    render(<DropdownMenu trigger="Options" items={baseItems} />)
    expect(screen.getByRole('button', { name: /options/i })).toBeInTheDocument()
  })

  it('does not show menu items initially', () => {
    render(<DropdownMenu trigger="Options" items={baseItems} />)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('opens menu on trigger click', async () => {
    const user = userEvent.setup()
    render(<DropdownMenu trigger="Options" items={baseItems} />)
    await user.click(screen.getByRole('button', { name: /options/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    expect(screen.getByRole('menuitem', { name: 'Edit' })).toBeInTheDocument()
  })

  it('closes menu on second trigger click', async () => {
    const user = userEvent.setup()
    render(<DropdownMenu trigger="Options" items={baseItems} />)
    const trigger = screen.getByRole('button', { name: /options/i })
    await user.click(trigger)
    await user.click(trigger)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('calls onClick and closes menu when item clicked', async () => {
    const onEdit = vi.fn()
    const user = userEvent.setup()
    render(
      <DropdownMenu
        trigger="Options"
        items={[{ label: 'Edit', onClick: onEdit }]}
      />
    )
    await user.click(screen.getByRole('button', { name: /options/i }))
    await user.click(screen.getByRole('menuitem', { name: 'Edit' }))
    expect(onEdit).toHaveBeenCalledTimes(1)
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes menu on Escape key', async () => {
    const user = userEvent.setup()
    render(<DropdownMenu trigger="Options" items={baseItems} />)
    await user.click(screen.getByRole('button', { name: /options/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('closes menu on outside click', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <DropdownMenu trigger="Options" items={baseItems} />
        <button>Outside</button>
      </div>
    )
    await user.click(screen.getByRole('button', { name: /options/i }))
    expect(screen.getByRole('menu')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Outside' }))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('renders destructive items with red text class', async () => {
    const user = userEvent.setup()
    render(<DropdownMenu trigger="Options" items={baseItems} />)
    await user.click(screen.getByRole('button', { name: /options/i }))
    const deleteItem = screen.getByRole('menuitem', { name: 'Delete' })
    expect(deleteItem).toHaveClass('text-red-600')
  })

  it('renders separator as hr with role separator', async () => {
    const user = userEvent.setup()
    render(<DropdownMenu trigger="Options" items={baseItems} />)
    await user.click(screen.getByRole('button', { name: /options/i }))
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('does not open when disabled', async () => {
    const user = userEvent.setup()
    render(<DropdownMenu trigger="Options" items={baseItems} disabled />)
    await user.click(screen.getByRole('button', { name: /options/i }))
    expect(screen.queryByRole('menu')).not.toBeInTheDocument()
  })

  it('has correct ARIA attributes', async () => {
    const user = userEvent.setup()
    render(<DropdownMenu trigger="Options" items={baseItems} />)
    const trigger = screen.getByRole('button', { name: /options/i })
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
    expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await user.click(trigger)
    expect(trigger).toHaveAttribute('aria-expanded', 'true')
  })

  it('navigates items with arrow keys', async () => {
    const user = userEvent.setup()
    render(
      <DropdownMenu
        trigger="Options"
        items={[
          { label: 'Item A', onClick: vi.fn() },
          { label: 'Item B', onClick: vi.fn() },
          { label: 'Item C', onClick: vi.fn() },
        ]}
      />
    )
    await user.click(screen.getByRole('button', { name: /options/i }))
    // First item gets focus on open
    expect(screen.getByRole('menuitem', { name: 'Item A' })).toHaveFocus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('menuitem', { name: 'Item B' })).toHaveFocus()
    await user.keyboard('{ArrowUp}')
    expect(screen.getByRole('menuitem', { name: 'Item A' })).toHaveFocus()
  })

  it('does not call onClick for disabled items', async () => {
    const onDisabled = vi.fn()
    const user = userEvent.setup()
    render(
      <DropdownMenu
        trigger="Options"
        items={[{ label: 'Locked', disabled: true, onClick: onDisabled }]}
      />
    )
    await user.click(screen.getByRole('button', { name: /options/i }))
    const item = screen.getByRole('menuitem', { name: 'Locked' })
    expect(item).toBeDisabled()
  })
})
