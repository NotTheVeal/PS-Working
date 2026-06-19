import * as React from 'react'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { CopyButton } from './CopyButton'

// ---------------------------------------------------------------------------
// Mock clipboard API
// ---------------------------------------------------------------------------

const writeTextMock = vi.fn().mockResolvedValue(undefined)

beforeEach(() => {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: writeTextMock },
    writable: true,
    configurable: true,
  })
  vi.useFakeTimers()
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

describe('CopyButton', () => {
  it('renders with default label', () => {
    render(<CopyButton text="hello" />)
    expect(screen.getByRole('button', { name: 'Copy to clipboard' })).toBeInTheDocument()
    expect(screen.getByText('Copy')).toBeInTheDocument()
  })

  it('renders with custom label', () => {
    render(<CopyButton text="hello" label="Copy code" />)
    expect(screen.getByText('Copy code')).toBeInTheDocument()
  })

  it('copies text to clipboard on click', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<CopyButton text="my-text" />)
    await user.click(screen.getByRole('button'))
    expect(writeTextMock).toHaveBeenCalledWith('my-text')
  })

  it('shows success label after copy', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<CopyButton text="hello" successLabel="Copied!" />)
    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Copied!')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Copied to clipboard')
  })

  it('reverts to original label after timeout', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<CopyButton text="hello" label="Copy" successLabel="Copied!" timeout={2000} />)
    await user.click(screen.getByRole('button'))
    expect(screen.getByText('Copied!')).toBeInTheDocument()

    act(() => vi.advanceTimersByTime(2001))

    expect(screen.getByText('Copy')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Copy to clipboard')
  })

  it('announces success state via aria-live region', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<CopyButton text="hello" successLabel="Copied!" />)
    const live = screen.getByRole('status')
    expect(live).toHaveTextContent('')
    await user.click(screen.getByRole('button'))
    expect(live).toHaveTextContent('Copied!')
  })

  it('reverts live region after timeout', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<CopyButton text="hello" timeout={1000} />)
    await user.click(screen.getByRole('button'))
    act(() => vi.advanceTimersByTime(1001))
    expect(screen.getByRole('status')).toHaveTextContent('')
  })

  it('is disabled when disabled prop is set', () => {
    render(<CopyButton text="hello" disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('does not copy when disabled', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<CopyButton text="hello" disabled />)
    await user.click(screen.getByRole('button'))
    expect(writeTextMock).not.toHaveBeenCalled()
  })

  it('forwards ref to the button element', () => {
    const ref = { current: null }
    render(<CopyButton text="hello" ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('passes additional props to button', () => {
    render(<CopyButton text="hello" data-testid="copy-btn" />)
    expect(screen.getByTestId('copy-btn')).toBeInTheDocument()
  })

  it('merges custom className', () => {
    render(<CopyButton text="hello" className="my-class" />)
    expect(screen.getByRole('button')).toHaveClass('my-class')
  })

  it('uses execCommand fallback when clipboard API throws', async () => {
    writeTextMock.mockRejectedValueOnce(new Error('not allowed'))
    const execCommandMock = vi.fn().mockReturnValue(true)
    document.execCommand = execCommandMock

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<CopyButton text="fallback-text" />)
    await user.click(screen.getByRole('button'))
    expect(execCommandMock).toHaveBeenCalledWith('copy')
  })
})
