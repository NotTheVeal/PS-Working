import { render, screen, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Stepper } from './Stepper'

const steps = [
  { label: 'Cart', description: 'Review items' },
  { label: 'Shipping', description: 'Delivery address' },
  { label: 'Payment', description: 'Card details' },
]

describe('Stepper', () => {
  it('renders as an ordered list with role="list"', () => {
    render(<Stepper steps={steps} currentStep={0} />)
    expect(screen.getByRole('list', { name: 'Progress' })).toBeInTheDocument()
  })

  it('renders the correct number of list items', () => {
    render(<Stepper steps={steps} currentStep={0} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(steps.length)
  })

  it('renders step labels in default variant', () => {
    render(<Stepper steps={steps} currentStep={0} />)
    expect(screen.getByText('Cart')).toBeInTheDocument()
    expect(screen.getByText('Shipping')).toBeInTheDocument()
    expect(screen.getByText('Payment')).toBeInTheDocument()
  })

  it('renders step descriptions when provided', () => {
    render(<Stepper steps={steps} currentStep={0} />)
    expect(screen.getByText('Review items')).toBeInTheDocument()
    expect(screen.getByText('Delivery address')).toBeInTheDocument()
  })

  it('marks current step with aria-current="step"', () => {
    render(<Stepper steps={steps} currentStep={1} />)
    const items = screen.getAllByRole('listitem')
    expect(items[1]).toHaveAttribute('aria-current', 'step')
    expect(items[0]).not.toHaveAttribute('aria-current')
    expect(items[2]).not.toHaveAttribute('aria-current')
  })

  it('shows checkmark for completed steps', () => {
    // completed steps render an SVG checkmark, not a number
    const { container } = render(<Stepper steps={steps} currentStep={2} />)
    // Step 1 (index 0) is completed — its circle should NOT contain "1"
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).queryByText('1')).not.toBeInTheDocument()
    // Step 3 (index 2) is current — shows number
    expect(within(items[2]).getByText('3')).toBeInTheDocument()
  })

  it('shows step numbers for current and upcoming steps', () => {
    render(<Stepper steps={steps} currentStep={0} />)
    const items = screen.getAllByRole('listitem')
    expect(within(items[0]).getByText('1')).toBeInTheDocument()
    expect(within(items[1]).getByText('2')).toBeInTheDocument()
    expect(within(items[2]).getByText('3')).toBeInTheDocument()
  })

  it('all steps completed when currentStep exceeds steps length', () => {
    render(<Stepper steps={steps} currentStep={10} />)
    const items = screen.getAllByRole('listitem')
    // No item should have aria-current
    items.forEach((item) => {
      expect(item).not.toHaveAttribute('aria-current')
    })
    // All labels still visible
    expect(screen.getByText('Cart')).toBeInTheDocument()
  })

  it('renders compact variant without labels', () => {
    render(<Stepper steps={steps} currentStep={1} variant="compact" />)
    // Compact does not render labels
    expect(screen.queryByText('Cart')).not.toBeInTheDocument()
    expect(screen.queryByText('Shipping')).not.toBeInTheDocument()
  })

  it('still marks current step in compact variant', () => {
    render(<Stepper steps={steps} currentStep={1} variant="compact" />)
    const items = screen.getAllByRole('listitem')
    expect(items[1]).toHaveAttribute('aria-current', 'step')
  })

  it('applies custom className', () => {
    const { container } = render(
      <Stepper steps={steps} currentStep={0} className="custom-stepper" />
    )
    expect(container.firstChild).toHaveClass('custom-stepper')
  })
})
