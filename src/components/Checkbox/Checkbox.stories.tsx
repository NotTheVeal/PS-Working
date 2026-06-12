import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Checkbox } from './Checkbox'

const meta = {
  title: 'PS Design Library/Forms/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  argTypes: {
    disabled:      { control: 'boolean' },
    required:      { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    label:         { control: 'text' },
    hint:          { control: 'text' },
    error:         { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'I agree to the terms and conditions' },
}

export const Checked: Story = {
  args: { label: 'Receive order notifications', defaultChecked: true },
}

export const WithHint: Story = {
  args: {
    label: 'Enable expedited shipping',
    hint: 'Additional charges may apply based on your location.',
  },
}

export const WithError: Story = {
  args: {
    label: 'Accept terms of service',
    error: 'You must accept the terms to continue.',
  },
}

export const Indeterminate: Story = {
  args: { label: 'Select all items', indeterminate: true },
}

export const Disabled: Story = {
  args: { label: 'Auto-renew subscription', disabled: true },
}

export const DisabledChecked: Story = {
  args: { label: 'Required (cannot change)', disabled: true, defaultChecked: true },
}

export const SelectAllPattern: Story = {
  render: () => {
    const items = ['OEM parts', 'Aftermarket parts', 'Remanufactured parts']
    const [checked, setChecked] = useState<boolean[]>([false, false, false])
    const allChecked  = checked.every(Boolean)
    const someChecked = checked.some(Boolean) && !allChecked

    return (
      <div className="flex flex-col gap-3 p-4">
        <Checkbox
          label="Select all"
          checked={allChecked}
          indeterminate={someChecked}
          onChange={(e) => setChecked(checked.map(() => e.target.checked))}
        />
        <div className="ml-6 flex flex-col gap-2">
          {items.map((item, i) => (
            <Checkbox
              key={item}
              label={item}
              checked={checked[i]}
              onChange={(e) => {
                const next = [...checked]
                next[i] = e.target.checked
                setChecked(next)
              }}
            />
          ))}
        </div>
      </div>
    )
  },
}
