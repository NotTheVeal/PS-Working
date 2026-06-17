import type { Meta, StoryObj } from '@storybook/react'
import { EmptyState } from './EmptyState'

const meta = {
  title: 'PS Design Library/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof EmptyState>

export default meta
type Story = StoryObj<typeof meta>

const InboxIcon = () => (
  <svg
    className="h-6 w-6 text-[#6b6b6b]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"
    />
  </svg>
)

const SearchIcon = () => (
  <svg
    className="h-6 w-6 text-[#6b6b6b]"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z"
    />
  </svg>
)

const ActionButton = ({ label }: { label: string }) => (
  <button
    className="inline-flex items-center gap-1.5 rounded-lg border border-[#1a56b0] px-3 py-2 text-sm font-medium text-[#1a56b0] bg-white hover:bg-[#f0ede8] transition-colors"
  >
    {label}
  </button>
)

export const Default: Story = {
  args: {
    icon: <InboxIcon />,
    title: 'No messages yet',
    description: 'When you receive a message it will appear here.',
    size: 'md',
  },
}

export const WithAction: Story = {
  args: {
    icon: <InboxIcon />,
    title: 'No orders found',
    description: 'Get started by placing your first order.',
    action: <ActionButton label="New order" />,
    size: 'md',
  },
}

export const NoIcon: Story = {
  args: {
    title: 'Nothing here',
    description: 'Try adjusting your filters.',
    size: 'md',
  },
}

export const SearchEmpty: Story = {
  args: {
    icon: <SearchIcon />,
    title: 'No results for "brake pad"',
    description: 'Try a different search term or browse all parts.',
    action: <ActionButton label="Browse all parts" />,
    size: 'md',
  },
}

export const Small: Story = {
  args: {
    icon: <InboxIcon />,
    title: 'Nothing here',
    description: 'Add some items to get started.',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    icon: <InboxIcon />,
    title: 'Your dashboard is empty',
    description: 'Add widgets to customise your dashboard view.',
    action: <ActionButton label="Add widget" />,
    size: 'lg',
  },
}
