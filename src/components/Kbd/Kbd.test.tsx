import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Kbd, Shortcut } from './Kbd'

describe('Kbd', () => {
  it('renders children inside a kbd element', () => {
    render(<Kbd>⌘</Kbd>)
    const el = screen.getByText('⌘')
    expect(el.tagName.toLowerCase()).toBe('kbd')
  })

  it('applies md size classes by default', () => {
    render(<Kbd>K</Kbd>)
    const el = screen.getByText('K')
    expect(el).toHaveClass('px-2', 'py-1', 'text-sm')
  })

  it('applies sm size classes', () => {
    render(<Kbd size="sm">K</Kbd>)
    const el = screen.getByText('K')
    expect(el).toHaveClass('px-1.5', 'py-0.5', 'text-xs')
  })

  it('applies lg size classes', () => {
    render(<Kbd size="lg">K</Kbd>)
    const el = screen.getByText('K')
    expect(el).toHaveClass('px-2.5', 'py-1.5', 'text-base')
  })

  it('applies PS token background and border colors', () => {
    render(<Kbd>X</Kbd>)
    const el = screen.getByText('X')
    expect(el).toHaveClass('bg-[#f0ede8]', 'text-[#1a1a1a]', 'border-[#e0ddd6]')
  })

  it('renders with extra bottom border for 3D effect', () => {
    render(<Kbd>Y</Kbd>)
    expect(screen.getByText('Y')).toHaveClass('border-b-2')
  })

  it('uses font-mono', () => {
    render(<Kbd>Z</Kbd>)
    expect(screen.getByText('Z')).toHaveClass('font-mono')
  })

  it('accepts a custom className', () => {
    render(<Kbd className="my-custom-class">Q</Kbd>)
    expect(screen.getByText('Q')).toHaveClass('my-custom-class')
  })

  it('forwards ref to the kbd element', () => {
    const ref = { current: null } as React.RefObject<HTMLElement>
    render(<Kbd ref={ref}>R</Kbd>)
    expect(ref.current).not.toBeNull()
    expect((ref.current as HTMLElement).tagName.toLowerCase()).toBe('kbd')
  })
})

describe('Shortcut', () => {
  it('renders all keys', () => {
    render(<Shortcut keys={['⌘', 'K']} />)
    expect(screen.getByText('⌘')).toBeInTheDocument()
    expect(screen.getByText('K')).toBeInTheDocument()
  })

  it('renders separator "+" between keys', () => {
    render(<Shortcut keys={['Ctrl', 'Shift', 'P']} />)
    const separators = screen.getAllByText('+')
    expect(separators).toHaveLength(2)
  })

  it('no trailing separator after last key', () => {
    render(<Shortcut keys={['A', 'B']} />)
    const separators = screen.getAllByText('+')
    expect(separators).toHaveLength(1)
  })

  it('has an accessible aria-label on the wrapper', () => {
    render(<Shortcut keys={['⌘', 'K']} />)
    expect(screen.getByLabelText('⌘ + K')).toBeInTheDocument()
  })

  it('renders each key as a kbd element', () => {
    render(<Shortcut keys={['A', 'B', 'C']} />)
    const kbds = document.querySelectorAll('kbd')
    expect(kbds).toHaveLength(3)
  })

  it('passes size to each Kbd', () => {
    render(<Shortcut keys={['Ctrl', 'Z']} size="lg" />)
    const kbds = document.querySelectorAll('kbd')
    kbds.forEach((kbd) => {
      expect(kbd).toHaveClass('text-base')
    })
  })

  it('renders a single key without any separator', () => {
    render(<Shortcut keys={['Esc']} />)
    expect(screen.queryByText('+')).not.toBeInTheDocument()
  })
})
