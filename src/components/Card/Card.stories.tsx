import type { Meta, StoryObj } from '@storybook/react'
import { Card, CardHeader, CardBody, CardFooter, CardDivider } from './Card'
import { Button } from '../Button/Button'

const meta = {
  title: 'PS Design Library/Layout/Card',
  component: Card,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card style={{ width: 360 }}>
      <CardHeader title="Card title" description="Supporting description text goes here." />
      <CardBody>
        Body content goes here. This is where the main information lives.
      </CardBody>
      <CardFooter>
        <Button variant="secondary" size="sm">Cancel</Button>
        <Button variant="primary" size="sm">Confirm</Button>
      </CardFooter>
    </Card>
  ),
}

export const SimpleContent: Story = {
  render: () => (
    <Card style={{ width: 320 }}>
      <p className="text-[14px] text-[#1a1a1a]">A simple card with just children passed directly.</p>
    </Card>
  ),
}

export const WithAction: Story = {
  render: () => (
    <Card style={{ width: 380 }}>
      <CardHeader
        title="Recent orders"
        description="Last 30 days"
        action={<Button variant="ghost" size="sm">View all</Button>}
      />
      <CardBody>
        <p className="text-[13px] text-[#6b6b6b]">No orders found.</p>
      </CardBody>
    </Card>
  ),
}

export const WithDivider: Story = {
  render: () => (
    <Card style={{ width: 360 }}>
      <CardHeader title="Section one" />
      <CardBody>First section content.</CardBody>
      <CardDivider />
      <CardHeader title="Section two" />
      <CardBody>Second section content.</CardBody>
    </Card>
  ),
}

export const Flush: Story = {
  render: () => (
    <Card flush style={{ width: 360 }}>
      <div className="h-32 bg-[#f0ede8] rounded-t-[10px]" aria-label="Image placeholder" />
      <div className="p-5">
        <CardHeader title="Flush card" description="Image bleeds to the edges." />
        <CardBody>Content with manual padding.</CardBody>
      </div>
    </Card>
  ),
}

export const FooterAlignments: Story = {
  render: () => (
    <div className="flex flex-col gap-4" style={{ width: 360 }}>
      <Card>
        <CardBody>Footer aligned right (default)</CardBody>
        <CardFooter align="right">
          <Button variant="secondary" size="sm">Cancel</Button>
          <Button size="sm">Save</Button>
        </CardFooter>
      </Card>
      <Card>
        <CardBody>Footer aligned between</CardBody>
        <CardFooter align="between">
          <Button variant="danger" size="sm">Delete</Button>
          <Button size="sm">Save</Button>
        </CardFooter>
      </Card>
    </div>
  ),
}
