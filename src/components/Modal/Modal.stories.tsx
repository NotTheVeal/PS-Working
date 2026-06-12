import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Modal } from './Modal'
import { Button } from '../Button/Button'
import { Input } from '../Input/Input'

const meta = {
  title: 'PS Design Library/Overlay/Modal',
  component: Modal,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>

export default meta
type Story = StoryObj<typeof meta>

const Trigger = ({ label, children }: { label: string; children: (open: boolean, setOpen: (v: boolean) => void) => React.ReactNode }) => {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <Button onClick={() => setOpen(true)}>{label}</Button>
      {children(open, setOpen)}
    </div>
  )
}

export const Default: Story = {
  render: () => (
    <Trigger label="Open modal">
      {(open, setOpen) => (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Confirm order"
          description="Review your order before submitting."
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => setOpen(false)}>Submit order</Button>
            </>
          }
        >
          <p>Order #PO-12345 for 3 items totalling $248.00 will be submitted for processing.</p>
        </Modal>
      )}
    </Trigger>
  ),
}

export const Small: Story = {
  render: () => (
    <Trigger label="Open small modal">
      {(open, setOpen) => (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Delete item"
          size="sm"
          footer={
            <>
              <Button variant="secondary" size="sm" onClick={() => setOpen(false)}>Cancel</Button>
              <Button variant="danger" size="sm" onClick={() => setOpen(false)}>Delete</Button>
            </>
          }
        >
          <p className="text-[14px] text-[#4a4a4a]">
            Are you sure you want to remove this part from your cart? This action cannot be undone.
          </p>
        </Modal>
      )}
    </Trigger>
  ),
}

export const Large: Story = {
  render: () => (
    <Trigger label="Open large modal">
      {(open, setOpen) => (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Part details"
          size="lg"
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>Close</Button>
              <Button onClick={() => setOpen(false)}>Add to cart</Button>
            </>
          }
        >
          <div className="flex flex-col gap-4">
            <div className="h-40 bg-[#f0ede8] rounded-lg flex items-center justify-center text-[#6b6b6b] text-[13px]">
              Part image
            </div>
            <div>
              <h3 className="text-[14px] font-semibold text-[#1a1a1a]">Ultrasound transducer probe</h3>
              <p className="text-[13px] text-[#6b6b6b] mt-1">Part number: AB-7890-UT</p>
            </div>
            <p className="text-[14px] text-[#4a4a4a] leading-[1.6]">
              OEM replacement probe compatible with GE Vivid E9 and E95 systems.
              Includes 6-month warranty and calibration certificate.
            </p>
          </div>
        </Modal>
      )}
    </Trigger>
  ),
}

export const WithForm: Story = {
  render: () => (
    <Trigger label="Edit shipping address">
      {(open, setOpen) => (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Edit shipping address"
          size="md"
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={() => setOpen(false)}>Save address</Button>
            </>
          }
        >
          <div className="flex flex-col gap-4">
            <Input label="Street address" placeholder="123 Main St" />
            <div className="flex gap-3">
              <Input label="City" placeholder="Columbus" />
              <Input label="State" placeholder="OH" />
            </div>
            <Input label="ZIP code" placeholder="43215" />
          </div>
        </Modal>
      )}
    </Trigger>
  ),
}

export const Persistent: Story = {
  render: () => (
    <Trigger label="Open persistent modal">
      {(open, setOpen) => (
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="Session expiring"
          size="sm"
          persistent
          footer={
            <>
              <Button variant="secondary" onClick={() => setOpen(false)}>Sign out</Button>
              <Button onClick={() => setOpen(false)}>Stay signed in</Button>
            </>
          }
        >
          <p className="text-[14px] text-[#4a4a4a]">
            Your session will expire in 5 minutes. Would you like to stay signed in?
          </p>
        </Modal>
      )}
    </Trigger>
  ),
}
