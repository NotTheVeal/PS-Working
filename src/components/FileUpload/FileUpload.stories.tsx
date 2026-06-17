import type { Meta, StoryObj } from '@storybook/react'
import { FileUpload } from './FileUpload'

const meta = {
  title: 'PS Design Library/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 480 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FileUpload>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Attachment',
    hint: 'Upload any relevant documents',
  },
}

export const ImageOnly: Story = {
  args: {
    label: 'Product image',
    accept: '.jpg,.jpeg,.png,.webp',
    hint: 'JPG, PNG or WebP',
  },
}

export const WithMaxSize: Story = {
  args: {
    label: 'Document',
    maxSize: 5 * 1024 * 1024, // 5 MB
    hint: 'PDF only',
    accept: '.pdf',
  },
}

export const Multiple: Story = {
  args: {
    label: 'Attachments',
    multiple: true,
    hint: 'Upload up to 10 files',
  },
}

export const WithError: Story = {
  args: {
    label: 'Attachment',
    error: 'Please upload a file to continue',
  },
}

export const Disabled: Story = {
  args: {
    label: 'Attachment',
    hint: 'Upload disabled',
    disabled: true,
  },
}
