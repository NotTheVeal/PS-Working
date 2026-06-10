import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('forwards ref to the button element', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Ref</Button>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('is disabled and aria-busy when loading', () => {
    render(<Button loading>Loading</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    expect(btn).toHaveAttribute('aria-busy', 'true')
  })

  it('does not fire onClick when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(<Button disabled onClick={onClick}>Disabled</Button>)
    await user.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('spreads extra props onto the button element', () => {
    render(<Button data-testid="my-btn">Extra</Button>)
    expect(screen.getByTestId('my-btn')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<Button className="custom-class">Styled</Button>)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('renders all variants without crashing', () => {
    const variants = ['primary', 'secondary', 'ghost', 'danger', 'brand'] as const
    variants.forEach((variant) => {
      const { unmount } = render(<Button variant={variant}>{variant}</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
      unmount()
    })
  })

  it('renders all sizes without crashing', () => {
    const sizes = ['sm', 'md', 'lg'] as const
    sizes.forEach((size) => {
      const { unmount } = render(<Button size={size}>{size}</Button>)
      expect(screen.getByRole('button')).toBeInTheDocument()
      unmount()
    })
  })
})
