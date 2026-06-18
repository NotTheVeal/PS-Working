import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Drawer } from './Drawer'

const meta = {
  title: 'PS Design Library/Overlay/Drawer',
  component: Drawer,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    side:       { control: 'select', options: ['left', 'right'] },
    size:       { control: 'select', options: ['sm', 'md', 'lg', 'full'] },
    persistent: { control: 'boolean' },
    title:      { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Drawer>

export default meta
type Story = StoryObj<typeof meta>

function DrawerDemo(props: Partial<React.ComponentProps<typeof Drawer>>) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="flex items-center justify-center h-screen bg-[#f0ede8]">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="px-4 py-2 bg-[#1a56b0] text-white rounded-lg text-sm font-medium"
      >
        Open Drawer
      </button>
      <Drawer open={open} onClose={() => setOpen(false)} {...props}>
        <p className="text-sm text-[#1a1a1a]">
          This is the drawer content area. Place any content here.
        </p>
      </Drawer>
    </div>
  )
}

export const Default: Story = {
  render: () => <DrawerDemo title="Drawer title" />,
}

export const FromLeft: Story = {
  render: () => <DrawerDemo title="Left drawer" side="left" />,
}

export const Small: Story = {
  render: () => <DrawerDemo title="Small drawer" size="sm" />,
}

export const Large: Story = {
  render: () => <DrawerDemo title="Large drawer" size="lg" />,
}

export const FullWidth: Story = {
  render: () => <DrawerDemo title="Full width drawer" size="full" />,
}

export const Persistent: Story = {
  render: () => <DrawerDemo title="Persistent drawer" persistent />,
}

export const WithFooter: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false)
    return (
      <div className="flex items-center justify-center h-screen bg-[#f0ede8]">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="px-4 py-2 bg-[#1a56b0] text-white rounded-lg text-sm font-medium"
        >
          Open Drawer
        </button>
        <Drawer
          open={open}
          onClose={() => setOpen(false)}
          title="Edit order"
          footer={
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-4 py-2 border border-[#e0ddd6] rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-[#1a56b0] text-white rounded-lg text-sm font-medium"
              >
                Save changes
              </button>
            </div>
          }
        >
          <p className="text-sm text-[#1a1a1a]">Edit form content here.</p>
        </Drawer>
      </div>
    )
  },
}

export const NoTitle: Story = {
  render: () => <DrawerDemo />,
}
