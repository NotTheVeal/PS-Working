import type { Meta, StoryObj } from '@storybook/react'
import { Stepper } from './Stepper'

const meta = {
  title: 'PS Design Library/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Stepper>

export default meta
type Story = StoryObj<typeof meta>

const checkoutSteps = [
  { label: 'Cart', description: 'Review items' },
  { label: 'Shipping', description: 'Delivery address' },
  { label: 'Payment', description: 'Card details' },
  { label: 'Confirm', description: 'Review order' },
]

export const Step1: Story = {
  args: {
    steps: checkoutSteps,
    currentStep: 0,
    variant: 'default',
  },
}

export const Step2: Story = {
  args: {
    steps: checkoutSteps,
    currentStep: 1,
    variant: 'default',
  },
}

export const Step3: Story = {
  args: {
    steps: checkoutSteps,
    currentStep: 2,
    variant: 'default',
  },
}

export const AllComplete: Story = {
  args: {
    steps: checkoutSteps,
    currentStep: 4,
    variant: 'default',
  },
}

export const Compact: Story = {
  args: {
    steps: checkoutSteps,
    currentStep: 1,
    variant: 'compact',
  },
}

export const ThreeSteps: Story = {
  args: {
    steps: [
      { label: 'Details' },
      { label: 'Review' },
      { label: 'Submit' },
    ],
    currentStep: 1,
    variant: 'default',
  },
}
