---
name: ps-accessibility
description: Audit a React component or page for accessibility issues against WCAG 2.1 AA and PS Design Library standards. Checks ARIA, color contrast, keyboard navigation, focus management, screen reader output, and interactive semantics. Use after building a component or before shipping a PR.
when_to_use: "Use when you want to verify a component meets accessibility requirements — ARIA roles, keyboard nav, focus rings, color contrast, screen reader announcements."
allowed-tools: Read Grep Glob Bash
---

# PS Accessibility Audit

Audit a component for accessibility issues against WCAG 2.1 AA and PS Design Library standards.
Produce a prioritised findings report with exact file locations and fix instructions.

---

## Step 1 — Locate the target

`$ARGUMENTS` can be:
- A component name: `Button` → read `src/components/Button/Button.tsx`
- A file path: `src/components/Button/Button.tsx`
- A directory: `src/components/` → audit every component in it
- No argument → audit every `.tsx` file in `src/components/`

Read every target file in full before auditing.

---

## Step 2 — Run the audit checklist

For each component, check every item below. Mark each **PASS**, **FAIL**, or **WARN**.

### 2.1 Interactive element semantics

- [ ] Every clickable `<div>` or `<span>` has `role="button"` (or is a real `<button>`)
- [ ] Every `<button>` has either visible text, `aria-label`, or `aria-labelledby`
- [ ] Links (`<a>`) have descriptive text — not "click here" or "read more"
- [ ] Custom checkboxes/radios use `role="checkbox"` / `role="radio"` + `aria-checked`
- [ ] Custom selects/dropdowns use `role="combobox"` or `role="listbox"` pattern correctly
- [ ] Toggle buttons use `aria-pressed`
- [ ] Disclosure/accordion triggers use `aria-expanded` + `aria-controls`

### 2.2 Keyboard navigation

- [ ] All interactive elements reachable by `Tab` (no `tabIndex={-1}` on focusable elements without reason)
- [ ] Custom interactive elements handle `Enter` and `Space` via `onKeyDown`
- [ ] Modals/dialogs trap focus when open and restore focus on close
- [ ] No keyboard trap outside of intentional modal patterns
- [ ] Logical tab order matches visual reading order

### 2.3 Focus visibility

- [ ] Every interactive element has a visible `focus-visible` ring
- [ ] Focus ring uses `focus-visible:` Tailwind variant (not `:focus`) to avoid showing on mouse click
- [ ] Focus ring color has 3:1 contrast against adjacent background
- [ ] PS standard focus ring: `focus-visible:ring-2 focus-visible:ring-[#1a56b0] focus-visible:ring-offset-1`

### 2.4 Color contrast (WCAG AA)

- [ ] Normal text (< 18pt / < 14pt bold): **4.5:1** minimum contrast ratio
- [ ] Large text (≥ 18pt / ≥ 14pt bold): **3:1** minimum contrast ratio
- [ ] UI components and graphical objects: **3:1** minimum

**PS token contrast check table** (pre-calculated):

| Foreground | Background | Ratio | AA Normal | AA Large |
|-----------|-----------|-------|-----------|---------|
| `#1a1a1a` | `#ffffff` | 17.1:1 | ✓ | ✓ |
| `#1a1a1a` | `#f0ede8` | 15.2:1 | ✓ | ✓ |
| `#6b6b6b` | `#ffffff` | 5.7:1 | ✓ | ✓ |
| `#6b6b6b` | `#f0ede8` | 5.1:1 | ✓ | ✓ |
| `#aaaaaa` | `#ffffff` | 2.3:1 | ✗ | ✗ |
| `#ffffff` | `#1a56b0` | 4.9:1 | ✓ | ✓ |
| `#ffffff` | `#1a6b3a` | 5.1:1 | ✓ | ✓ |
| `#ffffff` | `#d97757` | 2.9:1 | ✗ | ✓ |
| `#1a56b0` | `#e8f0fe` | 4.6:1 | ✓ | ✓ |
| `#9b2c2c` | `#fde8e8` | 5.4:1 | ✓ | ✓ |
| `#1a6b3a` | `#d4edda` | 5.2:1 | ✓ | ✓ |

⚠️ `#aaaaaa` on white FAILS AA for normal text — only use for decorative/disabled content.
⚠️ `#ffffff` on `#d97757` FAILS AA for normal text — only use for large text (≥ 18px).

### 2.5 Images and icons

- [ ] Decorative icons have `aria-hidden="true"`
- [ ] Meaningful icons have `aria-label` or adjacent visible text
- [ ] `<img>` elements always have `alt` (empty string `alt=""` for decorative)
- [ ] SVG icons used as buttons have `role="img"` and `aria-label` if standalone

### 2.6 Forms and inputs

- [ ] Every `<input>` has an associated `<label>` (via `htmlFor` / `id` pair or `aria-label`)
- [ ] Error messages are associated with their field via `aria-describedby`
- [ ] Required fields marked with `aria-required="true"` (not just a visual asterisk)
- [ ] Invalid fields marked with `aria-invalid="true"` when in error state
- [ ] Placeholder text is NOT the only label (fails when field is focused)

### 2.7 Dynamic content

- [ ] Loading states announced: `aria-busy="true"` on the container or live region
- [ ] Success/error toasts use `role="alert"` or `aria-live="polite"` / `aria-live="assertive"`
- [ ] `aria-live` regions exist in the DOM before content is injected (not created on the fly)
- [ ] Modal open/close announced: `role="dialog"` + `aria-labelledby` pointing to the title

### 2.8 Disabled states

- [ ] Disabled interactive elements use `disabled` attribute on native elements OR
      `aria-disabled="true"` + `tabIndex={-1}` on custom elements
- [ ] Disabled elements are NOT removed from tab order without `aria-disabled` communication

### 2.9 Heading structure

- [ ] Headings form a logical hierarchy (no skipping from h1 → h3)
- [ ] Page has exactly one `<h1>`
- [ ] Section headings use the correct level for their nesting depth

---

## Step 3 — Severity classification

Classify each failing item:

| Severity | Meaning |
|----------|---------|
| **P0 — Blocker** | Prevents use by keyboard or screen reader users entirely |
| **P1 — Critical** | WCAG AA violation — must fix before shipping |
| **P2 — Major** | Best practice violation — fix in this PR if possible |
| **P3 — Minor** | Enhancement — log as tech debt |

---

## Step 4 — Output report

```
# Accessibility Audit — <ComponentName>
Date: <today>
Files audited: <list>
WCAG level: 2.1 AA

## Summary
| Severity | Count |
|----------|-------|
| P0 Blocker  | N |
| P1 Critical | N |
| P2 Major    | N |
| P3 Minor    | N |
| PASS        | N |

## Findings

### [P0] <Finding title>
File: src/components/<Name>/<Name>.tsx:<line>
Issue: <what is wrong>
WCAG: <criterion number and name>
Fix:
  <exact code change, not a description>

### [P1] <Finding title>
…

## Passing checks
(Brief list of what was verified and passed)

## Recommended fixes (copy-paste ready)
<Paste the corrected code blocks for every FAIL — grouped by file>
```

---

## Step 5 — Apply fixes

After reporting, ask: "Apply all P0 and P1 fixes automatically?"

If yes, edit the files directly. Re-run the checklist after applying to confirm everything passes.
