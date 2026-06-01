# PartsSource Design System — Claude Code Rules

## Component Library
Always use `@partssource/react-kit` components. Never use native HTML elements
(div, button, input, etc.) when a react-kit equivalent exists.

## Design Tokens
Match PartsSource design tokens for all values:
- **Colors**: Use token variables (e.g. `--ps-color-primary`, `--ps-color-blue-600`) — never hardcode hex values
- **Spacing**: Use token spacing scale — never hardcode px values
- **Typography**: Use token type ramp — never hardcode font sizes or weights

## Output Format
- All output files must be TypeScript: `.tsx` for components, `.ts` for utilities
- No Tailwind CSS — use CSS Modules (`.module.css`) or styled-components if styling beyond tokens is needed
- Prefer CSS Modules for new files unless the surrounding codebase uses styled-components

## Figma → Code Workflow
When given a Figma frame URL:
1. Read the frame via Figma MCP
2. Map every Figma layer to a `@partssource/react-kit` component by name
3. Implement as a `.tsx` file using only react-kit components
4. Flag any Figma component that has no react-kit equivalent with a `// TODO: no react-kit match — approximated with <X>` comment

## Unmatched Components
If a Figma component has no react-kit equivalent:
- Note it clearly in the output
- Approximate with the closest react-kit primitive
- Add a `// TODO` comment inline in the generated code
- List all unmatched components in a summary at the end of your response

## Code Connect
- Code Connect mappings live in `/code-connect/`
- Each mapping file is named after the Figma component: `<ComponentName>.figma.tsx`
- All mappings use the `React` label
