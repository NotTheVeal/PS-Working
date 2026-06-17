import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Switch } from './Switch'

const meta = {
  title: 'PS Design Library/Forms/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { label: 'Enable notifications' } }
export const Checked: Story = { args: { label: 'Auto-renew', defaultChecked: true } }
export const WithHint: Story = { args: { label: 'Expedited shipping', hint: 'Additional charges may apply.', defaultChecked: false } }
export const Disabled: Story = { args: { label: 'Feature unavailable', disabled: true } }
export const DisabledChecked: Story = { args: { label: 'Required setting', disabled: true, defaultChecked: true } }
export const Small: Story = { args: { label: 'Compact mode', size: 'sm' } }

export const Controlled: Story = {
  render: () => {
    const [checked, setChecked] = useState(false)
    return (
      <div className="flex flex-col gap-4 p-4">
        <Switch label="Receive order updates" checked={checked} onChange={setChecked} />
        <p className="text-[13px] text-[#6b6b6b]">State: {checked ? 'on' : 'off'}</p>
      </div>
    )
  },
}
