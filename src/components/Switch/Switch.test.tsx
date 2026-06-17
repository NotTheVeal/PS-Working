import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Switch } from './Switch'

describe('Switch', () => {
  it('renders with role=switch', () => {
    render(<Switch label="Toggle" />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('is off by default', () => {
    render(<Switch label="Toggle" />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })

  it('is on when defaultChecked', () => {
    render(<Switch label="Toggle" defaultChecked />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('toggles on click', async () => {
    const user = userEvent.setup()
    render(<Switch label="Toggle" />)
    await user.click(screen.getByRole('switch'))
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('calls onChange with new value', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Switch label="Toggle" onChange={onChange} />)
    await user.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('does not toggle when disabled', async () => {
    const user = userEvent.setup()
    render(<Switch label="Toggle" disabled />)
    await user.click(screen.getByRole('switch'))
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })

  it('toggles with Space key', async () => {
    const user = userEvent.setup()
    render(<Switch label="Toggle" />)
    screen.getByRole('switch').focus()
    await user.keyboard(' ')
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLButtonElement>()
    render(<Switch ref={ref} label="Toggle" />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })
})
