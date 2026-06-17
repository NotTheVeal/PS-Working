import React, { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Table, TableHead, TableBody, TableFooter, TableRow, TableHeader, TableCell, TableCaption } from './Table'
import { Badge } from '../Badge/Badge'
import { Button } from '../Button/Button'

const meta = {
  title: 'PS Design Library/Data/Table',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const parts = [
  { id: 'AB-7890', name: 'Ultrasound transducer probe', category: 'Imaging',     qty: 1, price: 1240.00, status: 'In stock' },
  { id: 'CD-1234', name: 'Patient monitor display',     category: 'Monitoring',  qty: 2, price:  890.00, status: 'In stock' },
  { id: 'EF-5678', name: 'Infusion pump motor',         category: 'Surgical',    qty: 1, price:  345.00, status: 'Low stock' },
  { id: 'GH-9012', name: 'ECG electrode set (100pk)',   category: 'Monitoring',  qty: 5, price:   48.50, status: 'In stock' },
  { id: 'IJ-3456', name: 'X-ray collimator assembly',   category: 'Imaging',     qty: 1, price: 2100.00, status: 'Backordered' },
]

const statusVariant = (s: string) =>
  s === 'In stock' ? 'green' : s === 'Low stock' ? 'orange' : 'red' as const

export const Default: Story = {
  render: () => (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Part number</TableHeader>
          <TableHeader>Description</TableHeader>
          <TableHeader>Category</TableHeader>
          <TableHeader>Qty</TableHeader>
          <TableHeader>Unit price</TableHeader>
          <TableHeader>Status</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {parts.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-mono text-[13px] text-[#1a56b0]">{p.id}</TableCell>
            <TableCell>{p.name}</TableCell>
            <TableCell className="text-[#6b6b6b]">{p.category}</TableCell>
            <TableCell className="text-right tabular-nums">{p.qty}</TableCell>
            <TableCell className="text-right tabular-nums">${p.price.toFixed(2)}</TableCell>
            <TableCell>
              <Badge variant={statusVariant(p.status)} size="sm">{p.status}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}

export const WithFooter: Story = {
  render: () => {
    const total = parts.reduce((sum, p) => sum + p.price * p.qty, 0)
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Part number</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Qty</TableHeader>
            <TableHeader>Unit price</TableHeader>
            <TableHeader>Total</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {parts.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-mono text-[13px] text-[#1a56b0]">{p.id}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell className="text-right tabular-nums">{p.qty}</TableCell>
              <TableCell className="text-right tabular-nums">${p.price.toFixed(2)}</TableCell>
              <TableCell className="text-right tabular-nums">${(p.price * p.qty).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-right text-[#6b6b6b]">Order total</TableCell>
            <TableCell className="text-right tabular-nums">${total.toFixed(2)}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )
  },
}

export const Sortable: Story = {
  render: () => {
    const [sortKey, setSortKey] = useState<keyof typeof parts[0]>('id')
    const [dir, setDir] = useState<'asc' | 'desc'>('asc')
    const sorted = [...parts].sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey]
      return dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av))
    })
    function toggleSort(key: keyof typeof parts[0]) {
      if (sortKey === key) setDir(d => d === 'asc' ? 'desc' : 'asc')
      else { setSortKey(key); setDir('asc') }
    }
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader sortable sorted={sortKey === 'id' ? dir : false} onClick={() => toggleSort('id')}>Part number</TableHeader>
            <TableHeader sortable sorted={sortKey === 'name' ? dir : false} onClick={() => toggleSort('name')}>Description</TableHeader>
            <TableHeader sortable sorted={sortKey === 'price' ? dir : false} onClick={() => toggleSort('price')}>Price</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {sorted.map((p) => (
            <TableRow key={p.id}>
              <TableCell className="font-mono text-[13px] text-[#1a56b0]">{p.id}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell className="text-right tabular-nums">${p.price.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    )
  },
}

export const WithActions: Story = {
  render: () => (
    <Table>
      <TableCaption>Recent orders — last 30 days</TableCaption>
      <TableHead>
        <TableRow>
          <TableHeader>Part number</TableHeader>
          <TableHeader>Description</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader><span className="sr-only">Actions</span></TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {parts.map((p) => (
          <TableRow key={p.id}>
            <TableCell className="font-mono text-[13px] text-[#1a56b0]">{p.id}</TableCell>
            <TableCell>{p.name}</TableCell>
            <TableCell><Badge variant={statusVariant(p.status)} size="sm">{p.status}</Badge></TableCell>
            <TableCell>
              <div className="flex gap-1 justify-end">
                <Button variant="ghost" size="sm">Edit</Button>
                <Button variant="ghost" size="sm">Remove</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
}
