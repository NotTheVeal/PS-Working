# PS Design Library — Claude Skills UX Guide

> A practical reference for designers and engineers using the 8 Claude Code skills that automate the full Figma ↔ code lifecycle.

---

## How Skills Work

Type `/` in any Claude Code prompt to see all skills. Claude reads the skill instructions automatically and executes the workflow — you just supply the URL or component name.

**Getting a Figma node URL:**
1. Open your Figma file
2. Click the component or frame you want
3. Right-click → **Copy link to selection**
4. The URL will contain `?node-id=` — that's what the skills need

---

## Sprint Workflow (Start Here)

Run skills in this order each sprint:

```
1. /figma-audit         → Know what to build before writing a single line
2. /figma-token-sync    → Sync design tokens first (only if tokens changed)
3. /figma-to-code       → Build each missing component
4. /figma-code-connect  → Wire Dev Mode so designers see the live component
5. /ps-accessibility    → Fix all a11y issues before opening a PR
6. /ps-react-patterns   → Fix engineering quality issues before opening a PR
7. /ps-design-review    → Pixel-compare and fix token drift before opening a PR
8. /figma-push          → Push new component back into Figma if needed
```

---

## The 8 Skills

---

### 1. `/figma-audit`

**What it does**
Scans your entire Figma file and compares every component against `src/components/`. Tells you exactly what's built, what's missing, and what's drifted — before you write a single line of code.

**When to use**
- Start of every sprint
- After a designer hands off a new file
- When you want a health check on design-to-code coverage

**Command**
```
/figma-audit https://figma.com/design/ABC123/PS-Design-Library
```

**What you get**
| Output | Description |
|--------|-------------|
| Coverage dashboard | COMPLETE / IMPLEMENTED / PARTIAL / MISSING / STALE per component |
| Missing components list | Prioritised, with ready-to-run `/figma-to-code` commands |
| Partial components list | What's built but lacking tests, stories, or Code Connect |
| Stale mappings | Code Connect registered but source file deleted |
| Saved report | `.claude/audit/figma-coverage-<date>.md` committed to repo |

**Status definitions**
| Status | Meaning |
|--------|---------|
| COMPLETE | Component + Code Connect + Storybook + Tests all present |
| IMPLEMENTED | Component exists in code, Code Connect not yet wired |
| PARTIAL | Component exists but missing Storybook or Tests |
| MISSING | No code component found for this Figma component |
| STALE | Code Connect registered in Figma but the source file is gone |

**How it helps**
Eliminates the guesswork at sprint planning. Instead of manually cross-referencing Figma pages and the `src/` folder, you get a prioritised list in under a minute — including the exact commands to run for every gap.

---

### 2. `/figma-token-sync`

**What it does**
Pulls every design variable out of Figma, diffs them against your codebase, shows you exactly what changed, and writes the updates to three files. Nothing is written until you approve the diff.

**When to use**
- When the design team updates colors, spacing, or typography in Figma
- When starting a new project and setting up the token layer
- When you suspect tokens have drifted between Figma and code

**Command**
```
/figma-token-sync https://figma.com/design/ABC123/PS-Design-Library
```

**What you get**
| File | What's written |
|------|---------------|
| `tailwind.config.js` | `theme.extend` additions and updates |
| `tokens/base.json` | Token Studio source of truth (merged, not overwritten) |
| `src/tokens/tokens.ts` | Typed TypeScript constants for use outside Tailwind |

**Diff table shown before writing:**
```
| Variable             | Figma value | Codebase value | Status   |
|----------------------|-------------|----------------|----------|
| color/brand/orange   | #d97757     | #d97757        | identical|
| color/brand/blue     | #1a56b0     | —              | NEW      |
| spacing/6            | 24px        | 20px           | CHANGED  |
```

**How it helps**
No more manually hunting for every place a color token is used. The sync catches every change, shows you a diff before touching anything, and writes consistently to all three token files in one shot. Tokens removed from Figma are flagged but never auto-deleted — you stay in control.

---

### 3. `/figma-to-code`

**What it does**
Reads a Figma component, downloads the reference screenshot, maps every design value to PS tokens, and produces three production-ready files. Shows an implementation plan and waits for your approval before writing any code.

**When to use**
- For every MISSING component from your `/figma-audit`
- When a designer hands off a new component
- When you want a pixel-perfect starting point rather than building from scratch

**Command**
```
/figma-to-code https://figma.com/design/ABC123/PS-Design-Library?node-id=1-23
```

> **Requires** a URL with `?node-id=` — click the frame in Figma → Copy link to selection.

**What you get**
| File | Contents |
|------|----------|
| `src/components/<Name>/<Name>.tsx` | React + TypeScript + Tailwind + cva + forwardRef + ARIA |
| `src/components/<Name>/<Name>.stories.tsx` | Storybook CSF3, all states, Figma URL wired |
| `src/components/<Name>/<Name>.test.tsx` | Vitest + Testing Library, behavioral tests |

**The plan step**
Before writing code, Claude shows:
```
Component:   ButtonPrimary
Files:       src/components/ButtonPrimary/...
Layout:      Horizontal flex with icon slot and label
Variants:    variant (primary | secondary | ghost), size (sm | md | lg)
Reused:      Spinner (already in codebase)
New tokens:  none
Props:
  children: ReactNode   // button label
  icon?: ReactNode      // leading icon slot
  loading?: boolean     // shows spinner, aria-busy
```

**Pixel-accuracy checklist (auto-verified)**
- Padding, gap, font size, weight, line-height, letter-spacing
- Border-radius, box-shadow, colors
- Flex/grid direction, alignment, justification
- Hover, focus-visible, active, disabled states
- Responsive breakpoints if multiple frame sizes exist

**How it helps**
Cuts component build time from hours to minutes. You never start from a blank file — Claude reads the live Figma data, translates every value to a PS token, and produces code that passes the accessibility and design review skills without rework.

---

### 4. `/figma-code-connect`

**What it does**
Maps your React component back to Figma so designers see the real component — with live props and usage examples — when they open it in Figma Dev Mode.

**When to use**
- Immediately after every `/figma-to-code` run
- When doing a bulk mapping session at the end of a sprint
- When designers report that Dev Mode is showing generic placeholders instead of real code

**Commands**
```
# Single component
/figma-code-connect https://figma.com/design/ABC123/PS-Design-Library?node-id=1-23

# Bulk mode — maps every unmapped component in the file at once
/figma-code-connect https://figma.com/design/ABC123/PS-Design-Library
```

**What you get**
| Output | Description |
|--------|-------------|
| `<Name>.figma.tsx` | Code Connect template file written alongside the component |
| Figma registration | Mapping registered in Figma — designers see it immediately |
| Prop mapping table | Figma properties ↔ React props shown for review before writing |

**Example Code Connect file**
```tsx
figma.connect(Button, 'https://figma.com/design/ABC123/...?node-id=1-23', {
  props: {
    label:    figma.string('Label'),
    variant:  figma.enum('Variant', { 'Primary': 'primary', 'Secondary': 'secondary' }),
    disabled: figma.boolean('Disabled'),
    icon:     figma.instance('Icon'),
  },
  example: ({ label, variant, disabled, icon }) => (
    <Button variant={variant} disabled={disabled} icon={icon}>{label}</Button>
  ),
})
```

**How it helps**
Closes the loop with the design team. Instead of designers copying raw CSS from Dev Mode, they see the actual React component with the right prop names, a working usage example, and a direct link to the source file. Eliminates the "how do I use this in code?" question entirely.

---

### 5. `/figma-push`

**What it does**
Takes a React component from the codebase and creates or updates its Figma counterpart — Auto Layout, variants, component properties, correct fills. The reverse of `/figma-to-code`.

**When to use**
- When engineers build something new that the design team needs in Figma
- When code has drifted ahead of the design and you want Figma to catch up
- When bootstrapping a design system from existing code

**Command**
```
/figma-push Button https://figma.com/design/ABC123/PS-Design-Library
```

**What you get**
- A fully structured Figma component with Auto Layout matching the React flex/grid
- Variant properties matching the cva variant axes
- Component properties for each prop (Label, Disabled, Loading, etc.)
- Hover, focus, and disabled state variant frames
- A screenshot comparison between the Figma result and Storybook

**How it helps**
Keeps Figma and code in sync when engineers are moving fast. Instead of designers having to rebuild a component from scratch when code changes, Claude reads the TypeScript source and produces the Figma component spec automatically — including the exact colors, spacing, and border-radius values converted to Figma's format.

---

### 6. `/ps-accessibility`

**What it does**
Full WCAG 2.1 AA accessibility audit. Covers ARIA roles, keyboard navigation, focus rings, color contrast, form labelling, dynamic content announcements, and disabled state patterns. Classifies every finding as P0–P3 and can auto-apply all P0 and P1 fixes.

**When to use**
- Before every PR — required quality gate
- When a component is flagged in an a11y review
- When auditing a whole directory before a release

**Commands**
```
# Single component
/ps-accessibility Button

# File path
/ps-accessibility src/components/Button/Button.tsx

# Whole directory
/ps-accessibility src/components/
```

**Severity levels**
| Level | Meaning | Action |
|-------|---------|--------|
| P0 Blocker | Prevents use by keyboard or screen reader users entirely | Fix immediately |
| P1 Critical | WCAG AA violation | Must fix before merging |
| P2 Major | Best practice violation | Fix in this PR if possible |
| P3 Minor | Enhancement | Log as tech debt |

**Checklist categories**
1. Interactive element semantics (roles, labels, aria-pressed, aria-expanded)
2. Keyboard navigation (Tab order, Enter/Space handlers, focus trapping)
3. Focus visibility (focus-visible ring, 3:1 contrast against background)
4. Color contrast — pre-calculated for all PS tokens
5. Images and icons (aria-hidden on decorative, alt on all img)
6. Forms and inputs (label association, aria-describedby for errors)
7. Dynamic content (loading states, toasts, modals)
8. Disabled states
9. Heading structure

**PS token contrast quick-ref**
| Text | Background | Ratio | Normal text |
|------|-----------|-------|-------------|
| `#1a1a1a` | `#ffffff` | 17.1:1 | ✅ |
| `#6b6b6b` | `#ffffff` | 5.7:1 | ✅ |
| `#aaaaaa` | `#ffffff` | 2.3:1 | ❌ decorative only |
| `#ffffff` | `#1a56b0` | 4.9:1 | ✅ |
| `#ffffff` | `#d97757` | 2.9:1 | ❌ large text only |

**How it helps**
Catches accessibility regressions before they reach users — and before they become legal liabilities. The pre-calculated PS token contrast table means no manual calculation. Auto-applying P0/P1 fixes saves hours of remediation work.

---

### 7. `/ps-react-patterns`

**What it does**
Engineering quality review against PS Design Library standards. Checks component structure, TypeScript strictness, cva usage, prop API design, composition patterns, performance, event handling, and testability. Produces a pass/fail report and can apply all fixes automatically.

**When to use**
- Before every PR — required quality gate
- When reviewing a new component for merge readiness
- When onboarding a new engineer to PS patterns
- When refactoring legacy components to meet current standards

**Commands**
```
# Single component
/ps-react-patterns Card

# Whole directory
/ps-react-patterns src/components/
```

**What it checks**

| Category | Key checks |
|----------|-----------|
| Structure | forwardRef, displayName, named exports, no `any`, HTML element type extension, `...props` spread |
| Variant logic | cva for ≥2 variants, VariantProps in interface, defaultVariants in cva not component |
| Prop API | Semantic names, positive booleans, precise callback types, no prop drilling >2 levels |
| Composition | Sub-components for distinct regions, exported alongside parent |
| Performance | No anonymous functions in JSX, React.memo where needed, no inline expensive computations |
| Event handling | Space+Enter on custom interactive elements, e.preventDefault() for scroll prevention |
| TypeScript | No `as any`, discriminated unions for mutually exclusive props, `satisfies` for config objects |
| Testability | Accessible queries, isolated side effects, ref forwarding testable |

**Verdicts**
- `PASS` — Ready to merge
- `NEEDS WORK` — Fixable issues found
- `SIGNIFICANT REWORK REQUIRED` — Structural problems need addressing

**How it helps**
Enforces the PS engineering standard consistently across the whole team — not just when a senior engineer happens to review. New engineers get specific, actionable feedback with exact code fixes. The auto-apply feature means a full engineering review takes seconds instead of a PR round-trip.

---

### 8. `/ps-design-review`

**What it does**
Visual QA audit before merge. Greps for hardcoded hex/px values, checks all 8 interactive states, verifies token usage, spacing consistency, typography compliance, and Storybook coverage. With a Figma URL, downloads the reference screenshot and does a direct pixel comparison.

**When to use**
- Before every PR — required quality gate
- When a designer reports visual drift between Figma and the live component
- When auditing existing components for token compliance
- When a component has been updated and needs a visual sanity check

**Commands**
```
# Code-only audit
/ps-design-review Button

# Code + pixel comparison against Figma
/ps-design-review Button https://figma.com/design/ABC123/...?node-id=1-23
```

**What it checks**

| Category | What it looks for |
|----------|--------------------|
| Token compliance | Raw hex values, inline style={{ }}, magic pixel values, hardcoded font styles |
| Spacing | 8px grid compliance, consistent padding in component family, no mixed units |
| Visual hierarchy | Primary/secondary/muted text using correct tokens |
| Interactive states | All 8 states present: default, hover, focus-visible, active, disabled, loading, error, selected |
| Border & radius | rounded-lg for buttons/inputs, rounded-[10px] for cards, rounded-full for pills |
| Typography | 14px body, 13px small, 11px labels, correct font stack |
| Responsive | 320px minimum width, 44×44px touch targets, Tailwind breakpoints only |
| Storybook coverage | All variants, all states, edge cases, Figma URL param |

**Required interactive states**
| State | PS Implementation |
|-------|------------------|
| Default | Base styles |
| Hover | `hover:` — darken background one step |
| Focus-visible | `focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1` |
| Active/pressed | `active:` — slightly darker than hover |
| Disabled | `disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none` |
| Loading | Spinner + `aria-busy="true"` |
| Error | `border-[#e53e3e]` + error text below |
| Selected | `bg-[#e8f0fe] border-[#1a56b0] text-[#1a56b0]` |

**Verdicts**
- `✓ APPROVED` — Ready to merge
- `⚠ APPROVED WITH NOTES` — Minor issues, log as tech debt
- `✗ NEEDS REWORK` — Token violations or missing states must be fixed

**How it helps**
Catches the design drift that code review misses — hardcoded colors, a missing hover state, slightly wrong border-radius. The Figma pixel comparison makes it impossible for a component to ship looking different from the design. Auto-applying token fixes and missing states means the rework is done in the same session, not a week later.

---

## Common Gotchas

| Problem | Fix |
|---------|-----|
| Figma URL has no `node-id` | Click the frame → right-click → **Copy link to selection** |
| Skill doesn't trigger | Type `/` and select from the list — don't just type the command as freetext |
| `get_design_context` returns metadata only | Retry with `forceCode: true` |
| Code Connect not showing in Figma Dev Mode | Ensure `@figma/code-connect` is installed; check that the MCP registration succeeded |
| Font `'SemiBold'` not found in Figma | Use `'Semi Bold'` with a space |
| `#aaaaaa` text failing contrast | Only use for decorative/disabled — fails AA on white (2.3:1) |
| White on `#d97757` failing | Fails AA for normal text — large text (≥18px) or icons only |
| Component already exists in Figma | `/figma-push` will ask before overwriting |
| Token sync wants to delete a token | It won't auto-delete — you review flagged removals manually |

---

## File Structure Reference

```
src/components/<Name>/
  <Name>.tsx           ← Component (forwardRef, cva, ARIA)
  <Name>.stories.tsx   ← Storybook (all states, Figma URL param)
  <Name>.test.tsx      ← Vitest + Testing Library
  <Name>.figma.tsx     ← Code Connect template

.claude/
  settings.json        ← Pre-approved MCP + Bash permissions (no prompts during skills)
  audit/               ← Dated coverage reports from /figma-audit
  skills/
    figma-audit/
    figma-token-sync/
    figma-to-code/
      ps-tokens.md     ← Full PS Design Library token reference
      examples.md      ← Worked examples: Card, Chip, Banner
      templates/       ← base.tsx, with-variants.tsx, with-slots.tsx
    figma-code-connect/
      code-connect-reference.md
    figma-push/
    ps-accessibility/
    ps-react-patterns/
    ps-design-review/
```

---

*PS Design Library — Claude Skills UX Guide · Generated 2026-06-10*
