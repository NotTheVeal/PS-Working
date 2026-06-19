import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Stat } from './Stat'

describe('Stat', () => {
  it('renders label and value', () => {
    render(<Stat label="Revenue" value="$1,000" />)
    expect(screen.getByText('Revenue')).toBeInTheDocument()
    expect(screen.getByText('$1,000')).toBeInTheDocument()
  })

  it('sets aria-label combining label and value', () => {
    render(<Stat label="Revenue" value="$1,000" />)
    expect(screen.getByRole('generic', { name: 'Revenue: $1,000' })).toBeInTheDocument()
  })

  it('renders trend up with correct aria-label', () => {
    render(<Stat label="Users" value="100" trend="up" trendLabel="+10%" />)
    expect(screen.getByLabelText('Trending up')).toBeInTheDocument()
    expect(screen.getByText('+10%')).toBeInTheDocument()
  })

  it('renders trend down with correct aria-label', () => {
    render(<Stat label="Churn" value="5%" trend="down" trendLabel="-2%" />)
    expect(screen.getByLabelText('Trending down')).toBeInTheDocument()
  })

  it('renders trend neutral with correct aria-label', () => {
    render(<Stat label="Session" value="4m" trend="neutral" trendLabel="No change" />)
    expect(screen.getByLabelText('No change')).toBeInTheDocument()
  })

  it('does not render trend section when trend is not provided', () => {
    render(<Stat label="Revenue" value="$1,000" />)
    expect(screen.queryByLabelText('Trending up')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Trending down')).not.toBeInTheDocument()
  })

  it('renders icon when provided', () => {
    render(<Stat label="Users" value="50" icon={<svg data-testid="icon" />} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('does not render icon slot when no icon provided', () => {
    const { container } = render(<Stat label="Users" value="50" />)
    // no shrink-0 flex items-center icon wrapper
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBe(0)
  })

  it('renders previousValue when provided without trendLabel', () => {
    render(<Stat label="Revenue" value="$1,200" previousValue="$1,000" trend="up" />)
    expect(screen.getByText('vs $1,000')).toBeInTheDocument()
  })

  it('applies outlined variant classes', () => {
    const { container } = render(<Stat label="A" value="1" variant="outlined" />)
    expect(container.firstChild).toHaveClass('border', 'rounded-xl')
  })

  it('applies filled variant classes', () => {
    const { container } = render(<Stat label="A" value="1" variant="filled" />)
    expect(container.firstChild).toHaveClass('bg-[#f0ede8]', 'rounded-xl')
  })

  it('forwards ref to the root div', () => {
    const ref = { current: null }
    render(<Stat label="A" value="1" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('passes additional HTML attributes to root div', () => {
    render(<Stat label="A" value="1" data-testid="stat-root" />)
    expect(screen.getByTestId('stat-root')).toBeInTheDocument()
  })

  it('merges custom className', () => {
    const { container } = render(<Stat label="A" value="1" className="my-custom-class" />)
    expect(container.firstChild).toHaveClass('my-custom-class')
  })
})
