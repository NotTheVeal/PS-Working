import * as React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from './Tabs'

function SimpleTabs() {
  return (
    <Tabs defaultTab="a">
      <TabList>
        <Tab tabId="a">Tab A</Tab>
        <Tab tabId="b">Tab B</Tab>
        <Tab tabId="c">Tab C</Tab>
      </TabList>
      <TabPanels>
        <TabPanel tabId="a">Panel A</TabPanel>
        <TabPanel tabId="b">Panel B</TabPanel>
        <TabPanel tabId="c">Panel C</TabPanel>
      </TabPanels>
    </Tabs>
  )
}

describe('Tabs', () => {
  it('shows the default tab panel', () => {
    render(<SimpleTabs />)
    expect(screen.getByText('Panel A')).toBeInTheDocument()
    expect(screen.queryByText('Panel B')).not.toBeInTheDocument()
  })

  it('switches panels on click', async () => {
    const user = userEvent.setup()
    render(<SimpleTabs />)
    await user.click(screen.getByRole('tab', { name: 'Tab B' }))
    expect(screen.getByText('Panel B')).toBeInTheDocument()
    expect(screen.queryByText('Panel A')).not.toBeInTheDocument()
  })

  it('sets aria-selected on the active tab', () => {
    render(<SimpleTabs />)
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('aria-selected', 'false')
  })

  it('active tab has tabIndex=0, others -1', () => {
    render(<SimpleTabs />)
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('tabindex', '0')
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('tabindex', '-1')
  })

  it('panel has role=tabpanel', () => {
    render(<SimpleTabs />)
    expect(screen.getByRole('tabpanel')).toBeInTheDocument()
  })

  it('navigates with arrow keys', async () => {
    const user = userEvent.setup()
    render(<SimpleTabs />)
    screen.getByRole('tab', { name: 'Tab A' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(screen.getByText('Panel B')).toBeInTheDocument()
  })

  it('wraps arrow key navigation', async () => {
    const user = userEvent.setup()
    render(<SimpleTabs />)
    screen.getByRole('tab', { name: 'Tab A' }).focus()
    await user.keyboard('{ArrowLeft}')
    expect(screen.getByText('Panel C')).toBeInTheDocument()
  })
})
