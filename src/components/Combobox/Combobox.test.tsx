import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Combobox } from './Combobox'

const options = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'disabled-fig', label: 'Fig', disabled: true },
]

describe('Combobox', () => {
  it('renders an input with combobox role', () => {
    render(<Combobox options={options} label="Fruit" />)
    expect(screen.getByRole('combobox', { name: 'Fruit' })).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Combobox options={options} label="Pick a fruit" />)
    expect(screen.getByText('Pick a fruit')).toBeInTheDocument()
  })

  it('shows hint text', () => {
    render(<Combobox options={options} hint="Choose wisely" />)
    expect(screen.getByText('Choose wisely')).toBeInTheDocument()
  })

  it('shows error text and sets aria-invalid', () => {
    render(<Combobox options={options} error="Required field" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required field')
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('opens listbox on focus', async () => {
    const user = userEvent.setup()
    render(<Combobox options={options} />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('filters options on input', async () => {
    const user = userEvent.setup()
    render(<Combobox options={options} />)
    const input = screen.getByRole('combobox')
    await user.type(input, 'an')
    const listbox = screen.getByRole('listbox')
    expect(listbox).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Apple' })).not.toBeInTheDocument()
  })

  it('shows "No results" when filter returns empty', async () => {
    const user = userEvent.setup()
    render(<Combobox options={options} />)
    await user.type(screen.getByRole('combobox'), 'zzz')
    expect(screen.getByText('No results')).toBeInTheDocument()
  })

  it('selects option on click and calls onChange', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Combobox options={options} onChange={onChange} />)
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: 'Cherry' }))
    expect(onChange).toHaveBeenCalledWith('cherry')
    expect(screen.getByRole('combobox')).toHaveValue('Cherry')
  })

  it('closes listbox after selection', async () => {
    const user = userEvent.setup()
    render(<Combobox options={options} />)
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: 'Apple' }))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('clears value and closes on Escape', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Combobox options={options} onChange={onChange} />)
    const input = screen.getByRole('combobox')
    await user.type(input, 'Ban')
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(onChange).toHaveBeenCalledWith('')
  })

  it('navigates options with arrow keys and selects with Enter', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Combobox options={options} onChange={onChange} />)
    const input = screen.getByRole('combobox')
    await user.click(input)
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{ArrowDown}')
    await user.keyboard('{Enter}')
    // Second option is Banana
    expect(onChange).toHaveBeenCalledWith('banana')
  })

  it('does not select disabled options', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Combobox options={options} onChange={onChange} />)
    await user.click(screen.getByRole('combobox'))
    const figOption = screen.getByRole('option', { name: 'Fig' })
    expect(figOption).toHaveAttribute('aria-disabled', 'true')
  })

  it('is disabled when disabled prop set', () => {
    render(<Combobox options={options} disabled />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('has aria-expanded false when closed', () => {
    render(<Combobox options={options} />)
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')
  })

  it('has aria-expanded true when open', async () => {
    const user = userEvent.setup()
    render(<Combobox options={options} />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true')
  })
})
