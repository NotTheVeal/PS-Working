import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { SegmentedControl } from './SegmentedControl'

const meta = {
  title: 'PS Design Library/Navigation/SegmentedControl',
  component: SegmentedControl,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    size:      { control: 'select', options: ['sm', 'md', 'lg'] },
    fullWidth: { control: 'boolean' },
    disabled:  { control: 'boolean' },
    label:     { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

const viewOptions = [
  { value: 'list', label: 'List' },
  { value: 'grid', label: 'Grid' },
  { value: 'table', label: 'Table' },
]

const periodOptions = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
  { value: 'year', label: 'Year' },
]

export const Default: Story = {
  args: {
    options: viewOptions,
    defaultValue: 'list',
    label: 'View mode',
  },
}

export const Small: Story = {
  args: {
    options: viewOptions,
    defaultValue: 'grid',
    size: 'sm',
    label: 'View mode',
  },
}

export const Large: Story = {
  args: {
    options: viewOptions,
    defaultValue: 'table',
    size: 'lg',
    label: 'View mode',
  },
}

export const FullWidth: Story = {
  render: () => (
    <div className="w-80">
      <SegmentedControl
        options={periodOptions}
        defaultValue="week"
        fullWidth
        label="Time period"
      />
    </div>
  ),
}

export const WithDisabledOption: Story = {
  args: {
    options: [
      { value: 'list', label: 'List' },
      { value: 'grid', label: 'Grid' },
      { value: 'table', label: 'Table', disabled: true },
    ],
    defaultValue: 'list',
    label: 'View mode',
  },
}

export const AllDisabled: Story = {
  args: {
    options: viewOptions,
    defaultValue: 'list',
    disabled: true,
    label: 'View mode',
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <SegmentedControl options={viewOptions} defaultValue="list" size="sm" label="Small" />
      <SegmentedControl options={viewOptions} defaultValue="list" size="md" label="Medium" />
      <SegmentedControl options={viewOptions} defaultValue="list" size="lg" label="Large" />
    </div>
  ),
}

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState('week')
    return (
      <div className="flex flex-col items-center gap-4">
        <SegmentedControl
          options={periodOptions}
          value={value}
          onChange={setValue}
          label="Time period"
        />
        <p className="text-sm text-[#1a1a1a]/60">Selected: {value}</p>
      </div>
    )
  },
}
