import * as React from 'react'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  it('does not show tooltip initially', () => {
    render(
      <Tooltip content="Hint text" delay={0}>
        <button>Trigger</button>
      </Tooltip>
    )
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('shows tooltip on mouse enter after delay', async () => {
    const user = userEvent.setup({ delay: null })
    render(
      <Tooltip content="Hint text" delay={0}>
        <button>Trigger</button>
      </Tooltip>
    )
    await act(async () => { await user.hover(screen.getByText('Trigger')) })
    expect(screen.getByRole('tooltip')).toHaveTextContent('Hint text')
  })

  it('hides tooltip on mouse leave', async () => {
    const user = userEvent.setup({ delay: null })
    render(
      <Tooltip content="Hint text" delay={0}>
        <button>Trigger</button>
      </Tooltip>
    )
    await act(async () => { await user.hover(screen.getByText('Trigger')) })
    await act(async () => { await user.unhover(screen.getByText('Trigger')) })
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('shows tooltip on focus', async () => {
    const user = userEvent.setup({ delay: null })
    render(
      <Tooltip content="Focus hint" delay={0}>
        <button>Trigger</button>
      </Tooltip>
    )
    await act(async () => { await user.tab() })
    expect(screen.getByRole('tooltip')).toHaveTextContent('Focus hint')
  })

  it('sets aria-describedby on trigger when visible', async () => {
    const user = userEvent.setup({ delay: null })
    render(
      <Tooltip content="Hint" delay={0}>
        <button>Trigger</button>
      </Tooltip>
    )
    await act(async () => { await user.hover(screen.getByText('Trigger')) })
    const tooltip = screen.getByRole('tooltip')
    expect(screen.getByText('Trigger')).toHaveAttribute('aria-describedby', tooltip.id)
  })
})
