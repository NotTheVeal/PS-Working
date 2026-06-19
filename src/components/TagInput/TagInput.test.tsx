import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TagInput } from './TagInput'

describe('TagInput', () => {
  it('renders with a label', () => {
    render(<TagInput label="Topics" />)
    expect(screen.getByLabelText('Topics')).toBeInTheDocument()
  })

  it('renders defaultValue tags', () => {
    render(<TagInput defaultValue={['react', 'vue']} />)
    expect(screen.getByText('react')).toBeInTheDocument()
    expect(screen.getByText('vue')).toBeInTheDocument()
  })

  it('adds a tag on Enter', async () => {
    const onChange = vi.fn()
    render(<TagInput onChange={onChange} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'typescript')
    await userEvent.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalledWith(['typescript'])
  })

  it('adds a tag on comma', async () => {
    const onChange = vi.fn()
    render(<TagInput onChange={onChange} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'javascript,')
    expect(onChange).toHaveBeenCalledWith(['javascript'])
  })

  it('trims whitespace when adding a tag', async () => {
    const onChange = vi.fn()
    render(<TagInput onChange={onChange} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, '  spaced  ')
    await userEvent.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalledWith(['spaced'])
  })

  it('does not add duplicate tags', async () => {
    const onChange = vi.fn()
    render(<TagInput defaultValue={['react']} onChange={onChange} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'react')
    await userEvent.keyboard('{Enter}')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('does not add empty tags', async () => {
    const onChange = vi.fn()
    render(<TagInput onChange={onChange} />)
    const input = screen.getByRole('textbox')
    await userEvent.keyboard('{Enter}')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('removes a tag via the remove button', async () => {
    const onChange = vi.fn()
    render(<TagInput defaultValue={['alpha', 'beta']} onChange={onChange} />)
    await userEvent.click(screen.getByLabelText('Remove alpha'))
    expect(onChange).toHaveBeenCalledWith(['beta'])
  })

  it('removes last tag on Backspace when input is empty', async () => {
    const onChange = vi.fn()
    render(<TagInput defaultValue={['alpha', 'beta']} onChange={onChange} />)
    const input = screen.getByRole('textbox')
    input.focus()
    await userEvent.keyboard('{Backspace}')
    expect(onChange).toHaveBeenCalledWith(['alpha'])
  })

  it('shows hint text', () => {
    render(<TagInput hint="Press Enter to add" />)
    expect(screen.getByText('Press Enter to add')).toBeInTheDocument()
  })

  it('shows error text and marks input aria-invalid', () => {
    render(<TagInput error="Field is required" />)
    expect(screen.getByText('Field is required')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('disables input when disabled prop is set', () => {
    render(<TagInput disabled />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('disables input when maxTags is reached', () => {
    render(<TagInput defaultValue={['a', 'b', 'c']} maxTags={3} />)
    expect(screen.getByRole('textbox')).toBeDisabled()
  })

  it('calls validate and shows error for invalid tag', async () => {
    const validate = vi.fn(() => 'Not a valid email')
    render(<TagInput validate={validate} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'notanemail')
    await userEvent.keyboard('{Enter}')
    expect(validate).toHaveBeenCalledWith('notanemail')
    expect(await screen.findByText(/"notanemail": Not a valid email/)).toBeInTheDocument()
  })

  it('accepts valid tag when validate returns true', async () => {
    const onChange = vi.fn()
    const validate = vi.fn(() => true as const)
    render(<TagInput validate={validate} onChange={onChange} />)
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'validtag')
    await userEvent.keyboard('{Enter}')
    expect(onChange).toHaveBeenCalledWith(['validtag'])
  })

  it('controlled: value prop drives displayed tags', () => {
    const { rerender } = render(<TagInput value={['one']} />)
    expect(screen.getByText('one')).toBeInTheDocument()
    rerender(<TagInput value={['one', 'two']} />)
    expect(screen.getByText('two')).toBeInTheDocument()
  })

  it('remove button is disabled when TagInput is disabled', () => {
    render(<TagInput defaultValue={['locked']} disabled />)
    expect(screen.getByLabelText('Remove locked')).toBeDisabled()
  })
})
