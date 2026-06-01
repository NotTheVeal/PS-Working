import React from 'react';
import figma from '@figma/code-connect';
import { Button, ButtonInline } from '@partssource/react-kit';

figma.connect(Button, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: {
    variant: figma.enum('Variant', {
      Primary: 'primary',
      Secondary: 'secondary',
      Tertiary: 'tertiary',
      Pill: 'pill',
      Arrow: 'arrow',
    }),
    size: figma.enum('Size', {
      SM: 'sm',
      LG: 'lg',
    }),
    disabled: figma.boolean('Disabled'),
    loading: figma.boolean('Loading'),
    children: figma.string('Label'),
  },
  example: ({ variant, size, disabled, loading, children }) => (
    <Button variant={variant} size={size} disabled={disabled} loading={loading}>
      {children}
    </Button>
  ),
});

figma.connect(ButtonInline, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q', {
  props: {
    children: figma.string('Label'),
    disabled: figma.boolean('Disabled'),
  },
  example: ({ children, disabled }) => (
    <ButtonInline disabled={disabled}>{children}</ButtonInline>
  ),
});
