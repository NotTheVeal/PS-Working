import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Drawer } from './Drawer'

function TestDrawer(props: Partial<React.ComponentProps<typeof Drawer>>) {
  return (
    <Drawer open={true} onClose={() => undefined} {...props}>
      <p>Drawer content</p>
    </Drawer>
  )
}

describe('Drawer', () => {
  it('renders with role="dialog"', () => {
    render(<TestDrawer />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('has aria-modal="true"', () => {
    render(<TestDrawer />)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('renders title when provided', () => {
    render(<TestDrawer title="Edit item" />)
    expect(screen.getByText('Edit item')).toBeInTheDocument()
  })

  it('has aria-labelledby pointing to title', () => {
    render(<TestDrawer title="My drawer" />)
    const dialog = screen.getByRole('dialog')
    const titleId = dialog.getAttribute('aria-labelledby')
    expect(titleId).toBeTruthy()
    const titleEl = document.getElementById(titleId!)
    expect(titleEl?.textContent).toBe('My drawer')
  })

  it('renders children', () => {
    render(<TestDrawer />)
    expect(screen.getByText('Drawer content')).toBeInTheDocument()
  })

  it('renders footer when provided', () => {
    render(<TestDrawer footer={<button type="button">Save</button>} />)
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('renders close button with correct aria-label', () => {
    render(<TestDrawer />)
    expect(screen.getByRole('button', { name: 'Close drawer' })).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<TestDrawer onClose={onClose} />)
    await user.click(screen.getByRole('button', { name: 'Close drawer' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape is pressed (non-persistent)', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<TestDrawer onClose={onClose} />)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose on Escape when persistent', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<TestDrawer onClose={onClose} persistent />)
    await user.keyboard('{Escape}')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls onClose when backdrop is clicked (non-persistent)', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<TestDrawer onClose={onClose} />)
    const backdrop = document.querySelector('[aria-hidden="true"]') as HTMLElement
    await user.click(backdrop)
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when backdrop is clicked (persistent)', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<TestDrawer onClose={onClose} persistent />)
    // backdrop has onClick undefined when persistent, so no call
    const backdrop = document.querySelector('[aria-hidden="true"]') as HTMLElement
    await user.click(backdrop)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('forwards ref to the panel element', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(
      <Drawer open={true} onClose={() => undefined} ref={ref}>
        <p>Ref test</p>
      </Drawer>
    )
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('is aria-hidden when closed', () => {
    render(
      <Drawer open={false} onClose={() => undefined}>
        <p>Hidden content</p>
      </Drawer>
    )
    const dialog = document.querySelector('[role="dialog"]')
    expect(dialog).toHaveAttribute('aria-hidden', 'true')
  })
})
