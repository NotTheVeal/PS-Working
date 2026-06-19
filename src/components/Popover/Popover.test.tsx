import * as React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Popover } from './Popover'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function renderPopover(props: Partial<React.ComponentProps<typeof Popover>> = {}) {
  return render(
    <Popover trigger={<button type="button">Open</button>} {...props}>
      {props.children ?? <p>Popover content</p>}
    </Popover>,
  )
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('Popover', () => {
  it('renders the trigger', () => {
    renderPopover()
    expect(screen.getByRole('button', { name: 'Open' })).toBeInTheDocument()
  })

  it('does not render panel by default', () => {
    renderPopover()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('opens the panel when trigger is clicked', async () => {
    const user = userEvent.setup()
    renderPopover()
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Popover content')).toBeInTheDocument()
  })

  it('closes the panel when Escape is pressed', async () => {
    const user = userEvent.setup()
    renderPopover()
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes the panel when clicking outside', async () => {
    const user = userEvent.setup()
    render(
      <div>
        <Popover trigger={<button type="button">Open</button>}>
          <p>Popover content</p>
        </Popover>
        <button type="button">Outside</button>
      </div>,
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Outside' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders title inside the panel when provided', async () => {
    const user = userEvent.setup()
    renderPopover({ title: 'Popover Title' })
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByText('Popover Title')).toBeInTheDocument()
  })

  it('sets aria-labelledby on dialog pointing to title element', async () => {
    const user = userEvent.setup()
    renderPopover({ title: 'My Title' })
    await user.click(screen.getByRole('button', { name: 'Open' }))
    const dialog = screen.getByRole('dialog')
    const labelledById = dialog.getAttribute('aria-labelledby')
    expect(labelledById).toBeTruthy()
    const titleEl = document.getElementById(labelledById!)
    expect(titleEl?.textContent).toBe('My Title')
  })

  it('does not set aria-labelledby when no title provided', async () => {
    const user = userEvent.setup()
    renderPopover()
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('dialog')).not.toHaveAttribute('aria-labelledby')
  })

  it('trigger wrapper has aria-haspopup="dialog" and aria-expanded', async () => {
    const user = userEvent.setup()
    renderPopover()
    const trigger = screen.getByRole('button', { name: 'Open' })
    const wrapper = trigger.parentElement!
    expect(wrapper).toHaveAttribute('aria-haspopup', 'dialog')
    expect(wrapper).toHaveAttribute('aria-expanded', 'false')
    await user.click(trigger)
    expect(wrapper).toHaveAttribute('aria-expanded', 'true')
  })

  it('moves focus into the panel on open', async () => {
    const user = userEvent.setup()
    render(
      <Popover trigger={<button type="button">Open</button>}>
        <button type="button">Focusable inside</button>
      </Popover>,
    )
    await user.click(screen.getByRole('button', { name: 'Open' }))
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Focusable inside' }))
    })
  })

  describe('controlled mode', () => {
    it('respects controlled open=true prop', () => {
      renderPopover({ open: true })
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('respects controlled open=false prop', () => {
      renderPopover({ open: false })
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('calls onOpenChange when trigger is clicked in controlled mode', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()
      renderPopover({ open: false, onOpenChange })
      await user.click(screen.getByRole('button', { name: 'Open' }))
      expect(onOpenChange).toHaveBeenCalledWith(true)
    })

    it('calls onOpenChange(false) when Escape is pressed in controlled mode', async () => {
      const user = userEvent.setup()
      const onOpenChange = vi.fn()
      renderPopover({ open: true, onOpenChange })
      await user.keyboard('{Escape}')
      expect(onOpenChange).toHaveBeenCalledWith(false)
    })
  })

  it('opens with defaultOpen=true in uncontrolled mode', () => {
    renderPopover({ defaultOpen: true })
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('toggles closed when trigger is clicked while open', async () => {
    const user = userEvent.setup()
    renderPopover()
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Open' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
