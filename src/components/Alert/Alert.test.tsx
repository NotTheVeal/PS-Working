import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Alert } from './Alert'

describe('Alert', () => {
  it('renders with role="alert"', () => {
    render(<Alert>Test message</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders title when provided', () => {
    render(<Alert title="Alert title">Body text</Alert>)
    expect(screen.getByText('Alert title')).toBeInTheDocument()
  })

  it('renders children', () => {
    render(<Alert>Something happened</Alert>)
    expect(screen.getByText('Something happened')).toBeInTheDocument()
  })

  it('does not render dismiss button when onDismiss is not provided', () => {
    render(<Alert>No dismiss</Alert>)
    expect(screen.queryByRole('button', { name: 'Dismiss alert' })).not.toBeInTheDocument()
  })

  it('renders dismiss button when onDismiss is provided', () => {
    render(<Alert onDismiss={() => undefined}>Dismissible</Alert>)
    expect(screen.getByRole('button', { name: 'Dismiss alert' })).toBeInTheDocument()
  })

  it('calls onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<Alert onDismiss={onDismiss}>Dismiss me</Alert>)
    await user.click(screen.getByRole('button', { name: 'Dismiss alert' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('forwards ref to the div element', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Alert ref={ref}>Ref test</Alert>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('applies custom className', () => {
    render(<Alert className="my-custom-class">Styled</Alert>)
    expect(screen.getByRole('alert')).toHaveClass('my-custom-class')
  })

  it('renders all variants without crashing', () => {
    const variants = ['info', 'success', 'warning', 'error'] as const
    variants.forEach((variant) => {
      const { unmount } = render(
        <Alert variant={variant} title={`${variant} title`}>
          {variant} message
        </Alert>
      )
      expect(screen.getByRole('alert')).toBeInTheDocument()
      unmount()
    })
  })

  it('renders custom icon when provided', () => {
    render(
      <Alert icon={<span data-testid="custom-icon">*</span>}>
        Custom icon alert
      </Alert>
    )
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('spreads extra props onto the alert div', () => {
    render(<Alert data-testid="my-alert">Extra props</Alert>)
    expect(screen.getByTestId('my-alert')).toBeInTheDocument()
  })
})
