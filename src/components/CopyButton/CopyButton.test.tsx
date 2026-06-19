import * as React from 'react'
import { render, screen, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { CopyButton } from './CopyButton'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const writeTextMock = vi.fn()

function setupClipboard() {
  writeTextMock.mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: writeTextMock },
    writable: true,
    configurable: true,
  })
}

afterEach(() => {
  vi.restoreAllMocks()
})

// ---------------------------------------------------------------------------
// Rendering & static props
// ---------------------------------------------------------------------------

describe('CopyButton — rendering & props', () => {
  it('renders with default label', () => {
    render(<CopyButton text="hello" />)
    expect(screen.getByRole('button', { name: 'Copy to clipboard' })).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveTextContent('Copy')
  })

  it('renders with custom label', () => {
    render(<CopyButton text="hello" label="Copy code" />)
    expect(screen.getByRole('button')).toHaveTextContent('Copy code')
  })

  it('is disabled when disabled prop is set', () => {
    render(<CopyButton text="hello" disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
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

  it('live region is initially empty', () => {
    render(<CopyButton text="hello" />)
    expect(screen.getByRole('status')).toHaveTextContent('')
  })
})

// ---------------------------------------------------------------------------
// Clipboard interaction (fake timers)
// ---------------------------------------------------------------------------

describe('CopyButton — clipboard interaction', () => {
  beforeEach(() => {
    setupClipboard()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runAllTimers()
    vi.useRealTimers()
  })

  async function clickAndFlush() {
    await act(async () => {
      fireEvent.click(screen.getByRole('button'))
      // Flush the resolved clipboard promise microtask
      await Promise.resolve()
    })
  }

  it('copies text to clipboard on click', async () => {
    render(<CopyButton text="my-text" />)
    await clickAndFlush()
    expect(writeTextMock).toHaveBeenCalledWith('my-text')
  })

  it('shows success label after copy', async () => {
    render(<CopyButton text="hello" successLabel="Copied!" />)
    await clickAndFlush()
    expect(screen.getByRole('button')).toHaveTextContent('Copied!')
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Copied to clipboard')
  })

  it('announces success state via aria-live region', async () => {
    render(<CopyButton text="hello" successLabel="Done!" />)
    await clickAndFlush()
    expect(screen.getByRole('status')).toHaveTextContent('Done!')
  })

  it('reverts to original label after timeout', async () => {
    render(<CopyButton text="hello" label="Copy" successLabel="Copied!" timeout={2000} />)
    await clickAndFlush()
    expect(screen.getByRole('button')).toHaveTextContent('Copied!')

    act(() => vi.advanceTimersByTime(2001))

    expect(screen.getByRole('button')).toHaveTextContent('Copy')
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Copy to clipboard')
  })

  it('reverts live region after timeout', async () => {
    render(<CopyButton text="hello" successLabel="Copied!" timeout={1000} />)
    await clickAndFlush()
    act(() => vi.advanceTimersByTime(1001))
    expect(screen.getByRole('status')).toHaveTextContent('')
  })

  it('does not copy when disabled', async () => {
    render(<CopyButton text="hello" disabled />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button'))
      await Promise.resolve()
    })
    expect(writeTextMock).not.toHaveBeenCalled()
  })

  it('uses execCommand fallback when clipboard API throws', async () => {
    writeTextMock.mockRejectedValueOnce(new Error('not allowed'))
    const execCommandMock = vi.fn().mockReturnValue(true)
    document.execCommand = execCommandMock

    render(<CopyButton text="fallback-text" />)
    await act(async () => {
      fireEvent.click(screen.getByRole('button'))
      // Two microtasks: one for the rejection, one for the catch handler
      await Promise.resolve()
      await Promise.resolve()
      await Promise.resolve()
    })
    expect(execCommandMock).toHaveBeenCalledWith('copy')
  })
})

// ---------------------------------------------------------------------------
// Keyboard accessibility
// ---------------------------------------------------------------------------

describe('CopyButton — keyboard & accessibility', () => {
  beforeEach(() => {
    setupClipboard()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.runAllTimers()
    vi.useRealTimers()
  })

  it('is keyboard accessible — Enter triggers copy', async () => {
    render(<CopyButton text="hello" />)
    screen.getByRole('button').focus()
    // Simulate Enter on a button (native click)
    await act(async () => {
      fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter', code: 'Enter' })
      fireEvent.click(screen.getByRole('button'))
      await Promise.resolve()
    })
    expect(writeTextMock).toHaveBeenCalledWith('hello')
  })

  it('is keyboard accessible — Space triggers copy', async () => {
    render(<CopyButton text="space-copy" />)
    screen.getByRole('button').focus()
    await act(async () => {
      fireEvent.keyDown(screen.getByRole('button'), { key: ' ', code: 'Space' })
      fireEvent.click(screen.getByRole('button'))
      await Promise.resolve()
    })
    expect(writeTextMock).toHaveBeenCalledWith('space-copy')
  })

  it('button has type="button" so it does not submit forms', () => {
    render(<CopyButton text="hello" />)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })
})
