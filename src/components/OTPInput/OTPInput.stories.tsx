import type { Meta, StoryObj } from '@storybook/react'
import { OTPInput } from './OTPInput'

const meta = {
  title: 'PS Design Library/Forms/OTPInput',
  component: OTPInput,
  parameters: { layout: 'centered' },
  argTypes: {
    length:   { control: { type: 'number', min: 1, max: 12 } },
    disabled: { control: 'boolean' },
    type:     { control: 'radio', options: ['numeric', 'alphanumeric'] },
    label:    { control: 'text' },
    error:    { control: 'text' },
    value:    { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OTPInput>

export default meta
type Story = StoryObj<typeof meta>

/** Default 6-box OTP entry */
export const Default: Story = {
  args: {
    length: 6,
  },
}

/** Four-digit PIN style */
export const FourDigit: Story = {
  args: {
    length: 4,
  },
}

/** Numeric only — triggers numeric keyboard on mobile */
export const Numeric: Story = {
  args: {
    length: 6,
    type: 'numeric',
    label: 'Verification code',
  },
}

/** Alphanumeric — accepts letters and numbers */
export const Alphanumeric: Story = {
  args: {
    length: 6,
    type: 'alphanumeric',
    label: 'Activation key',
  },
}

/** Error state — all boxes get red border and error message shows */
export const WithError: Story = {
  args: {
    length: 6,
    error: 'The code you entered is incorrect. Please try again.',
    value: '123456',
  },
}

/** Disabled state — all inputs non-interactive */
export const Disabled: Story = {
  args: {
    length: 6,
    disabled: true,
    value: '123456',
    label: 'Verification code',
  },
}

/** Pre-filled with a complete value */
export const Prefilled: Story = {
  args: {
    length: 6,
    value: '123456',
  },
}

/** With visible label above the group */
export const WithLabel: Story = {
  args: {
    length: 6,
    label: 'Enter the 6-digit code sent to your email',
    type: 'numeric',
  },
}
