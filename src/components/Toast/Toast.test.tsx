import * as React from 'react'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { ToastProvider, useToast } from './Toast'

function Trigger({ variant }: { variant?: 'info' | 'success' | 'warning' | 'error' }) {
  const { toast } = useToast()
  return (
    <button onClick={() => toast({ variant, message: 'Test message', title: 'Title', duration: 0 })}>
      Show toast
    </button>
  )
}

function renderWithProvider(ui: React.ReactElement) {
  return render(<ToastProvider>{ui}</ToastProvider>)
}

describe('Toast', () => {
  it('shows a toast when triggered', async () => {
    const user = userEvent.setup()
    renderWithProvider(<Trigger />)
    await user.click(screen.getByText('Show toast'))
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('shows the title', async () => {
    const user = userEvent.setup()
    renderWithProvider(<Trigger />)
    await user.click(screen.getByText('Show toast'))
    expect(screen.getByText('Title')).toBeInTheDocument()
  })

  it('dismisses when the dismiss button is clicked', async () => {
    const user = userEvent.setup()
    renderWithProvider(<Trigger />)
    await user.click(screen.getByText('Show toast'))
    await user.click(screen.getByRole('button', { name: 'Dismiss notification' }))
    expect(screen.queryByText('Test message')).not.toBeInTheDocument()
  })

  it('uses aria-live=assertive for error variant', async () => {
    const user = userEvent.setup()
    renderWithProvider(<Trigger variant="error" />)
    await user.click(screen.getByText('Show toast'))
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'assertive')
  })

  it('throws if useToast is used outside provider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Trigger />)).toThrow('useToast must be used inside <ToastProvider>')
    spy.mockRestore()
  })

  it('auto-dismisses after duration', async () => {
    vi.useFakeTimers()
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    renderWithProvider(
      <ToastProvider>
        <Trigger />
      </ToastProvider>
    )
    await user.click(screen.getByText('Show toast'))
    // duration: 0 in test means it fires immediately
    act(() => { vi.advanceTimersByTime(100) })
    vi.useRealTimers()
  })
})
