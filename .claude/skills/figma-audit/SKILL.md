---
name: figma-audit
description: Audit coverage between a Figma design file and the codebase. Produces a dashboard showing which Figma components are implemented, which are missing, which have Code Connect wired up, and which are stale. Use when you want a gap report before a sprint, after a design handoff, or to track library coverage over time.
when_to_use: "Use when you want to know what's built vs missing from Figma, or to get a health check on the design-to-code sync state."
allowed-tools: Read Grep Glob Bash mcp__Figma__get_metadata mcp__Figma__get_code_connect_map mcp__Figma__get_code_connect_suggestions mcp__Figma__search_design_system mcp__Figma__get_libraries
---

# Figma ↔ Code Coverage Audit

Produce a full gap report between what exists in Figma and what exists in the codebase.
Output is a dashboard the team can act on directly.

---

## Step 1 — Parse input

`$ARGUMENTS` can be:
- A Figma file URL (no `node-id`) → audit the whole file
- A Figma page URL (`?node-id=` pointing to a page node) → audit one page
- No argument → audit `src/components` against whatever Figma file is in CLAUDE.md

If no Figma URL is available at all, ask the user for one before continuing.

Extract `fileKey`. If a `nodeId` is present use it as the page scope; otherwise omit it.

---

## Step 2 — Inventory the Figma file

Call in parallel:

```
mcp__Figma__get_metadata(
  fileKey: <fileKey>,
  clientFrameworks: "react",
  clientLanguages: "typescript"
)
// Returns page list when nodeId is omitted

mcp__Figma__get_libraries(fileKey: <fileKey>)
// Returns subscribed design libraries — useful for cross-file component refs

mcp__Figma__get_code_connect_map(
  fileKey: <fileKey>,
  nodeId: <pageNodeId or first page node>,
  codeConnectLabel: "React"
)
// Returns which nodes are already Code Connect mapped
```

Then call `get_metadata` again for each page, passing each page's node ID, to get the full
component tree. Collect every node where `type` is `COMPONENT` or `COMPONENT_SET`.

Build a **Figma inventory list**:
```
{ nodeId, name, page, isComponentSet, variantCount, isAlreadyMapped }
```

---

## Step 3 — Inventory the codebase

```
Glob("src/components/**/*.tsx")         → all component files
Glob("src/components/**/*.figma.tsx")   → Code Connect files
Grep("export const", "src/components/**/*.tsx", output_mode: "content")
```

Build a **codebase inventory list**:
```
{ exportName, filePath, hasFigmaConnect, hasStorybook, hasTests }
```

Where:
- `hasFigmaConnect` = a `.figma.tsx` file exists alongside it
- `hasStorybook` = a `.stories.tsx` file exists alongside it
- `hasTests` = a `.test.tsx` file exists alongside it

---

## Step 4 — Match Figma components to code components

Use fuzzy name matching (normalise: lowercase, strip punctuation, strip "PS/"/"PS Design/" prefixes):

| Match confidence | Rule |
|-----------------|------|
| **Exact** | Figma name === export name after normalisation |
| **Likely** | Edit distance ≤ 2, or one is a substring of the other |
| **Unmatched** | No reasonable match found |

For each Figma component, determine its status:

| Status | Meaning |
|--------|---------|
| `COMPLETE` | Implemented + Code Connect wired + Storybook + Tests |
| `IMPLEMENTED` | Component exists in code, no Code Connect yet |
| `PARTIAL` | Component exists but missing Storybook or Tests |
| `MISSING` | No matching code component found |
| `STALE` | Code Connect mapped but component file deleted or renamed |

---

## Step 5 — Output the dashboard

```
# PS Design Library — Figma Coverage Audit
Date: <today>
Figma file: <file name>
Pages audited: <list>

## Summary

| Status      | Count | % of total |
|-------------|-------|------------|
| COMPLETE    | N     | N%         |
| IMPLEMENTED | N     | N%         |
| PARTIAL     | N     | N%         |
| MISSING     | N     | N%         |
| STALE       | N     | N%         |
| **TOTAL**   | N     | 100%       |

## Coverage by page

| Page | Total components | Complete | Implemented | Partial | Missing |
|------|-----------------|----------|-------------|---------|---------|
| Foundations | … | … | … | … | … |
| Components  | … | … | … | … | … |
| …           | … | … | … | … | … |

## Missing components (priority list)

Components in Figma with no code equivalent — implement these next.

| # | Figma name | Page | Node ID | Variants | Suggested command |
|---|-----------|------|---------|----------|-------------------|
| 1 | Button    | Components | 1:23 | 4 | `/figma-to-code https://figma.com/design/<key>/...?node-id=1-23` |
| … | …         | …    | …       | …        | … |

## Partial components (quick wins)

Implemented but missing Code Connect / Storybook / Tests.

| Component | File | Missing |
|-----------|------|---------|
| Card | src/components/Card/Card.tsx | Code Connect, Tests |
| … | … | … |

Suggested command for Code Connect: `/figma-code-connect <url with node-id>`

## Stale mappings

Code Connect registered in Figma but the source file no longer exists.

| Figma name | Node ID | Expected file | Action |
|-----------|---------|--------------|--------|
| … | … | … | Re-run /figma-code-connect or delete mapping |

## Codebase components with no Figma match

Components in code that have no corresponding Figma component.
These may be internal-only or may need a Figma design created.

| Component | File |
|-----------|------|
| … | … |
```

---

## Step 6 — Write the report to disk

Save the dashboard as `.claude/audit/figma-coverage-<YYYY-MM-DD>.md` so it can be
tracked over time and committed to the repo.

Then print the summary table to the terminal.

---

## Step 7 — Offer next actions

After the report, offer:

```
What would you like to do?
  A) Implement all MISSING components  → runs /figma-to-code for each
  B) Wire Code Connect for IMPLEMENTED → runs /figma-code-connect for each
  C) Fix PARTIAL components            → adds missing Storybook/Tests
  D) Nothing — just the report
```

Wait for the user's choice before running any follow-up skill.
