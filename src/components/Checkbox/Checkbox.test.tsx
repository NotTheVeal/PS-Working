import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('renders with a label', () => {
    render(<Checkbox label="Accept terms" />)
    expect(screen.getByLabelText('Accept terms')).toBeInTheDocument()
  })

  it('is checked when defaultChecked', () => {
    render(<Checkbox label="Checked" defaultChecked />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('renders hint text', () => {
    render(<Checkbox label="Notify me" hint="We'll send you an email" />)
    expect(screen.getByText("We'll send you an email")).toBeInTheDocument()
  })

  it('renders error with role=alert', () => {
    render(<Checkbox label="Accept" error="Required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
  })

  it('hides hint when error is present', () => {
    render(<Checkbox label="Accept" hint="Helper" error="Error" />)
    expect(screen.queryByText('Helper')).not.toBeInTheDocument()
  })

  it('sets aria-invalid when error present', () => {
    render(<Checkbox label="Accept" error="Required" />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('is disabled when disabled prop is set', () => {
    render(<Checkbox label="Disabled" disabled />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('calls onChange when clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Checkbox label="Toggle" onChange={onChange} />)
    await user.click(screen.getByRole('checkbox'))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Checkbox ref={ref} label="Ref" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})
