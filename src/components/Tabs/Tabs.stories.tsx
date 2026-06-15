import type { Meta, StoryObj } from '@storybook/react'
import { Tabs, TabList, Tab, TabPanels, TabPanel } from './Tabs'
import { Badge } from '../Badge/Badge'

const meta = {
  title: 'PS Design Library/Navigation/Tabs',
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tabs defaultTab="overview" style={{ maxWidth: 600 }}>
      <TabList>
        <Tab tabId="overview">Overview</Tab>
        <Tab tabId="specs">Specifications</Tab>
        <Tab tabId="documents">Documents</Tab>
        <Tab tabId="history">Order history</Tab>
      </TabList>
      <TabPanels>
        <TabPanel tabId="overview">
          <p className="text-[14px] text-[#4a4a4a] leading-[1.6]">
            Ultrasound transducer probe — OEM replacement compatible with GE Vivid E9 and E95 systems.
            Includes 6-month warranty and calibration certificate.
          </p>
        </TabPanel>
        <TabPanel tabId="specs">
          <ul className="text-[14px] text-[#4a4a4a] space-y-1">
            <li><strong>Part number:</strong> AB-7890-UT</li>
            <li><strong>Frequency:</strong> 1–5 MHz</li>
            <li><strong>Connector:</strong> D-sub 15-pin</li>
            <li><strong>Weight:</strong> 320g</li>
          </ul>
        </TabPanel>
        <TabPanel tabId="documents">
          <p className="text-[14px] text-[#6b6b6b]">No documents attached.</p>
        </TabPanel>
        <TabPanel tabId="history">
          <p className="text-[14px] text-[#6b6b6b]">No previous orders for this part.</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  ),
}

export const WithBadges: Story = {
  render: () => (
    <Tabs defaultTab="open" style={{ maxWidth: 600 }}>
      <TabList>
        <Tab tabId="open">
          Open <Badge variant="blue" size="sm" className="ml-1">4</Badge>
        </Tab>
        <Tab tabId="pending">
          Pending <Badge variant="orange" size="sm" className="ml-1">2</Badge>
        </Tab>
        <Tab tabId="closed">Closed</Tab>
      </TabList>
      <TabPanels>
        <TabPanel tabId="open"><p className="text-[14px] text-[#4a4a4a]">4 open orders</p></TabPanel>
        <TabPanel tabId="pending"><p className="text-[14px] text-[#4a4a4a]">2 pending orders</p></TabPanel>
        <TabPanel tabId="closed"><p className="text-[14px] text-[#4a4a4a]">No closed orders in the last 30 days.</p></TabPanel>
      </TabPanels>
    </Tabs>
  ),
}

export const Vertical: Story = {
  render: () => (
    <Tabs defaultTab="profile" orientation="vertical" style={{ maxWidth: 600 }}>
      <TabList>
        <Tab tabId="profile">Account details</Tab>
        <Tab tabId="billing">Billing</Tab>
        <Tab tabId="shipping">Shipping addresses</Tab>
        <Tab tabId="notifications">Notifications</Tab>
      </TabList>
      <TabPanels>
        <TabPanel tabId="profile"><p className="text-[14px] text-[#4a4a4a]">Account details panel</p></TabPanel>
        <TabPanel tabId="billing"><p className="text-[14px] text-[#4a4a4a]">Billing panel</p></TabPanel>
        <TabPanel tabId="shipping"><p className="text-[14px] text-[#4a4a4a]">Shipping addresses panel</p></TabPanel>
        <TabPanel tabId="notifications"><p className="text-[14px] text-[#4a4a4a]">Notifications panel</p></TabPanel>
      </TabPanels>
    </Tabs>
  ),
}
