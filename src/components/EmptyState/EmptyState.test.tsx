import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { EmptyState } from './EmptyState'

describe('EmptyState', () => {
  it('renders the title', () => {
    render(<EmptyState title="No results" />)
    expect(screen.getByText('No results')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<EmptyState title="Empty" description="Try adjusting your search" />)
    expect(screen.getByText('Try adjusting your search')).toBeInTheDocument()
  })

  it('does not render description when omitted', () => {
    render(<EmptyState title="Empty" />)
    expect(screen.queryByText(/adjusting/)).not.toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    render(
      <EmptyState
        title="Empty"
        icon={<svg data-testid="test-icon" />}
      />
    )
    expect(screen.getByTestId('test-icon')).toBeInTheDocument()
  })

  it('does not render icon wrapper when icon is omitted', () => {
    const { container } = render(<EmptyState title="Empty" />)
    // No icon wrapper div present
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeInTheDocument()
  })

  it('renders action slot', () => {
    render(
      <EmptyState
        title="Empty"
        action={<button>Take action</button>}
      />
    )
    expect(screen.getByRole('button', { name: 'Take action' })).toBeInTheDocument()
  })

  it('action button is clickable', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(
      <EmptyState
        title="Empty"
        action={<button onClick={onClick}>Take action</button>}
      />
    )
    await user.click(screen.getByRole('button', { name: 'Take action' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('has role="region" with aria-label matching title', () => {
    render(<EmptyState title="No orders found" />)
    expect(
      screen.getByRole('region', { name: 'No orders found' })
    ).toBeInTheDocument()
  })

  it('applies sm size classes', () => {
    const { container } = render(<EmptyState title="Empty" size="sm" />)
    expect(container.firstChild).toHaveClass('py-6')
  })

  it('applies lg size classes', () => {
    const { container } = render(<EmptyState title="Empty" size="lg" />)
    expect(container.firstChild).toHaveClass('py-16')
  })

  it('applies custom className', () => {
    const { container } = render(
      <EmptyState title="Empty" className="custom-class" />
    )
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
