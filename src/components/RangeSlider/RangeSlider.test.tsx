import * as React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { RangeSlider } from './RangeSlider'

describe('RangeSlider', () => {
  it('renders both range inputs', () => {
    render(<RangeSlider label="Price range" />)
    expect(screen.getByRole('slider', { name: 'Minimum value' })).toBeInTheDocument()
    expect(screen.getByRole('slider', { name: 'Maximum value' })).toBeInTheDocument()
  })

  it('renders label', () => {
    render(<RangeSlider label="Price range" />)
    expect(screen.getByText('Price range')).toBeInTheDocument()
  })

  it('renders hint text', () => {
    render(<RangeSlider label="Price" hint="Select a range" />)
    expect(screen.getByText('Select a range')).toBeInTheDocument()
  })

  it('renders error with role=alert and hides hint', () => {
    render(<RangeSlider label="Price" hint="Help text" error="Invalid range" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Invalid range')
    expect(screen.queryByText('Help text')).not.toBeInTheDocument()
  })

  it('sets aria-valuemin, aria-valuemax, aria-valuenow on min slider', () => {
    render(<RangeSlider min={10} max={90} defaultValue={[20, 70]} />)
    const minSlider = screen.getByRole('slider', { name: 'Minimum value' })
    expect(minSlider).toHaveAttribute('aria-valuemin', '10')
    expect(minSlider).toHaveAttribute('aria-valuemax', '90')
    expect(minSlider).toHaveAttribute('aria-valuenow', '20')
  })

  it('sets aria-valuemin, aria-valuemax, aria-valuenow on max slider', () => {
    render(<RangeSlider min={10} max={90} defaultValue={[20, 70]} />)
    const maxSlider = screen.getByRole('slider', { name: 'Maximum value' })
    expect(maxSlider).toHaveAttribute('aria-valuenow', '70')
  })

  it('shows value labels when showValues is true', () => {
    render(<RangeSlider defaultValue={[15, 85]} showValues />)
    // Labels are aria-hidden but still in DOM
    expect(screen.getByText('15')).toBeInTheDocument()
    expect(screen.getByText('85')).toBeInTheDocument()
  })

  it('calls onChange when min slider changes', () => {
    const onChange = vi.fn()
    render(<RangeSlider min={0} max={100} defaultValue={[20, 80]} onChange={onChange} />)
    const minSlider = screen.getByRole('slider', { name: 'Minimum value' })
    // jsdom doesn't propagate keyboard events on range inputs; use fireEvent.change directly
    fireEvent.change(minSlider, { target: { value: '25' } })
    expect(onChange).toHaveBeenCalledWith([25, 80])
  })

  it('calls onChange when max slider changes', () => {
    const onChange = vi.fn()
    render(<RangeSlider min={0} max={100} defaultValue={[20, 80]} onChange={onChange} />)
    const maxSlider = screen.getByRole('slider', { name: 'Maximum value' })
    fireEvent.change(maxSlider, { target: { value: '75' } })
    expect(onChange).toHaveBeenCalledWith([20, 75])
  })

  it('is disabled when disabled prop is set', () => {
    render(<RangeSlider disabled defaultValue={[20, 80]} />)
    const sliders = screen.getAllByRole('slider')
    sliders.forEach((s) => expect(s).toBeDisabled())
  })

  it('forwards ref to the wrapper div', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<RangeSlider ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('links error to slider via aria-describedby', () => {
    render(<RangeSlider label="Price" error="Error message" />)
    const minSlider = screen.getByRole('slider', { name: 'Minimum value' })
    const errorId = minSlider.getAttribute('aria-describedby')
    expect(errorId).toBeTruthy()
    expect(document.getElementById(errorId!)).toHaveTextContent('Error message')
  })

  it('respects min/max scale displayed', () => {
    render(<RangeSlider min={5} max={95} />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('95')).toBeInTheDocument()
  })
})
