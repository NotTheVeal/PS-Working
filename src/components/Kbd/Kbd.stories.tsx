import type { Meta, StoryObj } from '@storybook/react'
import { Kbd, Shortcut } from './Kbd'

const meta = {
  title: 'PS Design Library/Utilities/Kbd',
  component: Kbd,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Kbd>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: '⌘',
    size: 'md',
  },
}

export const Small: Story = {
  args: {
    children: 'Esc',
    size: 'sm',
  },
}

export const Large: Story = {
  args: {
    children: 'Enter',
    size: 'lg',
  },
}

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-4">
      <Kbd size="sm">Ctrl</Kbd>
      <Kbd size="md">Ctrl</Kbd>
      <Kbd size="lg">Ctrl</Kbd>
    </div>
  ),
}

export const CommonKeys: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {['⌘', '⌥', '⇧', '⌃', 'Ctrl', 'Alt', 'Shift', 'Tab', 'Enter', 'Esc', '↑', '↓', '←', '→'].map(
        (key) => (
          <Kbd key={key}>{key}</Kbd>
        )
      )}
    </div>
  ),
}

export const ShortcutCombo: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-6">
        <span className="text-sm text-gray-500 w-32">Command palette</span>
        <Shortcut keys={['⌘', 'K']} />
      </div>
      <div className="flex items-center gap-6">
        <span className="text-sm text-gray-500 w-32">Save file</span>
        <Shortcut keys={['Ctrl', 'S']} />
      </div>
      <div className="flex items-center gap-6">
        <span className="text-sm text-gray-500 w-32">Format document</span>
        <Shortcut keys={['Ctrl', 'Shift', 'P']} />
      </div>
      <div className="flex items-center gap-6">
        <span className="text-sm text-gray-500 w-32">Undo</span>
        <Shortcut keys={['⌘', 'Z']} size="sm" />
      </div>
      <div className="flex items-center gap-6">
        <span className="text-sm text-gray-500 w-32">Large combo</span>
        <Shortcut keys={['Ctrl', 'Alt', 'Delete']} size="lg" />
      </div>
    </div>
  ),
}

export const InlineUsage: StoryObj = {
  render: () => (
    <p className="text-sm text-[#1a1a1a]">
      Press <Kbd size="sm">⌘</Kbd> <Kbd size="sm">K</Kbd> to open the command palette, or{' '}
      <Kbd size="sm">Esc</Kbd> to dismiss it.
    </p>
  ),
}
