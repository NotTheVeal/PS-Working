import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { MultiSelect } from './MultiSelect'

const PART_CATEGORIES: { value: string; label: string; disabled?: boolean }[] = [
  { value: 'bearings', label: 'Bearings' },
  { value: 'belts', label: 'Belts & Chains' },
  { value: 'electrical', label: 'Electrical Components' },
  { value: 'filters', label: 'Filters' },
  { value: 'gaskets', label: 'Gaskets & Seals' },
  { value: 'hydraulics', label: 'Hydraulics' },
  { value: 'lubrication', label: 'Lubrication' },
  { value: 'motors', label: 'Motors & Drives' },
  { value: 'pneumatics', label: 'Pneumatics', disabled: true },
  { value: 'sensors', label: 'Sensors' },
]

const meta = {
  title: 'PS Design Library/Forms/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    options: PART_CATEGORIES,
    label: 'Part categories',
    placeholder: 'Search categories…',
    hint: 'Select one or more categories.',
  },
} satisfies Meta<typeof MultiSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithDefaultValues: Story = {
  args: {
    defaultValue: ['bearings', 'motors'],
  },
}

export const WithError: Story = {
  args: {
    error: 'Please select at least one category.',
    hint: undefined,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: ['filters', 'sensors'],
  },
}

export const MaxItems: Story = {
  args: {
    maxItems: 3,
    hint: 'You may select up to 3 categories.',
    defaultValue: ['bearings', 'belts', 'filters'],
  },
}

export const NoOptions: Story = {
  args: {
    options: [],
    placeholder: 'No categories available',
  },
}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = React.useState<string[]>(['electrical'])
    return (
      <div className="flex flex-col gap-3">
        <MultiSelect
          {...args}
          value={value}
          onChange={setValue}
          label="Controlled selection"
        />
        <p className="text-sm text-[#6b6b6b]">
          Selected: {value.length > 0 ? value.join(', ') : '(none)'}
        </p>
      </div>
    )
  },
}
