import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Select } from './Select'

const options = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
]

describe('Select', () => {
  it('renders with a label', () => {
    render(<Select label="Category" options={options} />)
    expect(screen.getByLabelText('Category')).toBeInTheDocument()
  })

  it('forwards ref to the select element', () => {
    const ref = React.createRef<HTMLSelectElement>()
    render(<Select ref={ref} label="Test" options={options} />)
    expect(ref.current).toBeInstanceOf(HTMLSelectElement)
  })

  it('renders all options', () => {
    render(<Select label="Category" options={options} />)
    expect(screen.getByRole('option', { name: 'Option A' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Option B' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Option C' })).toBeInTheDocument()
  })

  it('renders placeholder option', () => {
    render(<Select label="Category" options={options} placeholder="Choose…" />)
    expect(screen.getByRole('option', { name: 'Choose…' })).toBeInTheDocument()
  })

  it('renders hint text', () => {
    render(<Select label="Category" options={options} hint="Select one option" />)
    expect(screen.getByText('Select one option')).toBeInTheDocument()
  })

  it('renders error with role=alert', () => {
    render(<Select label="Category" options={options} error="Required field" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required field')
  })

  it('hides hint when error is present', () => {
    render(<Select label="Category" options={options} hint="Helper" error="Error" />)
    expect(screen.queryByText('Helper')).not.toBeInTheDocument()
  })

  it('sets aria-invalid when error is present', () => {
    render(<Select label="Field" options={options} error="Error" />)
    expect(screen.getByLabelText('Field')).toHaveAttribute('aria-invalid', 'true')
  })

  it('sets aria-required when required', () => {
    render(<Select label="Field" options={options} required />)
    expect(screen.getByLabelText(/Field/)).toHaveAttribute('aria-required', 'true')
  })

  it('is disabled when disabled prop is set', () => {
    render(<Select label="Field" options={options} disabled />)
    expect(screen.getByLabelText('Field')).toBeDisabled()
  })

  it('calls onChange when selection changes', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Select label="Category" options={options} onChange={onChange} />)
    await user.selectOptions(screen.getByLabelText('Category'), 'b')
    expect(onChange).toHaveBeenCalled()
  })

  it('renders native children when no options prop provided', () => {
    render(
      <Select label="Year">
        <option value="2024">2024</option>
        <option value="2023">2023</option>
      </Select>
    )
    expect(screen.getByRole('option', { name: '2024' })).toBeInTheDocument()
  })
})
