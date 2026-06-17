import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Progress } from './Progress'

describe('Progress', () => {
  it('renders a progressbar role', () => {
    render(<Progress value={50} />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('sets aria-valuenow', () => {
    render(<Progress value={75} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '75')
  })

  it('sets aria-valuemin and aria-valuemax', () => {
    render(<Progress value={50} max={200} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemin', '0')
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '200')
  })

  it('shows label', () => {
    render(<Progress value={40} label="Upload" />)
    expect(screen.getByText('Upload')).toBeInTheDocument()
  })

  it('shows percentage when showLabel', () => {
    render(<Progress value={50} showLabel />)
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('clamps value at 100', () => {
    render(<Progress value={150} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '150')
  })

  it('omits aria-valuenow when indeterminate', () => {
    render(<Progress value={0} indeterminate />)
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow')
  })

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Progress ref={ref} value={50} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })
})
