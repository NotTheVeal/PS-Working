import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { DatePicker } from './DatePicker'

// Pin system time to June 19, 2026 (Friday) for deterministic calendar rendering
const PINNED_DATE = new Date(2026, 5, 19) // month is 0-indexed

beforeAll(() => {
  vi.useFakeTimers()
  vi.setSystemTime(PINNED_DATE)
})

afterAll(() => {
  vi.useRealTimers()
})

beforeEach(() => {
  // Re-pin between tests in case any test shifts the clock
  vi.setSystemTime(PINNED_DATE)
})

function setup(ui: React.ReactElement) {
  const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
  return { user, ...render(ui) }
}

describe('DatePicker', () => {
  it('renders the label', () => {
    render(<DatePicker label="Appointment date" />)
    expect(screen.getByText('Appointment date')).toBeInTheDocument()
  })

  it('renders the placeholder when no value is set', () => {
    render(<DatePicker placeholder="Choose a date" />)
    expect(screen.getByPlaceholderText('Choose a date')).toBeInTheDocument()
  })

  it('renders a formatted date when value is provided', () => {
    render(<DatePicker value={new Date(2026, 5, 19)} />)
    expect(screen.getByDisplayValue('Jun 19, 2026')).toBeInTheDocument()
  })

  it('opens the calendar popup when the calendar icon button is clicked', async () => {
    const { user } = setup(<DatePicker label="Date" />)
    await user.click(screen.getByLabelText('Open date picker'))
    expect(screen.getByRole('dialog', { name: /date picker calendar/i })).toBeInTheDocument()
    expect(screen.getByText('June 2026')).toBeInTheDocument()
  })

  it('opens the calendar popup when the text input is clicked', async () => {
    const { user } = setup(<DatePicker label="Date" id="dp" />)
    await user.click(screen.getByRole('combobox'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('navigates to the previous month', async () => {
    const { user } = setup(<DatePicker label="Date" />)
    await user.click(screen.getByLabelText('Open date picker'))
    expect(screen.getByText('June 2026')).toBeInTheDocument()
    await user.click(screen.getByLabelText('Previous month'))
    expect(screen.getByText('May 2026')).toBeInTheDocument()
  })

  it('navigates to the next month', async () => {
    const { user } = setup(<DatePicker label="Date" />)
    await user.click(screen.getByLabelText('Open date picker'))
    expect(screen.getByText('June 2026')).toBeInTheDocument()
    await user.click(screen.getByLabelText('Next month'))
    expect(screen.getByText('July 2026')).toBeInTheDocument()
  })

  it('selects a day and calls onChange', async () => {
    const handleChange = vi.fn()
    const { user } = setup(<DatePicker label="Date" onChange={handleChange} />)
    await user.click(screen.getByLabelText('Open date picker'))

    // Click "15" in June 2026
    const june15 = screen.getByLabelText(/June 15, 2026/i)
    await user.click(june15)

    expect(handleChange).toHaveBeenCalledOnce()
    const called = handleChange.mock.calls[0][0] as Date
    expect(called.getFullYear()).toBe(2026)
    expect(called.getMonth()).toBe(5)
    expect(called.getDate()).toBe(15)

    // Calendar should close after selection
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('displays the selected date in the input after selection', async () => {
    const { user } = setup(<DatePicker label="Date" />)
    await user.click(screen.getByLabelText('Open date picker'))
    await user.click(screen.getByLabelText(/June 15, 2026/i))
    expect(screen.getByDisplayValue('Jun 15, 2026')).toBeInTheDocument()
  })

  it('marks today with aria-current="date"', async () => {
    const { user } = setup(<DatePicker label="Date" />)
    await user.click(screen.getByLabelText('Open date picker'))
    const todayBtn = screen.getByLabelText(/Friday, June 19, 2026/i)
    expect(todayBtn).toHaveAttribute('aria-current', 'date')
  })

  it('marks the selected day with aria-pressed="true"', async () => {
    const { user } = setup(<DatePicker label="Date" value={new Date(2026, 5, 10)} />)
    await user.click(screen.getByLabelText('Open date picker'))
    const selected = screen.getByLabelText(/June 10, 2026/i)
    expect(selected).toHaveAttribute('aria-pressed', 'true')
  })

  it('closes the calendar when Escape is pressed', async () => {
    const { user } = setup(<DatePicker label="Date" />)
    await user.click(screen.getByLabelText('Open date picker'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes the calendar when the Close button is clicked', async () => {
    const { user } = setup(<DatePicker label="Date" />)
    await user.click(screen.getByLabelText('Open date picker'))
    await user.click(screen.getByRole('button', { name: /close/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('closes the calendar on outside click', async () => {
    const { user } = setup(
      <div>
        <DatePicker label="Date" />
        <button type="button">Outside</button>
      </div>,
    )
    await user.click(screen.getByLabelText('Open date picker'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Outside' }))
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  it('shows the hint text', () => {
    render(<DatePicker label="Date" hint="Select your preferred date." />)
    expect(screen.getByText('Select your preferred date.')).toBeInTheDocument()
  })

  it('shows the error state with aria-invalid and error message', () => {
    render(<DatePicker label="Date" error="Date is required." id="dp-err" />)
    const input = screen.getByRole('combobox')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    const errorMsg = screen.getByRole('alert')
    expect(errorMsg).toHaveTextContent('Date is required.')
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('dp-err-error'))
  })

  it('does not open the calendar when disabled', async () => {
    const { user } = setup(<DatePicker label="Date" disabled />)
    const iconBtn = screen.getByLabelText('Open date picker')
    expect(iconBtn).toBeDisabled()
    await user.click(iconBtn)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('disables day cells outside min/max range', async () => {
    const min = new Date(2026, 5, 15)
    const max = new Date(2026, 5, 20)
    const { user } = setup(<DatePicker label="Date" min={min} max={max} />)
    await user.click(screen.getByLabelText('Open date picker'))

    // Day 10 should be disabled (before min)
    const day10 = screen.getByLabelText(/June 10, 2026/i)
    expect(day10).toBeDisabled()

    // Day 25 should be disabled (after max)
    const day25 = screen.getByLabelText(/June 25, 2026/i)
    expect(day25).toBeDisabled()

    // Day 17 should be enabled
    const day17 = screen.getByLabelText(/June 17, 2026/i)
    expect(day17).not.toBeDisabled()
  })
})
