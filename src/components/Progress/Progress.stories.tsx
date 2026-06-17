import React, { useEffect, useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Progress } from './Progress'

const meta = {
  title: 'PS Design Library/Feedback/Progress',
  component: Progress,
  parameters: { layout: 'padded' },
  decorators: [(Story) => <div style={{ maxWidth: 400 }}><Story /></div>],
  tags: ['autodocs'],
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { value: 65, label: 'Upload progress', showLabel: true } }
export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <Progress value={70} variant="default" label="Processing" showLabel />
      <Progress value={85} variant="success" label="Complete"   showLabel />
      <Progress value={45} variant="warning" label="At risk"    showLabel />
      <Progress value={20} variant="error"   label="Failed"     showLabel />
    </div>
  ),
}
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-4">
      <Progress value={60} size="sm" />
      <Progress value={60} size="md" />
      <Progress value={60} size="lg" />
    </div>
  ),
}
export const Indeterminate: Story = { args: { value: 0, indeterminate: true, label: 'Loading parts…' } }
export const Animated: Story = {
  render: () => {
    const [v, setV] = useState(0)
    useEffect(() => {
      const t = setInterval(() => setV(p => p >= 100 ? 0 : p + 5), 300)
      return () => clearInterval(t)
    }, [])
    return <Progress value={v} label="Syncing catalog" showLabel variant="default" />
  },
}
