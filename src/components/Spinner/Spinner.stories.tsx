import type { Meta, StoryObj } from '@storybook/react'
import { Spinner } from './Spinner'

const meta = {
  title: 'PS Design Library/Feedback/Spinner',
  component: Spinner,
  parameters: { layout: 'centered' },
  argTypes: {
    size:    { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    variant: { control: 'select', options: ['current', 'blue', 'white', 'muted'] },
    label:   { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Spinner>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { variant: 'blue' },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-4">
      <Spinner size="xs" variant="blue" />
      <Spinner size="sm" variant="blue" />
      <Spinner size="md" variant="blue" />
      <Spinner size="lg" variant="blue" />
      <Spinner size="xl" variant="blue" />
    </div>
  ),
}

export const OnDarkBackground: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-6 bg-[#1a56b0] rounded-lg">
      <Spinner variant="white" size="sm" />
      <Spinner variant="white" size="md" />
      <Spinner variant="white" size="lg" />
    </div>
  ),
}

export const InlineWithText: Story = {
  render: () => (
    <div className="flex items-center gap-2 text-[14px] text-[#1a1a1a]">
      <Spinner size="sm" variant="blue" />
      <span>Loading parts…</span>
    </div>
  ),
}

export const PageLoader: Story = {
  render: () => (
    <div className="flex flex-col items-center gap-3 p-12">
      <Spinner size="xl" variant="blue" />
      <p className="text-[13px] text-[#6b6b6b]">Loading your order history…</p>
    </div>
  ),
}
