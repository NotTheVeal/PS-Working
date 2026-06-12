import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Banner } from './Banner'

describe('Banner', () => {
  it('renders children', () => {
    render(<Banner>Alert message</Banner>)
    expect(screen.getByText('Alert message')).toBeInTheDocument()
  })

  it('renders title when provided', () => {
    render(<Banner title="Important">Details here</Banner>)
    expect(screen.getByText('Important')).toBeInTheDocument()
  })

  it('has role=alert', () => {
    render(<Banner>Message</Banner>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('uses aria-live=assertive for error variant', () => {
    render(<Banner variant="error">Error</Banner>)
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive')
  })

  it('uses aria-live=polite for non-error variants', () => {
    render(<Banner variant="info">Info</Banner>)
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'polite')
  })

  it('renders dismiss button when onDismiss is provided', () => {
    render(<Banner onDismiss={() => {}}>Message</Banner>)
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument()
  })

  it('calls onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<Banner onDismiss={onDismiss}>Message</Banner>)
    await user.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('does not render dismiss button when onDismiss is not provided', () => {
    render(<Banner>Message</Banner>)
    expect(screen.queryByRole('button', { name: 'Dismiss' })).not.toBeInTheDocument()
  })

  it('renders action slot', () => {
    render(<Banner action={<button>Retry</button>}>Message</Banner>)
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Banner ref={ref}>Message</Banner>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('renders all variants without crashing', () => {
    const variants = ['info', 'success', 'warning', 'error', 'neutral'] as const
    variants.forEach((variant) => {
      const { unmount } = render(<Banner variant={variant}>Message</Banner>)
      expect(screen.getByRole('alert')).toBeInTheDocument()
      unmount()
    })
  })
})
