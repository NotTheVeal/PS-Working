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
When given a Figma URL, use the `/figma-to-code` skill automatically.
The Figma MCP server is connected — use it to read live design data.

## Design Tokens
See `.claude/skills/figma-to-code/ps-tokens.md` for the full PS Design Library token map.
Primary palette: `#1a1a1a` (text), `#d97757` (brand orange), `#1a56b0` (blue),
`#1a6b3a` (green), `#f0ede8` (page bg), `#e0ddd6` (border).
