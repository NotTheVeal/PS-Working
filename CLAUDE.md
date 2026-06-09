# PS Design Library — Claude Instructions

## Project
PS Design Library setup guide and component library. Phase 4 — Claude Automation.

## Tech Stack
- React + TypeScript
- Tailwind CSS
- Token Studio (design tokens)
- Storybook
- Vitest + Testing Library
- Figma (source of truth for design)

## Hard Rules
1. Always use design tokens — never hardcode colour or spacing values when a token exists
2. Every component must include ARIA roles, labels, and keyboard navigation
3. Always generate a Storybook story covering all states and variants
4. Always generate unit tests (Vitest + Testing Library)
5. Use `React.forwardRef` on all components
6. Use `class-variance-authority` (cva) for variant logic when ≥2 variants exist
7. Named exports only — `export const ComponentName`
8. No TypeScript `any` types
9. Never modify `tailwind.config.js` without approval
10. Never install new packages without approval

## Behaviour
- Explain what you are building before writing any code
- Ask one clarifying question if anything is unclear
- Generate the full file — never use `// rest of code here` placeholders
- Summarise what was created and why after generating

## Figma Integration
The Figma MCP server is connected. Use it to read live design data.
When given a Figma URL, trigger the appropriate skill automatically (see below).

## Design Tokens
See `.claude/skills/figma-to-code/ps-tokens.md` for the full PS Design Library token map.
Primary palette: `#1a1a1a` (text), `#d97757` (brand orange), `#1a56b0` (blue),
`#1a6b3a` (green), `#f0ede8` (page bg), `#e0ddd6` (border).

---

## Skill System

Five skills cover the full design ↔ code lifecycle. All are in `.claude/skills/`.

### `/figma-to-code <figma-url>`
**Figma → Code.** Given a Figma node URL, reads the design via MCP, maps every value
to PS tokens, and produces:
- `<Name>.tsx` — React + TypeScript + Tailwind + cva + forwardRef + ARIA
- `<Name>.stories.tsx` — Storybook CSF3, all states, Figma URL param
- `<Name>.test.tsx` — Vitest + Testing Library, behavioral tests

### `/figma-token-sync <figma-url>`
**Token sync.** Extracts Figma variables, diffs against the codebase, shows a change
table, then writes:
- `tailwind.config.js` — `theme.extend` additions/updates
- `tokens/base.json` — Token Studio source of truth
- `src/tokens/tokens.ts` — typed TypeScript constants

### `/figma-code-connect <figma-url>`
**Code → Figma link.** Generates a `.figma.tsx` Code Connect template file and registers
the mapping in Figma so designers see the real component with live props in Dev Mode.
Supports single nodes, component sets, and bulk mode (whole file).

### `/figma-audit <figma-url>`
**Coverage dashboard.** Inventories every Figma component vs every codebase component,
classifies each as COMPLETE / IMPLEMENTED / PARTIAL / MISSING / STALE, and writes a
dated report to `.claude/audit/`. Offers to kick off follow-up skills for any gaps.

### `/figma-push <component-name> <figma-url>`
**Code → Figma design.** Reverse of figma-to-code. Reads a React component, derives its
visual spec, and creates or updates the Figma component via the Plugin API — Auto Layout,
variants, component properties, correct colors and typography.

---

## Workflow

```
Sprint starts
    │
    ▼  /figma-audit <file-url>
    Gap report → prioritised list of missing / partial components
    │
    ▼  /figma-token-sync <file-url>   (if tokens changed)
    tailwind.config + tokens.json + tokens.ts updated
    │
    For each component to build:
    ▼  /figma-to-code <node-url>
    .tsx + .stories.tsx + .test.tsx created
    │
    ▼  /figma-code-connect <node-url>
    .figma.tsx written + Dev Mode link registered
    │
    If new component needs to go INTO Figma:
    ▼  /figma-push <ComponentName> <file-url>
    Figma component created / updated to match code
```

## File layout

```
src/components/<Name>/
  <Name>.tsx           ← component (forwardRef, cva, ARIA)
  <Name>.stories.tsx   ← Storybook (all states, figma URL param)
  <Name>.test.tsx      ← Vitest + Testing Library
  <Name>.figma.tsx     ← Code Connect template

.claude/
  settings.json        ← pre-approved MCP + Bash permissions
  skills/
    figma-to-code/     → Figma → code
    figma-token-sync/  → token sync
    figma-code-connect/→ code → Figma link
    figma-audit/       → coverage dashboard
    figma-push/        → code → Figma design
  audit/               ← dated coverage reports written here
```
