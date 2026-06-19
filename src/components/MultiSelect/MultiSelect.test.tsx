import * as React from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { MultiSelect } from './MultiSelect'

const OPTIONS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
  { value: 'd', label: 'Delta', disabled: true },
]

describe('MultiSelect', () => {
  it('renders with a label', () => {
    render(<MultiSelect options={OPTIONS} label="Categories" />)
    expect(screen.getByText('Categories')).toBeInTheDocument()
  })

  it('renders placeholder text when nothing selected', () => {
    render(<MultiSelect options={OPTIONS} placeholder="Pick items" />)
    expect(screen.getByPlaceholderText('Pick items')).toBeInTheDocument()
  })

  it('renders hint text', () => {
    render(<MultiSelect options={OPTIONS} label="Cat" hint="Choose any" />)
    expect(screen.getByText('Choose any')).toBeInTheDocument()
  })

  it('renders error with role=alert', () => {
    render(<MultiSelect options={OPTIONS} label="Cat" error="Required field" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required field')
  })

  it('hides hint when error is present', () => {
    render(<MultiSelect options={OPTIONS} label="Cat" hint="Help" error="Error" />)
    expect(screen.queryByText('Help')).not.toBeInTheDocument()
  })

  it('renders selected tags from defaultValue', () => {
    render(<MultiSelect options={OPTIONS} defaultValue={['a', 'b']} />)
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('opens dropdown on input focus', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={OPTIONS} label="Cat" />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })

  it('shows all options in the listbox', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={OPTIONS} label="Cat" />)
    await user.click(screen.getByRole('combobox'))
    const listbox = screen.getByRole('listbox')
    expect(within(listbox).getAllByRole('option')).toHaveLength(4)
  })

  it('calls onChange when selecting an option', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<MultiSelect options={OPTIONS} onChange={onChange} label="Cat" />)
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: /Alpha/ }))
    expect(onChange).toHaveBeenCalledWith(['a'])
  })

  it('calls onChange when deselecting an option', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<MultiSelect options={OPTIONS} defaultValue={['a']} onChange={onChange} label="Cat" />)
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: /Alpha/ }))
    expect(onChange).toHaveBeenCalledWith([])
  })

  it('removes a tag via the × button', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<MultiSelect options={OPTIONS} defaultValue={['a', 'b']} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Remove Alpha' }))
    expect(onChange).toHaveBeenCalledWith(['b'])
  })

  it('removes last tag on Backspace when input is empty', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<MultiSelect options={OPTIONS} defaultValue={['a', 'b']} onChange={onChange} />)
    await user.click(screen.getByRole('combobox'))
    await user.keyboard('{Backspace}')
    expect(onChange).toHaveBeenCalledWith(['a'])
  })

  it('closes dropdown on Escape', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={OPTIONS} label="Cat" />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
  })

  it('filters options by query text', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={OPTIONS} label="Cat" />)
    await user.click(screen.getByRole('combobox'))
    await user.type(screen.getByRole('combobox'), 'al')
    const listbox = screen.getByRole('listbox')
    // "Alpha" matches "al", others do not
    expect(within(listbox).getByRole('option', { name: /Alpha/ })).toBeInTheDocument()
    expect(within(listbox).queryByRole('option', { name: /Beta/ })).not.toBeInTheDocument()
  })

  it('shows "No options found" when filter matches nothing', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={OPTIONS} label="Cat" />)
    await user.click(screen.getByRole('combobox'))
    await user.type(screen.getByRole('combobox'), 'zzz')
    expect(screen.getByText('No options found.')).toBeInTheDocument()
  })

  it('prevents adding more than maxItems', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <MultiSelect
        options={OPTIONS}
        defaultValue={['a', 'b']}
        maxItems={2}
        onChange={onChange}
        label="Cat"
      />
    )
    await user.click(screen.getByRole('combobox'))
    await user.click(screen.getByRole('option', { name: /Gamma/ }))
    // onChange should not be called for a third selection
    expect(onChange).not.toHaveBeenCalled()
  })

  it('shows maxItems hint when at capacity', () => {
    render(
      <MultiSelect
        options={OPTIONS}
        defaultValue={['a', 'b']}
        maxItems={2}
      />
    )
    expect(screen.getByText(/Maximum of 2 items selected/)).toBeInTheDocument()
  })

  it('is disabled when disabled prop is set', () => {
    render(<MultiSelect options={OPTIONS} disabled label="Cat" />)
    expect(screen.getByRole('combobox')).toBeDisabled()
  })

  it('forwards ref to the wrapper div', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<MultiSelect options={OPTIONS} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('combobox has aria-expanded false when closed', () => {
    render(<MultiSelect options={OPTIONS} label="Cat" />)
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')
  })

  it('combobox has aria-expanded true when open', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={OPTIONS} label="Cat" />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true')
  })

  it('marks the combobox as aria-invalid when error is set', () => {
    render(<MultiSelect options={OPTIONS} error="Required" label="Cat" />)
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('selected options show aria-selected=true in listbox', async () => {
    const user = userEvent.setup()
    render(<MultiSelect options={OPTIONS} defaultValue={['a']} label="Cat" />)
    await user.click(screen.getByRole('combobox'))
    const alphaOption = screen.getByRole('option', { name: /Alpha/ })
    expect(alphaOption).toHaveAttribute('aria-selected', 'true')
  })
})
