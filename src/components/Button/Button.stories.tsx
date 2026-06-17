import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta = {
  title: 'PS Design Library/Actions/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant:      { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger', 'brand'] },
    size:         { control: 'select', options: ['sm', 'md', 'lg'] },
    loading:      { control: 'boolean' },
    disabled:     { control: 'boolean' },
    children:     { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  args: { variant: 'primary', children: 'Button' },
}

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Button' },
}

export const Ghost: Story = {
  args: { variant: 'ghost', children: 'Button' },
}

export const Danger: Story = {
  args: { variant: 'danger', children: 'Delete item' },
}

export const Brand: Story = {
  args: { variant: 'brand', children: 'Get started' },
}

export const Small: Story = {
  args: { variant: 'primary', size: 'sm', children: 'Small' },
}

export const Large: Story = {
  args: { variant: 'primary', size: 'lg', children: 'Large' },
}

export const Loading: Story = {
  args: { variant: 'primary', loading: true, children: 'Saving…' },
}

export const Disabled: Story = {
  args: { variant: 'primary', disabled: true, children: 'Disabled' },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3 p-6 bg-[#f0ede8]">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="brand">Brand</Button>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3 p-6 bg-[#f0ede8]">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}
