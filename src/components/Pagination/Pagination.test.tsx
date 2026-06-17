import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { Pagination } from './Pagination'

describe('Pagination', () => {
  it('renders prev and next buttons', () => {
    render(<Pagination totalPages={5} currentPage={3} onPageChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument()
  })

  it('disables prev on first page', () => {
    render(<Pagination totalPages={5} currentPage={1} onPageChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
  })

  it('disables next on last page', () => {
    render(<Pagination totalPages={5} currentPage={5} onPageChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
  })

  it('marks current page with aria-current=page', () => {
    render(<Pagination totalPages={5} currentPage={3} onPageChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page')
  })

  it('calls onPageChange with next page on next click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination totalPages={5} currentPage={2} onPageChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Next page' }))
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('calls onPageChange on page button click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination totalPages={5} currentPage={1} onPageChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Page 3' }))
    expect(onChange).toHaveBeenCalledWith(3)
  })

  it('shows navigation landmark', () => {
    render(<Pagination totalPages={5} currentPage={1} onPageChange={() => {}} />)
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument()
  })
})
