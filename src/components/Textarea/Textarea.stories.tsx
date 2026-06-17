import type { Meta, StoryObj } from '@storybook/react'
import { Textarea } from './Textarea'

const meta = {
  title: 'PS Design Library/Forms/Textarea',
  component: Textarea,
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div style={{ width: 360 }}><Story /></div>],
  argTypes: {
    disabled:  { control: 'boolean' },
    required:  { control: 'boolean' },
    showCount: { control: 'boolean' },
    label:     { control: 'text' },
    hint:      { control: 'text' },
    error:     { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { label: 'Notes', placeholder: 'Add any notes for this order…', rows: 4 },
}

export const WithHint: Story = {
  args: {
    label: 'Return reason',
    hint: 'Please describe the issue in detail to speed up processing.',
    placeholder: 'Describe the issue…',
    rows: 4,
  },
}

export const WithError: Story = {
  args: {
    label: 'Return reason',
    error: 'Please provide a reason for the return.',
    rows: 4,
  },
}

export const WithCharacterCount: Story = {
  args: {
    label: 'Short description',
    showCount: true,
    maxLength: 200,
    placeholder: 'Enter a brief description…',
    rows: 3,
  },
}

export const Required: Story = {
  args: { label: 'Rejection reason', required: true, rows: 4, placeholder: 'Required field' },
}

export const Disabled: Story = {
  args: {
    label: 'Previous notes',
    disabled: true,
    defaultValue: 'Part was inspected on 2024-01-15. No visible damage.',
    rows: 3,
  },
}
