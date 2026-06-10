---
name: figma-code-connect
description: Map existing codebase components to their Figma counterparts using Code Connect. Generates .figma.tsx template files and registers them in Figma so designers see the real component, its props, and usage examples in Dev Mode. Use when you want to close the loop between a Figma design and a React component that already exists in the codebase.
when_to_use: "Use after a component has been implemented to link it back to Figma, or when running a bulk mapping session across a whole design file. Requires a Figma URL with a node-id."
allowed-tools: Read Grep Glob Bash Write mcp__Figma__get_context_for_code_connect mcp__Figma__get_code_connect_suggestions mcp__Figma__get_code_connect_map mcp__Figma__send_code_connect_mappings mcp__Figma__add_code_connect_map
---

# Figma Code Connect

You are linking codebase components to their Figma counterparts so that designers see the real
React component — with live props and usage examples — when they open a node in Figma Dev Mode.

The output of this skill is:
1. A `.figma.tsx` Code Connect template file alongside each component
2. Registered mappings in Figma via `send_code_connect_mappings`

---

## Step 1 — Parse the Figma URL

The user supplies a Figma URL in `$ARGUMENTS`. Extract:
- `fileKey` — segment after `/design/`
- `nodeId` — `?node-id=` value, converting `-` to `:`

If `node-id` is missing, ask for a node-specific URL.

---

## Step 2 — Check what's already mapped

```
mcp__Figma__get_code_connect_map(
  fileKey: <fileKey>,
  nodeId: <nodeId>,
  codeConnectLabel: "React"
)
```

If the node is already mapped, show the current mapping and ask whether to overwrite or update it.

---

## Step 3 — Read the Figma component structure

Call both tools **in parallel**:

```
mcp__Figma__get_context_for_code_connect(
  fileKey: <fileKey>,
  nodeId: <nodeId>,
  clientFrameworks: "react",
  clientLanguages: "typescript"
)

mcp__Figma__get_code_connect_suggestions(
  fileKey: <fileKey>,
  nodeId: <nodeId>,
  clientFrameworks: "react",
  clientLanguages: "typescript"
)
```

### Interpreting `get_context_for_code_connect`

Returns:
- **`properties`** — array of `{ name, type, options? }` describing Figma component properties
- **`variants`** — variant combinations for component sets
- **`descendantTree`** — nested instances and text nodes with their property references

Map each Figma property type to its Code Connect helper:

| Figma property type | Code Connect helper | Example |
|---------------------|---------------------|---------|
| `TEXT` | `figma.string('PropName')` | Label, placeholder text |
| `BOOLEAN` | `figma.boolean('PropName')` | Disabled, loading, hasIcon |
| `VARIANT` (string enum) | `figma.enum('PropName', { FigmaVal: 'codeVal', … })` | size, variant, color |
| `INSTANCE_SWAP` | `figma.instance('PropName')` | Icon, avatar, leading element |
| `BOOLEAN` (visibility) | `figma.boolean('PropName', { true: <JSX/>, false: null })` | Show/hide a slot |

### Interpreting `get_code_connect_suggestions`

Returns AI-suggested mappings between Figma nodes and codebase files. Use these as a starting
point — verify each suggestion against the actual component source before accepting.

---

## Step 4 — Find the codebase component

Use the suggestions from Step 3 plus your own search:

```
Grep("<ComponentName>", "src/**/*.tsx")    — find by export name
Glob("src/components/<Name>/<Name>.tsx")  — check canonical path
```

Read the component file to understand:
- The exact export name
- Every prop name and its TypeScript type
- Which props map to which Figma properties

Build a **prop mapping table**:

```
| Figma property | Figma type | Code prop | Code type | Mapping |
|----------------|-----------|-----------|-----------|---------|
| Label          | TEXT      | children  | ReactNode | figma.string('Label') |
| Variant        | VARIANT   | variant   | 'primary' \| 'secondary' | figma.enum(...) |
| Disabled       | BOOLEAN   | disabled  | boolean   | figma.boolean('Disabled') |
| Icon           | INSTANCE_SWAP | icon  | ReactNode | figma.instance('Icon') |
```

Show this table and ask: "Does this prop mapping look right?" before generating the file.
Skip confirmation if the user said to proceed automatically.

---

## Step 5 — Generate the Code Connect file

Create `src/components/<Name>/<Name>.figma.tsx`:

```tsx
import figma from '@figma/code-connect'
import { ComponentName } from './<Name>'
// import any icon or sub-components used in the example

figma.connect(ComponentName, '<full figma URL with node-id>', {
  props: {
    // TEXT properties
    label: figma.string('Label'),

    // VARIANT / enum properties — map every Figma variant value to its code equivalent
    variant: figma.enum('Variant', {
      'Primary':   'primary',
      'Secondary': 'secondary',
      'Ghost':     'ghost',
    }),

    // BOOLEAN properties
    disabled: figma.boolean('Disabled'),

    // INSTANCE_SWAP — renders the swapped instance
    icon: figma.instance('Icon'),

    // BOOLEAN with conditional rendering
    showBadge: figma.boolean('Show Badge', {
      true:  <span className="badge" />,
      false: null,
    }),
  },

  example: ({ label, variant, disabled, icon, showBadge }) => (
    <ComponentName variant={variant} disabled={disabled} icon={icon}>
      {label}
      {showBadge}
    </ComponentName>
  ),
})
```

**Rules for the template:**
- Every Figma property must appear in `props` — don't skip any
- Enum value keys are the **exact** Figma variant strings (case-sensitive)
- Enum value values are the **exact** TypeScript prop values your component accepts
- The `example` function must be valid JSX that compiles — use the real prop names from the component
- Import any sub-components referenced in `figma.instance()` slots
- For component sets with multiple Figma nodes (one per variant), generate one
  `figma.connect()` call per variant node in the same file

---

## Step 6 — Register the mapping in Figma

```
mcp__Figma__send_code_connect_mappings(
  fileKey: <fileKey>,
  nodeId: <nodeId>,
  mappings: [
    {
      nodeId: "<nodeId>",
      componentName: "<FigmaComponentName>",
      source: "src/components/<Name>/<Name>.tsx",
      label: "React",
      template: "<full contents of the .figma.tsx file>",
      templateDataJson: JSON.stringify({
        isParserless: true,
        imports: ["import { <ComponentName> } from './<Name>'"]
      })
    }
  ]
)
```

For component sets with variants, send one mapping entry per variant node.

---

## Step 7 — Bulk mode (whole file or page)

If `$ARGUMENTS` contains a Figma URL **without** a `node-id` (pointing to a whole file or page),
run in bulk:

1. Call `get_code_connect_suggestions(fileKey, excludeMappingPrompt: false)` — returns all
   unmapped components in the file with AI suggestions
2. For each suggested component, run Steps 3–6 above
3. Batch all mappings into a single `send_code_connect_mappings` call
4. Report a table of what was mapped vs skipped (no codebase match found)

---

## Step 8 — Output summary

```
## Code Connect registered

| Figma component | Node ID | Code file | Status |
|-----------------|---------|-----------|--------|
| Button/Primary  | 1:23    | src/components/Button/Button.tsx | ✓ mapped |
| Card            | 1:45    | src/components/Card/Card.tsx     | ✓ mapped |
| Input           | 1:67    | — | ✗ no match found |

## Files written
- src/components/Button/Button.figma.tsx
- src/components/Card/Card.figma.tsx

## Prop mappings
(one table per component — Figma property → code prop → Code Connect helper)

## Next steps
- Components with no match: implement them with /figma-to-code, then re-run /figma-code-connect
- Verify in Figma: open Dev Mode on a mapped component — you should see the React tab
- Add @figma/code-connect to package.json if not already installed:
  npm install --save-dev @figma/code-connect
```
