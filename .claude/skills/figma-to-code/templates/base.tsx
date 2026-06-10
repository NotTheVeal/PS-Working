import * as React from 'react'

// TEMPLATE: Base component — no variants
// Replace: ComponentName, Props fields, className, JSX

interface ComponentNameProps extends React.HTMLAttributes<HTMLDivElement> {
  // Add your props here
}

export const ComponentName = React.forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={[
        // Add your Tailwind classes here — map from figma-to-code token table
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </div>
  )
)
ComponentName.displayName = 'ComponentName'
