---
name: figma-to-code
description: Convert a Figma design into pixel-perfect PS Design Library code. Use when the user provides a Figma URL and wants it implemented as a React component, page, or screen that matches the design exactly.
when_to_use: "Use when you have a Figma link and want a one-for-one implementation in code — matching spacing, colors, typography, layout, and interactions precisely."
allowed-tools: Read Grep Glob Bash mcp__Figma__get_design_context mcp__Figma__get_screenshot mcp__Figma__get_variable_defs mcp__Figma__get_code_connect_map mcp__Figma__search_design_system
---

# Figma → Code: Pixel-Perfect Implementation

You are building a production-ready PS Design Library component that is an exact one-for-one
match of a Figma design: same spacing, colors, typography, border-radius, shadows, layout,
and interactive states.

---

## Step 1 — Parse the Figma URL

The user supplies a Figma URL in `$ARGUMENTS`. Extract:

| Part | Where it lives | Example |
|------|---------------|---------|
| `fileKey` | Segment after `/design/` | `https://figma.com/design/ABC123/...` → `ABC123` |
| `nodeId` | `?node-id=` query param, `-` → `:` | `?node-id=1-2` → `1:2` |

If `node-id` is missing, reply: "Please share a node-specific URL — click the frame/component in
Figma, then copy the link (it will include `?node-id=`)."

---

## Step 2 — Read the Design (parallel)

Call all three tools **at the same time**:

```
mcp__Figma__get_design_context(
  fileKey: <fileKey>,
  nodeId: <nodeId>,
  clientFrameworks: "react",
  clientLanguages: "typescript,css"
)

mcp__Figma__get_variable_defs(
  fileKey: <fileKey>,
  nodeId: <nodeId>,
  clientFrameworks: "react",
  clientLanguages: "typescript,css"
)

mcp__Figma__get_code_connect_map(
  fileKey: <fileKey>,
  nodeId: <nodeId>,
  codeConnectLabel: "React"
)
```

### Interpreting `get_design_context` response

The response contains:
- **`code`** — Figma-generated reference code. Treat this as a **starting scaffold, not finished
  output**. It will have raw hex values, pixel literals, and generic HTML — your job is to replace
  all of that with PS Design Library tokens and patterns.
- **`assets`** — JSON map of asset names → download URLs. Use `Bash` + `curl` to download any
  icons, images, or SVGs you need.
- **`screenshot`** — a short-lived PNG URL. Download it immediately:
  ```bash
  curl -sL "<screenshot_url>" -o /tmp/figma-reference.png
  ```
  Keep this image open as your visual ground truth throughout.

### Interpreting `get_variable_defs` response

Returns a map like `{ 'color/brand/orange': '#d97757', 'spacing/4': '16px' }`. Map each variable
to the corresponding PS token or Tailwind class. Variables that don't exist in the codebase yet
should be noted in the output summary.

### Interpreting `get_code_connect_map` response

Returns `{ nodeId: { codeConnectSrc, codeConnectName } }`. If a node is already mapped to a
codebase component, **import and reuse it** rather than re-implementing it.

---

## Step 3 — Audit the Codebase

Before touching any file, scan the project:

```
Glob("src/**/*.tsx")            → existing components to reuse
Glob("tailwind.config.*")       → theme tokens
Glob("tokens/**/*.json")        → Token Studio token sets
Glob("src/tokens/**")           → alternative token path
Grep("extend", "tailwind.config.*") → custom token overrides
```

Build a **token translation table** — every color/spacing/font from the Figma reference code
mapped to its codebase equivalent:

| Figma value | PS token | Tailwind class |
|-------------|----------|----------------|
| `#1a56b0`   | blue     | `text-blue-700` or `text-[#1a56b0]` |
| `16px gap`  | spacing-4 | `gap-4` |
| …           | …        | … |

If no `tailwind.config` exists, use the fallback token map in
`.claude/skills/figma-to-code/ps-tokens.md`.

---

## Step 4 — Plan (show before coding)

Output a short plan and wait for confirmation:

```
## Implementation plan

Component:   <PascalCase name>
Files:
  src/components/<Name>/<Name>.tsx
  src/components/<Name>/<Name>.stories.tsx
  src/components/<Name>/<Name>.test.tsx

Layout:      <one sentence describing top-level structure>
Variants:    <list cva variants if any>
Reused:      <existing components being imported>
New tokens:  <any Figma variables not yet in codebase>
Props:
  <propName>: <type>  // <description>
  …
```

Ask: "Does this look right? I'll write the code once you confirm."

Skip the confirmation step only if the user said "just do it" or equivalent.

---

## Step 5 — Implement

### Component (`<Name>.tsx`)

**Rules — all are hard requirements, not suggestions:**

- `React.forwardRef` on every component
- `cva` for variant logic when ≥2 variants exist; a single string of classes otherwise
- Named export: `export const ComponentName`
- No TypeScript `any`
- No hardcoded hex or pixel values — use Tailwind classes mapped from the token table
- Inline `style={{}}` only for values with no Tailwind equivalent; add a comment explaining why
- Every interactive element: `role`, `aria-label` (or `aria-labelledby`), keyboard handler
  (`onKeyDown` for Space/Enter on custom buttons; focus-visible ring)
- Full `forwardRef` generic signature: `React.forwardRef<HTMLDivElement, Props>`

**Pixel-accuracy checklist** — verify each before finishing the component:

- [ ] Padding and gap match Figma values (use 8px grid; round to nearest 0.5 Tailwind step if needed)
- [ ] Font size, weight, line-height, letter-spacing match
- [ ] Border-radius matches exactly
- [ ] Colors map to correct tokens (check against screenshot)
- [ ] Box-shadow / drop-shadow reproduced (`shadow-*` or custom)
- [ ] Flex/grid direction, alignment, and justification match
- [ ] Width/height constraints (min/max/fixed/fill/hug) match
- [ ] Hover, focus-visible, active, and disabled states present
- [ ] Responsive breakpoints if multiple frame sizes appear in the Figma file
- [ ] Overflow behavior (clip, scroll, visible) matches

### Storybook (`<Name>.stories.tsx`)

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { ComponentName } from './<Name>'

const meta = {
  title: 'PS Design Library/<Category>/<Name>',
  component: ComponentName,
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: '<original figma URL>',   // always include
    },
  },
  argTypes: { /* map every prop */ },
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>

// One named export per variant/state
export const Default: Story = { args: { … } }
export const Hover: Story = { … }
export const Disabled: Story = { … }
// … etc — cover EVERY state from the Figma design
```

### Tests (`<Name>.test.tsx`)

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import { ComponentName } from './<Name>'

describe('<ComponentName>', () => {
  it('renders without crashing', () => { … })
  it('applies correct ARIA attributes', () => { … })
  it('renders all variants', () => { … })
  it('handles click / keyboard interaction', async () => { … })
  it('forwards ref', () => { … })
  // test every prop that changes visual output
})
```

No snapshot tests.

---

## Step 6 — Visual Diff

After writing the code, re-examine `/tmp/figma-reference.png` alongside your implementation.
Walk through the pixel-accuracy checklist again. Fix any discrepancy before reporting done.

If you cannot reproduce something exactly (missing asset, font not available, animation), say so
explicitly in the output summary.

---

## Step 7 — Output Summary

End every implementation with:

```
## What was built
- `<Name>.tsx` — <one sentence>
- `<Name>.stories.tsx` — N stories covering: <list states>
- `<Name>.test.tsx` — N tests

## Token mapping
| Figma value | Codebase token | Tailwind class |
|-------------|----------------|----------------|
| …           | …              | …              |

## New tokens needed
(List any Figma variables that have no codebase equivalent yet — these should be added to
tailwind.config or Token Studio in a follow-up.)

## Deviations from design
(List anything that couldn't be matched exactly and why.)

## Next steps
(Missing states, assets, follow-up work.)
```
