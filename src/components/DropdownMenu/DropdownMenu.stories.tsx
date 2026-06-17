import type { Meta, StoryObj } from '@storybook/react'
import { DropdownMenu } from './DropdownMenu'

const meta = {
  title: 'PS Design Library/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof DropdownMenu>

export default meta
type Story = StoryObj<typeof meta>

const baseItems = [
  { label: 'Edit', onClick: () => console.log('Edit') },
  { label: 'Duplicate', onClick: () => console.log('Duplicate') },
  { separator: true, label: '' },
  { label: 'Delete', onClick: () => console.log('Delete'), destructive: true },
]

export const Default: Story = {
  args: {
    trigger: 'Options',
    items: baseItems,
    align: 'left',
  },
}

export const AlignRight: Story = {
  args: {
    trigger: 'Actions',
    items: baseItems,
    align: 'right',
  },
}

export const WithIcons: Story = {
  args: {
    trigger: 'Menu',
    items: [
      {
        label: 'Edit',
        icon: (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        ),
        onClick: () => console.log('Edit'),
      },
      {
        label: 'Copy',
        icon: (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
          </svg>
        ),
        onClick: () => console.log('Copy'),
      },
      { separator: true, label: '' },
      {
        label: 'Delete',
        icon: (
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        ),
        destructive: true,
        onClick: () => console.log('Delete'),
      },
    ],
  },
}

export const WithDisabledItem: Story = {
  args: {
    trigger: 'Options',
    items: [
      { label: 'Edit', onClick: () => console.log('Edit') },
      { label: 'Export', disabled: true, onClick: () => console.log('Export') },
      { separator: true, label: '' },
      { label: 'Delete', destructive: true, onClick: () => console.log('Delete') },
    ],
  },
}

export const Disabled: Story = {
  args: {
    trigger: 'Options',
    items: baseItems,
    disabled: true,
  },
}
