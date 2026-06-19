import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { OTPInput } from './OTPInput'

describe('OTPInput', () => {
  // ------------------------------------------------------------------ render
  it('renders the correct number of inputs (default 6)', () => {
    render(<OTPInput />)
    expect(screen.getAllByRole('textbox')).toHaveLength(6)
  })

  it('renders the correct number of inputs when length is set', () => {
    render(<OTPInput length={4} />)
    expect(screen.getAllByRole('textbox')).toHaveLength(4)
  })

  it('labels each input with "Digit N of M"', () => {
    render(<OTPInput length={6} />)
    expect(screen.getByLabelText('Digit 1 of 6')).toBeInTheDocument()
    expect(screen.getByLabelText('Digit 6 of 6')).toBeInTheDocument()
  })

  it('renders a visible label above the group when provided', () => {
    render(<OTPInput label="Enter code" />)
    expect(screen.getByText('Enter code')).toBeInTheDocument()
  })

  it('uses label as aria-label on the group when provided', () => {
    render(<OTPInput label="Enter code" />)
    expect(screen.getByRole('group', { name: 'Enter code' })).toBeInTheDocument()
  })

  it('falls back to "One-time password" aria-label when no label provided', () => {
    render(<OTPInput />)
    expect(screen.getByRole('group', { name: 'One-time password' })).toBeInTheDocument()
  })

  // ------------------------------------------------------------------ typing
  it('typing a character fills the box and advances focus to the next box', async () => {
    const user = userEvent.setup()
    render(<OTPInput length={4} />)
    const [first, second] = screen.getAllByRole('textbox')

    first.focus()
    await user.keyboard('5')

    expect(second).toHaveFocus()
  })

  it('calls onChange with the joined string on every keystroke', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<OTPInput length={4} onChange={onChange} />)

    screen.getAllByRole('textbox')[0].focus()
    await user.keyboard('3')

    expect(onChange).toHaveBeenCalledWith(expect.stringContaining('3'))
  })

  // ------------------------------------------------------------------ onComplete
  it('calls onComplete with full value when all boxes are filled', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<OTPInput length={4} onComplete={onComplete} />)

    screen.getAllByRole('textbox')[0].focus()
    await user.keyboard('1234')

    expect(onComplete).toHaveBeenCalledWith('1234')
  })

  it('does not call onComplete when only some boxes are filled', async () => {
    const user = userEvent.setup()
    const onComplete = vi.fn()
    render(<OTPInput length={4} onComplete={onComplete} />)

    screen.getAllByRole('textbox')[0].focus()
    await user.keyboard('12')

    expect(onComplete).not.toHaveBeenCalled()
  })

  // ------------------------------------------------------------------ backspace
  it('backspace on an empty box moves focus to the previous box', async () => {
    const user = userEvent.setup()
    render(<OTPInput length={4} />)
    const [first, second] = screen.getAllByRole('textbox')

    // Focus second box (which is empty) and press backspace
    second.focus()
    await user.keyboard('{Backspace}')

    expect(first).toHaveFocus()
  })

  it('backspace on a filled box clears that box without moving focus', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<OTPInput length={4} onChange={onChange} />)
    const [first] = screen.getAllByRole('textbox')

    first.focus()
    await user.keyboard('5')
    // move back to first box
    first.focus()
    onChange.mockClear()
    await user.keyboard('{Backspace}')

    // onChange called with a string that has first box empty
    expect(onChange).toHaveBeenCalledWith(expect.stringMatching(/^ /))
  })

  // ------------------------------------------------------------------ paste
  it('paste fills boxes starting at the focused box', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<OTPInput length={6} onChange={onChange} />)

    const inputs = screen.getAllByRole('textbox')
    inputs[0].focus()
    await user.paste('123456')

    expect(onChange).toHaveBeenCalledWith('123456')
  })

  it('paste starting mid-way only fills from that position', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<OTPInput length={6} onChange={onChange} />)

    const inputs = screen.getAllByRole('textbox')
    inputs[2].focus()
    await user.paste('abc')

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0] as string
    expect(lastCall[2]).toBe('a')
    expect(lastCall[3]).toBe('b')
    expect(lastCall[4]).toBe('c')
  })

  // ------------------------------------------------------------------ arrow keys
  it('ArrowRight moves focus to the next box', async () => {
    const user = userEvent.setup()
    render(<OTPInput length={4} />)
    const [first, second] = screen.getAllByRole('textbox')

    first.focus()
    await user.keyboard('{ArrowRight}')

    expect(second).toHaveFocus()
  })

  it('ArrowLeft moves focus to the previous box', async () => {
    const user = userEvent.setup()
    render(<OTPInput length={4} />)
    const [first, second] = screen.getAllByRole('textbox')

    second.focus()
    await user.keyboard('{ArrowLeft}')

    expect(first).toHaveFocus()
  })

  it('ArrowLeft on the first box does not throw', async () => {
    const user = userEvent.setup()
    render(<OTPInput length={4} />)
    const [first] = screen.getAllByRole('textbox')

    first.focus()
    await expect(user.keyboard('{ArrowLeft}')).resolves.toBeUndefined()
    expect(first).toHaveFocus()
  })

  it('ArrowRight on the last box does not throw', async () => {
    const user = userEvent.setup()
    render(<OTPInput length={4} />)
    const inputs = screen.getAllByRole('textbox')
    const last = inputs[inputs.length - 1]

    last.focus()
    await expect(user.keyboard('{ArrowRight}')).resolves.toBeUndefined()
    expect(last).toHaveFocus()
  })

  // ------------------------------------------------------------------ error state
  it('sets aria-invalid on all inputs when error is present', () => {
    render(<OTPInput length={4} error="Invalid code" />)
    const inputs = screen.getAllByRole('textbox')
    inputs.forEach((input) => {
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })
  })

  it('renders the error message with role=alert', () => {
    render(<OTPInput error="The code is wrong" />)
    expect(screen.getByRole('alert')).toHaveTextContent('The code is wrong')
  })

  it('does not render aria-invalid when no error', () => {
    render(<OTPInput length={4} />)
    screen.getAllByRole('textbox').forEach((input) => {
      expect(input).not.toHaveAttribute('aria-invalid')
    })
  })

  // ------------------------------------------------------------------ disabled
  it('disables all inputs when disabled prop is set', () => {
    render(<OTPInput length={4} disabled />)
    screen.getAllByRole('textbox').forEach((input) => {
      expect(input).toBeDisabled()
    })
  })

  // ------------------------------------------------------------------ controlled
  it('pre-fills boxes when a value prop is provided', () => {
    render(<OTPInput length={6} value="123456" />)
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
    expect(inputs[0].value).toBe('1')
    expect(inputs[5].value).toBe('6')
  })

  it('updates displayed value when controlled value prop changes', () => {
    const { rerender } = render(<OTPInput length={4} value="1234" />)
    const inputs = screen.getAllByRole('textbox') as HTMLInputElement[]
    expect(inputs[0].value).toBe('1')

    rerender(<OTPInput length={4} value="5678" />)
    expect(inputs[0].value).toBe('5')
  })

  // ------------------------------------------------------------------ ref
  it('forwards ref to the wrapping group div', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<OTPInput ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current?.getAttribute('role')).toBe('group')
  })
})
