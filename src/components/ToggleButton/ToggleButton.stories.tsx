import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { ToggleButton } from './ToggleButton'

const BoldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M6 4h8a4 4 0 0 1 0 8H6V4zm0 8h9a4 4 0 0 1 0 8H6v-8z" />
  </svg>
)

const ItalicIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <line x1="19" y1="4" x2="10" y2="4" stroke="currentColor" strokeWidth="2" />
    <line x1="14" y1="20" x2="5" y2="20" stroke="currentColor" strokeWidth="2" />
    <line x1="15" y1="4" x2="9" y2="20" stroke="currentColor" strokeWidth="2" />
  </svg>
)

const meta = {
  title: 'PS Design Library/Actions/ToggleButton',
  component: ToggleButton,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant:        { control: 'select', options: ['default', 'outline'] },
    size:           { control: 'select', options: ['sm', 'md', 'lg'] },
    pressed:        { control: 'boolean' },
    defaultPressed: { control: 'boolean' },
    disabled:       { control: 'boolean' },
  },
} satisfies Meta<typeof ToggleButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Toggle',
    variant:  'default',
  },
}

export const Outline: Story = {
  args: {
    children: 'Toggle',
    variant:  'outline',
  },
}

export const PressedDefault: Story = {
  args: {
    children: 'Active',
    variant:  'default',
    pressed:  true,
  },
}

export const PressedOutline: Story = {
  args: {
    children: 'Active',
    variant:  'outline',
    pressed:  true,
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
  },
}

export const SizeSmall: Story = {
  args: { children: 'Small', size: 'sm' },
}

export const SizeMedium: Story = {
  args: { children: 'Medium', size: 'md' },
}

export const SizeLarge: Story = {
  args: { children: 'Large', size: 'lg' },
}

export const Uncontrolled: Story = {
  args: {
    children:       'Click to toggle',
    defaultPressed: false,
  },
}

export const Controlled: Story = {
  render: () => {
    const [pressed, setPressed] = React.useState(false)
    return (
      <div className="flex flex-col items-center gap-3 p-6 bg-[#f0ede8]">
        <ToggleButton pressed={pressed} onChange={setPressed} variant="outline">
          {pressed ? 'On' : 'Off'}
        </ToggleButton>
        <p className="text-sm text-[#1a1a1a]/60">State: {pressed ? 'pressed' : 'unpressed'}</p>
      </div>
    )
  },
}

export const TextFormattingToolbar: Story = {
  render: () => {
    const [bold, setBold] = React.useState(false)
    const [italic, setItalic] = React.useState(false)

    return (
      <div className="flex flex-col items-center gap-6 p-8 bg-[#f0ede8]">
        <div className="flex items-center gap-1 p-1 bg-white border border-[#e0ddd6] rounded-lg">
          <ToggleButton
            pressed={bold}
            onChange={setBold}
            variant="outline"
            size="sm"
            aria-label="Bold"
          >
            <BoldIcon />
          </ToggleButton>
          <ToggleButton
            pressed={italic}
            onChange={setItalic}
            variant="outline"
            size="sm"
            aria-label="Italic"
          >
            <ItalicIcon />
          </ToggleButton>
        </div>
        <p
          className="text-base text-[#1a1a1a]"
          style={{
            fontWeight: bold ? 700 : 400,
            fontStyle:  italic ? 'italic' : 'normal',
          }}
        >
          Sample text — toggle Bold and Italic above
        </p>
      </div>
    )
  },
}

export const FilterGroup: Story = {
  render: () => {
    const filters = ['All', 'Active', 'Draft', 'Archived']
    const [active, setActive] = React.useState('All')

    return (
      <div className="flex items-center gap-1.5 p-4 bg-[#f0ede8] rounded-xl flex-wrap">
        {filters.map((f) => (
          <ToggleButton
            key={f}
            pressed={active === f}
            onChange={() => setActive(f)}
            variant="outline"
            size="sm"
          >
            {f}
          </ToggleButton>
        ))}
      </div>
    )
  },
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-6 bg-[#f0ede8]">
      <div className="flex gap-3">
        <ToggleButton variant="default">Unpressed default</ToggleButton>
        <ToggleButton variant="default" pressed>Pressed default</ToggleButton>
      </div>
      <div className="flex gap-3">
        <ToggleButton variant="outline">Unpressed outline</ToggleButton>
        <ToggleButton variant="outline" pressed>Pressed outline</ToggleButton>
      </div>
    </div>
  ),
}
