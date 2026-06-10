---
name: figma-push
description: Push a React component from the codebase INTO Figma as a design component — the reverse of figma-to-code. Use when an engineer builds a new component that the design team needs in Figma, or when a coded component drifts from its Figma version and you want to update the design to match the code.
when_to_use: "Use when code is the source of truth and you want Figma to reflect it — pushing new components, syncing drifted designs, or bootstrapping a design system from existing code."
allowed-tools: Read Grep Glob Bash mcp__Figma__use_figma mcp__Figma__get_metadata mcp__Figma__get_variable_defs mcp__Figma__upload_assets mcp__Figma__get_screenshot
---

# Code → Figma: Push Component to Design

You are taking a React component from the codebase and creating or updating its Figma
counterpart — making Figma match the code rather than the other way around.

IMPORTANT: Load the `/figma-use` skill before calling `mcp__Figma__use_figma`. If it is
available in your skills list, invoke it first.

---

## Step 1 — Parse input

`$ARGUMENTS` can be:
- A component name: `Button` → find `src/components/Button/Button.tsx`
- A file path: `src/components/Button/Button.tsx`
- A Figma URL + component name: push into a specific file

If no Figma URL is provided, ask: "Which Figma file should I push this to? Please share the
file URL."

Extract `fileKey` from the URL. The component goes onto the current page unless the user
specifies a page name.

---

## Step 2 — Read the component

```
Read(src/components/<Name>/<Name>.tsx)
Read(src/components/<Name>/<Name>.stories.tsx)   // for variant list
Glob("src/components/<Name>/**")                 // any assets
```

Extract from the source:
- **Component name** and display name
- **Props interface** — every prop, its type, its default value
- **Variants** — from the `cva` variants object or explicit prop union types
- **Visual properties** — all Tailwind classes, mapped back to raw values using ps-tokens.md
- **Sub-components** — any imported components rendered in the JSX
- **States** — default, hover, focus, disabled, loading, error (from stories or conditional classes)

Build a **component spec**:
```
Name: Button
Variants: variant (primary | secondary | ghost | danger), size (sm | md | lg)
States: default, hover, focus-visible, disabled, loading
Colors: bg #1a56b0, text #fff, border none; hover: bg #1446a0
Spacing: px-18px py-8px
Font: 13px / 600
Border-radius: 8px
```

---

## Step 3 — Check if a Figma component already exists

```
mcp__Figma__get_metadata(fileKey: <fileKey>)
```

Search the page tree for a node named `<ComponentName>` or `<ComponentName>/…`.

- **Found** → ask: "A component named '<Name>' already exists in Figma. Update it to match
  the code, or create a new one alongside it?"
- **Not found** → proceed to create

---

## Step 4 — Build the Figma component via use_figma

Load `/figma-use` skill first if available, then call `mcp__Figma__use_figma`.

The JS code you write must:

1. **Create a component set** if ≥2 variants exist, with one child frame per variant
2. **Use Auto Layout** to match the component's flex/grid structure
3. **Apply exact values** from the component spec — no approximations
4. **Set component properties** for each prop so Dev Mode shows them
5. **Name layers** to match code structure (makes Code Connect easier later)

Template for a button-style component:

```javascript
// Create component set with variant frames
const componentSet = figma.combineAsVariants(
  variantFrames,  // array of ComponentNode, one per variant
  figma.currentPage
)
componentSet.name = 'Button'

// Set component set properties
componentSet.addComponentProperty('Variant', 'VARIANT', 'Primary')
componentSet.addComponentProperty('Size', 'VARIANT', 'Medium')
componentSet.addComponentProperty('Disabled', 'BOOLEAN', false)
componentSet.addComponentProperty('Label', 'TEXT', 'Button label')
```

For each variant frame:
```javascript
const frame = figma.createComponent()
frame.name = 'Variant=Primary, Size=Medium, Disabled=false'

// Auto layout
frame.layoutMode = 'HORIZONTAL'
frame.primaryAxisAlignItems = 'CENTER'
frame.counterAxisAlignItems = 'CENTER'
frame.paddingLeft = 18
frame.paddingRight = 18
frame.paddingTop = 8
frame.paddingBottom = 8
frame.itemSpacing = 8
frame.cornerRadius = 8

// Fill
frame.fills = [{ type: 'SOLID', color: { r: 0.102, g: 0.337, b: 0.690 } }]
// Hex #1a56b0 → RGB: r=26/255, g=86/255, b=176/255

// Text label
const text = figma.createText()
await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' })
text.fontName = { family: 'Inter', style: 'Semi Bold' }
text.fontSize = 13
text.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]
text.characters = 'Button label'
text.name = 'Label'
frame.appendChild(text)
```

**Color conversion rule** — Tailwind/hex to Figma RGB (0–1 range):
`r = parseInt(hex.slice(1,3), 16) / 255`

**Font names** — use Figma's exact style strings:
- `font-semibold` (600) → `'Semi Bold'`
- `font-bold` (700) → `'Bold'`
- `font-medium` (500) → `'Medium'`
- `font-normal` (400) → `'Regular'`

---

## Step 5 — Handle hover / focus / disabled states

For each state that differs visually, create an additional variant frame and add an
`Interaction Type` property or a `State` variant property:

```javascript
// Hover variant
hoverFrame.name = 'Variant=Primary, Size=Medium, State=Hover'
hoverFrame.fills = [{ type: 'SOLID', color: { r: 0.078, g: 0.275, b: 0.627 } }]
// #1446a0 → r=20/255, g=70/255, b=160/255
```

---

## Step 6 — Upload any assets

If the component uses local SVG icons or images:
```
mcp__Figma__upload_assets(fileKey, assets: [{ name, data }])
```

Then reference the returned asset IDs when setting image fills.

---

## Step 7 — Take a screenshot and compare

After creating the component:
```
mcp__Figma__get_screenshot(fileKey, nodeId: <new component node ID>)
```

Download the PNG and visually compare it to a render of the React component from Storybook
(if available). Note any discrepancies.

---

## Step 8 — Output summary

```
## Pushed to Figma

Component: <Name>
Figma file: <file name>
Node ID: <nodeId>
Figma URL: https://figma.com/design/<fileKey>/...?node-id=<nodeId>

Variants created: N
States covered: default, hover, focus, disabled, …

## Visual diff
[Any discrepancies between code and what Figma rendered]

## Recommended next steps
1. Run /figma-code-connect <url with node-id> to wire Code Connect
2. QA the component in Figma Dev Mode
3. Share the URL with the design team for review
```
