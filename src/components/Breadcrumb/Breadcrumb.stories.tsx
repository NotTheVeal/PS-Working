import type { Meta, StoryObj } from '@storybook/react'
import { Breadcrumb } from './Breadcrumb'

const meta = {
  title: 'PS Design Library/Navigation/Breadcrumb',
  component: Breadcrumb,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: [
      { label: 'Home', href: '#' },
      { label: 'Catalog', href: '#' },
      { label: 'Imaging', href: '#' },
      { label: 'Ultrasound probes' },
    ],
  },
}

export const Short: Story = {
  args: {
    items: [
      { label: 'Orders', href: '#' },
      { label: 'PO-12345' },
    ],
  },
}

export const WithCollapse: Story = {
  args: {
    maxItems: 3,
    items: [
      { label: 'Home', href: '#' },
      { label: 'Catalog', href: '#' },
      { label: 'Imaging', href: '#' },
      { label: 'Ultrasound', href: '#' },
      { label: 'Transducer probes', href: '#' },
      { label: 'AB-7890-UT' },
    ],
  },
}
