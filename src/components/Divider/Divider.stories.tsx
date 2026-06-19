import type { Meta, StoryObj } from '@storybook/react'
import { Divider } from './Divider'

const meta = {
  title: 'PS Design Library/Layout/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'dashed', 'dotted'],
    },
    labelPosition: {
      control: 'select',
      options: ['start', 'center', 'end'],
    },
  },
} satisfies Meta<typeof Divider>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    orientation: 'horizontal',
  },
  render: (args) => (
    <div className="w-full">
      <p className="mb-4 text-sm">Above the divider</p>
      <Divider {...args} />
      <p className="mt-4 text-sm">Below the divider</p>
    </div>
  ),
}

export const WithLabel: Story = {
  args: {
    label: 'or continue with',
    labelPosition: 'center',
  },
  render: (args) => (
    <div className="w-full">
      <Divider {...args} />
    </div>
  ),
}

export const LabelStart: Story = {
  args: {
    label: 'Section start',
    labelPosition: 'start',
  },
  render: (args) => (
    <div className="w-full">
      <Divider {...args} />
    </div>
  ),
}

export const LabelEnd: Story = {
  args: {
    label: 'End of section',
    labelPosition: 'end',
  },
  render: (args) => (
    <div className="w-full">
      <Divider {...args} />
    </div>
  ),
}

export const Dashed: Story = {
  args: {
    variant: 'dashed',
    label: 'Dashed',
    labelPosition: 'center',
  },
  render: (args) => (
    <div className="w-full">
      <Divider {...args} />
    </div>
  ),
}

export const Dotted: Story = {
  args: {
    variant: 'dotted',
    label: 'Dotted',
    labelPosition: 'center',
  },
  render: (args) => (
    <div className="w-full">
      <Divider {...args} />
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8 w-full">
      <Divider variant="solid" label="Solid" />
      <Divider variant="dashed" label="Dashed" />
      <Divider variant="dotted" label="Dotted" />
    </div>
  ),
}

export const Vertical: Story = {
  render: () => (
    <div className="flex items-center gap-4 h-16">
      <span className="text-sm">Left</span>
      <Divider orientation="vertical" />
      <span className="text-sm">Middle</span>
      <Divider orientation="vertical" variant="dashed" />
      <span className="text-sm">Right</span>
    </div>
  ),
}

export const InForm: Story = {
  render: () => (
    <div className="flex flex-col gap-4 w-80">
      <button
        type="button"
        className="w-full border border-[#e0ddd6] rounded-lg py-2 text-sm font-medium text-[#1a1a1a] hover:bg-[#f0ede8]"
      >
        Continue with Google
      </button>
      <Divider label="or" />
      <div className="flex flex-col gap-2">
        <input
          type="email"
          placeholder="Email"
          className="border border-[#e0ddd6] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1a56b0]"
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-[#e0ddd6] rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1a56b0]"
        />
      </div>
    </div>
  ),
}
