import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { TreeView } from './TreeView'
import type { TreeNode } from './TreeView'

const nodes: TreeNode[] = [
  {
    id: 'parent-1',
    label: 'Parent One',
    children: [
      { id: 'child-1a', label: 'Child 1A' },
      { id: 'child-1b', label: 'Child 1B', disabled: true },
    ],
  },
  { id: 'parent-2', label: 'Parent Two' },
  { id: 'parent-3', label: 'Parent Three', disabled: true },
]

describe('TreeView', () => {
  it('renders top-level nodes', () => {
    render(<TreeView nodes={nodes} />)
    expect(screen.getByText('Parent One')).toBeInTheDocument()
    expect(screen.getByText('Parent Two')).toBeInTheDocument()
    expect(screen.getByText('Parent Three')).toBeInTheDocument()
  })

  it('has role="tree" on root element', () => {
    render(<TreeView nodes={nodes} />)
    expect(screen.getByRole('tree')).toBeInTheDocument()
  })

  it('nodes have role="treeitem"', () => {
    render(<TreeView nodes={nodes} />)
    const items = screen.getAllByRole('treeitem')
    expect(items.length).toBeGreaterThanOrEqual(3)
  })

  it('parent node has aria-expanded false when collapsed', () => {
    render(<TreeView nodes={nodes} />)
    const parentItem = screen.getByText('Parent One').closest('[role="treeitem"]')
    expect(parentItem).toHaveAttribute('aria-expanded', 'false')
  })

  it('leaf node does not have aria-expanded', () => {
    render(<TreeView nodes={nodes} />)
    const leafItem = screen.getByText('Parent Two').closest('[role="treeitem"]')
    expect(leafItem).not.toHaveAttribute('aria-expanded')
  })

  it('disabled node has aria-disabled', () => {
    render(<TreeView nodes={nodes} />)
    const disabledItem = screen.getByText('Parent Three').closest('[role="treeitem"]')
    expect(disabledItem).toHaveAttribute('aria-disabled', 'true')
  })

  it('expands node on chevron click', async () => {
    render(<TreeView nodes={nodes} />)
    const expandBtn = screen.getByLabelText('Expand Parent One')
    await userEvent.click(expandBtn)
    expect(screen.getByText('Child 1A')).toBeInTheDocument()
  })

  it('collapses an expanded node', async () => {
    render(<TreeView nodes={nodes} />)
    const expandBtn = screen.getByLabelText('Expand Parent One')
    await userEvent.click(expandBtn)
    expect(screen.getByText('Child 1A')).toBeVisible()
    const collapseBtn = screen.getByLabelText('Collapse Parent One')
    await userEvent.click(collapseBtn)
    expect(screen.queryByText('Child 1A')).not.toBeInTheDocument()
  })

  it('expands node with defaultExpanded', () => {
    const expandedNodes: TreeNode[] = [
      {
        id: 'root',
        label: 'Root',
        defaultExpanded: true,
        children: [{ id: 'leaf', label: 'Visible Leaf' }],
      },
    ]
    render(<TreeView nodes={expandedNodes} />)
    expect(screen.getByText('Visible Leaf')).toBeInTheDocument()
  })

  it('calls onSelect when a node is clicked', async () => {
    const onSelect = vi.fn()
    render(<TreeView nodes={nodes} onSelect={onSelect} />)
    await userEvent.click(screen.getByText('Parent Two'))
    expect(onSelect).toHaveBeenCalledWith('parent-2')
  })

  it('calls onExpand when chevron is clicked', async () => {
    const onExpand = vi.fn()
    render(<TreeView nodes={nodes} onExpand={onExpand} />)
    await userEvent.click(screen.getByLabelText('Expand Parent One'))
    expect(onExpand).toHaveBeenCalledWith('parent-1', true)
  })

  it('marks selected node with aria-selected', () => {
    render(<TreeView nodes={nodes} selected="parent-2" />)
    const selectedItem = screen.getByText('Parent Two').closest('[role="treeitem"]')
    expect(selectedItem).toHaveAttribute('aria-selected', 'true')
  })

  it('does not call onSelect for disabled nodes', async () => {
    const onSelect = vi.fn()
    render(<TreeView nodes={nodes} onSelect={onSelect} />)
    await userEvent.click(screen.getByText('Parent Three'))
    expect(onSelect).not.toHaveBeenCalled()
  })

  it('renders children in role="group"', async () => {
    render(<TreeView nodes={nodes} />)
    await userEvent.click(screen.getByLabelText('Expand Parent One'))
    expect(screen.getByRole('group')).toBeInTheDocument()
  })

  it('keyboard: Enter selects focused node', async () => {
    const onSelect = vi.fn()
    render(<TreeView nodes={nodes} onSelect={onSelect} />)
    const tree = screen.getByRole('tree')
    tree.focus()
    fireEvent.focus(tree)
    // Simulate focus and then Enter on first treeitem
    const firstItem = screen.getAllByRole('treeitem')[0]
    firstItem.focus()
    fireEvent.keyDown(firstItem, { key: 'Enter' })
    expect(onSelect).toHaveBeenCalledWith('parent-1')
  })

  it('keyboard: ArrowRight expands a collapsed parent', () => {
    render(<TreeView nodes={nodes} />)
    const parentItem = screen.getByText('Parent One').closest('[role="treeitem"]') as HTMLElement
    parentItem.focus()
    fireEvent.keyDown(parentItem, { key: 'ArrowRight' })
    expect(screen.getByText('Child 1A')).toBeInTheDocument()
  })

  it('keyboard: ArrowLeft collapses an expanded parent', async () => {
    render(<TreeView nodes={nodes} />)
    await userEvent.click(screen.getByLabelText('Expand Parent One'))
    const parentItem = screen.getByText('Parent One').closest('[role="treeitem"]') as HTMLElement
    parentItem.focus()
    fireEvent.keyDown(parentItem, { key: 'ArrowLeft' })
    expect(screen.queryByText('Child 1A')).not.toBeInTheDocument()
  })
})
