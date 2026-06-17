import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell, TableCaption } from './Table'

function SimpleTable() {
  return (
    <Table>
      <TableCaption>Test table</TableCaption>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Value</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Row 1</TableCell>
          <TableCell>100</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Row 2</TableCell>
          <TableCell>200</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

describe('Table', () => {
  it('renders a table element', () => {
    render(<SimpleTable />)
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('renders column headers', () => {
    render(<SimpleTable />)
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Value' })).toBeInTheDocument()
  })

  it('renders all rows', () => {
    render(<SimpleTable />)
    expect(screen.getAllByRole('row')).toHaveLength(3) // 1 header + 2 body rows
  })

  it('renders cells', () => {
    render(<SimpleTable />)
    expect(screen.getByText('Row 1')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
  })

  it('renders caption', () => {
    render(<SimpleTable />)
    expect(screen.getByText('Test table')).toBeInTheDocument()
  })

  it('renders sortable header with scope=col', () => {
    render(
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader sortable sorted="asc">Name</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody><TableRow><TableCell>-</TableCell></TableRow></TableBody>
      </Table>
    )
    const th = screen.getByRole('columnheader', { name: /Name/ })
    expect(th).toHaveAttribute('aria-sort', 'ascending')
  })
})
