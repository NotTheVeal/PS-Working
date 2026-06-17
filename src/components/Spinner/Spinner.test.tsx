import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('renders with default label "Loading"', () => {
    render(<Spinner />)
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
  })

  it('renders with custom label', () => {
    render(<Spinner label="Saving changes" />)
    expect(screen.getByRole('status', { name: 'Saving changes' })).toBeInTheDocument()
  })

  it('forwards ref to the svg element', () => {
    const ref = React.createRef<SVGSVGElement>()
    render(<Spinner ref={ref} />)
    expect(ref.current).toBeInstanceOf(SVGSVGElement)
  })

  it('applies custom className', () => {
    const { container } = render(<Spinner className="custom-class" />)
    expect(container.querySelector('svg')).toHaveClass('custom-class')
  })

  it('renders all sizes without crashing', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const
    sizes.forEach((size) => {
      const { unmount } = render(<Spinner size={size} />)
      expect(screen.getByRole('status')).toBeInTheDocument()
      unmount()
    })
  })
})
