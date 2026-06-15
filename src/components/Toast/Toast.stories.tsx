import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ToastProvider, useToast } from './Toast'
import { Button } from '../Button/Button'

const meta = {
  title: 'PS Design Library/Feedback/Toast',
  parameters: { layout: 'centered' },
  decorators: [(Story) => <ToastProvider><Story /></ToastProvider>],
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

function ToastDemo({ variant, title, message }: { variant?: 'info' | 'success' | 'warning' | 'error'; title?: string; message: string }) {
  const { toast } = useToast()
  return (
    <Button onClick={() => toast({ variant, title, message })}>
      Show {variant ?? 'info'} toast
    </Button>
  )
}

export const Info: Story = {
  render: () => <ToastDemo variant="info" title="Order updated" message="Your order #PO-12345 has been updated." />,
}

export const Success: Story = {
  render: () => <ToastDemo variant="success" title="Order submitted" message="Your order has been received and is being processed." />,
}

export const Warning: Story = {
  render: () => <ToastDemo variant="warning" title="Low stock" message="Only 2 units remaining for this part." />,
}

export const Error: Story = {
  render: () => <ToastDemo variant="error" title="Payment failed" message="We couldn't process your payment. Please try again." />,
}

export const AllVariants: Story = {
  render: () => {
    const { toast } = useToast()
    return (
      <div className="flex flex-wrap gap-2">
        {(['info', 'success', 'warning', 'error'] as const).map((v) => (
          <Button
            key={v}
            variant="secondary"
            size="sm"
            onClick={() => toast({ variant: v, title: v.charAt(0).toUpperCase() + v.slice(1), message: `This is a ${v} notification.` })}
          >
            {v}
          </Button>
        ))}
      </div>
    )
  },
}
