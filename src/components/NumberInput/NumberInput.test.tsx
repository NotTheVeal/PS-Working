import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { NumberInput } from './NumberInput'

describe('NumberInput', () => {
  it('renders the input with role spinbutton', () => {
    render(<NumberInput />)
    expect(screen.getByRole('spinbutton')).toBeInTheDocument()
  })

  it('renders a label when provided', () => {
    render(<NumberInput label="Quantity" />)
    expect(screen.getByLabelText('Quantity')).toBeInTheDocument()
  })

  it('renders increment and decrement buttons', () => {
    render(<NumberInput />)
    expect(screen.getByRole('button', { name: 'Increment' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Decrement' })).toBeInTheDocument()
  })

  it('shows defaultValue in uncontrolled mode', () => {
    render(<NumberInput defaultValue={5} />)
    expect(screen.getByRole('spinbutton')).toHaveValue(5)
  })

  it('increments value when increment button is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NumberInput defaultValue={3} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Increment' }))
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('decrements value when decrement button is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NumberInput defaultValue={5} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Decrement' }))
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('disables decrement button at min boundary', () => {
    render(<NumberInput defaultValue={1} min={1} />)
    expect(screen.getByRole('button', { name: 'Decrement' })).toBeDisabled()
  })

  it('disables increment button at max boundary', () => {
    render(<NumberInput defaultValue={10} max={10} />)
    expect(screen.getByRole('button', { name: 'Increment' })).toBeDisabled()
  })

  it('increments with ArrowUp key', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NumberInput defaultValue={2} onChange={onChange} />)
    await user.click(screen.getByRole('spinbutton'))
    await user.keyboard('{ArrowUp}')
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('decrements with ArrowDown key', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NumberInput defaultValue={2} onChange={onChange} />)
    await user.click(screen.getByRole('spinbutton'))
    await user.keyboard('{ArrowDown}')
    expect(onChange).toHaveBeenCalledWith(1)
  })

  it('sets aria-valuemin and aria-valuemax', () => {
    render(<NumberInput min={0} max={100} defaultValue={50} />)
    const input = screen.getByRole('spinbutton')
    expect(input).toHaveAttribute('aria-valuemin', '0')
    expect(input).toHaveAttribute('aria-valuemax', '100')
  })

  it('sets aria-invalid when error is provided', () => {
    render(<NumberInput error="Required" />)
    expect(screen.getByRole('spinbutton')).toHaveAttribute('aria-invalid', 'true')
  })

  it('renders error message', () => {
    render(<NumberInput error="Value too low" />)
    expect(screen.getByText('Value too low')).toBeInTheDocument()
  })

  it('renders hint message', () => {
    render(<NumberInput hint="Enter a number" />)
    expect(screen.getByText('Enter a number')).toBeInTheDocument()
  })

  it('disables all controls when disabled', () => {
    render(<NumberInput disabled defaultValue={5} />)
    expect(screen.getByRole('spinbutton')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Increment' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Decrement' })).toBeDisabled()
  })

  it('forwards ref to the input element', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<NumberInput ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('clamps value to max in controlled mode', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<NumberInput value={9} max={10} step={5} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Increment' }))
    expect(onChange).toHaveBeenCalledWith(10)
  })
})
