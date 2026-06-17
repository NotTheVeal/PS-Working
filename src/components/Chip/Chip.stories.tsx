import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Chip } from './Chip'

const meta = {
  title: 'PS Design Library/Controls/Chip',
  component: Chip,
  parameters: { layout: 'centered' },
  argTypes: {
    variant:  { control: 'select', options: ['default', 'selected', 'filter'] },
    size:     { control: 'select', options: ['sm', 'md', 'lg'] },
    selected: { control: 'boolean' },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Chip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { children: 'All categories' },
}

export const Selected: Story = {
  args: { children: 'In stock', selected: true },
}

export const Removable: Story = {
  render: () => {
    const [items, setItems] = useState(['React', 'TypeScript', 'Tailwind', 'Storybook'])
    return (
      <div className="flex flex-wrap gap-2 p-4">
        {items.map((item) => (
          <Chip
            key={item}
            onRemove={() => setItems((prev) => prev.filter((i) => i !== item))}
          >
            {item}
          </Chip>
        ))}
      </div>
    )
  },
}

export const FilterGroup: Story = {
  render: () => {
    const filters = ['In stock', 'OEM', 'Aftermarket', 'Remanufactured', 'Core deposit']
    const [active, setActive] = useState<string[]>(['In stock'])
    return (
      <div className="flex flex-wrap gap-2 p-4">
        {filters.map((f) => (
          <Chip
            key={f}
            variant="filter"
            selected={active.includes(f)}
            onToggle={(sel) =>
              setActive((prev) => sel ? [...prev, f] : prev.filter((x) => x !== f))
            }
          >
            {f}
          </Chip>
        ))}
      </div>
    )
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2 p-4">
      <Chip variant="default">Default</Chip>
      <Chip variant="selected" selected>Selected</Chip>
      <Chip variant="filter">Filter</Chip>
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-2 p-4">
      <Chip size="sm">Small</Chip>
      <Chip size="md">Medium</Chip>
      <Chip size="lg">Large</Chip>
    </div>
  ),
}

export const Disabled: Story = {
  args: { children: 'Unavailable', disabled: true },
}
