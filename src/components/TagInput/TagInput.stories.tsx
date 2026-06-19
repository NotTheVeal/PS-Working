import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { TagInput } from './TagInput'

const meta = {
  title: 'PS Design Library/Forms/TagInput',
  component: TagInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof TagInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Tags',
    placeholder: 'Type and press Enter…',
    defaultValue: ['react', 'typescript'],
  },
}

export const WithHint: Story = {
  args: {
    label: 'Skills',
    hint: 'Press Enter or comma to add a tag',
    placeholder: 'Add a skill…',
  },
}

export const WithError: Story = {
  args: {
    label: 'Categories',
    defaultValue: ['design'],
    error: 'At least 3 categories are required',
    placeholder: 'Add a category…',
  },
}

export const MaxTags: Story = {
  args: {
    label: 'Labels (max 3)',
    defaultValue: ['bug', 'urgent', 'v2'],
    maxTags: 3,
    hint: 'Maximum 3 labels allowed',
  },
}

export const WithValidation: Story = {
  args: {
    label: 'Email tags',
    placeholder: 'Enter an email…',
    validate: (tag: string) => {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRe.test(tag) || 'Must be a valid email address'
    },
    hint: 'Enter valid email addresses',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Tags',
    defaultValue: ['locked', 'read-only'],
    disabled: true,
  },
}

export const Controlled: Story = {
  render: () => {
    const [tags, setTags] = useState(['controlled', 'example'])
    return (
      <div className="flex flex-col gap-4">
        <TagInput
          label="Controlled TagInput"
          value={tags}
          onChange={setTags}
          placeholder="Add a tag…"
          hint="Tags are managed externally"
        />
        <p className="text-sm text-gray-500">Current value: [{tags.join(', ')}]</p>
      </div>
    )
  },
}
