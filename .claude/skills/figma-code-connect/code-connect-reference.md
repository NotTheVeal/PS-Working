# Code Connect — Reference

Quick reference for writing `.figma.tsx` files in the PS Design Library.

---

## Package setup

```bash
npm install --save-dev @figma/code-connect
```

Add to `package.json` scripts:
```json
{
  "figma:connect:publish": "figma connect publish",
  "figma:connect:unpublish": "figma connect unpublish"
}
```

---

## File naming convention

Always colocate with the component:

```
src/components/Button/
  Button.tsx           ← component
  Button.stories.tsx   ← Storybook
  Button.test.tsx      ← tests
  Button.figma.tsx     ← Code Connect  ← NEW
```

---

## Full template anatomy

```tsx
import figma, { Enum } from '@figma/code-connect'
import { Button } from './Button'
import { Icon } from '../Icon/Icon'

// One figma.connect() per Figma component node.
// For component sets, one call per variant node.
figma.connect(Button, 'https://figma.com/design/FILE_KEY/...?node-id=1:23', {

  // ── props ──────────────────────────────────────────────────────────────────
  // Maps Figma component properties to React props.
  // Property names must match EXACTLY what's in Figma (case-sensitive).
  props: {

    // TEXT → string value
    label: figma.string('Label'),

    // BOOLEAN → boolean value
    disabled: figma.boolean('Disabled'),
    loading:  figma.boolean('Loading'),

    // VARIANT (string enum) → mapped to code values
    // Keys = exact Figma variant strings | Values = TypeScript prop values
    variant: figma.enum('Variant', {
      'Primary':   'primary',
      'Secondary': 'secondary',
      'Ghost':     'ghost',
      'Danger':    'danger',
    }),

    size: figma.enum('Size', {
      'Small':  'sm',
      'Medium': 'md',
      'Large':  'lg',
    }),

    // INSTANCE_SWAP → renders the swapped Figma instance as JSX
    icon: figma.instance('Leading Icon'),

    // BOOLEAN → conditional JSX (show / hide a slot)
    trailingIcon: figma.boolean('Has Trailing Icon', {
      true:  <Icon name="chevron-right" />,
      false: null,
    }),

    // BOOLEAN → map true/false to different class strings or props
    fullWidth: figma.boolean('Full Width', {
      true:  'w-full',
      false: 'w-auto',
    }),
  },

  // ── example ────────────────────────────────────────────────────────────────
  // Valid JSX that Figma renders in Dev Mode.
  // Destructure only what you need — unused props are fine to omit.
  example: ({ label, variant, size, disabled, loading, icon, trailingIcon, fullWidth }) => (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      loading={loading}
      icon={icon}
      className={fullWidth}
    >
      {label}
      {trailingIcon}
    </Button>
  ),
})
```

---

## Component sets (multiple variant nodes)

When a Figma component set has separate nodes per variant (e.g. Button/Primary, Button/Secondary),
write one `figma.connect()` per node in the **same file**:

```tsx
import figma from '@figma/code-connect'
import { Button } from './Button'

// Primary variant node
figma.connect(Button, 'https://figma.com/design/KEY/...?node-id=1:10', {
  props: { label: figma.string('Label'), disabled: figma.boolean('Disabled') },
  example: ({ label, disabled }) => <Button variant="primary" disabled={disabled}>{label}</Button>,
})

// Secondary variant node
figma.connect(Button, 'https://figma.com/design/KEY/...?node-id=1:11', {
  props: { label: figma.string('Label'), disabled: figma.boolean('Disabled') },
  example: ({ label, disabled }) => <Button variant="secondary" disabled={disabled}>{label}</Button>,
})
```

---

## Nested / composed components

Use `figma.nestedProps()` to pull properties from a child instance:

```tsx
figma.connect(Card, 'https://figma.com/design/KEY/...?node-id=2:1', {
  props: {
    title:       figma.string('Title'),
    // Pull props from a nested "Card Header" instance
    headerProps: figma.nestedProps('Card Header', {
      eyebrow: figma.string('Eyebrow'),
    }),
  },
  example: ({ title, headerProps }) => (
    <Card>
      <CardHeader eyebrow={headerProps.eyebrow} />
      {title}
    </Card>
  ),
})
```

---

## Children / slot content

Use `figma.children()` to render a named layer as children:

```tsx
props: {
  content: figma.children('Content Slot'),
},
example: ({ content }) => <Card>{content}</Card>
```

---

## Prop type quick-reference

| Situation | Helper |
|-----------|--------|
| Figma text layer → string prop | `figma.string('Name')` |
| Figma checkbox / boolean prop | `figma.boolean('Name')` |
| Figma boolean → different JSX | `figma.boolean('Name', { true: <A/>, false: <B/> })` |
| Figma variant/enum prop | `figma.enum('Name', { 'FigmaVal': 'codeVal' })` |
| Figma instance swap | `figma.instance('Name')` |
| Multiple named child instances | `figma.children(['Slot A', 'Slot B'])` |
| Props from a child component | `figma.nestedProps('Layer Name', { … })` |

---

## Gotchas

- Figma property names are **case-sensitive** — `'Label'` ≠ `'label'`
- For `figma.enum`, the key must be the **exact Figma variant value string**, not a display name
- `figma.instance()` renders whatever component is swapped in — it does not accept a static value
- `.figma.tsx` files are **not compiled into your app bundle** — they're only read by the
  `figma connect publish` CLI and by the MCP `send_code_connect_mappings` tool
- Every `figma.connect()` call requires a unique `node-id` — two calls can share the same
  component but must point to different Figma nodes

---

## Verification checklist

After running the skill:

- [ ] `.figma.tsx` file exists next to component
- [ ] Mapping registered via `send_code_connect_mappings` (check tool response for errors)
- [ ] In Figma: open the component in Dev Mode → React tab shows the example
- [ ] Prop values in Figma Dev Mode match the codebase prop names exactly
- [ ] No TypeScript errors in the `.figma.tsx` file (`tsc --noEmit`)
