import type { Meta, StoryObj } from '@storybook/react'
import { Avatar, AvatarGroup } from './Avatar'

const meta = {
  title: 'PS Design Library/Display/Avatar',
  component: Avatar,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Avatar>

export default meta
type Story = StoryObj<typeof meta>

export const WithInitials: Story = { args: { name: 'Rachael Veal' } }
export const WithImage: Story = { args: { src: 'https://i.pravatar.cc/80', alt: 'User avatar', name: 'Test User' } }
export const Fallback: Story = { args: {} }

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-3 p-4">
      {(['xs','sm','md','lg','xl'] as const).map(s => <Avatar key={s} name="Rachael Veal" size={s} />)}
    </div>
  ),
}

export const AllColors: Story = {
  render: () => (
    <div className="flex gap-2 p-4">
      {(['blue','green','orange','red','purple','gray'] as const).map(c => (
        <Avatar key={c} name="PS" color={c} />
      ))}
    </div>
  ),
}

export const WithStatus: Story = {
  render: () => (
    <div className="flex gap-4 p-4">
      <Avatar name="Online" status="online" />
      <Avatar name="Away" status="away" />
      <Avatar name="Busy" status="busy" />
      <Avatar name="Offline" status="offline" />
    </div>
  ),
}

export const Group: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <AvatarGroup max={3}>
        <Avatar name="Rachael Veal" color="blue" />
        <Avatar name="John Smith" color="green" />
        <Avatar name="Maria Garcia" color="orange" />
        <Avatar name="Alex Chen" color="purple" />
        <Avatar name="Sam Lee" color="red" />
      </AvatarGroup>
    </div>
  ),
}
