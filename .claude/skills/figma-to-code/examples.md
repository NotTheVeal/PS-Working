# figma-to-code — Worked Examples

These examples show what a correct implementation looks like for PS Design Library patterns
extracted from Figma. Use them as calibration when deciding how to translate design values.

---

## Example 1: Card component

**Figma values extracted by `get_design_context`:**
- Frame: 360×auto, `bg #ffffff`, border `1px solid #e0ddd6`, `border-radius 10px`, overflow hidden
- Header section: padding `14px 16px`, flex row, gap `12px`
- Icon: 32×32, `border-radius 8px`, background varies by type
- Title text: 14px, weight 600, color `#1a1a1a`
- Sub text: 12px, weight 400, color `#6b6b6b`, line-height 1.5
- Divider: `height 1px`, `bg #e0ddd6`
- Body: padding `0 16px 16px`

**Token translation:**
| Figma | Token | Tailwind |
|-------|-------|----------|
| `#ffffff` | white | `bg-white` |
| `#e0ddd6` border | border-default | `border border-[#e0ddd6]` |
| radius 10px | card | `rounded-xl` (≈10px in default config; use `rounded-[10px]` for exact) |
| `#1a1a1a` | text-primary | `text-[#1a1a1a]` |
| `#6b6b6b` | text-secondary | `text-[#6b6b6b]` |
| 14px/600 | body-bold | `text-sm font-semibold` |
| 12px/400/1.5 | caption | `text-xs leading-[1.5]` |

**Output:**

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const cardIconVariants = cva(
  'w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 mt-px',
  {
    variants: {
      color: {
        orange: 'bg-[#fff3e0]',
        blue:   'bg-[#e8f0fe]',
        green:  'bg-[#d4edda]',
      },
    },
    defaultVariants: { color: 'blue' },
  }
)

interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardIconVariants> {
  icon?: React.ReactNode
  title: string
  description?: string
  children?: React.ReactNode
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ icon, title, description, children, color, className, ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-white border border-[#e0ddd6] rounded-[10px] overflow-hidden ${className ?? ''}`}
      {...props}
    >
      {(icon || title) && (
        <div className="px-4 py-3.5 flex items-start gap-3">
          {icon && (
            <div className={cardIconVariants({ color })} aria-hidden="true">
              {icon}
            </div>
          )}
          <div>
            <div className="text-sm font-semibold text-[#1a1a1a] mb-0.5">{title}</div>
            {description && (
              <div className="text-xs text-[#6b6b6b] leading-[1.5]">{description}</div>
            )}
          </div>
        </div>
      )}
      {children && (
        <>
          <div className="h-px bg-[#e0ddd6]" role="separator" />
          <div className="px-4 pb-4">{children}</div>
        </>
      )}
    </div>
  )
)
Card.displayName = 'Card'
```

---

## Example 2: Chip / Tag component

**Figma values:**
- Size: auto width, height ~28px
- Padding: 5px 11px
- Border-radius: 100px (pill)
- Border: 1.5px
- Font: 12px, weight 500
- States: default (gray), active/on (blue), hover (blue tint)

**Output:**

```tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

const chipVariants = cva(
  'inline-flex items-center px-[11px] py-[5px] rounded-full text-xs font-medium cursor-pointer border-[1.5px] transition-all duration-[120ms] select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1',
  {
    variants: {
      active: {
        false: 'border-[#d0cdc5] text-[#4a4a4a] bg-white hover:border-[#1a56b0] hover:text-[#1a56b0] hover:bg-[#e8f0fe]',
        true:  'border-[#1a56b0] text-[#1a56b0] bg-[#e8f0fe]',
      },
    },
    defaultVariants: { active: false },
  }
)

interface ChipProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>,
    VariantProps<typeof chipVariants> {
  label: string
  onToggle?: (active: boolean) => void
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ label, active, onToggle, className, ...props }, ref) => (
    <button
      ref={ref}
      role="checkbox"
      aria-checked={active ?? false}
      className={chipVariants({ active, className })}
      onClick={() => onToggle?.(!active)}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault()
          onToggle?.(!active)
        }
      }}
      {...props}
    >
      {label}
    </button>
  )
)
Chip.displayName = 'Chip'
```

---

## Example 3: Banner / Top nav

**Figma values:**
- Height: 52px, sticky, `bg #1a1a1a`, no shadow
- Left section: flex row, gap 10px, items center
  - Logo mark: 26×26, `bg #d97757`, border-radius 6px, "C" text 13px/700/white
  - Title: 14px/600/white
  - Divider: 1px × 18px, `bg #444`
  - Subtitle: 13px/400/`#999`
- Right: badge pill `bg #2d2d2d`, `text #d97757`, `border #3a3a3a`, 11px/500, padding 3px 10px

**Output:**

```tsx
import * as React from 'react'

interface BannerProps {
  title: string
  subtitle?: string
  badge?: string
  logoMark?: string
}

export const Banner = React.forwardRef<HTMLElement, BannerProps>(
  ({ title, subtitle, badge, logoMark = 'C' }, ref) => (
    <header
      ref={ref}
      className="bg-[#1a1a1a] px-6 flex items-center justify-between h-[52px] sticky top-0 z-[100]"
      role="banner"
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-[26px] h-[26px] bg-[#d97757] rounded-md flex items-center justify-center text-[13px] font-bold text-white"
          aria-hidden="true"
        >
          {logoMark}
        </div>
        <span className="text-sm font-semibold text-white">{title}</span>
        {subtitle && (
          <>
            <div className="w-px h-[18px] bg-[#444]" aria-hidden="true" />
            <span className="text-[13px] text-[#999]">{subtitle}</span>
          </>
        )}
      </div>
      {badge && (
        <span className="text-[11px] font-medium px-2.5 py-[3px] rounded-full bg-[#2d2d2d] text-[#d97757] border border-[#3a3a3a]">
          {badge}
        </span>
      )}
    </header>
  )
)
Banner.displayName = 'Banner'
```

---

## Common mistakes to avoid

| Mistake | Correct approach |
|---------|-----------------|
| Copying Figma reference code verbatim | Adapt it — replace raw hex with tokens, add ARIA, wrap in forwardRef |
| Using `style={{ color: '#d97757' }}` | Use `text-[#d97757]` or the mapped Tailwind token |
| Hardcoding pixel sizes as inline styles | Map to Tailwind spacing/size classes |
| Skipping hover/focus states because they "aren't in the Figma" | Interactive elements always need hover + focus-visible |
| Snapshot tests | Write behavioral tests with Testing Library instead |
| One giant component file | Split at natural seams — if a sub-section is reused, extract it |
| Missing `displayName` on forwardRef components | Always set `ComponentName.displayName = 'ComponentName'` |
