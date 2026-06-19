import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SearchInput } from './SearchInput'

describe('SearchInput', () => {
  it('renders a searchbox input', () => {
    render(<SearchInput label="Search" />)
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('sets aria-label from label prop', () => {
    render(<SearchInput label="Find parts" />)
    expect(screen.getByRole('searchbox', { name: 'Find parts' })).toBeInTheDocument()
  })

  it('falls back to aria-label="Search" when no label provided', () => {
    render(<SearchInput />)
    expect(screen.getByRole('searchbox', { name: 'Search' })).toBeInTheDocument()
  })

  it('renders placeholder text', () => {
    render(<SearchInput placeholder="Search inventory…" />)
    expect(screen.getByPlaceholderText('Search inventory…')).toBeInTheDocument()
  })

  it('calls onChange with string value when typing', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SearchInput onChange={onChange} label="Search" />)
    await user.type(screen.getByRole('searchbox'), 'SKF')
    expect(onChange).toHaveBeenCalledWith('SKF')
  })

  it('calls onSearch when Enter is pressed', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<SearchInput defaultValue="bearing" onSearch={onSearch} label="Search" />)
    await user.click(screen.getByRole('searchbox'))
    await user.keyboard('{Enter}')
    expect(onSearch).toHaveBeenCalledWith('bearing')
  })

  it('shows clear button when value is non-empty', () => {
    render(<SearchInput defaultValue="SKF" label="Search" />)
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument()
  })

  it('does not show clear button when value is empty', () => {
    render(<SearchInput label="Search" />)
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
  })

  it('clears the input when clear button is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    const onClear = vi.fn()
    render(<SearchInput defaultValue="hello" onChange={onChange} onClear={onClear} label="Search" />)
    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(onChange).toHaveBeenCalledWith('')
    expect(onClear).toHaveBeenCalled()
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
  })

  it('focuses the input after clearing', async () => {
    const user = userEvent.setup()
    render(<SearchInput defaultValue="hello" label="Search" />)
    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(screen.getByRole('searchbox')).toHaveFocus()
  })

  it('shows loading spinner and hides clear button when loading', () => {
    render(<SearchInput defaultValue="query" loading label="Search" />)
    expect(screen.getByRole('status', { name: 'Loading' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
  })

  it('is disabled when disabled prop is set', () => {
    render(<SearchInput disabled label="Search" />)
    expect(screen.getByRole('searchbox')).toBeDisabled()
  })

  it('does not show clear button when disabled', () => {
    render(<SearchInput defaultValue="hello" disabled label="Search" />)
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
  })

  it('forwards ref to the input element', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<SearchInput ref={ref} label="Search" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('passes extra props to the input', () => {
    render(<SearchInput data-testid="my-search" label="Search" />)
    expect(screen.getByTestId('my-search')).toBeInTheDocument()
  })

  it('has type="search"', () => {
    render(<SearchInput label="Search" />)
    expect(screen.getByRole('searchbox')).toHaveAttribute('type', 'search')
  })
})
