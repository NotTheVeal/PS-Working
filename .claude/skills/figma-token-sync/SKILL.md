---
name: figma-token-sync
description: Extract design tokens from a Figma file's variables and sync them into the codebase — tailwind.config, Token Studio JSON, and a TypeScript token constants file. Use when the design token set in Figma has changed and the codebase needs to catch up.
when_to_use: "Use when Figma variables have changed, when setting up a new project's token layer, or when you need to verify the codebase tokens are in sync with Figma."
allowed-tools: Read Grep Glob Bash Write Edit mcp__Figma__get_variable_defs mcp__Figma__get_design_context mcp__Figma__search_design_system
---

# Figma Token Sync

Extract every design token from a Figma file and write them into the codebase in three places:
1. `tailwind.config.js` — theme extension
2. `tokens/base.json` — Token Studio source of truth
3. `src/tokens/tokens.ts` — typed TypeScript constants for use in non-Tailwind contexts

---

## Step 1 — Get the Figma file variables

Parse `$ARGUMENTS` for a Figma URL. Extract `fileKey` and `nodeId` exactly as in the
figma-to-code skill.

Call in parallel:
```
mcp__Figma__get_variable_defs(fileKey, nodeId, clientFrameworks: "react", clientLanguages: "typescript")
mcp__Figma__search_design_system(fileKey)   // if available — gets library-wide tokens
```

---

## Step 2 — Categorise the variables

Group every variable by type:

| Category | Figma variable names match | Target |
|----------|---------------------------|--------|
| Colors   | `color/…`, `colours/…`    | `theme.colors` in Tailwind; `color` group in tokens.json |
| Spacing  | `spacing/…`, `space/…`    | `theme.spacing` |
| Typography | `font/…`, `text/…`     | `theme.fontSize`, `theme.fontWeight`, `theme.lineHeight` |
| Border radius | `radius/…`, `rounded/…` | `theme.borderRadius` |
| Shadow   | `shadow/…`, `elevation/…` | `theme.boxShadow` |
| Z-index  | `z/…`, `layer/…`          | `theme.zIndex` |

Anything that doesn't fit a category goes into a `custom` group.

---

## Step 3 — Audit existing codebase tokens

```
Read tailwind.config.*          — current theme.extend
Glob tokens/**/*.json           — Token Studio files
Read src/tokens/tokens.ts       — current TS constants (if exists)
```

For each Figma variable, determine:
- **New** — doesn't exist in the codebase
- **Changed** — exists but has a different value
- **Identical** — already in sync (skip)
- **Removed** — exists in codebase but not in Figma (flag, don't delete automatically)

Output a diff table before writing any file:

```
## Token diff

| Variable | Figma value | Codebase value | Status |
|----------|-------------|----------------|--------|
| color/brand/orange | #d97757 | #d97757 | identical |
| color/brand/blue   | #1a56b0 | — | NEW |
| spacing/6          | 24px    | 20px   | CHANGED |
…

Removed from Figma (will NOT auto-delete): <list>
```

Ask: "Proceed with writing N new + M changed tokens?" before touching any file.

---

## Step 4 — Write the tokens

### `tailwind.config.js`

Add to `theme.extend` — never overwrite existing keys unless the value changed. Use the PS
Design Library naming convention: short semantic names (`brand`, `blue`, `green`, `page-bg`).

```js
// tailwind.config.js — theme.extend additions
colors: {
  'brand':    '#d97757',
  'blue':     '#1a56b0',
  'green':    '#1a6b3a',
  'page-bg':  '#f0ede8',
  'border':   '#e0ddd6',
  // … all color tokens
},
spacing: {
  '18': '72px',  // any non-standard steps
},
borderRadius: {
  'card': '10px',
  // …
},
boxShadow: {
  'card': '0 1px 3px rgba(0,0,0,0.08)',
  // …
},
```

### `tokens/base.json` (Token Studio format)

```json
{
  "color": {
    "brand": { "orange": { "value": "#d97757", "type": "color" } },
    "blue":  { "value": "#1a56b0", "type": "color" },
    …
  },
  "spacing": {
    "4":  { "value": "16px", "type": "spacing" },
    …
  }
}
```

If the file doesn't exist yet, create it. If it exists, merge — don't overwrite the whole file.

### `src/tokens/tokens.ts`

```ts
export const tokens = {
  color: {
    brand:   '#d97757',
    blue:    '#1a56b0',
    green:   '#1a6b3a',
    pageBg:  '#f0ede8',
    border:  '#e0ddd6',
    // …
  },
  spacing: {
    // raw pixel values as numbers
    4: 16,
    6: 24,
    // …
  },
  radius: {
    card: 10,
    pill: 9999,
    // …
  },
} as const

export type ColorToken = keyof typeof tokens.color
export type SpacingToken = keyof typeof tokens.spacing
```

---

## Step 5 — Output Summary

```
## Token sync complete

### Written
- tailwind.config.js — N tokens added / M updated
- tokens/base.json  — N tokens added / M updated
- src/tokens/tokens.ts — N tokens added / M updated

### New tokens
<list>

### Changed tokens
<list>

### Not synced (removed from Figma — review manually)
<list>

### Next steps
- Run `npm run build` to verify no Tailwind purge regressions
- Update any components that hardcode the old values
```
