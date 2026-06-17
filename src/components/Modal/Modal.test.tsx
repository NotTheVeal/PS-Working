import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Modal } from './Modal'

const defaultProps = {
  open: true,
  onClose: vi.fn(),
  title: 'Test dialog',
}

describe('Modal', () => {
  it('renders nothing when open is false', () => {
    render(<Modal {...defaultProps} open={false}>Content</Modal>)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the dialog when open is true', () => {
    render(<Modal {...defaultProps}>Content</Modal>)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders the title', () => {
    render(<Modal {...defaultProps}>Content</Modal>)
    expect(screen.getByText('Test dialog')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<Modal {...defaultProps} description="Subtitle text">Content</Modal>)
    expect(screen.getByText('Subtitle text')).toBeInTheDocument()
  })

  it('has aria-modal=true', () => {
    render(<Modal {...defaultProps}>Content</Modal>)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('is labelled by the title', () => {
    render(<Modal {...defaultProps}>Content</Modal>)
    const dialog = screen.getByRole('dialog')
    const titleId = screen.getByText('Test dialog').id
    expect(dialog).toHaveAttribute('aria-labelledby', titleId)
  })

  it('renders children in the body', () => {
    render(<Modal {...defaultProps}>Body content</Modal>)
    expect(screen.getByText('Body content')).toBeInTheDocument()
  })

  it('renders footer slot', () => {
    render(
      <Modal {...defaultProps} footer={<button>Confirm</button>}>Content</Modal>
    )
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Modal {...defaultProps} onClose={onClose}>Content</Modal>)
    await user.click(screen.getByRole('button', { name: 'Close dialog' }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when Escape key is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Modal {...defaultProps} onClose={onClose}>Content</Modal>)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose on Escape when persistent', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Modal {...defaultProps} onClose={onClose} persistent>Content</Modal>)
    await user.keyboard('{Escape}')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { container } = render(<Modal {...defaultProps} onClose={onClose}>Content</Modal>)
    const backdrop = container.querySelector('[aria-hidden="true"]') as HTMLElement
    await user.click(backdrop)
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
