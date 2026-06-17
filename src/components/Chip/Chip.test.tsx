import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Chip } from './Chip'

describe('Chip', () => {
  it('renders children', () => {
    render(<Chip>In stock</Chip>)
    expect(screen.getByText('In stock')).toBeInTheDocument()
  })

  it('has role=checkbox', () => {
    render(<Chip>Filter</Chip>)
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
  })

  it('reflects selected state via aria-checked', () => {
    render(<Chip selected>Active</Chip>)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'true')
  })

  it('reflects unselected state via aria-checked', () => {
    render(<Chip selected={false}>Inactive</Chip>)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false')
  })

  it('calls onToggle with toggled value on click', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<Chip selected={false} onToggle={onToggle}>Filter</Chip>)
    await user.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledWith(true)
  })

  it('calls onToggle with false when already selected', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<Chip selected onToggle={onToggle}>Filter</Chip>)
    await user.click(screen.getByRole('checkbox'))
    expect(onToggle).toHaveBeenCalledWith(false)
  })

  it('handles Space key to toggle', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<Chip selected={false} onToggle={onToggle}>Filter</Chip>)
    screen.getByRole('checkbox').focus()
    await user.keyboard(' ')
    expect(onToggle).toHaveBeenCalledWith(true)
  })

  it('renders remove button when onRemove is provided', () => {
    render(<Chip onRemove={() => {}}>Tag</Chip>)
    expect(screen.getByRole('button', { name: /remove tag/i })).toBeInTheDocument()
  })

  it('calls onRemove when remove button is clicked', async () => {
    const user = userEvent.setup()
    const onRemove = vi.fn()
    render(<Chip onRemove={onRemove}>Tag</Chip>)
    await user.click(screen.getByRole('button', { name: /remove/i }))
    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it('is disabled when disabled prop is set', () => {
    render(<Chip disabled>Tag</Chip>)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Chip ref={ref}>Ref</Chip>)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
