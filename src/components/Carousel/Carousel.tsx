import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

const dotVariants = cva(
  'rounded-full transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
  {
    variants: {
      active: {
        true: 'bg-[#1a56b0] w-3 h-3',
        false: 'bg-[#e0ddd6] w-2 h-2',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
)

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  items: React.ReactNode[]
  autoPlay?: boolean
  interval?: number
  showDots?: boolean
  showArrows?: boolean
  loop?: boolean
}

export const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  (
    {
      items,
      autoPlay = false,
      interval = 4000,
      showDots = true,
      showArrows = true,
      loop = true,
      className,
      ...props
    },
    ref
  ) => {
    const [current, setCurrent] = React.useState(0)
    const [paused, setPaused] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const total = items.length

    const goTo = React.useCallback(
      (index: number) => {
        if (loop) {
          setCurrent((index + total) % total)
        } else {
          setCurrent(Math.max(0, Math.min(index, total - 1)))
        }
      },
      [loop, total]
    )

    const goPrev = React.useCallback(() => {
      goTo(current - 1)
    }, [current, goTo])

    const goNext = React.useCallback(() => {
      goTo(current + 1)
    }, [current, goTo])

    React.useEffect(() => {
      if (!autoPlay || paused) return
      const id = setInterval(() => {
        setCurrent((c) => {
          if (loop) return (c + 1) % total
          if (c < total - 1) return c + 1
          return c
        })
      }, interval)
      return () => clearInterval(id)
    }, [autoPlay, interval, loop, paused, total])

    React.useEffect(() => {
      const el = containerRef.current
      if (!el) return

      const pause = () => setPaused(true)
      const resume = () => setPaused(false)

      el.addEventListener('mouseenter', pause)
      el.addEventListener('mouseleave', resume)
      el.addEventListener('focusin', pause)
      el.addEventListener('focusout', resume)

      return () => {
        el.removeEventListener('mouseenter', pause)
        el.removeEventListener('mouseleave', resume)
        el.removeEventListener('focusin', pause)
        el.removeEventListener('focusout', resume)
      }
    }, [])

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault()
          goPrev()
        } else if (e.key === 'ArrowRight') {
          e.preventDefault()
          goNext()
        }
      },
      [goPrev, goNext]
    )

    const isPrevDisabled = !loop && current === 0
    const isNextDisabled = !loop && current === total - 1

    return (
      <div
        ref={(node) => {
          containerRef.current = node as HTMLDivElement
          if (typeof ref === 'function') ref(node)
          else if (ref) ref.current = node
        }}
        role="region"
        aria-label="Carousel"
        className={cn('relative w-full select-none', className)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        {...props}
      >
        {/* Slide area */}
        <div className="overflow-hidden rounded-lg">
          <div
            aria-live="polite"
            aria-atomic="true"
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${current * 100}%)` }}
          >
            {items.map((item, index) => (
              <div
                key={index}
                className="min-w-full"
                aria-hidden={index !== current}
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Arrow buttons */}
        {showArrows && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={goPrev}
              disabled={isPrevDisabled}
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 z-10',
                'bg-white border border-[#e0ddd6] rounded-full w-10 h-10',
                'flex items-center justify-center shadow-sm hover:bg-[#f0ede8]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M10 12L6 8l4-4"
                  stroke="#1a1a1a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              aria-label="Next slide"
              onClick={goNext}
              disabled={isNextDisabled}
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 z-10',
                'bg-white border border-[#e0ddd6] rounded-full w-10 h-10',
                'flex items-center justify-center shadow-sm hover:bg-[#f0ede8]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M6 4l4 4-4 4"
                  stroke="#1a1a1a"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        )}

        {/* Dot indicators */}
        {showDots && (
          <div
            role="tablist"
            aria-label="Slide navigation"
            className="flex items-center justify-center gap-2 mt-4"
          >
            {items.map((_, index) => (
              <button
                key={index}
                role="tab"
                aria-selected={index === current}
                aria-label={`Slide ${index + 1} of ${total}`}
                onClick={() => goTo(index)}
                className={cn(dotVariants({ active: index === current }))}
              />
            ))}
          </div>
        )}
      </div>
    )
  }
)

Carousel.displayName = 'Carousel'
