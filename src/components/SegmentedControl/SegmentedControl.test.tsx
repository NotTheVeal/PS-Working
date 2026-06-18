import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SegmentedControl } from './SegmentedControl'

const options = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Grid' },
  { value: 'table', label: 'Table' },
]

describe('SegmentedControl', () => {
  it('renders with role="radiogroup"', () => {
    render(<SegmentedControl options={options} label="View" />)
    expect(screen.getByRole('radiogroup', { name: 'View' })).toBeInTheDocument()
  })

  it('renders each option as role="radio"', () => {
    render(<SegmentedControl options={options} label="View" />)
    const radios = screen.getAllByRole('radio')
    expect(radios).toHaveLength(3)
  })

  it('sets aria-checked on the selected option', () => {
    render(<SegmentedControl options={options} defaultValue="grid" label="View" />)
    expect(screen.getByRole('radio', { name: 'Grid' })).toHaveAttribute('aria-checked', 'true')
    expect(screen.getByRole('radio', { name: 'List' })).toHaveAttribute('aria-checked', 'false')
  })

  it('calls onChange when an option is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SegmentedControl options={options} defaultValue="list" onChange={onChange} label="View" />)
    await user.click(screen.getByRole('radio', { name: 'Grid' }))
    expect(onChange).toHaveBeenCalledWith('grid')
  })

  it('updates selection in uncontrolled mode', async () => {
    const user = userEvent.setup()
    render(<SegmentedControl options={options} defaultValue="list" label="View" />)
    await user.click(screen.getByRole('radio', { name: 'Table' }))
    expect(screen.getByRole('radio', { name: 'Table' })).toHaveAttribute('aria-checked', 'true')
  })

  it('does not update when fully disabled', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SegmentedControl options={options} defaultValue="list" disabled onChange={onChange} label="View" />)
    await user.click(screen.getByRole('radio', { name: 'Grid' }))
    expect(onChange).not.toHaveBeenCalled()
  })

  it('disables a specific option', () => {
    const optionsWithDisabled = [
      { value: 'list', label: 'List' },
      { value: 'grid', label: 'Grid', disabled: true },
    ]
    render(<SegmentedControl options={optionsWithDisabled} defaultValue="list" label="View" />)
    expect(screen.getByRole('radio', { name: 'Grid' })).toBeDisabled()
  })

  it('navigates with ArrowRight key', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SegmentedControl options={options} defaultValue="list" onChange={onChange} label="View" />)
    // Focus the active (tabIndex=0) radio button then fire the key on the group
    const activeRadio = screen.getByRole('radio', { name: 'List' })
    await user.click(activeRadio)
    await user.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenCalledWith('grid')
  })

  it('navigates with ArrowLeft key', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SegmentedControl options={options} defaultValue="grid" onChange={onChange} label="View" />)
    const activeRadio = screen.getByRole('radio', { name: 'Grid' })
    await user.click(activeRadio)
    await user.keyboard('{ArrowLeft}')
    expect(onChange).toHaveBeenCalledWith('list')
  })

  it('wraps around on ArrowRight from last', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SegmentedControl options={options} defaultValue="table" onChange={onChange} label="View" />)
    const activeRadio = screen.getByRole('radio', { name: 'Table' })
    await user.click(activeRadio)
    await user.keyboard('{ArrowRight}')
    expect(onChange).toHaveBeenCalledWith('list')
  })

  it('forwards ref to the container div', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<SegmentedControl options={options} ref={ref} label="View" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
