import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Popover } from './Popover'

const meta = {
  title: 'PS Design Library/Overlays/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    placement: {
      control: 'select',
      options: ['top', 'bottom', 'left', 'right'],
    },
    title: { control: 'text' },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>

export default meta
type Story = StoryObj<typeof meta>

// ─── Shared trigger button ────────────────────────────────────────────────────

function TriggerButton({ label = 'Open Popover' }: { label?: string }) {
  return (
    <button
      type="button"
      className={[
        'px-4 py-2 rounded-lg text-sm font-medium',
        'bg-[#1a56b0] text-white',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  name: 'Default (bottom)',
  args: {
    placement: 'bottom',
    trigger: <TriggerButton />,
    children: 'This is the popover content. Click outside or press Escape to close.',
  },
}

export const TopPlacement: Story = {
  name: 'Top Placement',
  args: {
    placement: 'top',
    trigger: <TriggerButton label="Popover Above" />,
    children: 'This popover appears above the trigger.',
  },
  decorators: [
    (Story) => (
      <div className="pt-24">
        <Story />
      </div>
    ),
  ],
}

export const LeftPlacement: Story = {
  name: 'Left Placement',
  args: {
    placement: 'left',
    trigger: <TriggerButton label="Popover Left" />,
    children: 'This popover appears to the left.',
  },
  decorators: [
    (Story) => (
      <div className="pl-56">
        <Story />
      </div>
    ),
  ],
}

export const RightPlacement: Story = {
  name: 'Right Placement',
  args: {
    placement: 'right',
    trigger: <TriggerButton label="Popover Right" />,
    children: 'This popover appears to the right.',
  },
}

export const WithTitle: Story = {
  name: 'With Title',
  args: {
    placement: 'bottom',
    title: 'More information',
    trigger: <TriggerButton label="Help" />,
    children:
      'This field accepts ISO 8601 date strings. Example: 2026-06-19. Dates must be in the future.',
  },
}

export const Controlled: Story = {
  name: 'Controlled',
  render: function ControlledDemo() {
    const [open, setOpen] = React.useState(false)
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="px-3 py-1.5 text-sm rounded-lg bg-[#1a6b3a] text-white font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1"
          >
            Open externally
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="px-3 py-1.5 text-sm rounded-lg bg-[#1a1a1a] text-white font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1"
          >
            Close externally
          </button>
        </div>
        <Popover
          open={open}
          onOpenChange={setOpen}
          placement="bottom"
          title="Controlled Popover"
          trigger={<TriggerButton label="Toggle" />}
        >
          <p>This popover is fully controlled via external state.</p>
          <p className="mt-1 text-xs text-[#1a1a1a]/60">
            Open state: <strong>{open ? 'open' : 'closed'}</strong>
          </p>
        </Popover>
      </div>
    )
  },
}

export const WithInteractiveContent: Story = {
  name: 'With Interactive Content',
  render: function InteractiveDemo() {
    const [submitted, setSubmitted] = React.useState(false)
    return (
      <Popover
        placement="bottom"
        title="Quick Feedback"
        trigger={<TriggerButton label="Give Feedback" />}
      >
        {submitted ? (
          <p className="text-[#1a6b3a] font-medium text-sm">Thank you for your feedback!</p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              setSubmitted(true)
            }}
            className="flex flex-col gap-3"
          >
            <label className="flex flex-col gap-1 text-xs font-medium text-[#1a1a1a]">
              Your name
              <input
                type="text"
                placeholder="Jane Smith"
                className={[
                  'rounded-lg border border-[#e0ddd6] px-3 py-1.5 text-sm',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
                ].join(' ')}
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-medium text-[#1a1a1a]">
              Comment
              <textarea
                rows={3}
                placeholder="Tell us what you think…"
                className={[
                  'rounded-lg border border-[#e0ddd6] px-3 py-1.5 text-sm resize-none',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
                ].join(' ')}
              />
            </label>
            <button
              type="submit"
              className={[
                'self-end px-4 py-1.5 rounded-lg text-sm font-medium',
                'bg-[#d97757] text-white',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
              ].join(' ')}
            >
              Submit
            </button>
          </form>
        )}
      </Popover>
    )
  },
}
