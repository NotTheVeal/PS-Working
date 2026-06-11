import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

const meta = {
  title: 'PS Design Library/Forms/Input',
  component: Input,
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
  argTypes: {
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    label:    { control: 'text' },
    hint:     { control: 'text' },
    error:    { control: 'text' },
    placeholder: { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Part number',
    placeholder: 'e.g. AB-1234-XY',
  },
}

export const WithHint: Story = {
  args: {
    label: 'Email address',
    hint: 'We'll use this to send your order confirmation.',
    placeholder: 'you@example.com',
    type: 'email',
  },
}

export const WithError: Story = {
  args: {
    label: 'Part number',
    error: 'Part number not found. Check the format and try again.',
    defaultValue: 'AB-INVALID',
  },
}

export const Required: Story = {
  args: {
    label: 'Purchase order number',
    required: true,
    placeholder: 'PO-12345',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Serial number',
    disabled: true,
    defaultValue: 'SN-00789-LOCKED',
  },
}

export const WithLeadingIcon: Story = {
  args: {
    label: 'Search parts',
    leadingIcon: <SearchIcon />,
    placeholder: 'Search by part number or description',
  },
}

export const NoLabel: Story = {
  args: {
    hideLabel: true,
    label: 'Search',
    leadingIcon: <SearchIcon />,
    placeholder: 'Search…',
    'aria-label': 'Search parts',
  },
}

export const AllStates: Story = {
  render: () => (
    <div className="flex flex-col gap-5 p-4" style={{ width: 360 }}>
      <Input label="Default" placeholder="Placeholder text" />
      <Input label="With value" defaultValue="AB-1234-XY" />
      <Input label="With hint" hint="8–12 characters required." placeholder="Enter code" />
      <Input label="With error" error="This field is required." defaultValue="" />
      <Input label="Disabled" disabled defaultValue="Cannot edit" />
      <Input label="Required" required placeholder="Required field" />
    </div>
  ),
}
