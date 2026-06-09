# PS Design Library — Claude Skills

Quick reference for every skill in this system. All skills are invoked with `/skill-name` inside
a Claude Code session pointed at this repo.

---

## The five skills

### `/figma-audit <figma-file-url>`
**Start here.** Run at the beginning of every sprint.

Inventories every component in the Figma file against every component in `src/components/`,
classifies each as COMPLETE / IMPLEMENTED / PARTIAL / MISSING / STALE, and writes a dated
report to `.claude/audit/figma-coverage-<date>.md`.

After the report it offers to chain into the other skills automatically.

```
/figma-audit https://figma.com/design/ABC123/PS-Design-Library
```

---

### `/figma-token-sync <figma-file-url>`
**Run when design tokens change.**

Extracts Figma variable definitions, diffs them against `tailwind.config.js` + `tokens/base.json`
+ `src/tokens/tokens.ts`, shows a change table, and writes all three files in one pass.
Never overwrites unchanged values.

```
/figma-token-sync https://figma.com/design/ABC123/PS-Design-Library
```

---

### `/figma-to-code <figma-node-url>`
**Main build skill.** Requires a URL with `?node-id=`.

Reads the Figma design via MCP, downloads the reference screenshot, maps every value to PS
design tokens, and produces three files:

| File | What it contains |
|------|-----------------|
| `src/components/<Name>/<Name>.tsx` | React + TypeScript + Tailwind + cva + forwardRef + ARIA |
| `src/components/<Name>/<Name>.stories.tsx` | Storybook CSF3, all states, Figma URL param |
| `src/components/<Name>/<Name>.test.tsx` | Vitest + Testing Library, behavioral tests |

Shows a plan and waits for confirmation before writing code.

```
/figma-to-code https://figma.com/design/ABC123/PS-Design-Library?node-id=1-23
```

---

### `/figma-code-connect <figma-node-url>`
**Run after `/figma-to-code`** to close the loop with designers.

Reads the Figma component's property definitions, matches them to the React component's props,
generates a `.figma.tsx` Code Connect template, and registers it in Figma via
`send_code_connect_mappings`. After this, designers see the real component in Figma Dev Mode.

Supports bulk mode — pass a file URL (no `node-id`) to map all unmapped components at once.

```
/figma-code-connect https://figma.com/design/ABC123/PS-Design-Library?node-id=1-23
```

---

### `/figma-push <ComponentName> <figma-file-url>`
**Reverse direction.** Use when code leads design.

Reads a React component, derives its visual spec (variants, spacing, color, typography), and
creates or updates the Figma component via the Plugin API with Auto Layout, variant properties,
and correct fills.

```
/figma-push Button https://figma.com/design/ABC123/PS-Design-Library
```

---

## Sprint workflow

```
1. /figma-audit      → find gaps
2. /figma-token-sync → sync tokens if changed
3. /figma-to-code    → implement each MISSING component
4. /figma-code-connect → wire Dev Mode for each new component
5. /figma-push       → if new components need to exist in Figma too
```

---

## File layout

```
src/components/<Name>/
  <Name>.tsx           ← component
  <Name>.stories.tsx   ← Storybook
  <Name>.test.tsx      ← tests
  <Name>.figma.tsx     ← Code Connect template

.claude/
  settings.json        ← pre-approved MCP permissions (no prompts during skills)
  skills/
    figma-to-code/
      SKILL.md         ← skill instructions
      ps-tokens.md     ← PS Design Library token reference
      examples.md      ← worked examples (Card, Chip, Banner)
      templates/
        base.tsx               ← starter: no variants
        with-variants.tsx      ← starter: cva variants
        with-slots.tsx         ← starter: icon/trailing/loading slots
    figma-token-sync/
      SKILL.md
    figma-code-connect/
      SKILL.md
      code-connect-reference.md  ← @figma/code-connect API guide
    figma-audit/
      SKILL.md
    figma-push/
      SKILL.md
  audit/               ← dated coverage reports (committed to repo)
```

---

## Common gotchas

| Gotcha | Fix |
|--------|-----|
| Figma URL has no `node-id` | Click the frame in Figma, then copy link — it will include `?node-id=` |
| `get_design_context` returns metadata only | Retry with `forceCode: true` |
| Figma property names are case-sensitive in Code Connect | `'Label'` ≠ `'label'` — use exact Figma string |
| `font-semibold` → Figma style `'SemiBold'` | Wrong. Use `'Semi Bold'` (with space) |
| Hex → Figma RGB | Divide each channel by 255: `#1a56b0` → `{ r: 0.102, g: 0.337, b: 0.690 }` |
| Code Connect template not showing in Dev Mode | Check the `send_code_connect_mappings` response for errors; verify `@figma/code-connect` is installed |
