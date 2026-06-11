import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Input } from './Input'

describe('Input', () => {
  it('renders with a label', () => {
    render(<Input label="Part number" />)
    expect(screen.getByLabelText('Part number')).toBeInTheDocument()
  })

  it('forwards ref to the input element', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Input ref={ref} label="Test" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('renders hint text', () => {
    render(<Input label="Email" hint="Enter your work email" />)
    expect(screen.getByText('Enter your work email')).toBeInTheDocument()
  })

  it('renders error message with role=alert', () => {
    render(<Input label="Email" error="Invalid email address" />)
    const error = screen.getByRole('alert')
    expect(error).toHaveTextContent('Invalid email address')
  })

  it('hides hint when error is present', () => {
    render(<Input label="Email" hint="Helper text" error="Error text" />)
    expect(screen.queryByText('Helper text')).not.toBeInTheDocument()
    expect(screen.getByText('Error text')).toBeInTheDocument()
  })

  it('sets aria-invalid when error is present', () => {
    render(<Input label="Field" error="Required" />)
    expect(screen.getByLabelText('Field')).toHaveAttribute('aria-invalid', 'true')
  })

  it('sets aria-required when required', () => {
    render(<Input label="Field" required />)
    expect(screen.getByLabelText(/Field/)).toHaveAttribute('aria-required', 'true')
  })

  it('is disabled when disabled prop is set', () => {
    render(<Input label="Field" disabled />)
    expect(screen.getByLabelText('Field')).toBeDisabled()
  })

  it('accepts user input', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Input label="Search" onChange={onChange} />)
    await user.type(screen.getByLabelText('Search'), 'AB-1234')
    expect(onChange).toHaveBeenCalled()
  })

  it('hides label visually with hideLabel while keeping it accessible', () => {
    render(<Input label="Search" hideLabel />)
    const label = screen.getByText('Search')
    expect(label).toHaveClass('sr-only')
    // input is still accessible via the hidden label
    expect(screen.getByLabelText('Search')).toBeInTheDocument()
  })

  it('spreads extra props onto the input', () => {
    render(<Input label="Test" data-testid="my-input" />)
    expect(screen.getByTestId('my-input')).toBeInTheDocument()
  })
})
