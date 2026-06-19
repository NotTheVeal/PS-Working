import type { Meta, StoryObj } from '@storybook/react'
import { DatePicker } from './DatePicker'

const meta = {
  title: 'PS Design Library/Forms/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onChange: { action: 'changed' },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
  },
} satisfies Meta<typeof DatePicker>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Select a date',
    placeholder: 'Pick a date',
  },
}

export const WithValue: Story = {
  args: {
    label: 'Delivery date',
    value: new Date(2026, 5, 19), // June 19 2026
  },
}

export const WithError: Story = {
  args: {
    label: 'Appointment date',
    error: 'Please select a valid date.',
  },
}

export const WithHint: Story = {
  args: {
    label: 'Ship date',
    hint: 'Select the date you need this order to ship.',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Order date',
    value: new Date(2026, 5, 19),
    disabled: true,
  },
}

export const WithMinMax: Story = {
  args: {
    label: 'Available dates',
    hint: 'Only dates within the next 30 days are selectable.',
    min: new Date(2026, 5, 19),
    max: new Date(2026, 6, 19),
  },
}
