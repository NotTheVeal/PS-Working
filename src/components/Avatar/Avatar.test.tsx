import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Avatar, AvatarGroup } from './Avatar'

describe('Avatar', () => {
  it('renders initials from name', () => {
    render(<Avatar name="Rachael Veal" />)
    expect(screen.getByText('RV')).toBeInTheDocument()
  })

  it('renders image when src provided', () => {
    render(<Avatar src="http://example.com/img.jpg" alt="Test user" name="Test User" />)
    expect(screen.getByRole('img')).toHaveAttribute('src', 'http://example.com/img.jpg')
  })

  it('has aria-label from name', () => {
    render(<Avatar name="Rachael Veal" />)
    expect(screen.getByLabelText('Rachael Veal')).toBeInTheDocument()
  })

  it('renders status dot with aria-label', () => {
    render(<Avatar name="User" status="online" />)
    expect(screen.getByLabelText('online')).toBeInTheDocument()
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLSpanElement>()
    render(<Avatar ref={ref} name="Test" />)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })
})

describe('AvatarGroup', () => {
  it('shows overflow count', () => {
    render(
      <AvatarGroup max={2}>
        <Avatar name="A B" />
        <Avatar name="C D" />
        <Avatar name="E F" />
        <Avatar name="G H" />
      </AvatarGroup>
    )
    expect(screen.getByLabelText('2 more')).toBeInTheDocument()
  })
})
