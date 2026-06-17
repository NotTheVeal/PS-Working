import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(<Badge ref={ref}>Ref</Badge>)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })

  it('renders a dot indicator when dot is true', () => {
    const { container } = render(<Badge dot>Online</Badge>)
    expect(container.querySelector('.rounded-full')).toBeInTheDocument()
  })

  it('renders an icon when provided', () => {
    render(<Badge icon={<span data-testid="icon" />}>With icon</Badge>)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('does not render icon when dot is true', () => {
    render(<Badge dot icon={<span data-testid="icon" />}>Status</Badge>)
    expect(screen.queryByTestId('icon')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Badge className="custom">Test</Badge>)
    expect(screen.getByText('Test')).toHaveClass('custom')
  })

  it('spreads extra props', () => {
    render(<Badge data-testid="badge">Test</Badge>)
    expect(screen.getByTestId('badge')).toBeInTheDocument()
  })

  it('renders all variants without crashing', () => {
    const variants = ['default', 'blue', 'green', 'red', 'orange', 'purple', 'neutral'] as const
    variants.forEach((variant) => {
      const { unmount } = render(<Badge variant={variant}>{variant}</Badge>)
      expect(screen.getByText(variant)).toBeInTheDocument()
      unmount()
    })
  })
})
