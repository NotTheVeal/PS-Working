import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Textarea } from './Textarea'

describe('Textarea', () => {
  it('renders with a label', () => {
    render(<Textarea label="Notes" />)
    expect(screen.getByLabelText('Notes')).toBeInTheDocument()
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLTextAreaElement>()
    render(<Textarea ref={ref} label="Notes" />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })

  it('renders hint text', () => {
    render(<Textarea label="Notes" hint="Max 500 characters" />)
    expect(screen.getByText('Max 500 characters')).toBeInTheDocument()
  })

  it('renders error with role=alert', () => {
    render(<Textarea label="Notes" error="Required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
  })

  it('hides hint when error is present', () => {
    render(<Textarea label="Notes" hint="Hint" error="Error" />)
    expect(screen.queryByText('Hint')).not.toBeInTheDocument()
  })

  it('sets aria-invalid when error present', () => {
    render(<Textarea label="Notes" error="Required" />)
    expect(screen.getByLabelText('Notes')).toHaveAttribute('aria-invalid', 'true')
  })

  it('is disabled when disabled prop is set', () => {
    render(<Textarea label="Notes" disabled />)
    expect(screen.getByLabelText('Notes')).toBeDisabled()
  })

  it('shows character count when showCount and maxLength provided', () => {
    render(<Textarea label="Notes" showCount maxLength={100} defaultValue="Hello" />)
    expect(screen.getByText('5/100')).toBeInTheDocument()
  })

  it('updates character count as user types', async () => {
    const user = userEvent.setup()
    render(<Textarea label="Notes" showCount maxLength={50} />)
    await user.type(screen.getByLabelText('Notes'), 'Hi')
    expect(screen.getByText('2/50')).toBeInTheDocument()
  })

  it('calls onChange when user types', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Textarea label="Notes" onChange={onChange} />)
    await user.type(screen.getByLabelText('Notes'), 'Test')
    expect(onChange).toHaveBeenCalled()
  })
})
