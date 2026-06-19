// PS Design Library — component exports

// Tokens & utilities
export { tokens, FOCUS_RING, DISABLED } from './tokens/tokens'
export type { ColorToken, SpacingToken, RadiusToken, ShadowToken, FontSizeToken } from './tokens/tokens'
export { cn } from './lib/cn'

// Actions
export { Button }                                      from './components/Button/Button'
export type { ButtonProps }                            from './components/Button/Button'

// Layout
export { Card, CardHeader, CardBody, CardFooter, CardDivider } from './components/Card/Card'
export type { CardProps, CardHeaderProps, CardFooterProps }    from './components/Card/Card'

// Display
export { Badge }            from './components/Badge/Badge'
export type { BadgeProps }  from './components/Badge/Badge'

export { Chip }             from './components/Chip/Chip'
export type { ChipProps }   from './components/Chip/Chip'

// Feedback
export { Banner }               from './components/Banner/Banner'
export type { BannerProps }     from './components/Banner/Banner'

export { Spinner }              from './components/Spinner/Spinner'
export type { SpinnerProps }    from './components/Spinner/Spinner'

export { ToastProvider, useToast } from './components/Toast/Toast'
export type { ToastItem }          from './components/Toast/Toast'

// Forms
export { Input }                from './components/Input/Input'
export type { InputProps }      from './components/Input/Input'

export { Select }               from './components/Select/Select'
export type { SelectProps, SelectOption } from './components/Select/Select'

export { Checkbox }             from './components/Checkbox/Checkbox'
export type { CheckboxProps }   from './components/Checkbox/Checkbox'

export { Radio, RadioGroup }    from './components/Radio/Radio'
export type { RadioProps, RadioGroupProps } from './components/Radio/Radio'

export { Textarea }             from './components/Textarea/Textarea'
export type { TextareaProps }   from './components/Textarea/Textarea'

// Data
export { Table, TableHead, TableBody, TableFooter, TableRow, TableHeader, TableCell, TableCaption } from './components/Table/Table'
export type { TableHeaderProps } from './components/Table/Table'

// Navigation
export { Tabs, TabList, Tab, TabPanels, TabPanel } from './components/Tabs/Tabs'
export type { TabsProps, TabProps, TabPanelProps }  from './components/Tabs/Tabs'

// Overlay
export { Modal }               from './components/Modal/Modal'
export type { ModalProps }     from './components/Modal/Modal'

export { Tooltip }             from './components/Tooltip/Tooltip'
export type { TooltipProps }   from './components/Tooltip/Tooltip'

// Display (wave 5)
export { Avatar, AvatarGroup }                from './components/Avatar/Avatar'
export type { AvatarProps, AvatarGroupProps } from './components/Avatar/Avatar'

export { Skeleton, SkeletonCard, SkeletonTable } from './components/Skeleton/Skeleton'
export type { SkeletonProps }                    from './components/Skeleton/Skeleton'

// Forms (wave 5)
export { Switch }              from './components/Switch/Switch'
export type { SwitchProps }    from './components/Switch/Switch'

// Layout (wave 5)
export { Accordion, AccordionItem } from './components/Accordion/Accordion'
export type { AccordionProps, AccordionItemProps } from './components/Accordion/Accordion'

// Navigation (wave 5)
export { Breadcrumb }              from './components/Breadcrumb/Breadcrumb'
export type { BreadcrumbProps }    from './components/Breadcrumb/Breadcrumb'

export { Pagination }              from './components/Pagination/Pagination'
export type { PaginationProps }    from './components/Pagination/Pagination'

// Feedback (wave 5)
export { Progress }                from './components/Progress/Progress'
export type { ProgressProps }      from './components/Progress/Progress'

// Wave 6 — actions/navigation/display
export { DropdownMenu }                from './components/DropdownMenu/DropdownMenu'
export type { DropdownMenuProps, DropdownMenuItemProps } from './components/DropdownMenu/DropdownMenu'

export { Combobox }                from './components/Combobox/Combobox'
export type { ComboboxProps, ComboboxOption } from './components/Combobox/Combobox'

export { EmptyState }              from './components/EmptyState/EmptyState'
export type { EmptyStateProps }    from './components/EmptyState/EmptyState'

export { Stepper }                 from './components/Stepper/Stepper'
export type { StepperProps, StepperStep } from './components/Stepper/Stepper'

export { FileUpload }              from './components/FileUpload/FileUpload'
export type { FileUploadProps }    from './components/FileUpload/FileUpload'

// Wave 7
export { Alert }                   from './components/Alert/Alert'
export type { AlertProps }         from './components/Alert/Alert'

export { NumberInput }             from './components/NumberInput/NumberInput'
export type { NumberInputProps }   from './components/NumberInput/NumberInput'

export { SegmentedControl }        from './components/SegmentedControl/SegmentedControl'
export type { SegmentedControlProps, SegmentedOption } from './components/SegmentedControl/SegmentedControl'

export { Drawer }                  from './components/Drawer/Drawer'
export type { DrawerProps }        from './components/Drawer/Drawer'

export { Timeline }                from './components/Timeline/Timeline'
export type { TimelineProps, TimelineEvent } from './components/Timeline/Timeline'

// Wave 8 — forms
export { RangeSlider }             from './components/RangeSlider/RangeSlider'
export type { RangeSliderProps }   from './components/RangeSlider/RangeSlider'

export { Rating }                  from './components/Rating/Rating'
export type { RatingProps }        from './components/Rating/Rating'

export { MultiSelect }             from './components/MultiSelect/MultiSelect'
export type { MultiSelectProps, MultiSelectOption } from './components/MultiSelect/MultiSelect'

export { SearchInput }             from './components/SearchInput/SearchInput'
export type { SearchInputProps }   from './components/SearchInput/SearchInput'

// Wave 8 — display
export { Stat }                    from './components/Stat/Stat'
export type { StatProps }          from './components/Stat/Stat'

export { CommandPalette }          from './components/CommandPalette/CommandPalette'
export type { CommandPaletteProps, CommandItem } from './components/CommandPalette/CommandPalette'

export { CopyButton }              from './components/CopyButton/CopyButton'
export type { CopyButtonProps }    from './components/CopyButton/CopyButton'

export { ToggleButton }            from './components/ToggleButton/ToggleButton'
export type { ToggleButtonProps }  from './components/ToggleButton/ToggleButton'

// Wave 9
export { TreeView }                from './components/TreeView/TreeView'
export type { TreeViewProps, TreeNode } from './components/TreeView/TreeView'

export { TagInput }                from './components/TagInput/TagInput'
export type { TagInputProps }      from './components/TagInput/TagInput'

export { Kbd, Shortcut }           from './components/Kbd/Kbd'
export type { KbdProps, ShortcutProps } from './components/Kbd/Kbd'

export { Divider }                 from './components/Divider/Divider'
export type { DividerProps }       from './components/Divider/Divider'

export { DatePicker }              from './components/DatePicker/DatePicker'
export type { DatePickerProps }    from './components/DatePicker/DatePicker'

export { Popover }                 from './components/Popover/Popover'
export type { PopoverProps }       from './components/Popover/Popover'

export { Carousel }                from './components/Carousel/Carousel'
export type { CarouselProps }      from './components/Carousel/Carousel'

export { OTPInput }                from './components/OTPInput/OTPInput'
export type { OTPInputProps }      from './components/OTPInput/OTPInput'
