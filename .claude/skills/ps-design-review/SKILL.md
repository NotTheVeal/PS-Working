---
name: ps-design-review
description: Visual and design-quality review of a React component against PS Design Library standards. Checks token usage, spacing consistency, visual hierarchy, responsive behaviour, interactive states, and motion. Use before merging a component to catch design drift before it reaches production.
when_to_use: "Use before a component ships to catch hardcoded values, missing states, spacing inconsistencies, or anything that drifts from the PS Design Library visual standard."
allowed-tools: Read Grep Glob Bash mcp__Figma__get_screenshot mcp__Figma__get_design_context
---

# PS Design Review

Visual and design-quality audit of a React component against PS Design Library standards.
Catches design drift — hardcoded values, missing states, off-token colors — before it ships.

---

## Step 1 — Locate the target

`$ARGUMENTS` can be:
- A component name + optional Figma URL: `Button https://figma.com/design/...?node-id=1-23`
- Just a component name: `Button` — audits code only, no Figma comparison
- Just a Figma URL — reads the design and checks if a code equivalent exists

---

## Step 2 — Read the component

```
Read(src/components/<Name>/<Name>.tsx)
Read(src/components/<Name>/<Name>.stories.tsx)  // for variant coverage
Glob("src/components/<Name>/**")               // any sub-files
```

---

## Step 3 — If a Figma URL is provided, fetch the design

```
mcp__Figma__get_design_context(fileKey, nodeId, clientFrameworks: "react", clientLanguages: "typescript")
```

Download the screenshot:
```bash
curl -sL "<screenshot_url>" -o /tmp/design-review-reference.png
```

Compare the screenshot against the component source visually and analytically.

---

## Step 4 — Design quality checklist

### 4.1 Token compliance

Grep for hardcoded values that should be tokens:

```bash
grep -n "#[0-9a-fA-F]\{3,6\}" src/components/<Name>/<Name>.tsx
grep -n "style={{" src/components/<Name>/<Name>.tsx
grep -n "px\b" src/components/<Name>/<Name>.tsx | grep -v "className"
```

- [ ] No raw hex colors — every color uses a Tailwind token or `text-[#TOKEN]` from ps-tokens.md
- [ ] No inline `style={{ color: '...' }}` unless documented with a comment explaining why
- [ ] No magic pixel values in inline styles — spacing uses Tailwind scale
- [ ] No hardcoded `font-size`, `font-weight`, or `line-height` inline styles

### 4.2 Spacing consistency

- [ ] All spacing uses the 8px grid — padding, gap, margin values are multiples of 4px (0.5 Tailwind step)
- [ ] Consistent padding within a component family (e.g. all buttons use same vertical padding for same size)
- [ ] No mixed spacing units (rem vs px vs arbitrary) within the same component

### 4.3 Visual hierarchy

- [ ] Primary text uses `text-[#1a1a1a]` / `font-semibold` or `font-bold`
- [ ] Secondary text uses `text-[#6b6b6b]` / `font-normal`
- [ ] Muted/disabled text uses `text-[#aaaaaa]` — never on body copy (contrast too low)
- [ ] Heading hierarchy matches the semantic level (don't use h1 styles on an h3)
- [ ] Icon sizes proportional to adjacent text (16px icon with 14px text, 20px with 16px, etc.)

### 4.4 Interactive states

Every interactive component must have ALL of these states implemented:

| State | Required? | PS implementation |
|-------|----------|------------------|
| Default | ✓ | Base styles |
| Hover | ✓ | `hover:` variant, typically darken background by one step |
| Focus-visible | ✓ | `focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1` |
| Active / pressed | ✓ | `active:` variant, slightly darker than hover |
| Disabled | ✓ | `disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none` |
| Loading | if applicable | Spinner replaces or overlays content; `aria-busy="true"` |
| Error | if applicable | Red border `border-[#e53e3e]`, error text below |
| Selected/on | if applicable | Blue fill `bg-[#e8f0fe] border-[#1a56b0] text-[#1a56b0]` |

- [ ] All applicable states are implemented
- [ ] Hover state is visible and distinct from default
- [ ] Disabled state reduces contrast appropriately without hiding content
- [ ] Loading spinner matches the component's size context

### 4.5 Border and radius

- [ ] Border radius matches the component type (see token map):
  - Buttons, inputs: `rounded-lg` (8px)
  - Cards, panels: `rounded-[10px]`
  - Pills, chips, badges: `rounded-full`
  - Tags: `rounded` (4px)
- [ ] Border color uses `border-[#e0ddd6]` (default) or `border-[#d0cdc5]` (strong)
- [ ] No mixed border radii within a single atomic component

### 4.6 Typography

- [ ] Body copy: 14px / regular / `#1a1a1a` / leading-[1.6]
- [ ] Small body: 13px / regular / `#4a4a4a` or `#6b6b6b` / leading-[1.55]
- [ ] Labels: 11px / semibold / uppercase / letter-spacing 0.04–0.08em
- [ ] Captions: 12px / regular / `#6b6b6b` / leading-[1.55]
- [ ] No text smaller than 11px (accessibility)
- [ ] Font family: system stack only — `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- [ ] Mono: `'SFMono-Regular', Consolas, monospace` for code blocks only

### 4.7 Responsive behaviour

- [ ] Component doesn't break at 320px viewport width (minimum supported)
- [ ] Text doesn't overflow fixed containers — use `truncate` or `break-words` as appropriate
- [ ] Touch targets ≥ 44×44px on mobile (WCAG 2.5.5)
- [ ] Responsive variants use Tailwind breakpoints: `sm:`, `md:`, `lg:` — not custom media queries

### 4.8 Storybook coverage

Check `.stories.tsx` covers:
- [ ] All `cva` variants are represented
- [ ] All interactive states (hover shown via `parameters.pseudo`, disabled, loading, error)
- [ ] Edge cases: long text truncation, empty state, single item vs many items
- [ ] Mobile viewport story if the component has responsive behaviour
- [ ] Figma URL param present: `parameters: { design: { type: 'figma', url: '...' } }`

---

## Step 5 — If Figma URL provided: direct comparison

With the reference screenshot downloaded, check:

- [ ] Spacing matches to within 1px (Tailwind's 0.5-step = 2px tolerance is acceptable)
- [ ] Colors are exact token matches, not approximations
- [ ] Font sizes, weights, and line-heights match
- [ ] Component dimensions match (fixed sizes) or behave correctly (hug/fill)
- [ ] Shadow/elevation matches exactly
- [ ] Layer order and z-index stacking matches

---

## Step 6 — Output report

```
# Design Review — <ComponentName>
Date: <today>
Figma reference: <url or 'none'>

## Summary
| Category | Status |
|----------|--------|
| Token compliance     | ✓ PASS / ✗ FAIL |
| Spacing consistency  | … |
| Visual hierarchy     | … |
| Interactive states   | … |
| Border & radius      | … |
| Typography           | … |
| Responsive           | … |
| Storybook coverage   | … |
| Figma comparison     | … |

## Findings

### [FAIL] <Category> — <Title>
File: src/components/<Name>/<Name>.tsx:<line>
Issue: <what is wrong>
Fix: <exact code>

## Hardcoded values found
(List every raw hex, pixel literal, or inline style — with file:line and the token it should use)

## Missing states
(List every interactive state that isn't implemented)

## Figma deviations
(If Figma URL provided — list anything in the design not reflected in code)

## Overall verdict
✓ APPROVED / ⚠ APPROVED WITH NOTES / ✗ NEEDS REWORK
```

---

## Step 7 — Apply fixes

After reporting, ask: "Fix all token violations and missing states automatically?"

If yes, apply fixes directly. Do not change any behaviour — design review fixes are visual only.
