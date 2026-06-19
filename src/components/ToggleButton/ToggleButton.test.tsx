import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ToggleButton } from './ToggleButton'

describe('ToggleButton', () => {
  it('renders with children', () => {
    render(<ToggleButton>Bold</ToggleButton>)
    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument()
  })

  it('has aria-pressed="false" by default', () => {
    render(<ToggleButton>Toggle</ToggleButton>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('reflects controlled pressed=true via aria-pressed', () => {
    render(<ToggleButton pressed={true}>Toggle</ToggleButton>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('reflects controlled pressed=false via aria-pressed', () => {
    render(<ToggleButton pressed={false}>Toggle</ToggleButton>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })

  it('toggles internal state when uncontrolled', async () => {
    const user = userEvent.setup()
    render(<ToggleButton>Toggle</ToggleButton>)
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-pressed', 'false')
    await user.click(btn)
    expect(btn).toHaveAttribute('aria-pressed', 'true')
    await user.click(btn)
    expect(btn).toHaveAttribute('aria-pressed', 'false')
  })

  it('uses defaultPressed for initial uncontrolled state', () => {
    render(<ToggleButton defaultPressed={true}>Toggle</ToggleButton>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('calls onChange with next pressed state', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<ToggleButton onChange={onChange}>Toggle</ToggleButton>)
    await user.click(screen.getByRole('button'))
    expect(onChange).toHaveBeenCalledWith(true)
    await user.click(screen.getByRole('button'))
    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('does not change internal state in controlled mode', async () => {
    const user = userEvent.setup()
    render(<ToggleButton pressed={false} onChange={vi.fn()}>Toggle</ToggleButton>)
    const btn = screen.getByRole('button')
    await user.click(btn)
    // Still false because parent controls it
    expect(btn).toHaveAttribute('aria-pressed', 'false')
  })

  it('calls onChange with correct value in controlled mode', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<ToggleButton pressed={false} onChange={onChange}>Toggle</ToggleButton>)
    await user.click(screen.getByRole('button'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('toggles with Space key (native button behavior)', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<ToggleButton onChange={onChange}>Toggle</ToggleButton>)
    screen.getByRole('button').focus()
    await user.keyboard(' ')
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('toggles with Enter key', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<ToggleButton onChange={onChange}>Toggle</ToggleButton>)
    screen.getByRole('button').focus()
    await user.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('is disabled when disabled prop is set', () => {
    render(<ToggleButton disabled>Toggle</ToggleButton>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('does not call onChange when disabled', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<ToggleButton disabled onChange={onChange}>Toggle</ToggleButton>)
    await user.click(screen.getByRole('button'))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('applies pressed styles for default variant when pressed', () => {
    render(<ToggleButton pressed variant="default">Toggle</ToggleButton>)
    expect(screen.getByRole('button')).toHaveClass('bg-[#1a56b0]', 'text-white')
  })

  it('applies pressed styles for outline variant when pressed', () => {
    render(<ToggleButton pressed variant="outline">Toggle</ToggleButton>)
    expect(screen.getByRole('button')).toHaveClass('border-[#1a56b0]', 'text-[#1a56b0]')
  })

  it('forwards ref to the button element', () => {
    const ref = { current: null }
    render(<ToggleButton ref={ref}>Toggle</ToggleButton>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('passes additional HTML attributes to the button', () => {
    render(<ToggleButton data-testid="toggle-btn">Toggle</ToggleButton>)
    expect(screen.getByTestId('toggle-btn')).toBeInTheDocument()
  })

  it('merges custom className', () => {
    render(<ToggleButton className="my-class">Toggle</ToggleButton>)
    expect(screen.getByRole('button')).toHaveClass('my-class')
  })
})
