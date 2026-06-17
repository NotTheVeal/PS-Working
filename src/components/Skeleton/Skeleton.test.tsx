import * as React from 'react'
import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Skeleton, SkeletonCard, SkeletonTable } from './Skeleton'

describe('Skeleton', () => {
  it('renders with aria-hidden', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true')
  })

  it('applies pulse animation by default', () => {
    const { container } = render(<Skeleton />)
    expect(container.firstChild).toHaveClass('animate-pulse')
  })

  it('does not animate when static=true', () => {
    const { container } = render(<Skeleton static />)
    expect(container.firstChild).not.toHaveClass('animate-pulse')
  })

  it('applies circle shape class', () => {
    const { container } = render(<Skeleton shape="circle" />)
    expect(container.firstChild).toHaveClass('rounded-full')
  })

  it('applies line shape class', () => {
    const { container } = render(<Skeleton shape="line" />)
    expect(container.firstChild).toHaveClass('rounded-md')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Skeleton ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})

describe('SkeletonCard', () => {
  it('renders without crashing', () => {
    const { container } = render(<SkeletonCard />)
    expect(container.firstChild).toBeInTheDocument()
  })
})

describe('SkeletonTable', () => {
  it('renders without crashing', () => {
    const { container } = render(<SkeletonTable rows={3} cols={3} />)
    expect(container.firstChild).toBeInTheDocument()
  })
})
