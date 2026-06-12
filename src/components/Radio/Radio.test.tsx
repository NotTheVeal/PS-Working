import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Radio, RadioGroup } from './Radio'

describe('Radio', () => {
  it('renders with a label', () => {
    render(<Radio label="Standard shipping" name="ship" value="std" />)
    expect(screen.getByLabelText('Standard shipping')).toBeInTheDocument()
  })

  it('is checked when defaultChecked', () => {
    render(<Radio label="Express" name="ship" value="exp" defaultChecked />)
    expect(screen.getByRole('radio')).toBeChecked()
  })

  it('renders hint text', () => {
    render(<Radio label="Net 30" name="pay" value="net30" hint="Pay within 30 days" />)
    expect(screen.getByText('Pay within 30 days')).toBeInTheDocument()
  })

  it('renders error with role=alert', () => {
    render(<Radio label="Option" name="x" value="a" error="Required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
  })

  it('is disabled when disabled prop is set', () => {
    render(<Radio label="Option" name="x" value="a" disabled />)
    expect(screen.getByRole('radio')).toBeDisabled()
  })

  it('calls onChange when clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Radio label="Option" name="x" value="a" onChange={onChange} />)
    await user.click(screen.getByRole('radio'))
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLInputElement>()
    render(<Radio ref={ref} label="Ref" name="x" value="r" />)
    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })
})

describe('RadioGroup', () => {
  it('renders the legend', () => {
    render(
      <RadioGroup legend="Shipping">
        <Radio label="Standard" name="ship" value="std" />
      </RadioGroup>
    )
    expect(screen.getByText('Shipping')).toBeInTheDocument()
  })

  it('renders group error', () => {
    render(
      <RadioGroup legend="Payment" error="Select one">
        <Radio label="Card" name="pay" value="card" />
      </RadioGroup>
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Select one')
  })

  it('hides legend visually with hideLegend', () => {
    render(
      <RadioGroup legend="Hidden" hideLegend>
        <Radio label="Option" name="x" value="a" />
      </RadioGroup>
    )
    expect(screen.getByText('Hidden')).toHaveClass('sr-only')
  })
})
