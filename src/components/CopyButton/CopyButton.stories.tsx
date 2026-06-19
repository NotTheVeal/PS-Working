import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { CopyButton } from './CopyButton'

const meta = {
  title: 'PS Design Library/Actions/CopyButton',
  component: CopyButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant:      { control: 'select', options: ['default', 'ghost', 'outline'] },
    size:         { control: 'select', options: ['sm', 'md', 'lg'] },
    label:        { control: 'text' },
    successLabel: { control: 'text' },
    timeout:      { control: 'number' },
    text:         { control: 'text' },
    disabled:     { control: 'boolean' },
  },
} satisfies Meta<typeof CopyButton>

export default meta
type Story = StoryObj<typeof meta>

const CODE_SNIPPET = 'npm install @partssource/design-system'

export const Default: Story = {
  args: {
    text: CODE_SNIPPET,
    variant: 'outline',
  },
}

export const VariantDefault: Story = {
  args: {
    text: CODE_SNIPPET,
    variant: 'default',
    label: 'Copy',
  },
}

export const VariantGhost: Story = {
  args: {
    text: CODE_SNIPPET,
    variant: 'ghost',
    label: 'Copy',
  },
}

export const VariantOutline: Story = {
  args: {
    text: CODE_SNIPPET,
    variant: 'outline',
    label: 'Copy',
  },
}

export const SizeSmall: Story = {
  args: { text: CODE_SNIPPET, size: 'sm', label: 'Copy' },
}

export const SizeMedium: Story = {
  args: { text: CODE_SNIPPET, size: 'md', label: 'Copy' },
}

export const SizeLarge: Story = {
  args: { text: CODE_SNIPPET, size: 'lg', label: 'Copy' },
}

export const CustomLabels: Story = {
  args: {
    text: 'Hello, World!',
    label: 'Copy code',
    successLabel: 'Done!',
    timeout: 1500,
  },
}

export const Disabled: Story = {
  args: {
    text: CODE_SNIPPET,
    disabled: true,
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 p-6 bg-[#f0ede8]">
      <CopyButton text="copy me" variant="default" label="Copy" />
      <CopyButton text="copy me" variant="outline" label="Copy" />
      <CopyButton text="copy me" variant="ghost" label="Copy" />
    </div>
  ),
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3 p-6 bg-[#f0ede8]">
      <CopyButton text="copy me" size="sm" label="Small" />
      <CopyButton text="copy me" size="md" label="Medium" />
      <CopyButton text="copy me" size="lg" label="Large" />
    </div>
  ),
}

export const InlineWithCode: Story = {
  render: () => (
    <div className="p-6 bg-[#1a1a1a] rounded-xl flex items-center justify-between gap-4 min-w-[360px]">
      <code className="text-[#d97757] text-sm font-mono">npm install @ps/design</code>
      <CopyButton text="npm install @ps/design" size="sm" variant="ghost" label="Copy" />
    </div>
  ),
}
