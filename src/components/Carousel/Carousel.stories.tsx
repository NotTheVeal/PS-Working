import type { Meta, StoryObj } from '@storybook/react'
import { Carousel } from './Carousel'

const slideData = [
  { bg: 'bg-[#1a56b0]', label: 'Slide 1', body: 'OEM Parts — Fast Delivery' },
  { bg: 'bg-[#1a6b3a]', label: 'Slide 2', body: 'Quality Guaranteed' },
  { bg: 'bg-[#d97757]', label: 'Slide 3', body: 'Trusted by 10,000+ Facilities' },
  { bg: 'bg-[#1a1a1a]', label: 'Slide 4', body: 'Expert Support 24/7' },
  { bg: 'bg-[#1a56b0]', label: 'Slide 5', body: 'Parts Sourced Globally' },
]

function makeSlide(bg: string, label: string, body: string) {
  return (
    <div
      className={`${bg} rounded-lg flex flex-col items-center justify-center h-56 gap-3 px-6`}
    >
      <span className="text-white text-2xl font-semibold tracking-tight">
        {label}
      </span>
      <span className="text-white/80 text-base text-center">{body}</span>
    </div>
  )
}

const threeSlides = slideData
  .slice(0, 3)
  .map(({ bg, label, body }) => makeSlide(bg, label, body))

const fiveSlides = slideData.map(({ bg, label, body }) =>
  makeSlide(bg, label, body)
)

const meta = {
  title: 'PS Design Library/Display/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  args: {
    showDots: true,
    showArrows: true,
    loop: true,
    autoPlay: false,
    interval: 4000,
  },
} satisfies Meta<typeof Carousel>

export default meta
type Story = StoryObj<typeof meta>

export const ThreeSlides: Story = {
  args: {
    items: threeSlides,
  },
}

export const FiveSlides: Story = {
  args: {
    items: fiveSlides,
  },
}

export const WithAutoPlay: Story = {
  args: {
    items: fiveSlides,
    autoPlay: true,
    interval: 2500,
  },
}

export const NoArrows: Story = {
  args: {
    items: threeSlides,
    showArrows: false,
  },
}

export const NoDots: Story = {
  args: {
    items: threeSlides,
    showDots: false,
  },
}

export const NoLoop: Story = {
  args: {
    items: threeSlides,
    loop: false,
  },
}
