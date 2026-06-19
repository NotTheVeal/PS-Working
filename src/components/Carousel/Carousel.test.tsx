import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Carousel } from './Carousel'

const slides = [
  <div key="1">Slide One</div>,
  <div key="2">Slide Two</div>,
  <div key="3">Slide Three</div>,
]

describe('Carousel', () => {
  it('renders the first slide by default', () => {
    render(<Carousel items={slides} />)
    expect(screen.getByText('Slide One')).toBeInTheDocument()
    expect(screen.getByText('Slide Two')).toBeInTheDocument()
    // First slide is visible (aria-hidden false), others hidden
    const slideContainers = screen
      .getAllByRole('tab')
    expect(slideContainers[0]).toHaveAttribute('aria-selected', 'true')
    expect(slideContainers[1]).toHaveAttribute('aria-selected', 'false')
  })

  it('navigates to the next slide when the Next button is clicked', async () => {
    const user = userEvent.setup()
    render(<Carousel items={slides} />)
    const next = screen.getByRole('button', { name: 'Next slide' })
    await user.click(next)
    const dots = screen.getAllByRole('tab')
    expect(dots[1]).toHaveAttribute('aria-selected', 'true')
  })

  it('navigates to the previous slide when the Prev button is clicked', async () => {
    const user = userEvent.setup()
    render(<Carousel items={slides} loop />)
    // go forward first
    const next = screen.getByRole('button', { name: 'Next slide' })
    await user.click(next)
    const prev = screen.getByRole('button', { name: 'Previous slide' })
    await user.click(prev)
    const dots = screen.getAllByRole('tab')
    expect(dots[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('clicking a dot jumps directly to that slide', async () => {
    const user = userEvent.setup()
    render(<Carousel items={slides} />)
    const dots = screen.getAllByRole('tab')
    await user.click(dots[2])
    expect(dots[2]).toHaveAttribute('aria-selected', 'true')
    expect(dots[0]).toHaveAttribute('aria-selected', 'false')
  })

  it('disables the Prev button at the first slide when loop is false', () => {
    render(<Carousel items={slides} loop={false} />)
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled()
  })

  it('disables the Next button at the last slide when loop is false', async () => {
    const user = userEvent.setup()
    render(<Carousel items={slides} loop={false} />)
    const next = screen.getByRole('button', { name: 'Next slide' })
    await user.click(next)
    await user.click(next)
    expect(next).toBeDisabled()
  })

  it('prev/next are not disabled on a looping carousel at boundaries', async () => {
    const user = userEvent.setup()
    render(<Carousel items={slides} loop />)
    expect(screen.getByRole('button', { name: 'Previous slide' })).not.toBeDisabled()
    expect(screen.getByRole('button', { name: 'Next slide' })).not.toBeDisabled()
    // Go to last slide
    const dots = screen.getAllByRole('tab')
    await user.click(dots[2])
    expect(screen.getByRole('button', { name: 'Next slide' })).not.toBeDisabled()
  })

  it('has aria-live="polite" on the slide area', () => {
    render(<Carousel items={slides} />)
    expect(document.querySelector('[aria-live="polite"]')).toBeInTheDocument()
  })

  it('navigates with Left/Right arrow keys', async () => {
    const user = userEvent.setup()
    render(<Carousel items={slides} loop />)
    const region = screen.getByRole('region', { name: 'Carousel' })
    region.focus()
    await user.keyboard('{ArrowRight}')
    const dots = screen.getAllByRole('tab')
    expect(dots[1]).toHaveAttribute('aria-selected', 'true')
    await user.keyboard('{ArrowLeft}')
    expect(dots[0]).toHaveAttribute('aria-selected', 'true')
  })

  it('dots have correct aria-label attributes', () => {
    render(<Carousel items={slides} />)
    const dots = screen.getAllByRole('tab')
    expect(dots[0]).toHaveAttribute('aria-label', 'Slide 1 of 3')
    expect(dots[1]).toHaveAttribute('aria-label', 'Slide 2 of 3')
    expect(dots[2]).toHaveAttribute('aria-label', 'Slide 3 of 3')
  })

  describe('autoPlay', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })
    afterEach(() => {
      vi.useRealTimers()
    })

    it('advances slides automatically when autoPlay is true', () => {
      render(<Carousel items={slides} autoPlay interval={1000} loop />)
      const dots = screen.getAllByRole('tab')
      expect(dots[0]).toHaveAttribute('aria-selected', 'true')
      act(() => { vi.advanceTimersByTime(1000) })
      expect(dots[1]).toHaveAttribute('aria-selected', 'true')
    })

    it('pauses autoPlay on mouseenter and resumes on mouseleave', () => {
      render(<Carousel items={slides} autoPlay interval={1000} loop />)
      const region = screen.getByRole('region', { name: 'Carousel' })
      const dots = screen.getAllByRole('tab')

      fireEvent.mouseEnter(region)
      act(() => { vi.advanceTimersByTime(2000) })
      // Should still be on slide 0 because paused
      expect(dots[0]).toHaveAttribute('aria-selected', 'true')

      fireEvent.mouseLeave(region)
      act(() => { vi.advanceTimersByTime(1000) })
      expect(dots[1]).toHaveAttribute('aria-selected', 'true')
    })

    it('pauses autoPlay on focusin and resumes on focusout', () => {
      render(<Carousel items={slides} autoPlay interval={1000} loop />)
      const region = screen.getByRole('region', { name: 'Carousel' })
      const dots = screen.getAllByRole('tab')

      fireEvent.focusIn(region)
      act(() => { vi.advanceTimersByTime(2000) })
      expect(dots[0]).toHaveAttribute('aria-selected', 'true')

      fireEvent.focusOut(region)
      act(() => { vi.advanceTimersByTime(1000) })
      expect(dots[1]).toHaveAttribute('aria-selected', 'true')
    })
  })
})
