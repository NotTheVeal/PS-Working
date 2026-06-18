import type { Meta, StoryObj } from '@storybook/react'
import { NumberInput } from './NumberInput'

const meta = {
  title: 'PS Design Library/Forms/NumberInput',
  component: NumberInput,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    min:          { control: 'number' },
    max:          { control: 'number' },
    step:         { control: 'number' },
    disabled:     { control: 'boolean' },
    label:        { control: 'text' },
    hint:         { control: 'text' },
    error:        { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof NumberInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Quantity',
    defaultValue: 1,
  },
}

export const WithMinMax: Story = {
  args: {
    label: 'Quantity',
    defaultValue: 1,
    min: 1,
    max: 10,
    hint: 'Between 1 and 10',
  },
}

export const WithStep: Story = {
  args: {
    label: 'Amount',
    defaultValue: 10,
    step: 5,
    min: 0,
    hint: 'Increments of 5',
  },
}

export const WithError: Story = {
  args: {
    label: 'Quantity',
    defaultValue: 0,
    min: 1,
    error: 'Quantity must be at least 1',
  },
}

export const WithHint: Story = {
  args: {
    label: 'Units',
    defaultValue: 0,
    hint: 'Enter the number of units required',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Quantity',
    defaultValue: 5,
    disabled: true,
  },
}

export const NoLabel: Story = {
  args: {
    defaultValue: 3,
    min: 0,
    max: 99,
  },
}
