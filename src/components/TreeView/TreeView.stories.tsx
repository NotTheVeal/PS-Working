import type { Meta, StoryObj } from '@storybook/react'
import { TreeView } from './TreeView'
import type { TreeNode } from './TreeView'

const sampleNodes: TreeNode[] = [
  {
    id: 'design',
    label: 'Design',
    defaultExpanded: true,
    children: [
      { id: 'colors', label: 'Colors' },
      { id: 'typography', label: 'Typography' },
      {
        id: 'components',
        label: 'Components',
        children: [
          { id: 'button', label: 'Button' },
          { id: 'input', label: 'Input' },
          { id: 'modal', label: 'Modal', disabled: true },
        ],
      },
    ],
  },
  {
    id: 'engineering',
    label: 'Engineering',
    children: [
      { id: 'frontend', label: 'Frontend' },
      { id: 'backend', label: 'Backend' },
    ],
  },
  { id: 'docs', label: 'Documentation' },
]

const meta = {
  title: 'PS Design Library/Navigation/TreeView',
  component: TreeView,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    selected: { control: 'text' },
  },
} satisfies Meta<typeof TreeView>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    nodes: sampleNodes,
  },
}

export const WithSelection: Story = {
  args: {
    nodes: sampleNodes,
    selected: 'button',
  },
}

export const WithIcons: Story = {
  args: {
    nodes: [
      {
        id: 'folder-1',
        label: 'Assets',
        defaultExpanded: true,
        icon: (
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="w-4 h-4 text-[#d97757]"
            aria-hidden="true"
          >
            <path
              d="M2 4a1 1 0 011-1h3.586a1 1 0 01.707.293l1.414 1.414A1 1 0 009.414 5H13a1 1 0 011 1v6a1 1 0 01-1 1H3a1 1 0 01-1-1V4z"
              fill="currentColor"
            />
          </svg>
        ),
        children: [
          {
            id: 'file-1',
            label: 'logo.svg',
            icon: (
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-gray-400" aria-hidden="true">
                <path
                  d="M4 2h5.586a1 1 0 01.707.293l2.414 2.414A1 1 0 0113 5.414V13a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z"
                  fill="currentColor"
                />
              </svg>
            ),
          },
          {
            id: 'file-2',
            label: 'icon-set.svg',
            icon: (
              <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-gray-400" aria-hidden="true">
                <path
                  d="M4 2h5.586a1 1 0 01.707.293l2.414 2.414A1 1 0 0113 5.414V13a1 1 0 01-1 1H4a1 1 0 01-1-1V3a1 1 0 011-1z"
                  fill="currentColor"
                />
              </svg>
            ),
          },
        ],
      },
    ],
  },
}

export const FlatList: Story = {
  args: {
    nodes: [
      { id: 'alpha', label: 'Alpha' },
      { id: 'beta', label: 'Beta' },
      { id: 'gamma', label: 'Gamma', disabled: true },
      { id: 'delta', label: 'Delta' },
    ],
    selected: 'beta',
  },
}

export const DeepNesting: Story = {
  args: {
    nodes: [
      {
        id: 'l1',
        label: 'Level 1',
        defaultExpanded: true,
        children: [
          {
            id: 'l2',
            label: 'Level 2',
            defaultExpanded: true,
            children: [
              {
                id: 'l3',
                label: 'Level 3',
                defaultExpanded: true,
                children: [{ id: 'l4', label: 'Level 4 (leaf)' }],
              },
            ],
          },
        ],
      },
    ],
  },
}
