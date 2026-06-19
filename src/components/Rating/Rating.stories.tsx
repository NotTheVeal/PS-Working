import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { Rating } from './Rating'

const meta = {
  title: 'PS Design Library/Forms/Rating',
  component: Rating,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    max: 5,
    size: 'md',
    label: 'Product rating',
  },
} satisfies Meta<typeof Rating>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    defaultValue: 3,
  },
}

export const Empty: Story = {
  args: {
    defaultValue: 0,
    hint: 'Click a star to rate.',
  },
}

export const FullRating: Story = {
  args: {
    defaultValue: 5,
  },
}

export const ReadOnly: Story = {
  args: {
    value: 4,
    readOnly: true,
    hint: 'Average customer rating.',
  },
}

export const SizeSmall: Story = {
  args: {
    size: 'sm',
    defaultValue: 3,
    label: 'Small stars',
  },
}

export const SizeMedium: Story = {
  args: {
    size: 'md',
    defaultValue: 3,
    label: 'Medium stars',
  },
}

export const SizeLarge: Story = {
  args: {
    size: 'lg',
    defaultValue: 3,
    label: 'Large stars',
  },
}

export const CustomMax: Story = {
  args: {
    max: 10,
    defaultValue: 7,
    label: 'Score out of 10',
  },
}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = React.useState(2)
    return (
      <div className="flex flex-col gap-3">
        <Rating {...args} value={value} onChange={setValue} label="Controlled rating" />
        <p className="text-sm text-[#6b6b6b]">Selected: {value} / {args.max ?? 5}</p>
      </div>
    )
  },
}
