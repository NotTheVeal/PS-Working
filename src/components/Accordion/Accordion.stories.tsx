import type { Meta, StoryObj } from '@storybook/react'
import { Accordion } from './Accordion'

const faqItems = [
  {
    id: 'shipping',
    trigger: 'What are the shipping options?',
    content: 'We offer standard (5–7 days), express (2–3 days), and overnight shipping. Free standard shipping on orders over $500.',
  },
  {
    id: 'returns',
    trigger: 'What is the return policy?',
    content: 'Most parts can be returned within 30 days of receipt in original, unopened packaging. Electrical parts are final sale.',
  },
  {
    id: 'warranty',
    trigger: 'Do parts come with a warranty?',
    content: 'OEM parts carry the full manufacturer warranty. Aftermarket and remanufactured parts include a 90-day PS warranty.',
  },
  {
    id: 'bulk',
    trigger: 'Can I place bulk orders?',
    content: 'Yes — contact your account manager or use the bulk order form in your account dashboard.',
  },
]

const meta = {
  title: 'PS Design Library/Display/Accordion',
  component: Accordion,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div style={{ maxWidth: 560 }}><Story /></div>],
  tags: ['autodocs'],
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { items: faqItems } }
export const DefaultOpen: Story = { args: { items: faqItems, defaultOpen: ['shipping'] } }
export const Multiple: Story = { args: { items: faqItems, multiple: true, defaultOpen: ['shipping', 'warranty'] } }
export const WithDisabled: Story = {
  args: {
    items: faqItems.map((item, i) => ({ ...item, disabled: i === 2 })),
  },
}
