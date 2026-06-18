import type { Meta, StoryObj } from '@storybook/react'
import { Alert } from './Alert'

const meta = {
  title: 'PS Design Library/Feedback/Alert',
  component: Alert,
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    variant:  { control: 'select', options: ['info', 'success', 'warning', 'error'] },
    title:    { control: 'text' },
    children: { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = {
  args: {
    variant: 'info',
    title: 'Heads up',
    children: 'Your order has been received and is being processed.',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    title: 'Order placed',
    children: 'Your parts order #84921 was successfully submitted.',
  },
}

export const Warning: Story = {
  args: {
    variant: 'warning',
    title: 'Low stock',
    children: 'Only 2 units remaining. Order soon to avoid delays.',
  },
}

export const Error: Story = {
  args: {
    variant: 'error',
    title: 'Submission failed',
    children: 'We could not process your request. Please try again later.',
  },
}

export const WithDismiss: Story = {
  args: {
    variant: 'info',
    title: 'New feature available',
    children: 'Check out the updated parts catalog with improved search.',
    onDismiss: () => undefined,
  },
}

export const NoTitle: Story = {
  args: {
    variant: 'success',
    children: 'Changes saved successfully.',
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 max-w-xl">
      <Alert variant="info" title="Info alert" onDismiss={() => undefined}>
        This is an informational message.
      </Alert>
      <Alert variant="success" title="Success alert" onDismiss={() => undefined}>
        Your action was completed successfully.
      </Alert>
      <Alert variant="warning" title="Warning alert" onDismiss={() => undefined}>
        Please review before continuing.
      </Alert>
      <Alert variant="error" title="Error alert" onDismiss={() => undefined}>
        Something went wrong. Try again.
      </Alert>
    </div>
  ),
}
