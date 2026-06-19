import type { Meta, StoryObj } from '@storybook/react'
import { Stat } from './Stat'

const ChartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)

const UsersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)

const meta = {
  title: 'PS Design Library/Display/Stat',
  component: Stat,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant:  { control: 'select', options: ['default', 'outlined', 'filled'] },
    size:     { control: 'select', options: ['sm', 'md', 'lg'] },
    trend:    { control: 'select', options: ['up', 'down', 'neutral'] },
    label:    { control: 'text' },
    value:    { control: 'text' },
    trendLabel: { control: 'text' },
  },
} satisfies Meta<typeof Stat>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'Total Revenue',
    value: '$48,295',
    variant: 'default',
  },
}

export const Outlined: Story = {
  args: {
    label: 'Total Revenue',
    value: '$48,295',
    variant: 'outlined',
  },
}

export const Filled: Story = {
  args: {
    label: 'Total Revenue',
    value: '$48,295',
    variant: 'filled',
  },
}

export const TrendUp: Story = {
  args: {
    label: 'Monthly Active Users',
    value: '12,840',
    trend: 'up',
    trendLabel: '+12% vs last month',
    variant: 'outlined',
  },
}

export const TrendDown: Story = {
  args: {
    label: 'Churn Rate',
    value: '3.2%',
    trend: 'down',
    trendLabel: '-0.4% vs last month',
    variant: 'outlined',
  },
}

export const TrendNeutral: Story = {
  args: {
    label: 'Avg. Session',
    value: '4m 22s',
    trend: 'neutral',
    trendLabel: 'No change',
    variant: 'outlined',
  },
}

export const WithIcon: Story = {
  args: {
    label: 'Active Users',
    value: '3,291',
    trend: 'up',
    trendLabel: '+8%',
    icon: <UsersIcon />,
    variant: 'outlined',
  },
}

export const SizeSmall: Story = {
  args: {
    label: 'Orders',
    value: '842',
    trend: 'up',
    trendLabel: '+5%',
    size: 'sm',
    variant: 'outlined',
  },
}

export const SizeMedium: Story = {
  args: {
    label: 'Orders',
    value: '842',
    trend: 'up',
    trendLabel: '+5%',
    size: 'md',
    variant: 'outlined',
  },
}

export const SizeLarge: Story = {
  args: {
    label: 'Orders',
    value: '842',
    trend: 'up',
    trendLabel: '+5%',
    size: 'lg',
    variant: 'outlined',
  },
}

export const KPIDashboard: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-6 bg-[#f0ede8] min-w-[540px]">
      <Stat
        label="Total Revenue"
        value="$48,295"
        trend="up"
        trendLabel="+12% vs last month"
        icon={<ChartIcon />}
        variant="outlined"
      />
      <Stat
        label="Active Users"
        value="3,291"
        trend="up"
        trendLabel="+8%"
        icon={<UsersIcon />}
        variant="outlined"
      />
      <Stat
        label="Churn Rate"
        value="3.2%"
        trend="down"
        trendLabel="-0.4%"
        variant="filled"
      />
      <Stat
        label="Avg. Session"
        value="4m 22s"
        trend="neutral"
        trendLabel="No change"
        variant="filled"
      />
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4 p-6 bg-white min-w-[260px]">
      <Stat label="Default" value="$12,000" trend="up" trendLabel="+5%" variant="default" />
      <Stat label="Outlined" value="$12,000" trend="up" trendLabel="+5%" variant="outlined" />
      <Stat label="Filled" value="$12,000" trend="up" trendLabel="+5%" variant="filled" />
    </div>
  ),
}
