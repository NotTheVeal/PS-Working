import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Timeline } from './Timeline'
import type { TimelineEvent } from './Timeline'

const events: TimelineEvent[] = [
  {
    id: '1',
    title: 'Order placed',
    description: 'Your order was submitted',
    timestamp: '2026-06-18T09:00:00',
    variant: 'default',
  },
  {
    id: '2',
    title: 'Payment confirmed',
    description: 'Payment processed',
    timestamp: '2026-06-18T09:05:00',
    variant: 'success',
  },
  {
    id: '3',
    title: 'Shipment failed',
    description: 'Address issue',
    variant: 'error',
  },
]

describe('Timeline', () => {
  it('renders with role="list"', () => {
    render(<Timeline events={events} />)
    expect(screen.getByRole('list')).toBeInTheDocument()
  })

  it('renders each event as role="listitem"', () => {
    render(<Timeline events={events} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(events.length)
  })

  it('renders each event title', () => {
    render(<Timeline events={events} />)
    expect(screen.getByText('Order placed')).toBeInTheDocument()
    expect(screen.getByText('Payment confirmed')).toBeInTheDocument()
    expect(screen.getByText('Shipment failed')).toBeInTheDocument()
  })

  it('renders event descriptions', () => {
    render(<Timeline events={events} />)
    expect(screen.getByText('Your order was submitted')).toBeInTheDocument()
    expect(screen.getByText('Payment processed')).toBeInTheDocument()
  })

  it('renders time elements with dateTime attribute for events with timestamps', () => {
    render(<Timeline events={events} />)
    const timeElements = document.querySelectorAll('time')
    expect(timeElements.length).toBeGreaterThan(0)
    const firstTime = timeElements[0]
    expect(firstTime).toHaveAttribute('dateTime', '2026-06-18T09:00:00')
  })

  it('does not render time element when no timestamp', () => {
    render(
      <Timeline
        events={[{ id: '1', title: 'No timestamp event' }]}
      />
    )
    expect(document.querySelector('time')).not.toBeInTheDocument()
  })

  it('renders with orientation="alternate"', () => {
    render(<Timeline events={events} orientation="alternate" />)
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(events.length)
  })

  it('renders custom icon when provided', () => {
    render(
      <Timeline
        events={[
          {
            id: '1',
            title: 'Custom icon event',
            icon: <span data-testid="custom-icon">★</span>,
          },
        ]}
      />
    )
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('renders empty list when no events', () => {
    render(<Timeline events={[]} />)
    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })

  it('forwards ref to the ol element', () => {
    const ref = React.createRef<HTMLOListElement>()
    render(<Timeline events={events} ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLOListElement)
  })

  it('applies custom className', () => {
    render(<Timeline events={events} className="my-timeline" />)
    expect(screen.getByRole('list')).toHaveClass('my-timeline')
  })

  it('renders all variants without crashing', () => {
    const variantEvents: TimelineEvent[] = [
      { id: '1', title: 'Default', variant: 'default' },
      { id: '2', title: 'Success', variant: 'success' },
      { id: '3', title: 'Warning', variant: 'warning' },
      { id: '4', title: 'Error', variant: 'error' },
    ]
    render(<Timeline events={variantEvents} />)
    expect(screen.getAllByRole('listitem')).toHaveLength(4)
  })
})
