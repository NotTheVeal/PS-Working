import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Timeline } from './Timeline'

const meta = {
  title: 'PS Design Library/Data Display/Timeline',
  component: Timeline,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    orientation: { control: 'select', options: ['left', 'alternate'] },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Timeline>

export default meta
type Story = StoryObj<typeof meta>

const orderEvents = [
  {
    id: '1',
    title: 'Order placed',
    description: 'Order #84921 was submitted by R. Veal',
    timestamp: '2026-06-18T09:00:00',
    variant: 'default' as const,
  },
  {
    id: '2',
    title: 'Payment confirmed',
    description: 'Payment of $1,248.00 was processed',
    timestamp: '2026-06-18T09:05:00',
    variant: 'success' as const,
  },
  {
    id: '3',
    title: 'Awaiting stock confirmation',
    description: '2 items are low in inventory',
    timestamp: '2026-06-18T09:30:00',
    variant: 'warning' as const,
  },
  {
    id: '4',
    title: 'Shipment failed',
    description: 'Carrier rejected the package — address issue',
    timestamp: '2026-06-18T14:20:00',
    variant: 'error' as const,
  },
  {
    id: '5',
    title: 'Reshipment scheduled',
    description: 'New delivery attempt on 2026-06-20',
    timestamp: '2026-06-18T15:00:00',
    variant: 'default' as const,
  },
]

export const Default: Story = {
  args: {
    events: orderEvents,
    orientation: 'left',
  },
}

export const Alternate: Story = {
  render: () => (
    <div className="max-w-2xl mx-auto">
      <Timeline events={orderEvents} orientation="alternate" />
    </div>
  ),
}

export const AllVariants: Story = {
  args: {
    events: [
      { id: '1', title: 'Default event', description: 'Standard info event', variant: 'default' },
      { id: '2', title: 'Success event', description: 'Completed successfully', variant: 'success' },
      { id: '3', title: 'Warning event', description: 'Needs attention', variant: 'warning' },
      { id: '4', title: 'Error event', description: 'Something went wrong', variant: 'error' },
    ],
    orientation: 'left',
  },
}

export const WithTimestamps: Story = {
  args: {
    events: orderEvents,
    orientation: 'left',
  },
}

export const WithCustomIcons: Story = {
  args: {
    events: [
      {
        id: '1',
        title: 'Email sent',
        description: 'Confirmation email delivered',
        timestamp: '2026-06-18T09:00:00',
        icon: (
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
            <path d="M2 4a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm10 0L8 7 4 4h8zM4 6.414L8 9l4-2.586V12H4V6.414z" />
          </svg>
        ),
        variant: 'default' as const,
      },
      {
        id: '2',
        title: 'Order shipped',
        description: 'Package is on its way',
        timestamp: '2026-06-18T11:00:00',
        icon: (
          <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
            <path d="M1 2.5A1.5 1.5 0 012.5 1h7A1.5 1.5 0 0111 2.5v4H2.5A1.5 1.5 0 011 5V2.5zM0 7.5A1.5 1.5 0 011.5 6H11v5.5A1.5 1.5 0 019.5 13H5.366A4 4 0 001 9.236V7.5zM13 6h1a2 2 0 012 2v1h-3V6zm0 4h3v1a2 2 0 01-2 2h-1v-3zM4 13a3 3 0 100 6 3 3 0 000-6zm8 0a3 3 0 100 6 3 3 0 000-6z" />
          </svg>
        ),
        variant: 'success' as const,
      },
    ],
  },
}

export const Minimal: Story = {
  args: {
    events: [
      { id: '1', title: 'Created' },
      { id: '2', title: 'Updated' },
      { id: '3', title: 'Completed', variant: 'success' as const },
    ],
  },
}
