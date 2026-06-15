import type { Meta, StoryObj } from '@storybook/react'
import { OrderFormDemo } from './OrderFormDemo'

const meta = {
  title: 'PS Design Library/Demo/Order Form',
  component: OrderFormDemo,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'page' },
  },
} satisfies Meta<typeof OrderFormDemo>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
