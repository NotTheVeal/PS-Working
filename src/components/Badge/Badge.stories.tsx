import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta = {
  title: 'PS Design Library/Display/Badge',
  component: Badge,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['default', 'blue', 'green', 'red', 'orange', 'purple', 'neutral'] },
    size:    { control: 'select', options: ['sm', 'md', 'lg'] },
    pill:    { control: 'boolean' },
    dot:     { control: 'boolean' },
    children: { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'Badge' },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 p-4">
      <Badge variant="default">Default</Badge>
      <Badge variant="blue">Blue</Badge>
      <Badge variant="green">Active</Badge>
      <Badge variant="red">Error</Badge>
      <Badge variant="orange">Warning</Badge>
      <Badge variant="purple">Beta</Badge>
      <Badge variant="neutral">Neutral</Badge>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2 p-4">
      <Badge variant="blue" size="sm">Small</Badge>
      <Badge variant="blue" size="md">Medium</Badge>
      <Badge variant="blue" size="lg">Large</Badge>
    </div>
  ),
}

export const Pills: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 p-4">
      <Badge variant="default" pill>Default</Badge>
      <Badge variant="blue" pill>Blue</Badge>
      <Badge variant="green" pill>Active</Badge>
      <Badge variant="red" pill>Error</Badge>
    </div>
  ),
}

export const WithDot: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 p-4">
      <Badge variant="green" dot>Online</Badge>
      <Badge variant="red" dot>Offline</Badge>
      <Badge variant="orange" dot>Away</Badge>
      <Badge variant="neutral" dot>Unknown</Badge>
    </div>
  ),
}

export const StatusLabels: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg border border-[#e0ddd6]">
      <Badge variant="blue">In Progress</Badge>
      <Badge variant="green">Complete</Badge>
      <Badge variant="red">Failed</Badge>
      <Badge variant="orange">Pending</Badge>
      <Badge variant="neutral">Draft</Badge>
    </div>
  ),
}
