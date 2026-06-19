import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Rating } from './Rating'

describe('Rating', () => {
  it('renders the correct number of stars', () => {
    render(<Rating max={5} label="Rating" />)
    const stars = screen.getAllByRole('radio')
    expect(stars).toHaveLength(5)
  })

  it('renders with a custom max', () => {
    render(<Rating max={10} label="Score" />)
    expect(screen.getAllByRole('radio')).toHaveLength(10)
  })

  it('renders hint text', () => {
    render(<Rating label="Rating" hint="Pick a rating" />)
    expect(screen.getByText('Pick a rating')).toBeInTheDocument()
  })

  it('has radiogroup role on container', () => {
    render(<Rating label="Rating" />)
    expect(screen.getByRole('radiogroup')).toBeInTheDocument()
  })

  it('stars have correct aria-label', () => {
    render(<Rating max={3} label="Rating" />)
    expect(screen.getByRole('radio', { name: '1 star' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '2 stars' })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: '3 stars' })).toBeInTheDocument()
  })

  it('sets aria-checked on the selected star', () => {
    render(<Rating defaultValue={3} max={5} label="Rating" />)
    const stars = screen.getAllByRole('radio')
    expect(stars[2]).toHaveAttribute('aria-checked', 'true')
    expect(stars[0]).toHaveAttribute('aria-checked', 'false')
  })

  it('calls onChange when a star is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Rating max={5} onChange={onChange} label="Rating" />)
    await user.click(screen.getByRole('radio', { name: '4 stars' }))
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('updates internal value on click (uncontrolled)', async () => {
    const user = userEvent.setup()
    render(<Rating max={5} label="Rating" />)
    await user.click(screen.getByRole('radio', { name: '3 stars' }))
    expect(screen.getByRole('radio', { name: '3 stars' })).toHaveAttribute('aria-checked', 'true')
  })

  it('navigates with ArrowRight key', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Rating defaultValue={2} max={5} onChange={onChange} label="Rating" />)
    // Focus star 2 (index 1) — it should be the tabbable one since value=2
    const star2 = screen.getByRole('radio', { name: '2 stars' })
    star2.focus()
    await user.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('navigates with ArrowLeft key', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Rating defaultValue={3} max={5} onChange={onChange} label="Rating" />)
    const star3 = screen.getByRole('radio', { name: '3 stars' })
    star3.focus()
    await user.keyboard('{ArrowLeft}')
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('selects with Enter key', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Rating defaultValue={2} max={5} onChange={onChange} label="Rating" />)
    const star2 = screen.getByRole('radio', { name: '2 stars' })
    star2.focus()
    await user.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('does not call onChange when readOnly', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Rating value={3} readOnly onChange={onChange} label="Rating" />)
    await user.click(screen.getByRole('radio', { name: '5 stars' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('stars have tabIndex=-1 in readOnly mode', () => {
    render(<Rating value={3} readOnly max={5} label="Rating" />)
    screen.getAllByRole('radio').forEach((star) => {
      expect(star).toHaveAttribute('tabindex', '-1')
    })
  })

  it('forwards ref to the wrapper div', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Rating ref={ref} label="Rating" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
