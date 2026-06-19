import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { RangeSlider } from './RangeSlider'

const meta = {
  title: 'PS Design Library/Forms/RangeSlider',
  component: RangeSlider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    defaultValue: [20, 80],
    label: 'Price range',
    hint: 'Drag handles to set a range.',
  },
} satisfies Meta<typeof RangeSlider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithShowValues: Story = {
  args: {
    showValues: true,
    label: 'Quantity range',
    hint: 'Current values shown above handles.',
  },
}

export const CustomStepAndRange: Story = {
  args: {
    min: 0,
    max: 1000,
    step: 50,
    defaultValue: [100, 700],
    label: 'Budget ($)',
    showValues: true,
  },
}

export const WithError: Story = {
  args: {
    error: 'Range must be at least $10 apart.',
    hint: undefined,
    defaultValue: [40, 60],
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: [30, 70],
    label: 'Price range (locked)',
  },
}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = React.useState<[number, number]>([25, 75])
    return (
      <div className="flex flex-col gap-4">
        <RangeSlider
          {...args}
          value={value}
          onChange={setValue}
          label="Controlled range"
          showValues
        />
        <p className="text-sm text-[#6b6b6b]">
          Selected: {value[0]} – {value[1]}
        </p>
      </div>
    )
  },
}

export const NoLabel: Story = {
  args: {
    label: undefined,
    hint: undefined,
    defaultValue: [10, 90],
  },
}
