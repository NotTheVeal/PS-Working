import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Accordion } from './Accordion'

const items = [
  { id: 'a', trigger: 'Question A', content: 'Answer A' },
  { id: 'b', trigger: 'Question B', content: 'Answer B' },
]

describe('Accordion', () => {
  it('renders all triggers', () => {
    render(<Accordion items={items} />)
    expect(screen.getByText('Question A')).toBeInTheDocument()
    expect(screen.getByText('Question B')).toBeInTheDocument()
  })

  it('hides content initially', () => {
    render(<Accordion items={items} />)
    expect(screen.queryByText('Answer A')).not.toBeInTheDocument()
  })

  it('shows content after clicking trigger', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} />)
    await user.click(screen.getByText('Question A'))
    expect(screen.getByText('Answer A')).toBeInTheDocument()
  })

  it('closes panel when trigger clicked again', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} defaultOpen={['a']} />)
    await user.click(screen.getByText('Question A'))
    expect(screen.queryByText('Answer A')).not.toBeInTheDocument()
  })

  it('closes other panels in single mode', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} defaultOpen={['a']} />)
    await user.click(screen.getByText('Question B'))
    expect(screen.queryByText('Answer A')).not.toBeInTheDocument()
    expect(screen.getByText('Answer B')).toBeInTheDocument()
  })

  it('allows multiple open in multiple mode', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} multiple />)
    await user.click(screen.getByText('Question A'))
    await user.click(screen.getByText('Question B'))
    expect(screen.getByText('Answer A')).toBeInTheDocument()
    expect(screen.getByText('Answer B')).toBeInTheDocument()
  })

  it('sets aria-expanded correctly', async () => {
    const user = userEvent.setup()
    render(<Accordion items={items} />)
    const btn = screen.getByText('Question A').closest('button')!
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    await user.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
  })

  it('does not open disabled item', async () => {
    const user = userEvent.setup()
    render(<Accordion items={[{ ...items[0], disabled: true }]} />)
    await user.click(screen.getByText('Question A'))
    expect(screen.queryByText('Answer A')).not.toBeInTheDocument()
  })
})
