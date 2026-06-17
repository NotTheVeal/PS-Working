import type { Meta, StoryObj } from '@storybook/react'
import { Skeleton, SkeletonCard, SkeletonTable } from './Skeleton'

const meta = {
  title: 'PS Design Library/Feedback/Skeleton',
  component: Skeleton,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Line: Story = { args: { shape: 'line', height: 16, width: '80%' } }
export const Circle: Story = { args: { shape: 'circle', width: 48, height: 48 } }
export const Rect: Story = { args: { shape: 'rect', height: 120 } }

export const TextBlock: Story = {
  render: () => (
    <div className="flex flex-col gap-2 max-w-sm p-4">
      <Skeleton height={20} width="60%" />
      <Skeleton height={14} />
      <Skeleton height={14} width="90%" />
      <Skeleton height={14} width="75%" />
    </div>
  ),
}

export const CardSkeleton: Story = {
  render: () => (
    <div className="max-w-sm p-4">
      <SkeletonCard />
    </div>
  ),
}

export const TableSkeleton: Story = {
  render: () => (
    <div className="p-4">
      <SkeletonTable rows={5} cols={5} />
    </div>
  ),
}

export const ProfileHeader: Story = {
  render: () => (
    <div className="flex items-center gap-4 p-4 max-w-sm">
      <Skeleton shape="circle" width={56} height={56} />
      <div className="flex-1 flex flex-col gap-2">
        <Skeleton height={16} width="55%" />
        <Skeleton height={12} width="40%" />
        <Skeleton height={12} width="70%" />
      </div>
    </div>
  ),
}
