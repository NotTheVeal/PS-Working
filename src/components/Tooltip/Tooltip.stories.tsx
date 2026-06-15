import type { Meta, StoryObj } from '@storybook/react'
import { Tooltip } from './Tooltip'
import { Button } from '../Button/Button'
import { Badge } from '../Badge/Badge'

const meta = {
  title: 'PS Design Library/Overlay/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tooltip content="Add this part to your cart">
      <Button variant="secondary">Hover me</Button>
    </Tooltip>
  ),
}

export const Placements: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-8 p-16 place-items-center">
      <div />
      <Tooltip content="Tooltip on top" placement="top">
        <Button variant="secondary" size="sm">Top</Button>
      </Tooltip>
      <div />
      <Tooltip content="Tooltip on left" placement="left">
        <Button variant="secondary" size="sm">Left</Button>
      </Tooltip>
      <div />
      <Tooltip content="Tooltip on right" placement="right">
        <Button variant="secondary" size="sm">Right</Button>
      </Tooltip>
      <div />
      <Tooltip content="Tooltip on bottom" placement="bottom">
        <Button variant="secondary" size="sm">Bottom</Button>
      </Tooltip>
      <div />
    </div>
  ),
}

export const LongContent: Story = {
  render: () => (
    <Tooltip
      content="OEM parts come with a full manufacturer warranty and are guaranteed to meet original equipment specifications."
      placement="bottom"
      maxWidth={280}
    >
      <Badge variant="blue">OEM</Badge>
    </Tooltip>
  ),
}

export const OnIcon: Story = {
  render: () => (
    <Tooltip content="Part number copied to clipboard" placement="right">
      <button
        aria-label="Copy part number"
        className="flex items-center justify-center w-7 h-7 rounded text-[#6b6b6b] hover:text-[#1a1a1a] hover:bg-[#f0ede8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0]"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="3" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M4 3V2a1 1 0 011-1h6a1 1 0 011 1v8a1 1 0 01-1 1h-1" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </button>
    </Tooltip>
  ),
}
