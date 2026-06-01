# @partssource/react-kit — Component Map

> Auto-generated from the `react-ui-kit` source (v0.1.0). Import path: `@partssource/react-kit`.
> Every component is a `.tsx` React FC. Styling is **Tailwind utility classes + CSS-variable design tokens** (`--ps-prim-*`). Fonts: Source Sans Pro / Source Sans 3 (and Inter for `ListTypeBadge`).

## How to import
```tsx
import { Button, Input, Modal /* … */ } from '@partssource/react-kit';
```

---

## Buttons — `Button.tsx`
| Export | Key props | Variants / options |
|---|---|---|
| `Button` | `variant`, `size`, `state`, `loading`, `iconStart`, `iconEnd`, `fullWidth`, + native button attrs | `variant`: primary \| secondary \| tertiary \| pill \| arrow · `size`: sm \| lg · `state`: default \| hover \| focus \| pressed |
| `ButtonInline` | `kind`, + native anchor attrs | `kind`: link \| link-blue \| tall \| dir |
| `BackArrowIcon` | — (glyph for `arrow` variant) | — |

## Inputs — `Input.tsx`
| Export | Key props | Variants / options |
|---|---|---|
| `Input` | `label` (req), `size`, `state`, `error`, `helperText`, + native input attrs | `size`: md \| lg · `state`: default \| hover \| focus \| withValue \| disabled \| error |
| `Dropdown` | `options` (req), `onSelect`, + InputProps | options: `{label,value}[]` |

## Cards — `Card.tsx`
| Export | Key props |
|---|---|
| `EventCard` | `title`, `subtitle`, `icon`, `iconBg`, `iconFg`, `meta[]`, `ctaLabel`, `onCtaClick` |
| `StatusCard` | `title`, `meta`, `thumbnail`, `thumbnailBg`, `onClick` |
| `AlertCard` | `title`, `subtitle`, `severity` (info\|warning\|error\|success), `thumbnail`, `location`, `datetime` |

## Cards (extended) — `CardExtras.tsx`
| Export | Key props | Variants / options |
|---|---|---|
| `AiDataCard` | `title`, `manufacturer`, `meta`, `badges[]`, `cost`, `costLabel` | badge tone: notShipped \| urgent \| pending |
| `ProductCard` | `title`, `info[]`, `imageUrl`, `statusTitle`, `statusBody`, `primaryLabel`, `secondaryLabel`, `width` | — |
| `AnalyticsCard` | `title`, `value`, `layout`, `delta`, `benchmark`, `sub`, `highlight`, `linkLabel`, `showMenu` | `layout`: wide \| square |
| `ListCard` | discriminated by `variant` | `variant`: list \| product \| create \| standing |

## Badges — `Badge.tsx`
| Export | Key props | Tones |
|---|---|---|
| `StatusBadge` | `children`, `tone` | neutral \| info \| success \| warning \| critical \| items |
| `ListTypeBadge` | `children`, `tone` | shopping \| preventative \| restocking |

## Alerts — `Alert.tsx`
| Export | Key props | Severity |
|---|---|---|
| `Alert` | `severity`, `children`, `onDismiss`, `actions` | success \| info \| warning \| fail |
| `Toast` | `severity`, `children`, `onDismiss` | success \| info \| warning \| fail |

## Selections — `Selections.tsx`
| Export | Key props | States |
|---|---|---|
| `Checkbox` | `label`, `checked`, `defaultChecked`, `onChange`, `state`, `disabled` | default \| hover \| focus \| pressed \| disabled |
| `Radio` | `label`, `name`, `value`, `checked`, `onChange`, `state`, `disabled` | (same) |
| `Toggle` | `checked`, `defaultChecked`, `onChange`, `disabled`, `label` | — |

## Tabs — `Tabs.tsx`
| Export | Key props | Notes |
|---|---|---|
| `FolderTabs` | `items[]`, `activeId`, `defaultActiveId`, `onChange` | items: `{id,label,icon?,count?,disabled?}` |
| `SegmentedTabs` | (same TabsProps) | icon-only switcher |
| `PillTabs` | (same TabsProps) | rounded chip row |

## Overlays — `Modal.tsx` / `Drawer.tsx`
| Export | Key props |
|---|---|
| `Modal` | `open`, `onClose`, `title`, `footer`, `width`, `children` |
| `ConfirmDialog` | `open`, `title`, `message`, `confirmLabel`, `cancelLabel`, `destructive`, `onConfirm`, `onCancel` |
| `Drawer` | `open`, `onClose`, `title`, `subtitle`, `footer`, `width`, `children` |

## Filters — `Filter.tsx`
| Export | Key props |
|---|---|
| `FilterChip` | `label`, `onRemove`, `removable` |
| `FilterShell` | `chips`, `onAddClick`, `addLabel`, `children` |

## Navigation — `Navigation.tsx`
| Export | Key props |
|---|---|
| `TopNav` | `logoSrc`, `searchPlaceholder`, `cartCount`, `facilityLabel`, `facilityName`, `heroTitle`, `proAccountLogo`, `onSearch`, `onCartClick`, `onHomeClick` |
| `LeftNav` | `userInitials`, `userName`, `items[]`, `collapsed`, `onToggleCollapse`, `onLogout` |

## CMS blocks — `CMS.tsx`
| Export | Key props | Options |
|---|---|---|
| `Banner` | `title`, `body`, `ctaLabel`, `onCta`, `imageUrl`, `overlay` | — |
| `ImageBlock` | `title`, `body`, `imageUrl`, `imagePosition`, `ctaLabel` | imagePosition: left \| right |
| `TextBlock` | `title`, `children` | — |
| `CardGrid` | `cards[]`, `columns`, `gap`, `cardStyle` | columns: 2\|3\|4 · gap: sm\|md\|lg · cardStyle: outlined\|elevated |

## Layout — `Layout.tsx`
| Export | Key props | Options |
|---|---|---|
| `Breadcrumb` | `items[]` | items: `{label,href?}` |
| `BreadcrumbBack` | `label`, `href` | — |
| `Accordion` | `title`, `subtitle`, `meta`, `showDragHandle`, `open`, `defaultOpen`, `onToggle`, `variant` | variant: default \| row \| filled |
| `AccordionCount` | `children`, `tone` | tone: info \| critical |
| `Stepper` | `steps[]`, `orientation`, `compact`, `ariaLabel` | orientation: horizontal \| vertical · step status: complete\|current\|pending\|error\|disabled |

## Feedback — `Feedback.tsx`
| Export | Key props | Options |
|---|---|---|
| `Avatar` | `name`, `initials`, `src`, `size`, `tone`, `status` | size: xs\|sm\|md\|lg\|xl · tone: blue\|green\|orange\|purple\|red\|neutral\|brand\|inverse · status: online\|busy\|away\|offline |
| `AvatarGroup` | `children`, `overflow`, `size` | — |
| `Tooltip` | `label`, `placement`, `maxWidth`, `children` | placement: top\|bottom\|left\|right |
| `TooltipRich` | `title`, `body`, `cta` | — |
| `Skeleton` | `shape`, `width`, `height` | shape: text\|title\|bar\|circle\|block\|button\|input |
| `SkeletonKeyframes` | — (mount once) | — |
| `Spinner` | `size`, `className` | (exported from `LoadingSpinner`) |
| `EmptyState` | `title`, `body`, `icon`, `tone`, `primaryAction`, `secondaryAction`, `inline` | tone: info\|neutral\|success\|warning\|error |
| `ErrorPage` | `code`, `icon`, `iconTone`, `title`, `body`, `primaryAction`, `secondaryAction` | iconTone: info\|warn\|error |

## Controls — `Controls.tsx`
| Export | Key props |
|---|---|
| `Pagination` | `page`, `totalPages`, `total`, `pageSize`, `pageSizeOptions`, `onPageChange`, `onPageSizeChange`, `compact` |
| `DatePicker` | `title`, `startDate`, `endDate`, `onChange`, `disabled`, `error`, `range` |

---

## Design tokens (`tokens.ts` / `tokens.css`)
CSS variables consumed as `var(--ps-prim-<ramp>-<step>)`:
- **Blue** `--ps-prim-blue-50…900` (brand anchor `500` = `#005BA6`)
- **Gray** `--ps-prim-gray-0…900`
- **Orange** `--ps-prim-orange-50/100/400/500/600` (legacy CTA only)
- **Status** success / error / warning / info (fg + bg)

> ⚠️ Token naming is `--ps-prim-*` (not `--ps-color-*`). Generated code must use the real `--ps-prim-*` names.
</content>
</invoke>
