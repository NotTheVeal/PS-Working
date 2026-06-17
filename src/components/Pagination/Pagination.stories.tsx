import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Pagination } from './Pagination'

const meta = {
  title: 'PS Design Library/Navigation/Pagination',
  component: Pagination,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { args: { totalPages: 10, currentPage: 1, onPageChange: () => {} } }
export const MiddlePage: Story = { args: { totalPages: 20, currentPage: 10, onPageChange: () => {} } }
export const LastPage: Story = { args: { totalPages: 8, currentPage: 8, onPageChange: () => {} } }
export const FewPages: Story = { args: { totalPages: 4, currentPage: 2, onPageChange: () => {} } }

export const Controlled: Story = {
  render: () => {
    const [page, setPage] = useState(1)
    return (
      <div className="flex flex-col items-center gap-4 p-6">
        <p className="text-[13px] text-[#6b6b6b]">Page {page} of 15</p>
        <Pagination totalPages={15} currentPage={page} onPageChange={setPage} />
      </div>
    )
  },
}
