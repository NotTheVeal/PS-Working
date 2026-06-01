import React from 'react';
import figma from '@figma/code-connect';
import { Button } from '@partssource/react-kit';

figma.connect(Button, 'https://www.figma.com/design/pyZ5wKN9KGBUfgi47UwQ0q?node-id=115:66', {
  props: {
    variant: figma.enum('Variant', {
      Primary: 'primary',
      Secondary: 'secondary',
      Tertiary: 'tertiary',
      Pill: 'pill',
      Arrow: 'arrow',
    }),
    size: figma.enum('Size', { LG: 'lg', SM: 'sm' }),
    loading: figma.boolean('Loading'),
    disabled: figma.boolean('Disabled'),
    children: figma.string('Label'),
  },
  example: ({ variant, size, loading, disabled, children }) => (
    <Button variant={variant} size={size} loading={loading} disabled={disabled}>
      {children}
    </Button>
  ),
});
