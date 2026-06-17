import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Breadcrumb } from './Breadcrumb'

const items = [
  { label: 'Home', href: '#' },
  { label: 'Catalog', href: '#' },
  { label: 'Part detail' },
]

describe('Breadcrumb', () => {
  it('renders a nav with aria-label', () => {
    render(<Breadcrumb items={items} />)
    expect(screen.getByRole('navigation', { name: 'Breadcrumb' })).toBeInTheDocument()
  })

  it('marks the last item with aria-current=page', () => {
    render(<Breadcrumb items={items} />)
    expect(screen.getByText('Part detail')).toHaveAttribute('aria-current', 'page')
  })

  it('renders links for non-last items', () => {
    render(<Breadcrumb items={items} />)
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
  })

  it('collapses middle items when maxItems set', () => {
    render(<Breadcrumb items={items} maxItems={2} />)
    expect(screen.getByRole('button', { name: 'Show full path' })).toBeInTheDocument()
  })

  it('expands when ellipsis button clicked', async () => {
    const user = userEvent.setup()
    render(<Breadcrumb items={items} maxItems={2} />)
    await user.click(screen.getByRole('button', { name: 'Show full path' }))
    expect(screen.getByRole('link', { name: 'Catalog' })).toBeInTheDocument()
  })
})
