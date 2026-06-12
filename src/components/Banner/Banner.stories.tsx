import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Banner } from './Banner'
import { Button } from '../Button/Button'

const meta = {
  title: 'PS Design Library/Feedback/Banner',
  component: Banner,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div style={{ maxWidth: 560 }}><Story /></div>],
  argTypes: {
    variant:  { control: 'select', options: ['info', 'success', 'warning', 'error', 'neutral'] },
    title:    { control: 'text' },
    children: { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Banner>

export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Scheduled maintenance',
    children: 'The system will be unavailable on Saturday from 2–4 AM ET.',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Order submitted',
    children: 'Your order #PO-12345 has been received and is being processed.',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Low stock',
    children: 'Only 3 units remain. Consider adjusting your order quantity.',
  },
}

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Payment failed',
    children: 'We couldn't process your payment. Please check your billing details and try again.',
  },
}

export const Neutral: Story = {
  args: {
    variant: 'neutral',
    children: 'You're viewing a read-only copy of this order.',
  },
}

export const Dismissible: Story = {
  render: () => {
    const [visible, setVisible] = useState(true)
    return visible ? (
      <Banner variant="info" title="New features available" onDismiss={() => setVisible(false)}>
        We've added bulk ordering and saved carts to your account.
      </Banner>
    ) : (
      <p className="text-[13px] text-[#6b6b6b]">Banner dismissed.</p>
    )
  },
}

export const WithAction: Story = {
  args: {
    variant: 'warning',
    title: 'Account verification required',
    children: 'Verify your account to unlock net-30 payment terms.',
    action: <Button variant="secondary" size="sm">Verify now</Button>,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Banner variant="info"    title="Info"    children="Informational message." />
      <Banner variant="success" title="Success" children="Operation completed successfully." />
      <Banner variant="warning" title="Warning" children="Please review before continuing." />
      <Banner variant="error"   title="Error"   children="Something went wrong. Try again." />
      <Banner variant="neutral"                 children="Neutral contextual message." />
    </div>
  ),
}
