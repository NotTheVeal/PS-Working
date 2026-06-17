import type { Meta, StoryObj } from '@storybook/react'
import { Combobox } from './Combobox'

const meta = {
  title: 'PS Design Library/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320, paddingBottom: 300 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Combobox>

export default meta
type Story = StoryObj<typeof meta>

const fruitOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'date', label: 'Date' },
  { value: 'elderberry', label: 'Elderberry' },
  { value: 'fig', label: 'Fig' },
  { value: 'grape', label: 'Grape' },
]

export const Default: Story = {
  args: {
    options: fruitOptions,
    label: 'Fruit',
    placeholder: 'Search fruit…',
  },
}

export const WithValue: Story = {
  args: {
    options: fruitOptions,
    label: 'Fruit',
    value: 'cherry',
  },
}

export const WithHint: Story = {
  args: {
    options: fruitOptions,
    label: 'Fruit',
    hint: 'Choose your favourite fruit',
    placeholder: 'Search fruit…',
  },
}

export const WithError: Story = {
  args: {
    options: fruitOptions,
    label: 'Fruit',
    error: 'Please select a valid fruit',
    placeholder: 'Search fruit…',
  },
}

export const WithDisabledOption: Story = {
  args: {
    options: [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana (unavailable)', disabled: true },
      { value: 'cherry', label: 'Cherry' },
    ],
    label: 'Fruit',
    placeholder: 'Search fruit…',
  },
}

export const Disabled: Story = {
  args: {
    options: fruitOptions,
    label: 'Fruit',
    disabled: true,
    placeholder: 'Search fruit…',
  },
}
