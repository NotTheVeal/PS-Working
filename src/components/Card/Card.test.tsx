import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Card, CardHeader, CardBody, CardFooter, CardDivider } from './Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Content</Card>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('forwards ref to the div element', () => {
    const ref = React.createRef<HTMLDivElement>()
    render(<Card ref={ref}>Ref</Card>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('applies custom className', () => {
    render(<Card className="custom">Content</Card>)
    expect(screen.getByText('Content').closest('div')).toHaveClass('custom')
  })

  it('spreads extra props', () => {
    render(<Card data-testid="card">Content</Card>)
    expect(screen.getByTestId('card')).toBeInTheDocument()
  })
})

describe('CardHeader', () => {
  it('renders title and description', () => {
    render(<CardHeader title="Title" description="Desc" />)
    expect(screen.getByText('Title')).toBeInTheDocument()
    expect(screen.getByText('Desc')).toBeInTheDocument()
  })

  it('renders action slot', () => {
    render(<CardHeader title="Title" action={<button>Action</button>} />)
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
  })
})

describe('CardBody', () => {
  it('renders children', () => {
    render(<CardBody>Body text</CardBody>)
    expect(screen.getByText('Body text')).toBeInTheDocument()
  })
})

describe('CardFooter', () => {
  it('renders children', () => {
    render(<CardFooter><button>Save</button></CardFooter>)
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })
})

describe('CardDivider', () => {
  it('renders an hr element', () => {
    render(<CardDivider />)
    expect(document.querySelector('hr')).toBeInTheDocument()
  })
})

describe('Card composition', () => {
  it('renders a full composed card', () => {
    render(
      <Card>
        <CardHeader title="Test card" description="Subtitle" />
        <CardBody>Body</CardBody>
        <CardFooter>
          <button>Submit</button>
        </CardFooter>
      </Card>
    )
    expect(screen.getByText('Test card')).toBeInTheDocument()
    expect(screen.getByText('Subtitle')).toBeInTheDocument()
    expect(screen.getByText('Body')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })
})
