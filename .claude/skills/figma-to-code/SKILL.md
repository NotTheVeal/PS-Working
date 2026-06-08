---
name: figma-to-code
description: Convert a Figma design into pixel-perfect PS Design Library code. Use when the user provides a Figma URL and wants it implemented as a React component, page, or screen that matches the design exactly.
when_to_use: "Use when you have a Figma link and want a one-for-one implementation in code — matching spacing, colors, typography, layout, and interactions precisely."
allowed-tools: Read Grep Glob Bash mcp__Figma__get_design_context mcp__Figma__get_screenshot mcp__Figma__get_metadata mcp__Figma__get_variable_defs mcp__Figma__search_design_system mcp__Figma__get_code_connect_map
---

# Figma → Code: Pixel-Perfect Implementation

You are implementing a Figma design as production-ready code for the **PS Design Library**. Your
goal is an exact one-for-one match: spacing, colors, typography, border-radius, shadows, and
layout must be indistinguishable from the Figma file.

## Step 1 — Parse the Figma URL

The user provides a Figma URL in `$ARGUMENTS`. Extract:
- `fileKey` — the segment after `/design/` (e.g. `https://figma.com/design/ABC123/...` → `ABC123`)
- `nodeId` — the `?node-id=` query param value, converting `-` to `:` (e.g. `1-2` → `1:2`)

If either value is missing, ask the user for a node-specific Figma URL containing `?node-id=`.

## Step 2 — Read the Design

Call these Figma MCP tools **in parallel**:

1. `mcp__Figma__get_design_context` — full layout tree: node names, types, dimensions, positions,
   auto-layout direction/gap/padding, fill colors, typography, effects, corner radius, border/stroke
2. `mcp__Figma__get_screenshot` — visual reference image of the target node
3. `mcp__Figma__get_variable_defs` — design token variables defined in the file
4. `mcp__Figma__get_metadata` — file name, page names, component names

Then call `mcp__Figma__get_code_connect_map` for the same node to check if any components are
already mapped to codebase equivalents.

## Step 3 — Audit the Codebase

Use Read/Grep/Glob to understand the project structure **before writing a single line**:

```
Glob: src/**/*.tsx          — find existing components
Glob: src/**/*.css          — find global styles
Glob: tailwind.config.*     — read token/theme config
Glob: tokens/**/*.json      — read Token Studio tokens
Glob: src/tokens/**         — alternative token location
Grep: "colors" tailwind.config  — extract color tokens
```

Map every Figma color/spacing/font value to its closest token. Do NOT hardcode raw hex or pixel
values when a token exists.

**PS Design Library token reference** (use these as a fallback if no config file exists):

| Token | Value | Usage |
|-------|-------|-------|
| `#1a1a1a` | Near-black | Primary text |
| `#d97757` | Brand orange | Accent, CTA borders |
| `#1a56b0` | Blue | Links, active states |
| `#1a6b3a` | Green | Success, confirmation |
| `#f0ede8` | Warm off-white | Page background |
| `#e0ddd6` | Warm gray | Borders, dividers |
| `#f9f8f5` | Light fill | Card backgrounds |
| `#6b6b6b` | Mid gray | Secondary text |
| `#aaaaaa` | Light gray | Placeholder, muted |
| `#0d1117` | Code black | Code block background |

## Step 4 — Plan the Component Hierarchy

Before writing code, output a short plan (5–10 lines):

```
Component: <Name>
File: src/components/<Name>/<Name>.tsx
Storybook: src/components/<Name>/<Name>.stories.tsx
Tests: src/components/<Name>/<Name>.test.tsx

Layout: [describe the top-level structure in plain English]
Sub-components: [list any child components you will create or reuse]
Tokens used: [list the design tokens you are mapping to]
Props: [list the TypeScript props interface fields]
```

Ask the user: "Does this plan look right before I write the code?" — wait for confirmation unless
the user said to proceed automatically.

## Step 5 — Implement

### Component file rules

- **React + TypeScript** — use `.tsx`, no `any` types
- **Tailwind CSS** — all layout, spacing, typography, color via Tailwind classes; map Figma
  values to the nearest config token
- **`React.forwardRef`** — wrap every component
- **`class-variance-authority` (cva)** — use for variant logic when ≥2 variants exist
- **Named exports** — `export const ComponentName`
- **No inline styles** unless a value genuinely has no Tailwind equivalent (document why)
- **ARIA** — every interactive element must have a role, label, and keyboard handler
- **Pixel accuracy checklist** (verify each before finishing):
  - [ ] Spacing (padding, gap, margin) matches Figma values
  - [ ] Font size, weight, line-height, letter-spacing match
  - [ ] Border-radius matches exactly
  - [ ] Colors map to correct tokens
  - [ ] Box shadows / drop shadows reproduced
  - [ ] Flex/grid direction, alignment, justification match
  - [ ] Width/height constraints (min/max/fixed) match
  - [ ] Hover and focus states present
  - [ ] Responsive breakpoints if the Figma file shows multiple frame sizes

### Storybook story rules

- Cover **every variant and state** (default, hover, disabled, loading, error, empty, etc.)
- Use `@storybook/react` CSF3 format
- Include `args` and `argTypes` so variants are interactive in the Controls panel
- Add a `figmaUrl` parameter pointing back to the source node

### Test file rules

- Use **Vitest + Testing Library**
- Test renders without crashing, all variants, ARIA attributes, and user interactions
- No snapshot tests

## Step 6 — Visual Diff Check

After writing the code, re-examine the `get_screenshot` image alongside your implementation. Run
through the pixel accuracy checklist above and fix any discrepancies. Call out anything you could
not reproduce and explain why.

## Step 7 — Output Summary

Finish with:

```
## What was built
- <ComponentName> — <one sentence>
- Storybook story — covers N variants
- Tests — N test cases

## Token mapping
| Figma value | Token used | Tailwind class |
|-------------|------------|----------------|
| #1a56b0     | blue-700   | text-blue-700  |
...

## Deviations from design
- [List anything that couldn't be matched exactly and why]

## Next steps
- [Any missing states, missing assets, or follow-up work]
```
