import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Divider } from './Divider'

describe('Divider', () => {
  it('renders with role="separator"', () => {
    render(<Divider />)
    expect(screen.getByRole('separator')).toBeInTheDocument()
  })

  it('defaults to horizontal orientation', () => {
    render(<Divider />)
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('renders vertical orientation', () => {
    render(<Divider orientation="vertical" />)
    const el = screen.getByRole('separator')
    expect(el).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('vertical divider has width and self-stretch classes', () => {
    render(<Divider orientation="vertical" />)
    const el = screen.getByRole('separator')
    expect(el).toHaveClass('w-px', 'self-stretch', 'bg-[#e0ddd6]')
  })

  it('horizontal divider without label has border-t', () => {
    render(<Divider />)
    const el = screen.getByRole('separator')
    expect(el).toHaveClass('border-t')
  })

  it('renders a label when provided', () => {
    render(<Divider label="or" />)
    expect(screen.getByText('or')).toBeInTheDocument()
  })

  it('label is accessible via aria-label on the separator', () => {
    render(<Divider label="Continue" />)
    expect(screen.getByRole('separator')).toHaveAttribute('aria-label', 'Continue')
  })

  it('renders two line divs when label is provided', () => {
    render(<Divider label="divider" />)
    const separator = screen.getByRole('separator')
    // The separator is a flex row with two border-t divs and a span
    const divs = separator.querySelectorAll('div')
    expect(divs).toHaveLength(2)
  })

  it('applies solid border style by default', () => {
    render(<Divider />)
    expect(screen.getByRole('separator')).toHaveClass('border-solid')
  })

  it('applies dashed border style', () => {
    render(<Divider variant="dashed" />)
    expect(screen.getByRole('separator')).toHaveClass('border-dashed')
  })

  it('applies dotted border style', () => {
    render(<Divider variant="dotted" />)
    expect(screen.getByRole('separator')).toHaveClass('border-dotted')
  })

  it('applies dashed variant to label line divs', () => {
    render(<Divider label="section" variant="dashed" />)
    const separator = screen.getByRole('separator')
    const lineDivs = separator.querySelectorAll('div')
    lineDivs.forEach((div) => {
      expect(div).toHaveClass('border-dashed')
    })
  })

  it('forwards ref to the root div', () => {
    const ref = { current: null } as React.RefObject<HTMLDivElement>
    render(<Divider ref={ref} />)
    expect(ref.current).not.toBeNull()
    expect(ref.current?.getAttribute('role')).toBe('separator')
  })

  it('accepts custom className', () => {
    render(<Divider className="my-custom" />)
    expect(screen.getByRole('separator')).toHaveClass('my-custom')
  })

  it('labelPosition start: left line has a short fixed flex', () => {
    render(<Divider label="Start" labelPosition="start" />)
    const separator = screen.getByRole('separator')
    const leftLine = separator.querySelectorAll('div')[0]
    expect(leftLine).toHaveClass('flex-[0_0_1rem]')
  })

  it('labelPosition end: right line has a short fixed flex', () => {
    render(<Divider label="End" labelPosition="end" />)
    const separator = screen.getByRole('separator')
    const rightLine = separator.querySelectorAll('div')[1]
    expect(rightLine).toHaveClass('flex-[0_0_1rem]')
  })

  it('labelPosition center: both lines are flex-1', () => {
    render(<Divider label="Center" labelPosition="center" />)
    const separator = screen.getByRole('separator')
    const lines = separator.querySelectorAll('div')
    expect(lines[0]).toHaveClass('flex-1')
    expect(lines[1]).toHaveClass('flex-1')
  })
})
