---
name: ps-react-patterns
description: Audit or generate React components following PS Design Library engineering standards — composition, performance, prop API design, TypeScript correctness, and testability. Use when reviewing a component for code quality, or when you want Claude to follow PS patterns from the start.
when_to_use: "Use when reviewing a component's code quality, designing a prop API, checking for performance issues, or making sure a new component follows PS Design Library engineering conventions."
allowed-tools: Read Grep Glob Bash
---

# PS React Patterns

Audit or enforce PS Design Library React engineering standards across components.
Covers composition, TypeScript correctness, prop API design, performance, and testability.

---

## Step 1 — Locate the target

`$ARGUMENTS` can be a component name, file path, or directory. If no argument, audit all
components in `src/components/`.

---

## Step 2 — Engineering checklist

### 2.1 Component structure

- [ ] `React.forwardRef` used on every component — enables ref forwarding for consumers
- [ ] `displayName` set on every forwardRef component: `Component.displayName = 'Component'`
- [ ] Named export only: `export const ComponentName` — no default exports
- [ ] No TypeScript `any` — use `unknown`, proper generics, or explicit union types
- [ ] Props interface extends the correct HTML element type:
  - Buttons: `React.ButtonHTMLAttributes<HTMLButtonElement>`
  - Divs: `React.HTMLAttributes<HTMLDivElement>`
  - Inputs: `React.InputHTMLAttributes<HTMLInputElement>`
  - Links: `React.AnchorHTMLAttributes<HTMLAnchorElement>`
- [ ] `...props` spread onto the root element so consumers can pass `data-*`, `aria-*`, `id`, etc.
- [ ] `className` merging uses array filter pattern or `clsx`/`cn` — never string concatenation
  ```tsx
  // ✓ correct
  className={[baseClasses, conditionalClass, className].filter(Boolean).join(' ')}
  // ✗ wrong
  className={`base-class ${className}`}  // breaks when className is undefined
  ```

### 2.2 Variant logic

- [ ] `cva` (class-variance-authority) used when ≥ 2 variant axes exist
- [ ] `VariantProps<typeof variantsFn>` in the props interface — not manually typed enums
- [ ] Default variants defined in `cva` `defaultVariants` — not in the component default props
- [ ] `compoundVariants` used for combinations instead of conditional logic in JSX
- [ ] Single variant strings (`className={condition ? 'a' : 'b'}`) fine for simple cases — no need
  to reach for cva

### 2.3 Prop API design

- [ ] Props are semantic, not visual: `variant="danger"` not `color="red"`, `size="lg"` not `width={48}`
- [ ] Boolean props use positive framing: `disabled` not `notEnabled`, `loading` not `isNotReady`
- [ ] Slot props typed as `React.ReactNode` not `string | JSX.Element`
- [ ] Callback props typed precisely: `onToggle?: (active: boolean) => void` not `() => void`
- [ ] No prop drilling beyond 2 levels — use context or composition instead
- [ ] Optional props have sensible defaults — avoid required props that could have a good default

### 2.4 Composition over configuration

Prefer composable sub-components over mega-props:

```tsx
// ✓ composable
<Card>
  <CardHeader icon={<Icon />} title="Title" />
  <CardBody>Content</CardBody>
</Card>

// ✗ monolithic
<Card headerIcon={<Icon />} headerTitle="Title" bodyContent="Content" />
```

Rules:
- [ ] Components with distinct visual regions (header, body, footer) are split into sub-components
- [ ] Sub-components exported alongside the parent: `export { Card, CardHeader, CardBody }`
- [ ] Parent component does not prescribe layout of slot content — let consumers compose
- [ ] Use `children` for flexible slot content; named slot props only when order/placement matters

### 2.5 Performance

- [ ] No anonymous functions created inside JSX on every render for stable callbacks:
  ```tsx
  // ✗ creates new function every render
  <button onClick={() => onToggle(!active)}>
  // ✓ stable reference when passed via props
  // (exception: inline is fine for simple event adapters in leaf components)
  ```
- [ ] `React.memo` on components that receive stable props but re-render frequently
- [ ] No expensive computations inline in the render body — use `useMemo` if genuinely expensive
- [ ] Images use explicit `width` + `height` to prevent layout shift
- [ ] SVGs inlined only when they need dynamic color/animation; otherwise use `<img>` or a sprite

### 2.6 Event handling

- [ ] Native events used where possible (`onClick`, `onChange`) instead of custom wrappers
- [ ] Custom interactive elements (non-button role="button") handle both `onClick` AND `onKeyDown`
  for Space + Enter:
  ```tsx
  onKeyDown={(e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
      onClick?.()
    }
  }}
  ```
- [ ] `e.preventDefault()` called when Space triggers a button (prevents page scroll)
- [ ] Form submit handlers call `e.preventDefault()` before processing

### 2.7 TypeScript

- [ ] No `as any`, no `as unknown as X` escape hatches without a comment explaining why
- [ ] Generic components use proper type parameters: `React.forwardRef<El, Props>`
- [ ] Discriminated unions for mutually exclusive prop combinations:
  ```tsx
  // ✓ either href or onClick, not both optional
  type ButtonProps =
    | { href: string; onClick?: never }
    | { href?: never; onClick: () => void }
  ```
- [ ] `satisfies` used for config/variant objects to get inference + type checking
- [ ] `type` imports used for type-only imports: `import type { FC } from 'react'`

### 2.8 Testability

- [ ] No logic that depends on implementation details (class names, internal state shape)
- [ ] Behaviour exposed via accessible queries: `getByRole`, `getByLabelText`, `getByText`
- [ ] Side effects isolated so they can be mocked: no direct `fetch` in components
- [ ] `data-testid` used sparingly — only when no accessible query works
- [ ] Ref forwarding testable: `const ref = React.createRef(); render(<C ref={ref} />); expect(ref.current).toBeInstanceOf(HTMLElement)`

---

## Step 3 — Output report

```
# React Patterns Audit — <ComponentName>
Date: <today>

## Summary
| Category | Pass | Fail | Warn |
|----------|------|------|------|
| Structure       | N | N | N |
| Variant logic   | N | N | N |
| Prop API        | N | N | N |
| Composition     | N | N | N |
| Performance     | N | N | N |
| TypeScript      | N | N | N |
| Testability     | N | N | N |

## Findings (failures only)

### [FAIL] <Category> — <Title>
File: src/components/<Name>/<Name>.tsx:<line>
Issue: <what is wrong and why it matters>
Fix:
  <exact corrected code>

## Overall verdict
PASS / NEEDS WORK / SIGNIFICANT REWORK REQUIRED
```

---

## Step 4 — Apply fixes

After reporting, ask: "Apply all fixes automatically?"

If yes, edit files directly. Re-run the checklist after applying.
