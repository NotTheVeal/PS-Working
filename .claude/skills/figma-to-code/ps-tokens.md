# PS Design Library — Token Reference

This file is loaded by the figma-to-code skill as a fallback token map when no
`tailwind.config` or Token Studio JSON is found in the project.

## Colors

### Text
| Token name  | Hex       | Usage                   |
|-------------|-----------|-------------------------|
| text-primary | `#1a1a1a` | Body copy, headings     |
| text-secondary | `#6b6b6b` | Sub-labels, captions  |
| text-muted  | `#aaaaaa`  | Placeholders, disabled  |
| text-brand  | `#d97757`  | Brand orange, CTAs      |
| text-link   | `#1a56b0`  | Links, active states    |
| text-success | `#1a6b3a` | Success, confirmation   |

### Backgrounds
| Token name    | Hex       | Usage                  |
|---------------|-----------|------------------------|
| bg-page       | `#f0ede8` | Page / app background  |
| bg-card       | `#ffffff`  | Card, modal, panel     |
| bg-subtle     | `#f9f8f5` | Subtle fill            |
| bg-code       | `#0d1117` | Code blocks            |

### Borders
| Token name    | Hex       | Usage           |
|---------------|-----------|-----------------|
| border-default | `#e0ddd6` | Dividers, cards |
| border-strong  | `#d0cdc5` | Input borders   |

### Interactive
| Token name        | Hex       | Usage                      |
|-------------------|-----------|----------------------------|
| interactive-brand | `#d97757` | Primary brand accent       |
| interactive-blue  | `#1a56b0` | Primary action / CTA       |
| interactive-blue-hover | `#1446a0` | Blue button hover     |
| interactive-green | `#1a7f37` | Positive / success action  |
| interactive-green-hover | `#176b2e` | Green button hover  |

### Semantic
| Token name  | Hex (bg)  | Hex (text) | Usage     |
|-------------|-----------|------------|-----------|
| success-bg  | `#d4edda` | `#1a6b3a`  | Success   |
| error-bg    | `#fde8e8` | `#9b2c2c`  | Error     |
| info-bg     | `#e8f0fe` | `#1a56b0`  | Info      |
| warning-bg  | `#fff3e0` | —          | Warning   |

---

## Typography

| Role       | Size  | Weight | Line-height |
|------------|-------|--------|-------------|
| Heading XL | 28px  | 700    | 1.2         |
| Heading L  | 20px  | 700    | 1.3         |
| Heading M  | 16px  | 700    | 1.35        |
| Body       | 14px  | 400    | 1.6         |
| Body SM    | 13px  | 400    | 1.55        |
| Caption    | 12px  | 400    | 1.55        |
| Label      | 11px  | 600    | —           |
| Mono       | 11.5–12px | 400 | 1.7        |

Font stack: `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
Mono stack: `'SFMono-Regular', Consolas, monospace`

---

## Spacing

The design uses an 8px base grid. Common values:

| Figma value | Tailwind |
|-------------|----------|
| 4px  | `p-1`  / `gap-1`  |
| 6px  | `p-1.5` / `gap-1.5` |
| 8px  | `p-2`  / `gap-2`  |
| 10px | `p-2.5` / `gap-2.5` |
| 12px | `p-3`  / `gap-3`  |
| 14px | `p-3.5` / `gap-3.5` |
| 16px | `p-4`  / `gap-4`  |
| 20px | `p-5`  / `gap-5`  |
| 24px | `p-6`  / `gap-6`  |
| 28px | `p-7`  / `gap-7`  |
| 32px | `p-8`  / `gap-8`  |

---

## Border Radius

| Figma value | Tailwind       |
|-------------|----------------|
| 4px         | `rounded`      |
| 6px         | `rounded-md`   |
| 8px         | `rounded-lg`   |
| 10px        | `rounded-xl`   |
| 100px       | `rounded-full` |

---

## Shadows / Effects

| Name        | CSS value                                  |
|-------------|--------------------------------------------|
| card        | `0 1px 3px rgba(0,0,0,0.08)`              |
| banner      | `none` (uses bottom border instead)        |
| input-focus | `0 0 0 3px rgba(26,86,176,0.2)`           |

---

## Component Patterns

### Banner / Top nav
- Height: 52px, sticky, `bg-[#1a1a1a]`
- Left: logo mark (26×26, `bg-[#d97757]`, rounded-md) + title + divider + subtitle
- Right: badge pill (`bg-[#2d2d2d]`, `text-[#d97757]`, border `#3a3a3a`)

### Card
- `bg-white border border-[#e0ddd6] rounded-xl overflow-hidden`
- Card head: `p-4 flex items-start gap-3`
- Card body: `px-4 pb-4`
- Divider inside card: `h-px bg-[#e0ddd6] mb-3.5`

### Button
| Variant   | Classes |
|-----------|---------|
| Primary   | `bg-[#1a56b0] hover:bg-[#1446a0] text-white` |
| Secondary | `bg-[#f5f4f0] border border-[#d0cdc5] text-[#1a1a1a] hover:bg-[#ebe9e3]` |
| Green     | `bg-[#1a7f37] hover:bg-[#176b2e] text-white` |
| Base      | `px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer border-none` |

### Chip / Tag
- Base: `px-2.5 py-1 rounded-full text-xs font-medium border-[1.5px] cursor-pointer`
- Default: `border-[#d0cdc5] text-[#4a4a4a] bg-white`
- Active/On: `border-[#1a56b0] text-[#1a56b0] bg-[#e8f0fe]`

### Input
- `w-full text-sm px-2.5 py-2 rounded-lg border border-[#d0cdc5] bg-white text-[#1a1a1a] mt-1`
- Focus: `outline-none border-[#1a56b0]`
- Placeholder: `text-[#aaa]`

### Step / Accordion
- Container: `bg-white border border-[#e0ddd6] rounded-xl mb-3 overflow-hidden`
- Head: `p-3 px-4 flex items-center gap-3 cursor-pointer hover:bg-[#faf9f7]`
- Number badge: 28×28 circle, `bg-[#e8f0fe] text-[#1a56b0]` / done: `bg-[#d4edda] text-[#1a6b3a]`
- Body: `px-4 pb-4 border-t border-[#e0ddd6]`

### Output / Code box
- `bg-[#0d1117] rounded-lg p-3.5 font-mono text-[11.5px] leading-[1.7] text-[#aff5b4]
   whitespace-pre-wrap border border-[#30363d]`
