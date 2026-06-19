import type { Meta, StoryObj } from '@storybook/react'
import * as React from 'react'
import { SearchInput } from './SearchInput'

const meta = {
  title: 'PS Design Library/Forms/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    placeholder: 'Search parts…',
    label: 'Search',
    size: 'md',
  },
} satisfies Meta<typeof SearchInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
  args: {
    defaultValue: 'Bearing 6203',
  },
}

export const Loading: Story = {
  args: {
    defaultValue: 'SKF bearing',
    loading: true,
  },
}

export const SizeSmall: Story = {
  args: {
    size: 'sm',
    placeholder: 'Search…',
  },
}

export const SizeMedium: Story = {
  args: {
    size: 'md',
    placeholder: 'Search…',
  },
}

export const SizeLarge: Story = {
  args: {
    size: 'lg',
    placeholder: 'Search…',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'Locked query',
  },
}

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = React.useState('')
    const [submitted, setSubmitted] = React.useState('')
    return (
      <div className="flex flex-col gap-3 w-80">
        <SearchInput
          {...args}
          value={value}
          onChange={setValue}
          onSearch={(v) => setSubmitted(v)}
          onClear={() => setSubmitted('')}
          placeholder="Search parts…"
          label="Part search"
        />
        {submitted && (
          <p className="text-sm text-[#6b6b6b]">Last search: <strong>{submitted}</strong></p>
        )}
      </div>
    )
  },
}

export const AllSizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4 w-80">
      <SearchInput {...args} size="sm" placeholder="Small search" />
      <SearchInput {...args} size="md" placeholder="Medium search" />
      <SearchInput {...args} size="lg" placeholder="Large search" />
    </div>
  ),
}
