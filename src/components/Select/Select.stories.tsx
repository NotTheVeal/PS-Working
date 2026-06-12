import type { Meta, StoryObj } from '@storybook/react'
import { Select } from './Select'

const partCategories = [
  { value: 'electrical', label: 'Electrical' },
  { value: 'imaging',    label: 'Imaging' },
  { value: 'lab',        label: 'Lab Equipment' },
  { value: 'monitoring', label: 'Patient Monitoring' },
  { value: 'surgical',   label: 'Surgical' },
]

const meta = {
  title: 'PS Design Library/Forms/Select',
  component: Select,
  parameters: { layout: 'centered' },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
  argTypes: {
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    label:    { control: 'text' },
    hint:     { control: 'text' },
    error:    { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Part category',
    placeholder: 'Select a category…',
    options: partCategories,
  },
}

export const WithValue: Story = {
  args: {
    label: 'Part category',
    options: partCategories,
    defaultValue: 'imaging',
  },
}

export const WithHint: Story = {
  args: {
    label: 'Shipping method',
    hint: 'Expedited shipping available for most items.',
    placeholder: 'Select shipping method…',
    options: [
      { value: 'standard', label: 'Standard (5–7 days)' },
      { value: 'express',  label: 'Express (2–3 days)' },
      { value: 'overnight', label: 'Overnight' },
    ],
  },
}

export const WithError: Story = {
  args: {
    label: 'Part category',
    error: 'Please select a category to continue.',
    placeholder: 'Select a category…',
    options: partCategories,
  },
}

export const Required: Story = {
  args: {
    label: 'Priority',
    required: true,
    placeholder: 'Select priority…',
    options: [
      { value: 'low',    label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high',   label: 'High' },
      { value: 'urgent', label: 'Urgent' },
    ],
  },
}

export const Disabled: Story = {
  args: {
    label: 'Region',
    disabled: true,
    defaultValue: 'us-east',
    options: [
      { value: 'us-east', label: 'US East' },
      { value: 'us-west', label: 'US West' },
    ],
  },
}

export const NativeChildren: Story = {
  args: {
    label: 'Year',
    placeholder: 'Select year…',
  },
  render: (args) => (
    <Select {...args}>
      <optgroup label="Recent">
        <option value="2024">2024</option>
        <option value="2023">2023</option>
        <option value="2022">2022</option>
      </optgroup>
      <optgroup label="Older">
        <option value="2021">2021</option>
        <option value="2020">2020</option>
      </optgroup>
    </Select>
  ),
}
