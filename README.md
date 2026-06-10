# PS Design Library — Claude Skills

> Eight Claude Code skills that automate the full Figma ↔ code lifecycle for the PS Design Library — from coverage auditing and pixel-perfect implementation through to accessibility checks and visual QA.

---

## Opening in VS Code

```bash
git clone https://github.com/nottheveal/ps-working
cd ps-working
code .
```

Install the **Claude Code** VS Code extension if you haven't already:
- Open Extensions (`Cmd+Shift+X` / `Ctrl+Shift+X`)
- Search **Claude Code** → Install → Sign in

Type `/` in any Claude Code prompt to see all 8 skills immediately — no setup required.

---

## The 8 skills

### Figma ↔ Code

---

#### `/figma-audit <figma-file-url>`

Scans your entire Figma file and compares every component against `src/components/`. Tells you exactly what's built, what's missing, and what's drifted.

**When to use:** Start of every sprint, before writing a single line of code.

**Output:**
- COMPLETE / IMPLEMENTED / PARTIAL / MISSING / STALE classification per component
- Prioritised list of missing components with ready-to-run `/figma-to-code` commands
- Dated report saved to `.claude/audit/figma-coverage-<date>.md`

```
/figma-audit https://figma.com/design/ABC123/PS-Design-Library
```

---

#### `/figma-token-sync <figma-file-url>`

Pulls every design variable out of Figma, diffs them against your codebase, and writes the changes to three files. Shows a diff table before touching anything — you approve first.

**When to use:** Whenever the design team updates colors, spacing, or typography in Figma.

**Output:**
- `tailwind.config.js` — theme.extend additions/updates
- `tokens/base.json` — Token Studio source of truth
- `src/tokens/tokens.ts` — typed TypeScript constants

```
/figma-token-sync https://figma.com/design/ABC123/PS-Design-Library
```

---

#### `/figma-to-code <figma-node-url>`

Reads a Figma component, downloads the reference screenshot, maps every design value to PS tokens, and produces three production-ready files. Shows a plan and waits for your approval before writing code.

**When to use:** For every MISSING component from your audit, or whenever a designer hands off a new component.

**Requires:** A URL with `?node-id=` — click the frame in Figma → Copy link to selection.

**Output:**
- `src/components/<Name>/<Name>.tsx` — React + TypeScript + Tailwind + cva + forwardRef + ARIA
- `src/components/<Name>/<Name>.stories.tsx` — Storybook CSF3, all states, Figma URL wired
- `src/components/<Name>/<Name>.test.tsx` — Vitest + Testing Library, behavioral tests

```
/figma-to-code https://figma.com/design/ABC123/PS-Design-Library?node-id=1-23
```

---

#### `/figma-code-connect <figma-node-url>`

Maps your React component back to Figma so designers see the real component — with live props and usage examples — in Figma Dev Mode.

**When to use:** Run immediately after `/figma-to-code` to close the loop with the design team.

**Output:**
- `src/components/<Name>/<Name>.figma.tsx` — Code Connect template file
- Mapping registered in Figma via MCP — designers see it immediately in Dev Mode

**Bulk mode:** Pass a file URL (no `node-id`) to map every unmapped component at once.

```
/figma-code-connect https://figma.com/design/ABC123/PS-Design-Library?node-id=1-23
```

---

#### `/figma-push <ComponentName> <figma-file-url>`

Takes a React component from the codebase and creates or updates its Figma counterpart — Auto Layout, variants, component properties, correct fills.

**When to use:** When engineers build something new that the design team needs in Figma, or when code has drifted ahead of the design.

```
/figma-push Button https://figma.com/design/ABC123/PS-Design-Library
```

---

### Quality Gates — run before every PR merge

---

#### `/ps-accessibility <component-name>`

WCAG 2.1 AA audit. Covers ARIA roles, keyboard navigation, focus rings, color contrast, form labelling, dynamic content, and disabled states. Classifies findings as P0–P3 and can auto-apply fixes.

**PS token contrast quick-ref:**

| Text color | Background | AA Normal text? |
|-----------|-----------|----------------|
| `#1a1a1a` | `#ffffff` | ✅ 17.1:1 |
| `#6b6b6b` | `#ffffff` | ✅ 5.7:1 |
| `#aaaaaa` | `#ffffff` | ❌ 2.3:1 — decorative only |
| `#ffffff` | `#1a56b0` | ✅ 4.9:1 |
| `#ffffff` | `#d97757` | ❌ 2.9:1 — large text only |

```
/ps-accessibility Button
/ps-accessibility src/components/
```

---

#### `/ps-react-patterns <component-name>`

Engineering quality review. Checks forwardRef + displayName, TypeScript strictness, cva usage, prop API design, composition, performance, keyboard event handling, and testability.

```
/ps-react-patterns Card
/ps-react-patterns src/components/
```

---

#### `/ps-design-review <component-name> [figma-url]`

Visual QA. Greps for hardcoded hex/px values, checks all interactive states exist (hover, focus, active, disabled, loading, error, selected), verifies token usage, spacing, typography, and Storybook coverage. With a Figma URL, downloads the reference screenshot and does a direct pixel comparison.

```
/ps-design-review Button
/ps-design-review Button https://figma.com/design/ABC123/...?node-id=1-23
```

---

## Sprint workflow

```
1. /figma-audit        → gap report — know what to build
2. /figma-token-sync   → sync design variables to code first (if changed)
3. /figma-to-code      → build each MISSING component
4. /figma-code-connect → wire Dev Mode for each new component
5. /ps-accessibility   → fix a11y issues before PR
6. /ps-react-patterns  → fix engineering issues before PR
7. /ps-design-review   → pixel compare and fix token drift before PR
8. /figma-push         → push new component into Figma if needed
```

---

## File structure

```
.claude/
  settings.json                     Pre-approved MCP permissions (no prompts during skills)
  audit/                            Dated coverage reports from /figma-audit
  skills/
    README.md                       Skills quick-reference
    figma-audit/SKILL.md
    figma-token-sync/SKILL.md
    figma-to-code/
      SKILL.md
      ps-tokens.md                  Full PS Design Library token reference
      examples.md                   Worked examples: Card, Chip, Banner
      templates/
        base.tsx                    Starter: no variants
        with-variants.tsx           Starter: cva variant axes
        with-slots.tsx              Starter: icon/trailing/loading slots
    figma-code-connect/
      SKILL.md
      code-connect-reference.md     Full @figma/code-connect API guide
    figma-push/SKILL.md
    ps-accessibility/SKILL.md
    ps-react-patterns/SKILL.md
    ps-design-review/SKILL.md

src/components/<Name>/
  <Name>.tsx                        Component
  <Name>.stories.tsx                Storybook
  <Name>.test.tsx                   Tests
  <Name>.figma.tsx                  Code Connect template
```

---

## Common gotchas

| Problem | Fix |
|---------|-----|
| Figma URL has no `node-id` | Click the frame → right-click → **Copy link to selection** |
| `get_design_context` returns metadata only | Retry with `forceCode: true` |
| Code Connect not showing in Figma Dev Mode | Ensure `@figma/code-connect` is installed; check MCP response for errors |
| Font `'SemiBold'` not found in Figma | Use `'Semi Bold'` with a space |
| Need hex → Figma RGB | Divide each channel by 255: `#1a56b0` → `{ r: 0.102, g: 0.337, b: 0.690 }` |
| `#aaaaaa` text failing contrast | Only use for decorative/disabled — fails AA on white |
| White on `#d97757` failing | Fails AA for normal text — large text (≥18px) or icons only |
