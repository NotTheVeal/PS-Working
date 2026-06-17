import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Radio, RadioGroup } from './Radio'

const meta = {
  title: 'PS Design Library/Forms/Radio',
  component: Radio,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Radio>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'Standard shipping (5–7 days)', name: 'shipping', value: 'standard' },
}

export const Checked: Story = {
  args: { label: 'Express shipping (2–3 days)', name: 'shipping', value: 'express', defaultChecked: true },
}

export const WithHint: Story = {
  args: { label: 'Net 30', hint: 'Pay within 30 days of invoice date.', name: 'payment', value: 'net30' },
}

export const WithError: Story = {
  args: { label: 'Credit card', name: 'payment', value: 'card', error: 'Please select a payment method.' },
}

export const Disabled: Story = {
  args: { label: 'Unavailable in your region', name: 'region', value: 'eu', disabled: true },
}

export const RadioGroupExample: Story = {
  render: () => {
    const [value, setValue] = useState('standard')
    return (
      <RadioGroup legend="Shipping method" className="p-4">
        {[
          { value: 'standard',  label: 'Standard (5–7 days)',  hint: 'Free for orders over $50' },
          { value: 'express',   label: 'Express (2–3 days)',   hint: '$12.99' },
          { value: 'overnight', label: 'Overnight',            hint: '$24.99' },
        ].map((opt) => (
          <Radio
            key={opt.value}
            name="shipping"
            value={opt.value}
            label={opt.label}
            hint={opt.hint}
            checked={value === opt.value}
            onChange={() => setValue(opt.value)}
          />
        ))}
      </RadioGroup>
    )
  },
}

export const RadioGroupWithError: Story = {
  render: () => (
    <RadioGroup legend="Payment method" error="Please select a payment method." className="p-4">
      <Radio name="payment" value="card"   label="Credit card" />
      <Radio name="payment" value="net30"  label="Net 30" />
      <Radio name="payment" value="po"     label="Purchase order" />
    </RadioGroup>
  ),
}
